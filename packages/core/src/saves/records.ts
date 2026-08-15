import type { GameSave } from "./types";

/**
 * Shape a save record had before `slot` replaced `name` and `title` replaced
 * `description`. Rows written by older builds - and save files exported by
 * them - still arrive in this shape.
 */
type LegacySaveRecord = Partial<GameSave> & {
    name?: unknown;
    description?: unknown;
};

/**
 * The literal an older `saveGame` wrote into optional fields that were never
 * supplied, because it stringified `undefined`.
 */
const STRINGIFIED_UNDEFINED = "undefined";

const asOptionalString = (value: unknown): string | undefined =>
    typeof value === "string" && value !== STRINGIFIED_UNDEFINED
        ? value
        : undefined;

/**
 * Brings a save record up to the current field names, in place.
 *
 * @remarks
 * Runs from three places that all see records written by older builds: the
 * Dexie schema upgrade, the copy out of the pre-`gameId` database, and save
 * file import. It also drops the `"undefined"` strings that the old
 * `saveGame` wrote into absent optional fields, so consumers can trust
 * `title` and `screenshot` to be either a real value or missing.
 *
 * @param record - Record to normalize. Mutated.
 */
export const normalizeSaveRecord = (record: LegacySaveRecord): void => {
    if (record.slot === undefined && typeof record.name === "string") {
        record.slot = record.name;
    }
    delete record.name;

    if (record.title === undefined && typeof record.description === "string") {
        record.title = record.description;
    }
    delete record.description;

    const title = asOptionalString(record.title);
    if (title === undefined) {
        delete record.title;
    } else {
        record.title = title;
    }

    const screenshot = asOptionalString(record.screenshot);
    if (screenshot === undefined) {
        delete record.screenshot;
    } else {
        record.screenshot = screenshot;
    }
};

/**
 * Reads an unknown value as a save record, normalizing legacy field names.
 *
 * @param value - Candidate record, typically straight out of a decoded file
 * @returns A normalized copy, or `null` if the value cannot be a save
 */
export const toSaveRecord = (value: unknown): GameSave | null => {
    if (typeof value !== "object" || value === null) {
        return null;
    }

    const record = { ...value } as LegacySaveRecord;
    normalizeSaveRecord(record);

    if (typeof record.slot !== "string" || record.slot === "") {
        return null;
    }
    if (typeof record.gameData !== "object" || record.gameData === null) {
        return null;
    }

    // JSON has no date type, so an imported timestamp arrives as a string.
    const timestamp = record.timestamp as Date | string | number | undefined;

    return {
        ...record,
        slot: record.slot,
        gameData: record.gameData,
        timestamp: timestamp === undefined ? new Date(0) : new Date(timestamp),
        version: typeof record.version === "string" ? record.version : "",
    } as GameSave;
};
