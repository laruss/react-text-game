import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import Dexie, { type EntityTable } from "dexie";

import { newOptions } from "#options";
import {
    getAllSaves,
    getAllSettings,
    getSetting,
    getSystemSave,
    loadGame,
    SYSTEM_SAVE_NAME,
    saveGame,
    setSetting,
} from "#saves/db";
import {
    LEGACY_DATABASE_NAME,
    LEGACY_MIGRATION_SETTING,
    migrateLegacySaves,
} from "#saves/legacy";
import type { GameSave, GameSettings } from "#saves/types";

/**
 * The shared database exactly as a build from before the `gameId` fix left it:
 * schema version 2, records spelled `name` and `description`.
 *
 * @remarks
 * Seeding through this rather than through `getGameDatabase("")` is what makes
 * these tests mean anything. Opening the shared database with the current
 * `GameDatabase` runs the version 3 upgrade against it - which is the mistake
 * the migration must not make - so a test that used the current class to set
 * the scene would have performed the damage itself and then found nothing
 * wrong.
 */
class OldBuildDatabase extends Dexie {
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

let legacy: OldBuildDatabase | undefined;

const legacyDatabase = () => {
    legacy ??= new OldBuildDatabase();
    return legacy;
};

type DatabaseOpen = { name: string; maxVersion: number };

/** Every database connection opened so far, read off the Dexie mock. */
const databaseOpens = (): ReadonlyArray<DatabaseOpen> =>
    (
        Dexie as unknown as { __opens: () => ReadonlyArray<DatabaseOpen> }
    ).__opens();

const useGame = (gameId: string) =>
    newOptions({
        gameName: "Legacy Game",
        gameId,
        gameVersion: "2.0.0",
    });

const seedLegacySave = async (
    record: Partial<GameSave> & Record<string, unknown>
) => {
    await legacyDatabase().saves.add(record as unknown as GameSave);
};

/** The error Dexie raises when a database is newer than the schema opening it. */
const versionError = () => {
    const error = new Error(
        'Database "-gamedb" has a newer version than the one declared'
    );
    error.name = "VersionError";
    return error;
};

/**
 * Makes reading the shared database fail.
 *
 * @remarks
 * The mock shares one table object per database name, so stubbing it here is
 * what the connection inside `migrateLegacySaves` sees too.
 *
 * @param error - What the read should throw
 * @returns Restores the real read
 */
const failLegacyRead = (error: Error) => {
    const table = legacyDatabase().saves as unknown as {
        toArray: () => Promise<GameSave[]>;
    };
    const original = table.toArray;

    table.toArray = async () => {
        throw error;
    };

    return () => {
        table.toArray = original;
    };
};

describe("migrateLegacySaves", () => {
    beforeEach(async () => {
        await legacyDatabase().saves.clear();
        await legacyDatabase().settings.clear();
    });

    // "-gamedb" is shared with every other suite in this process. Left seeded,
    // the next file to call `Game.init()` with an empty database would adopt
    // these records exactly as a real game would.
    afterAll(async () => {
        await legacyDatabase().saves.clear();
        await legacyDatabase().settings.clear();
    });

    test("copies saves and settings out of the shared database on first open", async () => {
        await seedLegacySave({
            name: "0",
            description: "Before the plumber",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });
        await seedLegacySave({
            name: "1",
            gameData: { progress: 2 },
            timestamp: new Date("2024-02-01T00:00:00.000Z"),
            version: "1.1.0",
        });
        await legacyDatabase().settings.add({
            key: "language",
            value: "de",
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        } as GameSettings);

        useGame("copies-target");
        const copied = await migrateLegacySaves();

        expect(copied).toEqual({ saves: 2, settings: 1 });

        const saves = await getAllSaves();
        expect(saves.map((save) => save.slot).sort()).toEqual(["0", "1"]);
        // The label survives the rename, and so does the moment each save was
        // taken: a restored list keeps the order the player knew it by.
        expect((await loadGame(0))?.title).toBe("Before the plumber");
        expect((await loadGame(0))?.timestamp).toEqual(
            new Date("2024-01-01T00:00:00.000Z")
        );
        expect((await loadGame(1))?.version).toBe("1.1.0");
        expect(await getSetting("language", "none")).toBe("de");
        expect(await getSetting(LEGACY_MIGRATION_SETTING, false)).toBe(true);
    });

    test("leaves the shared database's own records alone", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });

        useGame("untouched-target");
        const opensBefore = databaseOpens().length;
        await migrateLegacySaves();

        // The shared database must be opened under the schema the builds that
        // share it declare. Reading it through the current `GameDatabase`
        // would upgrade it to version 3 - rewriting rows under every other
        // game on this origin, and locking out those still on an older build
        // with a Dexie VersionError.
        const opened = databaseOpens()
            .slice(opensBefore)
            .filter((open) => open.name === LEGACY_DATABASE_NAME);
        expect(opened).toHaveLength(1);
        expect(opened[0]?.maxVersion).toBe(2);

        // So their records are still spelled the way their build expects.
        const [legacyRecord] = await legacyDatabase().saves.toArray();
        expect(legacyRecord).toMatchObject({ name: "0" });
        expect(legacyRecord).not.toHaveProperty("slot");
    });

    test("gives up on a shared database a newer build already owns", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });
        // A game running without a gameId opens "-gamedb" as its own and
        // upgrades it, after which Dexie refuses to open it under version 2.
        const restore = failLegacyRead(versionError());

        useGame("newer-legacy-target");

        try {
            expect(await migrateLegacySaves()).toEqual({
                saves: 0,
                settings: 0,
            });
        } finally {
            restore();
        }

        expect(await getAllSaves()).toEqual([]);
        // Recorded as settled: that database belongs to another game, and
        // retrying every boot would never reach a different answer.
        expect(await getSetting(LEGACY_MIGRATION_SETTING, false)).toBe(true);
    });

    test("tries again on the next boot when the read merely failed", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });
        const restore = failLegacyRead(new Error("storage unavailable"));

        useGame("retry-target");

        try {
            await expect(migrateLegacySaves()).rejects.toThrow(
                "storage unavailable"
            );
        } finally {
            restore();
        }

        // Not written off: a transient failure must not cost the player their
        // saves forever.
        expect(await getSetting(LEGACY_MIGRATION_SETTING, false)).toBe(false);
        expect(await migrateLegacySaves()).toEqual({ saves: 1, settings: 0 });
    });

    test("runs once, so a later boot does not copy again", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });

        useGame("once-target");
        expect(await migrateLegacySaves()).toEqual({ saves: 1, settings: 0 });

        // A save taken after the copy must survive the next boot.
        await saveGame(0, { progress: 99 });
        expect(await migrateLegacySaves()).toEqual({ saves: 0, settings: 0 });
        expect((await loadGame(0))?.gameData).toEqual({ progress: 99 });
    });

    test("never overwrites a database that already holds player saves", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: "legacy" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });

        useGame("occupied-target");
        await saveGame(0, { progress: "mine" });

        expect(await migrateLegacySaves()).toEqual({ saves: 0, settings: 0 });
        expect((await loadGame(0))?.gameData).toEqual({ progress: "mine" });
        expect(await getSetting(LEGACY_MIGRATION_SETTING, false)).toBe(true);
    });

    test("leaves the system save behind rather than copying a foreign baseline", async () => {
        await seedLegacySave({
            name: SYSTEM_SAVE_NAME,
            isSystemSave: true,
            gameData: { initial: "someone else's game" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });

        useGame("system-target");
        expect(await migrateLegacySaves()).toEqual({ saves: 0, settings: 0 });
        expect(await getSystemSave()).toBeUndefined();
    });

    test("keeps a setting the game has already written for itself", async () => {
        await legacyDatabase().settings.add({
            key: "language",
            value: "de",
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        } as GameSettings);

        useGame("settings-target");
        await setSetting("language", "fr");

        expect(await migrateLegacySaves()).toEqual({ saves: 0, settings: 0 });
        expect(await getSetting("language", "none")).toBe("fr");
    });

    test("does nothing when no legacy database was ever created", async () => {
        const dexie = Dexie as unknown as {
            exists: (name: string) => Promise<boolean>;
        };
        const originalExists = dexie.exists;
        let checkedName: string | undefined;
        dexie.exists = async (name) => {
            checkedName = name;
            return false;
        };

        useGame("absent-target");

        try {
            expect(await migrateLegacySaves()).toEqual({
                saves: 0,
                settings: 0,
            });
        } finally {
            dexie.exists = originalExists;
        }

        expect(checkedName).toBe(LEGACY_DATABASE_NAME);
        expect(await getAllSaves()).toEqual([]);
        expect(await getSetting(LEGACY_MIGRATION_SETTING, false)).toBe(true);
    });

    test("does nothing for a game that has no gameId of its own", async () => {
        await seedLegacySave({
            name: "0",
            gameData: { progress: 1 },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });

        newOptions({
            gameName: "Unnamed Game",
            gameId: "",
            gameVersion: "1.0",
        });

        expect(await migrateLegacySaves()).toEqual({ saves: 0, settings: 0 });
        expect(await getAllSettings()).toEqual({});
    });
});
