import { JSONPath } from "jsonpath-plus";

import { STORAGE_SYSTEM_PATH } from "#constants";
import { GameSaveState, JsonPath } from "#types";

const storage = {};

/**
 * JSONPath-based storage system for game state persistence.
 *
 * The Storage class provides a flexible way to store and retrieve game state using
 * JSONPath queries. It supports nested data structures and protects system paths
 * from accidental modification.
 *
 * @see https://www.npmjs.com/package/jsonpath-plus - JSONPath Plus library documentation
 *
 * @example
 * ```typescript
 * // Set values
 * Storage.setValue('$.player.health', 100);
 * Storage.setValue('$.inventory.items', ['sword', 'shield']);
 *
 * // Get values
 * const health = Storage.getValue<number>('$.player.health');
 * const items = Storage.getValue<string[]>('$.inventory.items');
 *
 * // Full state
 * const state = Storage.getState();
 * Storage.setState(state);
 * ```
 */
export class Storage {
    /**
     * Retrieves values from storage using a JSONPath query.
     *
     * Returns an array of matching values. If no matches are found, returns an empty array.
     * The JSONPath Plus library supports complex queries including wildcards, filters, and deep scanning.
     *
     * @template T - The expected type of values to retrieve
     * @param jsonPath - The JSONPath query string (e.g., '$.player.health', '$.inventory.items[*]')
     * @returns Array of values matching the JSONPath query
     *
     * @example
     * ```typescript
     * // Get a single value (returns array with one element)
     * const health = Storage.getValue<number>('$.player.health');
     * if (health.length > 0) {
     *   console.log(health[0]); // 100
     * }
     *
     * // Get multiple values with wildcard
     * const allItems = Storage.getValue<string>('$.inventory.*.name');
     * ```
     */
    static getValue<T>(jsonPath: JsonPath): Array<T> {
        return JSONPath({ path: jsonPath, json: storage }) as Array<T>;
    }

    /**
     * Sets a value in storage at the specified JSONPath.
     *
     * If the path exists, updates the value. If the path doesn't exist, creates it.
     * System paths (prefixed with STORAGE_SYSTEM_PATH) are protected from external modification.
     *
     * @template T - The type of value to set
     * @param jsonPath - The JSONPath where the value should be set
     * @param value - The value to set at the specified JSONPath
     * @param _isSystem - Internal flag to allow system path modification (default: false)
     * @throws Error if attempting to modify a system path without _isSystem flag
     *
     * @example
     * ```typescript
     * // Set a simple value
     * Storage.setValue('$.player.health', 75);
     *
     * // Set a complex object
     * Storage.setValue('$.player.stats', { str: 10, dex: 8 });
     *
     * // System paths are protected
     * Storage.setValue('$._system.game', {}); // Throws error
     * ```
     */
    static setValue<T>(
        jsonPath: JsonPath,
        value: T,
        _isSystem: boolean = false
    ): void {
        if (jsonPath.includes(STORAGE_SYSTEM_PATH) && !_isSystem) {
            throw new Error(`Cannot set value at system path: ${jsonPath}`);
        }

        // Check if the path exists
        const existingValues = JSONPath({
            path: jsonPath,
            json: storage,
        });

        if (existingValues.length > 0) {
            // Path exists, update it
            const parents = JSONPath({
                path: jsonPath,
                json: storage,
                resultType: "parent",
            });
            const properties = JSONPath({
                path: jsonPath,
                json: storage,
                resultType: "parentProperty",
            });

            // Update all matching paths
            for (let i = 0; i < parents.length; i++) {
                parents[i][properties[i]] = value;
            }
        } else {
            // Path doesn't exist, create it
            this.createPath(storage, jsonPath, value);
        }
    }

