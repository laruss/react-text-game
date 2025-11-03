import { proxy } from "valtio";

import { InitVarsType } from "#types";

import { BaseGameObject } from "./baseGameObject";

const CLASS_PROPERTIES = [
    "id",
    "_variables",
    "variables",
    "save",
    "load",
    "path",
    "proxyCache",
    "isProxyableObject",
    "createDeepProxy",
] as const;
type ClassProperties = typeof CLASS_PROPERTIES[number];

/**
 * Internal implementation that augments {@link BaseGameObject} with
 * property accessors for each variable field.
 *
 * Consumers interact with the exported `SimpleObject` type alias/factory,
 * but documenting this class clarifies how deep proxying and manual save hooks
 * are wired under the hood.
 */
class SimpleObjectImpl<
    VariablesType extends InitVarsType,
> extends BaseGameObject<VariablesType> {
    private proxyCache = new WeakMap<object, object>();

    constructor(props: { id: string; variables?: VariablesType }) {
        super(props);

        // Return a Proxy that intercepts all property access
        // This allows setting properties that weren't defined at initialization
        // (e.g., optional properties in TypeScript types)
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Handle symbols by delegating to the target
                if (typeof prop === "symbol") {
                    return Reflect.get(target, prop, receiver);
                }

                // Allow access to class properties and methods
                if (CLASS_PROPERTIES.includes(prop as ClassProperties)) {
                    return Reflect.get(target, prop, receiver);
                }

                // Get value from _variables
                const value = target._variables[prop as keyof VariablesType];

                // If it's an object (but not Date or other special types), wrap it in a deep proxy
                if (target.isProxyableObject(value)) {
                    return target.createDeepProxy(value);
                }

                return value;
            },
            set: (target, prop, value, receiver) => {
                // Handle symbols by delegating to the target
                if (typeof prop === "symbol") {
                    return Reflect.set(target, prop, value, receiver);
                }

                // Allow setting class properties
                if (
                    prop === "id" ||
                    prop === "_variables" ||
                    prop === "proxyCache"
                ) {
                    return Reflect.set(target, prop, value, receiver);
                }

                // If replacing an object, clear its proxy cache
                const oldValue = target._variables[prop as keyof VariablesType];
                if (
                    target.isProxyableObject(oldValue) &&
                    target.proxyCache.has(oldValue)
                ) {
                    target.proxyCache.delete(oldValue);
                }

                // Set value in _variables
                target._variables[prop as keyof VariablesType] = value;

                return true;
            },
        });
    }

    /**
     * Checks if a value should be wrapped in a proxy
     * Returns true for plain objects and arrays, false for primitives and special types
     */
    private isProxyableObject(value: unknown): value is object {
        return (
            value !== null &&
            typeof value === "object" &&
            !(value instanceof Date) &&
            !(value instanceof RegExp) &&
            !(value instanceof Map) &&
            !(value instanceof Set)
        );
    }

    /**
     * Creates a deep proxy that intercepts property access at all levels
     * Any modification to nested properties will trigger save()
     */
    private createDeepProxy(obj: object): object {
        // Return cached proxy if it exists to avoid creating multiple proxies for the same object
        if (this.proxyCache.has(obj)) {
            return this.proxyCache.get(obj)!;
        }

        const proxy_ = proxy(obj);
        this.proxyCache.set(obj, proxy_);

        return proxy_;
    }

    /**
     * Overrides load() to clear proxy cache after loading from storage.
     * This ensures that any cached proxies for nested objects are invalidated.
     */
    load(): void {
        super.load();
        // Clear the proxy cache so new proxies are created for the loaded data
        this.proxyCache = new WeakMap<object, object>();
    }
}

/**
 * Type representing a SimpleObject instance with direct property access.
 * Combines BaseGameObject functionality with variable properties.
 */
export type SimpleObject<VariablesType extends InitVarsType> =
    SimpleObjectImpl<VariablesType> & VariablesType;

/**
 * SimpleObject provides direct property access to game entity variables.
 *
 * Instead of accessing `entity._variables.health`, you can use `entity.health` directly.
 * Supports nested objects with deep reactivity.
 *
 * @template VariablesType - The type of variables stored in this object
 *
 * @example
 * ```typescript
 * const player = new SimpleObject({
 *   id: 'player',
 *   variables: { health: 100, mana: 50 }
 * });
 *
 * player.health = 75; // Direct access
 * player.health += 25; // Operators work
 * ```
 */
export const SimpleObject = SimpleObjectImpl as new <
    VariablesType extends InitVarsType,
>(props: {
    id: string;
    variables?: VariablesType;
}) => SimpleObject<VariablesType>;
