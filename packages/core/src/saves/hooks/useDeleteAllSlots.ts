import { useCallback } from "react";

import { logger } from "#logger";
import { deleteAllGameSaves } from "#saves";
import { errorMessage } from "#saves/helpers";
import type { SaveResult } from "#saves/types";

/**
 * React hook that provides a function to delete all game saves.
 * This function clears all saved game data from the database, keeping the
 * system save that `Game.init()` writes.
 *
 * @returns Callback function that deletes all game saves
 *
 * @example
 * ```tsx
 * const deleteAllSaves = useDeleteAllSaves();
 * const handleDeleteAll = async () => {
 *   const result = await deleteAllSaves();
 *   if (!result.success) {
 *     console.error('Delete failed:', result.error);
 *   }
 * };
 * ```
 */
export const useDeleteAllSaves = () => {
    return useCallback(async (): Promise<SaveResult> => {
        try {
            await deleteAllGameSaves();
            return { success: true, error: null };
        } catch (e) {
            logger.error("Failed to delete all saves:", e);
            return {
                success: false,
                code: "storage-failed",
                error: errorMessage(
                    e,
                    "Failed to delete all saves. Check console for more info."
                ),
            };
        }
    }, []);
};
