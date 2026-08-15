import { beforeEach, describe, expect, test } from "bun:test";

import { newOptions } from "#options";
import {
    createOrUpdateSystemSave,
    db,
    deleteAllGameSaves,
    deleteSave,
    deleteSetting,
    GameDatabase,
    getAllSaves,
    getAllSettings,
    getDatabase,
    getGameDatabase,
    getSetting,
    getSystemSave,
    loadGame,
    loadGameBySlot,
    putSaves,
    SYSTEM_SAVE_NAME,
    saveGame,
    setSetting,
    updateSave,
} from "#saves/db";
import {
    decodeSf,
    encodeSf,
    errorMessage,
    getDateString,
} from "#saves/helpers";
import { normalizeSaveRecord, toSaveRecord } from "#saves/records";
import type { GameSave } from "#saves/types";

describe("Save helpers", () => {
    beforeEach(() => {
        newOptions({
            gameName: "Coverage Game",
            gameId: "coverage-game",
            gameVersion: "2.4.0",
        });
    });

    test("encrypts and decrypts structured save data", () => {
        const original = {
            player: { name: "Ada", inventory: ["key", "map"] },
            checkpoint: 7,
        };

        const encoded = encodeSf(original);

        expect(encoded).toBeInstanceOf(Uint8Array);
        expect(new TextDecoder().decode(encoded)).not.toContain("Ada");
        expect(
            decodeSf<typeof original>(encoded.buffer as ArrayBuffer)
        ).toEqual(original);
    });

    test("rejects data encrypted for another game", () => {
        const encoded = encodeSf({ secret: "save" });
        newOptions({ gameName: "Another Game", gameId: "another-game" });

        expect(() => decodeSf(encoded.buffer as ArrayBuffer)).toThrow();
    });

    test("rejects corrupted encrypted data", () => {
        const corrupted = new TextEncoder().encode("not-a-valid-save-file");

        expect(() => decodeSf(corrupted.buffer as ArrayBuffer)).toThrow();
    });

    test("reads a message off a thrown value, falling back when it carries none", () => {
        expect(errorMessage(new Error("disk is full"), "fallback")).toBe(
            "disk is full"
        );
        expect(errorMessage(new Error(""), "fallback")).toBe("fallback");
        expect(errorMessage("just a string", "fallback")).toBe("fallback");
    });

    test("formats a timestamp for display", () => {
        const formatted = getDateString(new Date(2025, 0, 15, 14, 30));

        expect(formatted).toContain("15");
        expect(formatted).toContain("2025");
        expect(formatted).toMatch(/14:30|02:30/);
    });
});

