import { useCallback } from "react";

import type { GameSave } from "#saves";
import { SAFE_FILE_EXTENSION } from "#saves/constants";
import { decodeSf, errorMessage } from "#saves/helpers";
import { toSaveRecord } from "#saves/records";
import type { SaveResult } from "#saves/types";

/**
 * Result of reading a save file: the records it holds, empty when the read
 * failed.
 */
export type ReadSaveFileResult = SaveResult<{ saves: GameSave[] }>;

/**
 * Helper function to create a file picker and wait for user selection
 * @param input - HTMLInputElement configured as file picker
 * @returns Promise resolving to selected File or null if cancelled
 */
const pickFile = async (input: HTMLInputElement) =>
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

const openFilePicker = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = SAFE_FILE_EXTENSION;
    input.multiple = false;

    return pickFile(input);
};

/**
 * React hook that decodes an exported save file into save records, without
 * writing anything.
 *
 * @remarks
 * Split out of `useImportSaves` so a host can confirm a destructive import
 * with the file already chosen and its contents known - and so the flow can be
 * tested without a real file chooser. Pass a `File` to skip the picker
 * entirely.
 *
 * @returns Callback that reads a save file and returns the records it holds
 *
 * @example
 * ```tsx
 * const readSaveFile = useReadSaveFile();
 * const writeSaves = useWriteSaves();
 *
 * const handleImport = async () => {
 *   const read = await readSaveFile();
 *   if (!read.success) {
 *     if (read.code !== 'cancelled') console.error(read.error);
 *     return;
 *   }
 *   if (!confirm(`Replace every save on this device with ${read.saves.length}?`)) return;
 *   await writeSaves(read.saves);
 * };
 * ```
 */
export const useReadSaveFile = () => {
    return useCallback(async (file?: File): Promise<ReadSaveFileResult> => {
        const selected = file ?? (await openFilePicker());

        if (!selected) {
            return {
                success: false,
                code: "cancelled",
                error: "No file selected",
                saves: [],
            };
        }

        if (!selected.name.endsWith(SAFE_FILE_EXTENSION)) {
            return {
                success: false,
                code: "bad-file",
                error: `Invalid file type. Please select a file with ${SAFE_FILE_EXTENSION} extension.`,
                saves: [],
            };
        }

        let decoded: unknown;

        try {
            decoded = decodeSf<unknown>(await selected.arrayBuffer());
        } catch (e) {
            console.error(e);
            return {
                success: false,
                code: "decode-failed",
                error: errorMessage(
                    e,
                    "Failed to decode save file. Check console for more info."
                ),
                saves: [],
            };
        }

        if (!Array.isArray(decoded)) {
            return {
                success: false,
                code: "bad-file",
                error: "Invalid save file format",
                saves: [],
            };
        }

        const saves = decoded.map(toSaveRecord);
        const unusable = saves.filter((save) => save === null).length;

        // All or nothing: a file that holds junk is more likely corrupted
        // than partially valid, and the caller is about to swap it in for
        // everything the player has.
        if (unusable > 0) {
            return {
                success: false,
                code: "bad-file",
                error: `Save file holds ${unusable} unreadable record(s)`,
                saves: [],
            };
        }

        return {
            success: true,
            error: null,
            saves: saves as GameSave[],
        };
    }, []);
};
