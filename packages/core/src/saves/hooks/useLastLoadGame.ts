import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

import { Game } from "#game";
import { db, GameSave, loadGame } from "#saves";

const getLastSave = async (): Promise<GameSave | null> => {
    const save = await db.saves
        .filter((save) => !save.isSystemSave)
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
 * @function useLastLoadGame
 * @returns Returns an object containing:
 * - `hasLastSave` {boolean}: Indicates whether a last saved game exists.
 * - `loadLastGame` {Function}: Asynchronous function to load the last saved game state.
 * - `isLoading` {boolean}: Represents whether the last save status is currently being determined.
 * - `lastSave` {Object|null}: The last saved game data object, or null if not available.
 *
 * @example
 * ```tsx
 * const { hasLastSave, loadLastGame, isLoading } = useGetLastLoadGame();
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

    const loadLastGame = useCallback(async () => {
        if (!lastSave?.id) return;

        const saveId = Number(lastSave.name);
        if (isNaN(saveId)) {
            throw new Error("Invalid save ID");
        }

        try {
            const data = await loadGame(saveId);
            if (!data) {
                return { success: false, error: "Game data not found" };
            }
            Game.setState(data.gameData);
        } catch (e) {
            console.error("Failed to load last game:", e);
            return {
                success: false,
                error:
                    (e as Error).message ||
                    "Unknown error occurred while loading the game, please, check console for more info",
            };
        }
    }, [lastSave?.id]);

    return {
        hasLastSave: !!lastSave,
        loadLastGame,
        isLoading: lastSave === undefined,
        lastSave: lastSave ?? null,
    };
};