describe("GameDatabase", () => {
    beforeEach(async () => {
        newOptions({
            gameName: "Coverage Game",
            gameId: "coverage-game",
            gameVersion: "2.4.0",
        });
        await db.saves.clear();
        await db.settings.clear();
    });

    test("constructs and caches databases by game id", () => {
        const first = getGameDatabase("cache-a");
        const again = getGameDatabase("cache-a");
        const second = getGameDatabase("cache-b");

        expect(first).toBeInstanceOf(GameDatabase);
        expect(again).toBe(first);
        expect(second).not.toBe(first);
        expect(getDatabase()).toBe(getGameDatabase("coverage-game"));
    });

    test("creates, finds, lists and deletes named saves", async () => {
        const firstId = await saveGame(
            1,
            { player: { health: 80 } },
            {
                title: "Before the boss",
                screenshot: "data:image/png;base64,shot",
                meta: { day: 3, place: "flat" },
            }
        );
        await saveGame(2, { player: { health: 50 } });

        const first = await loadGame(1);
        expect(first?.id).toBe(firstId);
        expect(first?.slot).toBe("1");
        expect(first?.gameData).toEqual({ player: { health: 80 } });
        expect(first?.title).toBe("Before the boss");
        expect(first?.meta).toEqual({ day: 3, place: "flat" });
        expect(first?.screenshot).toBe("data:image/png;base64,shot");
        expect(first?.version).toBe("2.4.0");
        expect(first?.timestamp).toBeInstanceOf(Date);

        expect((await loadGameBySlot("2"))?.gameData).toEqual({
            player: { health: 50 },
        });
        expect(await getAllSaves()).toHaveLength(2);

        await deleteSave(1);
        expect(await loadGame(1)).toBeUndefined();
        expect((await getAllSaves()).map((save) => save.slot)).toEqual(["2"]);
    });

    test("stamps an explicit version instead of the current one", async () => {
        await saveGame(11, { player: { health: 10 } }, { version: "1.3.0" });

        expect((await loadGame(11))?.version).toBe("1.3.0");
    });

    test("falls back to the current game version when none is given", async () => {
        await saveGame(12, { player: { health: 10 } });

        expect((await loadGame(12))?.version).toBe("2.4.0");
    });

    test("serializes concurrent writes to the same new slot", async () => {
        const [firstId, secondId] = await Promise.all([
            saveGame(7, { checkpoint: "first" }),
            saveGame(7, { checkpoint: "second" }),
        ]);

        expect(secondId).toBe(firstId);
        expect(
            (await getAllSaves()).filter((save) => save.slot === "7")
        ).toHaveLength(1);
        expect((await loadGame(7))?.gameData).toEqual({
            checkpoint: "second",
        });
    });

    test("heals historical duplicate rows when overwriting a slot", async () => {
        const firstId = await db.saves.add({
            slot: "8",
            gameData: { checkpoint: "oldest" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });
        if (firstId === undefined) {
            throw new Error("Expected the historical save to receive an ID");
        }
        await db.saves.add({
            slot: "8",
            gameData: { checkpoint: "stale duplicate" },
            timestamp: new Date("2024-01-02T00:00:00.000Z"),
            version: "1.0.0",
        });

        expect(await saveGame(8, { checkpoint: "current" })).toBe(firstId);
        expect(
            (await getAllSaves()).filter((save) => save.slot === "8")
        ).toHaveLength(1);
        expect((await loadGame(8))?.gameData).toEqual({
            checkpoint: "current",
        });
    });

    test("does not allow regular saves to overwrite the system baseline", async () => {
        const systemId = await createOrUpdateSystemSave({ initial: true });

        await expect(
            saveGame(SYSTEM_SAVE_NAME, { initial: false })
        ).rejects.toThrow("is reserved");
        expect(await getSystemSave()).toMatchObject({
            id: systemId,
            gameData: { initial: true },
        });
    });

    test("creates and updates settings and returns defaults", async () => {
        const firstId = await setSetting("volume", 0.5);
        const updatedId = await setSetting("volume", 0.8);
        await setSetting("theme", { mode: "dark" });

        expect(updatedId).toBe(firstId);
        expect(await getSetting("volume", 1)).toBe(0.8);
        expect(await getSetting("missing", "fallback")).toBe("fallback");
        expect(await getAllSettings()).toEqual({
            volume: 0.8,
            theme: { mode: "dark" },
        });
    });

    test("delegates setting deletion to the selected collection", async () => {
        const table = db.settings as unknown as {
            where: (key: string) => {
                equals: (value: unknown) => { delete: () => Promise<void> };
            };
        };
        const originalWhere = table.where;
        let selectedKey: string | undefined;
        let selectedValue: unknown;
        let deleted = false;

        table.where = (key) => ({
            equals: (value) => ({
                delete: async () => {
                    selectedKey = key;
                    selectedValue = value;
                    deleted = true;
                },
            }),
        });

        try {
            await deleteSetting("obsolete");
        } finally {
            table.where = originalWhere;
        }

        expect(selectedKey).toBe("key");
        expect(selectedValue).toBe("obsolete");
        expect(deleted).toBe(true);
    });

    test("creates and updates the system save without listing it", async () => {
        const id = await createOrUpdateSystemSave({ player: { health: 100 } });
        const created = await getSystemSave();

        expect(created).toMatchObject({
            id,
            slot: SYSTEM_SAVE_NAME,
            isSystemSave: true,
            gameData: { player: { health: 100 } },
        });
        expect(await getAllSaves()).toEqual([]);

        const updatedId = await createOrUpdateSystemSave({
            player: { health: 75 },
        });
        expect(updatedId).toBe(id);
        expect((await getSystemSave())?.gameData).toEqual({
            player: { health: 75 },
        });
    });

    test("deletes user saves while preserving the system initial state", async () => {
        await createOrUpdateSystemSave({ initial: true });
        await saveGame(1, { progress: 10 });
        await saveGame(2, { progress: 20 });

        await deleteAllGameSaves();

        expect(await getAllSaves()).toEqual([]);
        expect((await getSystemSave())?.gameData).toEqual({ initial: true });
    });

    test("clears every save when no system save exists", async () => {
        await saveGame(1, { progress: 10 });

        await deleteAllGameSaves();

        expect(await getAllSaves()).toEqual([]);
        expect(await getSystemSave()).toBeUndefined();
    });

    test("reports an undefined save id as a failed write", async () => {
        const table = db.saves as unknown as {
            add: (value: unknown) => Promise<number | undefined>;
        };
        const originalAdd = table.add;
        table.add = async () => undefined;

        try {
            await expect(saveGame(1, { progress: 10 })).rejects.toThrow(
                "Failed to save game"
            );
            await expect(
                createOrUpdateSystemSave({ initial: true })
            ).rejects.toThrow("Failed to create system save");
        } finally {
            table.add = originalAdd;
        }
    });

    test("reports an undefined setting id as a failed write", async () => {
        const table = db.settings as unknown as {
            add: (value: unknown) => Promise<number | undefined>;
        };
        const originalAdd = table.add;
        table.add = async () => undefined;

        try {
            await expect(setSetting("volume", 0.5)).rejects.toThrow(
                "Failed to create setting"
            );
        } finally {
            table.add = originalAdd;
        }
    });
});

describe("Database resolution", () => {
    test("writes into the database of the game configured at call time", async () => {
        newOptions({
            gameName: "Game A",
            gameId: "isolation-a",
            gameVersion: "1.0.0",
        });
        await saveGame(0, { who: "a" });

        // The bug this guards against resolved the database once, while the
        // module was being imported, so every game shared the one built from
        // the default empty gameId.
        newOptions({
            gameName: "Game B",
            gameId: "isolation-b",
            gameVersion: "1.0.0",
        });
        expect(await loadGame(0)).toBeUndefined();
        expect(await getAllSaves()).toEqual([]);

        await saveGame(0, { who: "b" });
        expect((await loadGame(0))?.gameData).toEqual({ who: "b" });

        newOptions({
            gameName: "Game A",
            gameId: "isolation-a",
            gameVersion: "1.0.0",
        });
        expect((await loadGame(0))?.gameData).toEqual({ who: "a" });
    });

    test("keeps settings separate between games on one origin", async () => {
        newOptions({
            gameName: "Game A",
            gameId: "settings-a",
            gameVersion: "1.0.0",
        });
        await setSetting("language", "en");

        newOptions({
            gameName: "Game B",
            gameId: "settings-b",
            gameVersion: "1.0.0",
        });
        expect(await getSetting("language", "none")).toBe("none");
    });

    test("exposes the current game's database through the `db` binding", () => {
        newOptions({
            gameName: "Game A",
            gameId: "binding-a",
            gameVersion: "1.0.0",
        });
        expect(db.saves).toBe(getGameDatabase("binding-a").saves);

        newOptions({
            gameName: "Game B",
            gameId: "binding-b",
            gameVersion: "1.0.0",
        });
        expect(db.saves).toBe(getGameDatabase("binding-b").saves);
        expect(typeof db.transaction).toBe("function");
    });

    test("upgrades stored records to the current field names", async () => {
        const database = getGameDatabase("upgrade-game") as GameDatabase & {
            runUpgrades: () => Promise<void>;
        };
        await database.saves.clear();
        await database.saves.add({
            name: "3",
            description: "undefined",
            screenshot: "undefined",
            gameData: { progress: 1 },
            timestamp: new Date("2024-05-01T00:00:00.000Z"),
            version: "1.0.0",
        } as unknown as GameSave);
        await database.saves.add({
            name: "4",
            description: "Real label",
            gameData: { progress: 2 },
            timestamp: new Date("2024-05-02T00:00:00.000Z"),
            version: "1.0.0",
        } as unknown as GameSave);

        await database.runUpgrades();

        const [stale, labelled] = await database.saves.toArray();
        expect(stale).toMatchObject({ slot: "3", gameData: { progress: 1 } });
        expect(stale).not.toHaveProperty("name");
        expect(stale).not.toHaveProperty("description");
        expect(stale).not.toHaveProperty("title");
        expect(stale).not.toHaveProperty("screenshot");
        expect(labelled).toMatchObject({ slot: "4", title: "Real label" });
    });
});

describe("Save annotations", () => {
    beforeEach(async () => {
        newOptions({
            gameName: "Annotations Game",
            gameId: "annotations-game",
            gameVersion: "3.0.0",
        });
        await db.saves.clear();
    });

    test("leaves absent annotations absent instead of storing 'undefined'", async () => {
        await saveGame(1, { progress: 1 });

        const save = await loadGame(1);
        expect(save).not.toHaveProperty("title");
        expect(save).not.toHaveProperty("screenshot");
        expect(save).not.toHaveProperty("meta");
    });

    test("stores only the annotations that were supplied", async () => {
        await saveGame(2, { progress: 2 }, { title: "Only a title" });

        const save = await loadGame(2);
        expect(save?.title).toBe("Only a title");
        expect(save).not.toHaveProperty("screenshot");
    });

    test("does not carry the previous save's annotations into a new capture", async () => {
        await saveGame(
            5,
            { progress: 1 },
            {
                title: "Before the boss",
                meta: { day: 3 },
                screenshot: "data:image/png;base64,old",
            }
        );

        await saveGame(5, { progress: 2 });

        const save = await loadGame(5);
        expect(save?.gameData).toEqual({ progress: 2 });
        expect(save).not.toHaveProperty("title");
        expect(save).not.toHaveProperty("meta");
        expect(save).not.toHaveProperty("screenshot");
    });

    test("edits a label without moving the timestamp", async () => {
        await saveGame(3, { progress: 3 }, { title: "First name" });
        const before = await loadGame(3);

        expect(await updateSave(3, { title: "Renamed" })).toBe(true);

        const after = await loadGame(3);
        expect(after?.title).toBe("Renamed");
        expect(after?.timestamp).toEqual(before?.timestamp as Date);
        expect(after?.gameData).toEqual({ progress: 3 });
    });

    test("writes only the keys it is given", async () => {
        await saveGame(4, { progress: 4 }, { title: "Keep", meta: { day: 1 } });

        await updateSave(4, { meta: { day: 2 } });

        expect(await loadGame(4)).toMatchObject({
            title: "Keep",
            meta: { day: 2 },
        });

        await updateSave(4, {});
        expect(await loadGame(4)).toMatchObject({
            title: "Keep",
            meta: { day: 2 },
        });
    });

    test("reports an empty slot instead of creating one", async () => {
        expect(await updateSave(99, { title: "Nothing here" })).toBe(false);
        expect(await loadGame(99)).toBeUndefined();
    });
});

describe("putSaves", () => {
    const record = (slot: string, at: string): GameSave => ({
        slot,
        gameData: { at },
        timestamp: new Date(at),
        version: "1.0.0",
        title: `Save ${slot}`,
    });

    beforeEach(async () => {
        newOptions({
            gameName: "Restore Game",
            gameId: "restore-game",
            gameVersion: "3.0.0",
        });
        await db.saves.clear();
    });

    test("preserves the timestamp and version each record carries", async () => {
        const written = await putSaves([
            record("1", "2024-01-01T00:00:00.000Z"),
            record("2", "2024-02-01T00:00:00.000Z"),
        ]);

        expect(written).toBe(2);
        const saves = await getAllSaves();
        expect(saves.map((save) => save.timestamp)).toEqual([
            new Date("2024-01-01T00:00:00.000Z"),
            new Date("2024-02-01T00:00:00.000Z"),
        ]);
        expect(saves.every((save) => save.version === "1.0.0")).toBe(true);
    });

    test("replaces the player's saves while keeping the system baseline", async () => {
        await createOrUpdateSystemSave({ initial: true });
        await saveGame(5, { progress: 5 });

        await putSaves([record("1", "2024-01-01T00:00:00.000Z")]);

        expect((await getAllSaves()).map((save) => save.slot)).toEqual(["1"]);
        expect((await getSystemSave())?.gameData).toEqual({ initial: true });
    });

    test("merges into the existing saves, overwriting only the named slots", async () => {
        await saveGame(1, { progress: "old" });
        await saveGame(2, { progress: "untouched" });

        const written = await putSaves(
            [record("1", "2024-03-01T00:00:00.000Z")],
            "merge"
        );

        expect(written).toBe(1);
        expect((await loadGame(1))?.gameData).toEqual({
            at: "2024-03-01T00:00:00.000Z",
        });
        expect((await loadGame(2))?.gameData).toEqual({
            progress: "untouched",
        });
    });

    test("replaces a slot outright rather than merging into it", async () => {
        await saveGame(
            1,
            { progress: "old" },
            { title: "Local label", screenshot: "data:image/png;base64,old" }
        );

        const incoming = record("1", "2024-03-01T00:00:00.000Z");
        delete incoming.title;

        await putSaves([incoming], "merge");

        const save = await loadGame(1);
        expect(save?.gameData).toEqual({ at: "2024-03-01T00:00:00.000Z" });
        expect(save).not.toHaveProperty("title");
        expect(save).not.toHaveProperty("screenshot");
    });

    test("ignores a system save smuggled in through a file", async () => {
        await createOrUpdateSystemSave({ initial: true });

        const written = await putSaves(
            [
                {
                    ...record("1", "2024-01-01T00:00:00.000Z"),
                    slot: SYSTEM_SAVE_NAME,
                },
            ],
            "merge"
        );

        expect(written).toBe(0);
        expect((await getSystemSave())?.gameData).toEqual({ initial: true });
    });

    test("drops the source database id so records land in fresh rows", async () => {
        await putSaves([
            { ...record("1", "2024-01-01T00:00:00.000Z"), id: 9999 },
        ]);

        const saves = await getAllSaves();
        expect(saves).toHaveLength(1);
        expect(saves[0]?.id).not.toBe(9999);
        expect(saves[0]?.slot).toBe("1");
    });
});

describe("Save record normalization", () => {
    test("renames legacy fields and drops stringified undefined", () => {
        const record: Record<string, unknown> = {
            name: "2",
            description: "undefined",
            screenshot: "undefined",
            gameData: {},
        };

        normalizeSaveRecord(record as never);

        expect(record).toEqual({ slot: "2", gameData: {} });
    });

    test("keeps current field names untouched", () => {
        const record: Record<string, unknown> = {
            slot: "2",
            title: "Kept",
            screenshot: "data:image/png;base64,x",
            gameData: {},
        };

        normalizeSaveRecord(record as never);

        expect(record).toEqual({
            slot: "2",
            title: "Kept",
            screenshot: "data:image/png;base64,x",
            gameData: {},
        });
    });

    test("reads a decoded record, revitalizing its timestamp", () => {
        const save = toSaveRecord({
            name: "1",
            description: "From a file",
            gameData: { progress: 1 },
            timestamp: "2024-06-01T10:00:00.000Z",
            version: "1.2.0",
        });

        expect(save).toMatchObject({
            slot: "1",
            title: "From a file",
            version: "1.2.0",
        });
        expect(save?.timestamp).toEqual(new Date("2024-06-01T10:00:00.000Z"));
    });

    test("falls back for a record that records no timestamp or version", () => {
        const save = toSaveRecord({ slot: "1", gameData: {} });

        expect(save?.timestamp).toEqual(new Date(0));
        expect(save?.version).toBe("");
    });

    test("rejects anything that cannot be a save", () => {
        expect(toSaveRecord(null)).toBeNull();
        expect(toSaveRecord("a string")).toBeNull();
        expect(toSaveRecord({ gameData: {} })).toBeNull();
        expect(toSaveRecord({ slot: "", gameData: {} })).toBeNull();
        expect(toSaveRecord({ slot: "1" })).toBeNull();
        expect(toSaveRecord({ slot: "1", gameData: null })).toBeNull();
    });
});
