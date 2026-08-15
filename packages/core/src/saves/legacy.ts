import Dexie, { type EntityTable } from "dexie";

import { logger } from "#logger";
import { _getOptions } from "#options";

import {
    getDatabase,
    getSetting,
    putSaves,
    SYSTEM_SAVE_NAME,
    setSetting,
} from "./db";
import { normalizeSaveRecord } from "./records";
import type { GameSave, GameSettings } from "./types";

/**
 * Name of the database every game wrote to before `gameId` reached the storage
 * layer.
 *
 * @remarks
 * The database name was built from the configured `gameId`, but it was built
 * once, while the module was being imported - before `Game.init()` had applied
 * any options. Every game therefore resolved the default empty id and shared
 * this one database.
 */
export const LEGACY_DATABASE_NAME = "-gamedb";

/**
 * Setting that records the one-time copy out of {@link LEGACY_DATABASE_NAME},
 * so it is attempted once per game rather than on every boot.
 */
export const LEGACY_MIGRATION_SETTING = "__legacySavesMigrated";

/**
 * Connection to the shared pre-`gameId` database.
 *
 * @remarks
 * Declares the schema as it stood when that database was last written, and
 * deliberately stops there. Opening it through `GameDatabase` instead would run
 * the current schema upgrade against a database every other game on this origin
 * shares: their rows would be rewritten under them, and any of those games
 * still running an older build would afterwards fail to open it at all with a
 * Dexie `VersionError`.
 */
class LegacyGameDatabase extends Dexie {
    saves!: EntityTable<GameSave, "id">;
    settings!: EntityTable<GameSettings, "id">;

    constructor() {
        super(LEGACY_DATABASE_NAME);

        this.version(1).stores({
            saves: "++id, name, timestamp",
            settings: "++id, &key, timestamp",
        });

        this.version(2).stores({
            saves: "++id, name, timestamp, isSystemSave",
            settings: "++id, &key, timestamp",
        });
    }
}

/**
 * Dexie's refusal to open a database that is newer than the schema asking for
 * it.
 */
const isVersionError = (error: unknown): boolean =>
    error instanceof Error && error.name === "VersionError";

/**
 * Reads the shared pre-`gameId` database and hands the connection back.
 *
 * @returns The rows that database holds, or `null` when the database is newer
 * than the schema this reads it with
 */
const readLegacyDatabase = async (): Promise<{
    saves: GameSave[];
    settings: GameSettings[];
} | null> => {
    const legacy = new LegacyGameDatabase();

    try {
        return {
            saves: await legacy.saves.toArray(),
            settings: await legacy.settings.toArray(),
        };
    } catch (e) {
        // Anything else - a transient read failure - is left to throw, so the
        // copy is attempted again on the next boot rather than written off.
        if (!isVersionError(e)) throw e;

        // A database above version 2 is not the abandoned legacy store: a game
        // running without a `gameId` still owns and writes it, and its records
        // belong to that game. There is nothing here to adopt.
        logger.warn(
            `"${LEGACY_DATABASE_NAME}" is newer than the build that wrote it, so it belongs to a game still running without a gameId. Nothing was copied out of it.`
        );
        return null;
    } finally {
        // Left closed so it cannot block another game's own upgrade.
        legacy.close();
    }
};

const copySettings = async (
    source: GameSettings[],
    target: ReturnType<typeof getDatabase>
): Promise<number> => {
    let copied = 0;

    for (const setting of source) {
        if (setting.key === LEGACY_MIGRATION_SETTING) continue;

        const existing = await target.settings
            .where("key")
            .equals(setting.key)
            .first();
        if (existing) continue;

        const { id: _ignored, ...record } = setting;
        await target.settings.add(record as GameSettings);
        copied++;
    }

    return copied;
};

/**
 * Copies saves and settings out of the shared pre-`gameId` database on first
 * open.
 *
 * @remarks
 * Fixing the database name alone would strand every existing player: their
 * saves stay in {@link LEGACY_DATABASE_NAME} while the game opens an empty
 * `<gameId>-gamedb`. This copies them across once, and only into a database
 * that holds no player saves of its own, so it can never overwrite newer
 * progress. The legacy database is left in place - recovering data is easier
 * than un-deleting it.
 *
 * Called by `Game.init()` before anything reads storage. Safe to call again:
 * the copy is recorded in a setting and skipped afterwards.
 *
 * @returns How many saves and settings were copied
 */
export async function migrateLegacySaves(): Promise<{
    saves: number;
    settings: number;
}> {
    const nothingCopied = { saves: 0, settings: 0 };
    const { gameId } = _getOptions();

    // Without a gameId the game already opens the legacy database itself.
    if (!gameId) return nothingCopied;

    const target = getDatabase();

    if (await getSetting(LEGACY_MIGRATION_SETTING, false)) {
        return nothingCopied;
    }

    const own = await target.saves
        .filter((save) => !save.isSystemSave)
        .toArray();
    if (own.length > 0) {
        await setSetting(LEGACY_MIGRATION_SETTING, true);
        return nothingCopied;
    }

    if (!(await Dexie.exists(LEGACY_DATABASE_NAME))) {
        await setSetting(LEGACY_MIGRATION_SETTING, true);
        return nothingCopied;
    }

    const legacyRows = await readLegacyDatabase();
    if (!legacyRows) {
        await setSetting(LEGACY_MIGRATION_SETTING, true);
        return nothingCopied;
    }

    const { saves: records, settings: legacySettings } = legacyRows;

    const saves = records
        .filter((save) => !save.isSystemSave)
        .map((save) => {
            const { id: _ignored, ...record } = save;
            normalizeSaveRecord(record);
            return record as GameSave;
        })
        .filter((save) => save.slot && save.slot !== SYSTEM_SAVE_NAME);

    const copiedSaves = saves.length > 0 ? await putSaves(saves, "merge") : 0;
    const copiedSettings = await copySettings(legacySettings, target);

    await setSetting(LEGACY_MIGRATION_SETTING, true);

    if (copiedSaves > 0 || copiedSettings > 0) {
        logger.log(
            `Copied ${copiedSaves} save(s) and ${copiedSettings} setting(s) from "${LEGACY_DATABASE_NAME}" into "${gameId}-gamedb". The legacy database was left in place.`
        );
    }

    return { saves: copiedSaves, settings: copiedSettings };
}
