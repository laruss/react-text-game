import { decodeSf } from "@react-text-game/core/saves";

import { buildSchema, mergeSchemas } from "#schema";
import type { CaptureSource, SaveSchema } from "#types";

/**
 * Name the engine reserves for the pristine initial state it writes on every
 * `Game.init()`.
 *
 * @remarks
 * This record is the ideal baseline: it is the untouched default state of the
 * version that wrote it. A browser's IndexedDB holds one for whichever version
 * ran there last.
 */
export const SYSTEM_SAVE_NAME = "__SYSTEM_INITIAL_STATE__";

interface SaveRecord {
    name?: string;
    gameData?: Record<string, unknown>;
    version?: string;
}

const isSaveRecord = (value: unknown): value is SaveRecord =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as SaveRecord).gameData === "object" &&
    (value as SaveRecord).gameData !== null;

const schemaFromRecords = (
    records: SaveRecord[],
    capturedFrom: CaptureSource,
    gameVersion?: string
): SaveSchema => {
    const system = records.find((record) => record.name === SYSTEM_SAVE_NAME);
    // The pristine baseline beats any played save when both are present.
    const usable = system ? [system] : records;

    const versions = Array.from(
        new Set(usable.map((record) => record.version).filter(Boolean))
    ) as string[];

    if (!gameVersion && versions.length > 1) {
        throw new Error(
            `This artifact holds saves from several versions (${versions.sort().join(", ")}). Pass --game-version to pick one.`
        );
    }

    const targetVersion = gameVersion ?? versions[0];

    if (!targetVersion) {
        throw new Error(
            "This artifact records no game version. Pass --game-version to say which version it belongs to."
        );
    }

    const matching = usable.filter(
        (record) => (record.version ?? targetVersion) === targetVersion
    );

    if (matching.length === 0) {
        throw new Error(
            `This artifact holds no save for version ${targetVersion}. Available: ${versions.sort().join(", ") || "none"}.`
        );
    }

    // Slots populate different collections, so the union describes the version
    // better than any single slot.
    return mergeSchemas(
        matching.map((record) =>
            buildSchema({
                gameVersion: targetVersion,
                gameData: record.gameData ?? {},
                // Neither a save nor a dump knows the passage registry.
                passageIds: null,
                capturedFrom,
            })
        )
    );
};

/**
 * Derives a schema from an exported `.sx` save file.
 *
 * @remarks
 * Useful for recovering a baseline from a game that is already in production:
 * a real save is a faithful record of the shape its version wrote, and its
 * populated collections reveal element types that empty defaults hide.
 *
 * @param bytes - Raw contents of the `.sx` file
 * @param gameId - The game's `gameId`, which the file is encrypted with
 * @param gameVersion - Required only when the file mixes several versions
 * @returns The derived schema
 * @throws Error if the file cannot be decrypted or holds no usable save
 */
export const schemaFromSaveFile = (
    bytes: Uint8Array,
    gameId: string,
    gameVersion?: string
): SaveSchema => {
    let decoded: unknown;

    try {
        decoded = decodeSf<unknown>(
            bytes.buffer.slice(
                bytes.byteOffset,
                bytes.byteOffset + bytes.byteLength
            ) as ArrayBuffer,
            gameId
        );
    } catch {
        throw new Error(
            `Could not decrypt this save file with gameId "${gameId}". Check that --game-id matches the gameId the game was built with.`
        );
    }

    const records = (Array.isArray(decoded) ? decoded : [decoded]).filter(
        isSaveRecord
    );

    if (records.length === 0) {
        throw new Error("This save file holds no save records.");
    }

    return schemaFromRecords(records, "save", gameVersion);
};

/**
 * Derives a schema from an IndexedDB record copied out of a browser.
 *
 * Accepts any of:
 * - a whole `saves` table copy (an array of records)
 * - one record, such as the `__SYSTEM_INITIAL_STATE__` row
 * - a bare state object, in which case `gameVersion` is required
 *
 * @param dump - Parsed JSON from the browser
 * @param gameVersion - Required only for a bare state object or a mixed dump
 * @returns The derived schema
 * @throws Error if the dump holds no recognisable state
 */
export const schemaFromDump = (
    dump: unknown,
    gameVersion?: string
): SaveSchema => {
    const candidates = Array.isArray(dump) ? dump : [dump];
    const records = candidates.filter(isSaveRecord);

    if (records.length > 0) {
        return schemaFromRecords(records, "dump", gameVersion);
    }

    // Fall back to treating the payload as the state object itself, which is what
    // copying just the `gameData` cell out of the IndexedDB viewer produces.
    if (
        !Array.isArray(dump) &&
        typeof dump === "object" &&
        dump !== null &&
        Object.keys(dump).length > 0
    ) {
        if (!gameVersion) {
            throw new Error(
                "This dump looks like a bare state object with no version. Pass --game-version to say which version it belongs to."
            );
        }

        return buildSchema({
            gameVersion,
            gameData: dump as Record<string, unknown>,
            passageIds: null,
            capturedFrom: "dump",
        });
    }

    throw new Error(
        "This dump holds no save state. Export either the whole `saves` table, one of its rows, or the gameData object of a row."
    );
};
