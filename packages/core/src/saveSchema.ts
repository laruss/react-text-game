import { Game } from "#game";
import { _getOptions } from "#options";
import type { GameSaveState } from "#types";

/**
 * Everything needed to describe the shape of this game's saves.
 *
 * @remarks
 * This is raw material, not a schema: it carries the actual state object and
 * the registered passage ids. Turning it into a comparable schema (recording
 * value *kinds* rather than values) is the job of the tooling that consumes it,
 * so the engine stays free of any particular schema format.
 */
export interface SaveSchemaSource {
    /** Version the game currently declares through `Game.init()`. */
    gameVersion: string;
    /**
     * The state a save would contain right now, exactly as `Game.getState()`
     * would produce it - entity variables plus the `_system` paths owned by the
     * engine.
     */
    gameData: GameSaveState;
    /**
     * Ids of every registered passage, sorted.
     *
     * @remarks
     * Needed because a save stores `_system.game.currentPassageId`. Deleting or
     * renaming a passage leaves old saves pointing at an id that no longer
     * resolves, which is not visible in the state shape alone.
     */
    passageIds: string[];
}

/**
 * Captures the current shape of this game's saves.
 *
 * Intended for build-time tooling that detects whether a save migration is
 * needed - see `@react-text-game/devtools`.
 *
 * @remarks
 * Deliberately usable **without** `Game.init()`: initialization opens the
 * IndexedDB save database, which does not exist outside a browser. Import the
 * modules that declare your entities and passages, then call this.
 *
 * Called on a freshly imported game this returns the pristine default state.
 * Called mid-game it returns the live state, which has the same shape but with
 * populated collections - useful when empty defaults hide the element type.
 *
 * @returns The current game version, state, and registered passage ids
 *
 * @example
 * ```typescript
 * // Entities and passages register as a side effect of importing them.
 * import "./game/registry";
 * import { getSaveSchemaSource } from "@react-text-game/core";
 *
 * const source = getSaveSchemaSource();
 * console.log(source.gameVersion, Object.keys(source.gameData));
 * ```
 */
export const getSaveSchemaSource = (): SaveSchemaSource => ({
    gameVersion: _getOptions().gameVersion,
    // The internal flag skips the "call Game.init() first" guard. Reusing
    // getState keeps this in lockstep with what a real save records, including
    // the `_system.game` and `_system.clock` paths.
    gameData: Game.getState(true),
    passageIds: Array.from(
        Game.registeredPassages,
        (passage) => passage.id
    ).sort(),
});