    /**
     * Retrieves the entire storage state as a plain object.
     *
     * @returns The complete storage state, ready for serialization
     *
     * @example
     * ```typescript
     * const state = Storage.getState();
     * localStorage.setItem('save', JSON.stringify(state));
     * ```
     */
    static getState(): GameSaveState {
        return storage;
    }

    /**
     * Replaces the entire storage state with a new state object.
     *
     * Clears all existing storage data and replaces it with the provided state.
     * Useful for loading saved games or resetting to a specific state.
     *
     * @param state - The new state to set for the storage
     * @throws Error if state is not a valid object
     *
     * @example
     * ```typescript
     * const savedState = JSON.parse(localStorage.getItem('save'));
     * Storage.setState(savedState);
     * ```
     */
    static setState(state: GameSaveState): void {
        if (typeof state !== "object" || state === null) {
            throw new Error("Invalid state provided. Expected an object.");
        }
        // Clear the current storage
        for (const key in storage) {
            delete storage[key as keyof typeof storage];
        }
        // Set the new state
        Object.assign(storage, state);
    }

    /**
     * Creates a nested path in storage and assigns a value.
     *
     * Parses the JSONPath and creates all necessary intermediate objects/arrays
     * to build the path if it doesn't exist. Supports both object properties and array indices.
     *
     * @private - Used internally by setValue when creating new paths
     * @template T - The type of value to set at the path
     * @param obj - The target object where the path will be created
     * @param jsonPath - The JSONPath string specifying the location
     * @param value - The value to set at the specified location
     *
     * @example
     * ```typescript
     * // Creates $.player.inventory.items[0] = 'sword'
     * // Will create player object, inventory object, items array automatically
     * Storage.createPath(storage, '$.player.inventory.items[0]', 'sword');
     * ```
     */
    private static createPath<T>(
        obj: Record<string, unknown>,
        jsonPath: JsonPath,
        value: T
    ): void {
        // Parse the JSONPath to get the path components
        // toPathArray converts '$.a.b[0]' to ['$', 'a', 'b', '0']
        const pathComponents = JSONPath.toPathArray(jsonPath);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = obj as any;

        // Iterate through path components, skipping the root ($)
        for (let i = 1; i < pathComponents.length; i++) {
            const component = pathComponents[i];
            if (!component) {
                throw new Error(
                    `Invalid path component at index ${i} in path: ${jsonPath}`
                );
            }

            const isLast = i === pathComponents.length - 1;

            // Check if the component is a numeric array index
            const isNumeric = /^\d+$/.test(component);

            if (isNumeric) {
                // Array index like [0] or [1]
                const index = parseInt(component);

                if (isLast) {
                    // Ensure current is an array
                    if (!Array.isArray(current)) {
                        throw new Error(
                            `Cannot set array index on non-array at path: ${jsonPath}`
                        );
                    }
                    current[index] = value;
                } else {
                    // Create array if it doesn't exist or extend it if needed
                    if (!Array.isArray(current)) {
                        throw new Error(
                            `Cannot access array index on non-array at path: ${jsonPath}`
                        );
                    }
                    if (!current[index]) {
                        // Look ahead to see if next component is numeric
                        const nextComponent = pathComponents[i + 1];
                        const nextIsNumeric =
                            nextComponent && /^\d+$/.test(nextComponent);
                        current[index] = nextIsNumeric ? [] : {};
                    }
                    current = current[index];
                }
            } else {
                // Property access like .hello or .user
                const key = component;

                if (isLast) {
                    current[key] = value;
                } else {
                    // Create object or array if it doesn't exist
                    if (
                        !(key in current) ||
                        typeof current[key] !== "object" ||
                        current[key] === null
                    ) {
                        // Look ahead to see if next component is numeric (array index)
                        const nextComponent = pathComponents[i + 1];
                        const nextIsNumeric =
                            nextComponent && /^\d+$/.test(nextComponent);
                        current[key] = nextIsNumeric ? [] : {};
                    }
                    current = current[key];
                }
            }
        }
    }
}
