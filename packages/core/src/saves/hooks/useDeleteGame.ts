import { logger } from "#logger";
import { deleteSave } from "#saves";
import { errorMessage } from "#saves/helpers";
import type { SaveResult } from "#saves/types";

/**
 * React hook that provides a function to delete the save in a slot.
 * Removes the save from IndexedDB storage.
 *
 * @returns Function that accepts a slot and deletes the save it holds
 *
 * @example
 * ```tsx
 * const deleteGame = useDeleteGame();
 * const handleDelete = async () => {
 *   const result = await deleteGame(slotIndex);
 *   if (!result.success) {
 *     console.error('Delete failed:', result.error);
 *   }
 * };
 * ```
 */
export const useDeleteGame =
    () =>
    async (slot: string | number): Promise<SaveResult> => {
        try {
            await deleteSave(slot);
            return { success: true, error: null };
        } catch (e) {
            logger.error("Failed to delete save:", e);
            return {
                success: false,
                code: "storage-failed",
                error: errorMessage(
                    e,
                    "Failed to delete save. Check console for more info."
                ),
            };
        }
    };
