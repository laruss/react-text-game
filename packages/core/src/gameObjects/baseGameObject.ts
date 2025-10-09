import { snapshot } from "valtio";

import { Game } from "#game";
import { Storage } from "#storage";
import { InitVarsType, JsonPath } from "#types";

/**
 * Base class for all game entities in the text game engine.
 *
 * Provides automatic registration with the Game registry, reactive state management
 * via Valtio proxies, and persistence through the Storage system using JSONPath.
 *
 * @template VariablesType - The type definition for entity variables, must extend InitVarsType
 *
 * @example
 * ```typescript
 * class Player extends BaseGameObject<{ health: number; name: string }> {
 *   constructor() {
 *     super({
 *       id: 'player',
 *       variables: { health: 100, name: 'Hero' }
 *     });
 *   }
 *
 *   takeDamage(amount: number) {
 *     this._variables.health -= amount;
 *     this.save();
 *   }
 * }
 *
 * const player = new Player();
 * ```
 */
export class BaseGameObject<VariablesType extends InitVarsType = InitVarsType> {
    private static jsonPath: JsonPath = "$.";

    /**
     * Unique identifier for this game object.
     * Used for registry lookup and storage path generation.
     */
    readonly id: string;

    /**
     * Internal storage for entity variables.
     * Protected to allow derived classes to modify state directly.
     */
    protected _variables: VariablesType;

    /**
     * Creates a new game object and automatically registers it with the Game registry.
     *
     * @param props - Configuration object for the game object
     * @param props.id - Unique identifier for this object
     * @param props.variables - Optional initial variables for this object
     */
    constructor(props: { id: string; variables?: VariablesType }) {
        this.id = props.id;
        this._variables = props.variables || ({} as VariablesType);
        Game.registerEntity(this);
    }

    /**
     * Read-only accessor for entity variables.
     *
     * @returns The current variables object for this entity
     */
    get variables(): VariablesType {
        return this._variables;
    }

    /**
     * Generates the JSONPath for this object's storage location.
     *
     * @private
     * @returns The JSONPath string for storage operations
     */
    private get path() {
        return `${BaseGameObject.jsonPath}${this.id}` as JsonPath;
    }

    /**
     * Loads this object's variables from the Storage system.
     *
     * If saved data exists, it merges into the current variables.
     * If no saved data exists, clears all variables.
     *
     * @example
     * ```typescript
     * player.load(); // Restores player state from storage
     * ```
     */
    load() {
        const loadedVariables = Storage.getValue(this.path);
        if (loadedVariables.length > 0) {
            Object.assign(this._variables, loadedVariables[0] as VariablesType);
        } else {
            for (const key in this._variables) {
                delete this._variables[key];
            }
        }
    }

    /**
     * Saves this object's current variables to the Storage system.
     *
     * Uses Valtio's snapshot to create a plain object copy before saving.
     *
     * @example
     * ```typescript
     * player._variables.health = 50;
     * player.save(); // Persists the change
     * ```
     */
    save() {
        Storage.setValue(this.path, snapshot(this._variables));
    }
}
