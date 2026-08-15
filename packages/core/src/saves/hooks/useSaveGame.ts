import { Game } from "#game";
import { saveGame } from "#saves";
import { errorMessage } from "#saves/helpers";
import type { SaveOptions, SaveResult } from "#saves/types";

/**
 * React hook that provides a function to save the current game state to a specific slot.
 * The save is stored in IndexedDB with the slot number as its slot key.
 *
 * @returns Function that accepts a slot number and optional annotations, and
 * saves the game
 *
 * @example
 * ```tsx
 * const saveGame = useSaveGame();
 * const handleSave = async () => {
 *   const result = await saveGame(1, {
 *     title: 'Before the boss',
 *     meta: { day: 3, place: 'flat' },
 *   });
 *   if (!result.success) {
 *     console.error('Save failed:', result.error);
 *   }
 * };
 * ```
 */
export const useSaveGame =
    () =>
    async (
        slot: string | number,
        options?: SaveOptions
    ): Promise<SaveResult> => {
        const data = Game.getState();

        try {
            await saveGame(slot, data, options);
            return { success: true, error: null };
        } catch (e) {
            console.error("Failed to save game:", e);
            return {
                success: false,
                code: "storage-failed",
                error: errorMessage(
                    e,
                    "Failed to save game. Check console for more info."
                ),
            };
        }
    };
