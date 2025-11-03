import { proxy } from "valtio";

import { InitVarsType } from "#types";

import { BaseGameObject } from "./baseGameObject";

/**
 * Internal implementation that augments {@link BaseGameObject} with
 * property accessors for each variable field.
 *
 * Consumers interact with the exported `SimpleObject` type alias/factory,
 * but documenting this class clarifies how deep proxying and manual save hooks
 * are wired under the hood.
 */
class SimpleObjectImpl<VariablesType extends InitVarsType> extends BaseGameObject<VariablesType> {
    private proxyCache = new WeakMap<object, object>();

    constructor(props: { id: string; variables?: VariablesType }) {
        super(props);

        // for each of variables register getter and setter, so we can do like this:
        // const player = new SimpleObject({ id: 'player', variables: { health: 100 } });
        // player.health = 50;
        // console.log(player.health); // 50
        // Also supports nested objects:
        // const player = new SimpleObject({ id: 'player', variables: { health: { mental: 20, physical: 30 } } });
        // player.health.mental += 20;
        if (props.variables) {
            for (const key of Object.keys(props.variables)) {
                Object.defineProperty(this, key, {
                    get: () => {
                        const value = this._variables[key as keyof VariablesType];
                        // If it's an object (but not Date or other special types), wrap it in a deep proxy
                        if (this.isProxyableObject(value)) {
                            return this.createDeepProxy(value);
                        }
                        return value;
                    },
                    set: (value) => {
                        this._variables[key as keyof VariablesType] = value;
                        // Note: does not auto-save. Call save() manually to persist changes.
                    },
                    enumerable: true,
                    configurable: true,
                });
            }
        }
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
 * Supports nested objects with deep reactivity using Valtio proxies.
 *
 * **IMPORTANT:** All properties in `variables` must be required (non-optional).
 * Optional properties are not supported because the Proxy-based implementation
 * cannot distinguish between undefined optional values and missing properties.
 *
 * @template VariablesType - The type of variables stored in this object (must not contain optional properties)
 *
 * @example
 * ```typescript
 * // ✅ Correct - All properties are required
 * const player = new SimpleObject({
 *   id: 'player',
 *   variables: { health: 100, mana: 50 }
 * });
 *
 * player.health = 75; // Direct access
 * player.health += 25; // Operators work
 *
 * // ✅ Correct - Use explicit undefined for optional-like behavior
 * const player = new SimpleObject({
 *   id: 'player',
 *   variables: {
 *     health: 100,
 *     special: undefined as string | undefined // Explicit type
 *   }
 * });
 *
 * // ❌ Wrong - Optional properties cause TypeScript errors
 * const player = new SimpleObject({
 *   id: 'player',
 *   variables: {
 *     health: 100,
 *     mana?: 50  // This will not compile
 *   }
 * });
 * ```
 */
export const SimpleObject = SimpleObjectImpl as new <
    VariablesType extends InitVarsType,
>(
    props: { id: string; variables?: VariablesType }
) => SimpleObject<VariablesType>;
