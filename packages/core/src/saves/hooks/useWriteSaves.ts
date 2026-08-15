import { useCallback } from "react";

import { type GameSave, putSaves } from "#saves";
import { errorMessage } from "#saves/helpers";
import type { SaveResult } from "#saves/types";

/**
 * How incoming saves meet the ones already on the device.
 *
 * - `replace` - the player's other saves are cleared first. Restoring a backup.
 * - `merge` - only the slots being written are overwritten. Pulling one save
 *   off another machine.
 */
export type WriteSavesMode = "replace" | "merge";

/**
 * Result of writing saves: how many records landed, `0` when the write failed.
 */
export type WriteSavesResult = SaveResult<{ count: number }>;

/**
 * React hook that writes whole save records into the database.
 *
 * @remarks
 * Records keep the timestamp and version they carry, so saves restored from a
 * file stay in the order the player knew them by. In `replace` mode the wipe
 * and the writes share a transaction: nothing is destroyed unless the whole
 * write succeeds.
 *
 * @returns Callback that writes save records and reports how many landed
 *
 * @example
 * ```tsx
 * const writeSaves = useWriteSaves();
 * await writeSaves(saves, { mode: 'merge' });
 * ```
 */
export const useWriteSaves = () => {
    return useCallback(
        async (
            saves: GameSave[],
            options?: { mode?: WriteSavesMode }
        ): Promise<WriteSavesResult> => {
            try {
                const count = await putSaves(saves, options?.mode ?? "replace");
                return { success: true, error: null, count };
            } catch (e) {
                console.error(e);
                return {
                    success: false,
                    code: "storage-failed",
                    error: errorMessage(
                        e,
                        "Failed to write saves. Check console for more info."
                    ),
                    count: 0,
                };
            }
        },
        []
    );
};
