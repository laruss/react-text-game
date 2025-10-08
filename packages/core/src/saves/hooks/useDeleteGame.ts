import { logger } from "#logger";
import { deleteSave } from "#saves";

/**
 * React hook that provides a function to delete a saved game by its ID.
 * Removes the save from IndexedDB storage.
 *
 * @returns Function that accepts a save ID and deletes the game, returning a result object on failure
 *
 * @example
 * ```tsx
 * const deleteGame = useDeleteGame();
 * const handleDelete = async () => {
 *   const result = await deleteGame(saveId);
 *   if (result?.success === false) {
 *     console.error('Delete failed:', result.message);
 *   }
 * };
 * ```
 */
export const useDeleteGame = () => async (id: number) => {
    try {
        await deleteSave(id);
    } catch (e) {
        logger.error("Failed to delete save:", e);
        return {
            success: false,
            message:
                (e as Error).message ||
                "Failed to delete save. Check console for more info.",
        };
    }
};
