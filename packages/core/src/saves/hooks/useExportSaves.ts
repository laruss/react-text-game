import { useCallback } from "react";

import { _getOptions } from "#options";
import { SAFE_FILE_EXTENSION } from "#saves/constants";
import { getAllSaves } from "#saves/db";
import { encodeSf } from "#saves/helpers";

/**
 * React hook that provides a function to export all game saves to an encrypted file.
 * The exported file is downloaded with the game name, version, and .sx extension.
 *
 * @returns Callback function that exports saves and returns a result object
 *
 * @example
 * ```tsx
 * const exportSaves = useExportSaves();
 * const handleExport = async () => {
 *   const result = await exportSaves();
 *   if (result.success) {
 *     console.log('Saves exported successfully');
 *   } else {
 *     console.error('Export failed:', result.error);
 *   }
 * };
 * ```
 */
export const useExportSaves = () => {
    return useCallback(async () => {
        const options = _getOptions();

        const allSaves = await getAllSaves();
        if (allSaves.length === 0) {
            return { success: false, error: "No saves found" };
        }

        try {
            const data = encodeSf(allSaves);
            const blob = new Blob([data], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${options.gameName}-${options.gameVersion}${SAFE_FILE_EXTENSION}`;
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            return { success: true, error: null };
        } catch (e) {
            console.error(e);
            return {
                success: false,
                error:
                    (e as Error).message ||
                    "Unknown error, check console for more info",
            };
        }
    }, []);
};
