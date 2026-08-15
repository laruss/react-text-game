import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

import { type GameSave, getDatabase } from "#saves";
import type { SaveResult } from "#saves/types";

import { loadGameIntoState } from "./useLoadGame";

const getLastSave = async (): Promise<GameSave | null> => {
    const save = await getDatabase()
        .saves.filter((save) => !save.isSystemSave)
        .reverse()
        .sortBy("timestamp");
    return save[0] ?? null;
};

/**
 * A custom hook for managing the loading of the last saved game state.
 *
 * This hook provides functionality to determine the availability of the last saved game, as well as to load and restore the game data from the saved state.
 * It uses reactive data fetching and caching mechanisms to seamlessly manage game state retrieval.
 *
 * @remarks
 * Loading goes through the same path as `useLoadGame`, so a save written by an
 * older build is migrated here too.
 *
 * @function useLastLoadGame
 * @returns Returns an object containing:
 * - `hasLastSave` {boolean}: Indicates whether a last saved game exists.
 * - `loadLastGame` {Function}: Asynchronous function to load the last saved game state.
 * - `isLoading` {boolean}: Represents whether the last save status is currently being determined.
 * - `lastSave` {Object|null}: The last saved game data object, or null if not available.
 *
 * @example
 * ```tsx
 * const { hasLastSave, loadLastGame, isLoading } = useLastLoadGame();
 *
 * if (isLoading) {
 *   return <div>Loading...</div>;
 * }
 *
 * return (
 *   <button onClick={loadLastGame} disabled={!hasLastSave}>
 *     Continue Last Game
 *   </button>
 * );
 * ```
 */
export const useLastLoadGame = () => {
    const lastSave = useLiveQuery(getLastSave, [], null);

    const loadLastGame = useCallback(async (): Promise<SaveResult> => {
        if (!lastSave) {
            return {
                success: false,
                code: "not-found",
                error: "There is no save to load",
            };
        }

        return loadGameIntoState(lastSave.slot);
    }, [lastSave]);

    return {
        hasLastSave: !!lastSave,
        loadLastGame,
        isLoading: lastSave === undefined,
        lastSave: lastSave ?? null,
    };
};
