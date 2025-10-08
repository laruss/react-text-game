import { Game } from "#game";
import { saveGame } from "#saves";

/**
 * React hook that provides a function to save the current game state to a specific slot.
 * The save is stored in IndexedDB with the slot number as the save name.
 *
 * @returns Function that accepts a slot number and saves the game, returning a result object on failure
 *
 * @example
 * ```tsx
 * const saveGame = useSaveGame();
 * const handleSave = async () => {
 *   const result = await saveGame(1);
 *   if (result?.success === false) {
 *     console.error('Save failed:', result.message);
 *   }
 * };
 * ```
 */
export const useSaveGame = () => async (id: number) => {
    const data = Game.getState();

    try {
        await saveGame(id, data);
    } catch (e) {
        console.error("Failed to save game:", e);
        return {
            success: false,
            message:
                (e as Error).message ||
                "Failed to save game. Check console for more info.",
        };
    }
};
