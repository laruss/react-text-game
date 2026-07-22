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
    loadGameByName,
    SYSTEM_SAVE_NAME,
    saveGame,
    setSetting,
} from "#saves/db";
import { decodeSf, encodeSf, getDateString } from "#saves/helpers";

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
            "Before the boss",
            "data:image/png;base64,shot"
        );
        await saveGame(2, { player: { health: 50 } });

        const first = await loadGame(1);
        expect(first?.id).toBe(firstId);
        expect(first?.name).toBe("1");
        expect(first?.gameData).toEqual({ player: { health: 80 } });
        expect(first?.description).toBe("Before the boss");
        expect(first?.screenshot).toBe("data:image/png;base64,shot");
        expect(first?.version).toBe("2.4.0");
        expect(first?.timestamp).toBeInstanceOf(Date);

        expect((await loadGameByName("2"))?.gameData).toEqual({
            player: { health: 50 },
        });
        expect(await getAllSaves()).toHaveLength(2);

        await deleteSave(1);
        expect(await loadGame(1)).toBeUndefined();
        expect((await getAllSaves()).map((save) => save.name)).toEqual(["2"]);
    });

    test("serializes concurrent writes to the same new slot", async () => {
        const [firstId, secondId] = await Promise.all([
            saveGame(7, { checkpoint: "first" }),
            saveGame(7, { checkpoint: "second" }),
        ]);

        expect(secondId).toBe(firstId);
        expect(
            (await getAllSaves()).filter((save) => save.name === "7")
        ).toHaveLength(1);
        expect((await loadGame(7))?.gameData).toEqual({
            checkpoint: "second",
        });
    });

    test("heals historical duplicate rows when overwriting a slot", async () => {
        const firstId = await db.saves.add({
            name: "8",
            gameData: { checkpoint: "oldest" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "1.0.0",
        });
        if (firstId === undefined) {
            throw new Error("Expected the historical save to receive an ID");
        }
        await db.saves.add({
            name: "8",
            gameData: { checkpoint: "stale duplicate" },
            timestamp: new Date("2024-01-02T00:00:00.000Z"),
            version: "1.0.0",
        });

        expect(await saveGame(8, { checkpoint: "current" })).toBe(firstId);
        expect(
            (await getAllSaves()).filter((save) => save.name === "8")
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
            name: SYSTEM_SAVE_NAME,
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
