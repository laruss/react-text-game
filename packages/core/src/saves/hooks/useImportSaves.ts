import { useCallback } from "react";

import { useReadSaveFile } from "./useReadSaveFile";
import {
    useWriteSaves,
    type WriteSavesMode,
    type WriteSavesResult,
} from "./useWriteSaves";

/**
 * React hook that imports game saves from an encrypted file: opens a file
 * picker, decodes the selection and writes what it holds.
 *
 * @remarks
 * A convenience wrapper over `useReadSaveFile` and `useWriteSaves`. Reach for
 * those two directly when the flow needs to confirm the import with the file
 * already chosen - this hook cannot show the player what they are about to
 * replace, because it picks and writes in one call.
 *
 * Nothing is deleted until the whole file has decoded and validated, and the
 * timestamps in the file are preserved.
 *
 * @returns Callback that imports saves and reports how many landed
 *
 * @example
 * ```tsx
 * const importSaves = useImportSaves();
 * const handleImport = async () => {
 *   const result = await importSaves();
 *   if (result.success) {
 *     console.log(`Successfully imported ${result.count} saves`);
 *   } else if (result.code !== 'cancelled') {
 *     console.error('Import failed:', result.error);
 *   }
 * };
 * ```
 */
export const useImportSaves = () => {
    const readSaveFile = useReadSaveFile();
    const writeSaves = useWriteSaves();

    return useCallback(
        async (
            file?: File,
            options?: { mode?: WriteSavesMode }
        ): Promise<WriteSavesResult> => {
            const read = await readSaveFile(file);

            if (!read.success) {
                return {
                    success: false,
                    code: read.code,
                    error: read.error,
                    count: 0,
                };
            }

            return writeSaves(read.saves, options);
        },
        [readSaveFile, writeSaves]
    );
};
