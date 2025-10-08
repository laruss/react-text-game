import { useCallback } from "react";

import { deleteAllGameSaves, GameSave, saveGame } from "#saves";
import { SAFE_FILE_EXTENSION } from "#saves/constants";
import { decodeSf } from "#saves/helpers";

/**
 * Helper function to create a file picker and wait for user selection
 * @param input - HTMLInputElement configured as file picker
 * @returns Promise resolving to selected File or null if cancelled
 */
const createFile = async (input: HTMLInputElement) =>
    new Promise<File | null>((resolve) => {
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const selectedFile = target.files?.[0] || null;
            resolve(selectedFile);
        };

        input.oncancel = () => {
            resolve(null);
        };

        // Trigger file explorer
        input.click();
    });

/**
 * React hook that provides a function to import game saves from an encrypted file.
 * Opens a file picker, decrypts the selected file, and replaces all existing saves.
 *
 * @returns Callback function that imports saves and returns a result object with success status, count, and error
 *
 * @example
 * ```tsx
 * const importSaves = useImportSaves();
 * const handleImport = async () => {
 *   const result = await importSaves();
 *   if (result.success) {
 *     console.log(`Successfully imported ${result.count} saves`);
 *   } else {
 *     console.error('Import failed:', result.error);
 *   }
 * };
 * ```
 */
export const useImportSaves = () => {
    return useCallback(async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = SAFE_FILE_EXTENSION;
        input.multiple = false;

        const file = await createFile(input);

        if (!file) {
            return { success: false, count: 0, error: "No file selected" };
        }

        if (!file.name.endsWith(SAFE_FILE_EXTENSION)) {
            return {
                success: false,
                count: 0,
                error: `Invalid file type. Please select a file with ${SAFE_FILE_EXTENSION} extension.`,
            };
        }

        const arrayBuffer = await file.arrayBuffer();
        let saves: GameSave[] = [];

        try {
            saves = decodeSf<GameSave[]>(arrayBuffer);
        } catch (e) {
            console.error(e);
            return {
                success: false,
                count: 0,
                error:
                    (e as Error).message ||
                    "Failed to decode save file. Check console for more info.",
            };
        }

        if (!saves || !Array.isArray(saves)) {
            return {
                success: false,
                count: 0,
                error: "Invalid save file format",
            };
        }

        try {
            await deleteAllGameSaves();
        } catch (e) {
            console.error(e);
            return {
                success: false,
                count: 0,
                error:
                    (e as Error).message ||
                    "Failed to clear existing saves. Check console for more info.",
            };
        }

        let count = 0;
        for (const save of saves) {
            try {
                await saveGame(
                    save.name,
                    save.gameData,
                    save.description,
                    save.screenshot
                );
                count++;
            } catch (e) {
                console.error(e);
            }
        }

        return {
            success: true,
            count,
            error: null,
        };
    }, []);
};
