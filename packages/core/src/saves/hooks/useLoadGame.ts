import { Game } from "#game";
import { loadGame } from "#saves";

/**
 * React hook that provides a function to load a saved game by its ID.
 * Restores the game state from the specified save.
 *
 * @returns Function that accepts an optional save ID and loads the game, returning a result object on failure
 *
 * @example
 * ```tsx
 * const loadGame = useLoadGame();
 * const handleLoad = async () => {
 *   const result = await loadGame(saveId);
 *   if (result?.success === false) {
 *     console.error('Load failed:', result.message);
 *   }
 * };
 * ```
 */
export const useLoadGame = () => async (id: number) => {
    try {
        const data = await loadGame(id);
        if (!data) {
            return {
                success: false,
                message: "The requested game save does not exist",
            };
        }
        Game.setState(data.gameData);
    } catch (e) {
        console.error("Failed to load game:", e);
        return {
            success: false,
            message:
                (e as Error).message ||
                "Failed to load game. Check console for more info.",
        };
    }
};
