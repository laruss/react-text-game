import { logger } from "#logger";
import { updateSave } from "#saves";
import { errorMessage } from "#saves/helpers";
import type { SaveResult, SaveUpdate } from "#saves/types";

/**
 * React hook that provides a function to edit a save's label and metadata
 * without recapturing the game state.
 *
 * @remarks
 * The save's `timestamp` is left alone, so a renamed save keeps its place in a
 * list ordered by recency.
 *
 * @returns Function that accepts a slot and the fields to change
 *
 * @example
 * ```tsx
 * const updateSave = useUpdateSave();
 * const handleRename = async (slot: number, title: string) => {
 *   const result = await updateSave(slot, { title });
 *   if (!result.success) {
 *     console.error('Rename failed:', result.error);
 *   }
 * };
 * ```
 */
export const useUpdateSave =
    () =>
    async (slot: string | number, changes: SaveUpdate): Promise<SaveResult> => {
        try {
            const updated = await updateSave(slot, changes);
            if (!updated) {
                return {
                    success: false,
                    code: "not-found",
                    error: "The requested game save does not exist",
                };
            }
            return { success: true, error: null };
        } catch (e) {
            logger.error("Failed to update save:", e);
            return {
                success: false,
                code: "storage-failed",
                error: errorMessage(
                    e,
                    "Failed to update save. Check console for more info."
                ),
            };
        }
    };
