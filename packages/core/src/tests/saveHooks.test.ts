import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";

let liveQueryValue: unknown;
let executeLiveQuery = false;
let pendingLiveQueries: Array<Promise<unknown>> = [];

mock.module("dexie-react-hooks", () => ({
    useLiveQuery: <T>(
        querier: () => Promise<T> | T,
        _dependencies?: unknown[],
        defaultValue?: T
    ): T | undefined => {
        if (executeLiveQuery) {
            const result = querier();
            if (result instanceof Promise) {
                pendingLiveQueries.push(result);
            }
        }
        return liveQueryValue === undefined
            ? defaultValue
            : (liveQueryValue as T);
    },
}));

const { SYSTEM_PASSAGE_NAMES } = await import("#constants");
const { Game } = await import("#game");
const { newOptions } = await import("#options");
const { newStory } = await import("#passages/story/fabric");
const {
    createOrUpdateSystemSave,
    db,
    getAllSaves,
    getSystemSave,
    loadGame,
    saveGame,
} = await import("#saves/db");
const { encodeSf } = await import("#saves/helpers");
const {
    useDeleteAllSaves,
    useDeleteGame,
    useExportSaves,
    useImportSaves,
    useLastLoadGame,
    useLoadGame,
    useRestartGame,
    useSaveGame,
    useSaveSlots,
} = await import("#saves/hooks");
const { clearMigrations, registerMigration } = await import(
    "#saves/migrations"
);
const { Storage } = await import("#storage");

type PickerMode = "change" | "cancel";

function installFilePicker(file: File | null, mode: PickerMode = "change") {
    const originalCreateElement = document.createElement.bind(document);

    document.createElement = ((
        tagName: string,
        options?: ElementCreationOptions
    ) => {
        const element = originalCreateElement(tagName, options);
        if (tagName.toLowerCase() !== "input") {
            return element;
        }

        const input = element as HTMLInputElement;
        Object.defineProperty(input, "files", {
            configurable: true,
            value: file ? [file] : [],
        });
        input.click = () => {
            if (mode === "cancel") {
                input.oncancel?.(new Event("cancel"));
            } else {
                input.onchange?.({ target: input } as unknown as Event);
            }
        };
        return input;
    }) as typeof document.createElement;

    return () => {
        document.createElement = originalCreateElement;
    };
}

function makeSaveFile(data: unknown, name = "backup.sx") {
    return new File([encodeSf(data)], name, {
        type: "application/octet-stream",
    });
}

describe("Save hooks", () => {
    beforeEach(async () => {
        liveQueryValue = undefined;
        executeLiveQuery = false;
        pendingLiveQueries = [];
        clearMigrations();
        Game._resetForTesting();
        Storage.setState({});
        sessionStorage.clear();
        await db.saves.clear();
        await db.settings.clear();
        newOptions({
            gameName: "Hook Coverage Game",
            gameId: "hook-coverage-game",
            gameVersion: "2.0.0",
            isDevMode: true,
        });
        await Game.init({
            gameName: "Hook Coverage Game",
            gameId: "hook-coverage-game",
            gameVersion: "2.0.0",
            isDevMode: true,
        });
        newStory(SYSTEM_PASSAGE_NAMES.START_MENU, () => [
            { type: "text", content: "Start" },
        ]);
    });

    afterEach(() => {
        clearMigrations();
        Game._resetForTesting();
        Storage.setState({});
    });

    test("deletes all user saves but preserves the system save", async () => {
        await saveGame(1, { progress: 1 });
        const deleteAll = useDeleteAllSaves();

        await deleteAll();

        expect(await getAllSaves()).toEqual([]);
        expect(await getSystemSave()).toBeDefined();
    });

    test("deletes one save and reports a database error", async () => {
        await saveGame(3, { progress: 3 });
        const deleteGame = useDeleteGame();

        expect(await deleteGame(3)).toBeUndefined();
        expect(await loadGame(3)).toBeUndefined();

        const table = db.saves as unknown as {
            where: (query: unknown) => unknown;
        };
        const originalWhere = table.where;
        table.where = () => {
            throw new Error("delete unavailable");
        };
        try {
            expect(await deleteGame(4)).toEqual({
                success: false,
                message: "delete unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("saves the current game state and reports write errors", async () => {
        Storage.setValue("$.player", { health: 64 });
        const saveCurrentGame = useSaveGame();

        expect(await saveCurrentGame(4)).toBeUndefined();
        expect((await loadGame(4))?.gameData.player).toEqual({ health: 64 });

        const table = db.saves as unknown as {
            add: (value: unknown) => Promise<number>;
        };
        const originalAdd = table.add;
        table.add = async () => {
            throw new Error("disk full");
        };
        try {
            expect(await saveCurrentGame(5)).toEqual({
                success: false,
                message: "disk full",
            });
        } finally {
            table.add = originalAdd;
        }
    });

    test("loads an existing save and rejects an unknown slot", async () => {
        Storage.setValue("$.player", { health: 20 });
        const savedState = structuredClone(Game.getState());
        await saveGame(6, savedState);
        Storage.setValue("$.player.health", 99);

        const loadSavedGame = useLoadGame();
        expect(await loadSavedGame(6)).toBeUndefined();
        expect(Storage.getValue<number>("$.player.health")).toEqual([20]);
        expect(await loadSavedGame(999)).toEqual({
            success: false,
            message: "The requested game save does not exist",
        });
    });

    test("migrates an old save before restoring it", async () => {
        registerMigration({
            from: "1.0.0",
            to: "2.0.0",
            description: "Rename hp",
            migrate: (state) => ({
                ...state,
                player: {
                    health: (state.player as { hp: number }).hp,
                },
            }),
        });
        const oldState = structuredClone(Game.getState());
        oldState.player = { hp: 45 };
        await db.saves.add({
            name: "7",
            gameData: oldState,
            timestamp: new Date(),
            version: "1.0.0",
        });

        const loadSavedGame = useLoadGame();
        expect(await loadSavedGame(7)).toBeUndefined();
        expect(Storage.getValue<number>("$.player.health")).toEqual([45]);
    });

    test("returns migration and database failures from load", async () => {
        const oldState = structuredClone(Game.getState());
        await db.saves.add({
            name: "8",
            gameData: oldState,
            timestamp: new Date(),
            version: "0.5.0",
        });
        const loadSavedGame = useLoadGame();

        expect(await loadSavedGame(8)).toEqual({
            success: false,
            message: expect.stringContaining(
                "Failed to migrate save from version 0.5.0 to 2.0.0"
            ),
        });

        const table = db.saves as unknown as {
            where: (query: unknown) => unknown;
        };
        const originalWhere = table.where;
        table.where = () => {
            throw new Error("read unavailable");
        };
        try {
            expect(await loadSavedGame(8)).toEqual({
                success: false,
                message: "read unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("restarts from the system state and clears auto-save", async () => {
        const initialState = structuredClone(Game.getState());
        initialState.player = { health: 100 };
        await createOrUpdateSystemSave(initialState);
        Storage.setValue("$.player", { health: 1 });
        sessionStorage.setItem("gameAutoSave", "stale");
        const { result } = renderHook(() => useRestartGame());

        let restartResult:
            | Awaited<ReturnType<typeof result.current>>
            | undefined;
        await act(async () => {
            restartResult = await result.current();
        });

        expect(restartResult).toEqual({ success: true, error: null });
        expect(Storage.getValue<number>("$.player.health")).toEqual([100]);
        expect(Game.currentPassage?.id).toBe(SYSTEM_PASSAGE_NAMES.START_MENU);
        expect(sessionStorage.getItem("gameAutoSave")).toBeNull();
    });

    test("reports when restart has no system save", async () => {
        await db.saves.clear();
        const { result } = renderHook(() => useRestartGame());

        expect(await result.current()).toEqual({
            success: false,
            error: "System save not found. Cannot restart game.",
        });
    });

    test("exports encrypted saves with a versioned filename", async () => {
        await saveGame(1, { progress: 10 });
        const originalCreateElement = document.createElement.bind(document);
        const originalCreateObjectURL = URL.createObjectURL;
        const originalRevokeObjectURL = URL.revokeObjectURL;
        let clicked = false;
        let removed = false;
        let download = "";
        let href = "";
        let revoked = "";

        URL.createObjectURL = () => "blob:save-export";
        URL.revokeObjectURL = (url) => {
            revoked = url;
        };
        document.createElement = ((
            tagName: string,
            options?: ElementCreationOptions
        ) => {
            const element = originalCreateElement(tagName, options);
            if (tagName.toLowerCase() === "a") {
                const anchor = element as HTMLAnchorElement;
                anchor.click = () => {
                    clicked = true;
                    download = anchor.download;
                    href = anchor.href;
                };
                anchor.remove = () => {
                    removed = true;
                };
            }
            return element;
        }) as typeof document.createElement;

        try {
            const { result } = renderHook(() => useExportSaves());
            expect(await result.current()).toEqual({
                success: true,
                error: null,
            });
        } finally {
            document.createElement = originalCreateElement;
            URL.createObjectURL = originalCreateObjectURL;
            URL.revokeObjectURL = originalRevokeObjectURL;
        }

        expect(clicked).toBe(true);
        expect(removed).toBe(true);
        expect(download).toBe("Hook Coverage Game-2.0.0.sx");
        expect(href).toBe("blob:save-export");
        expect(revoked).toBe("blob:save-export");
    });

    test("reports empty exports and serialization failures", async () => {
        await db.saves.clear();
        const { result } = renderHook(() => useExportSaves());
        expect(await result.current()).toEqual({
            success: false,
            error: "No saves found",
        });

        await saveGame(1, { progress: 10 });
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = () => {
            throw new Error("blob unavailable");
        };
        try {
            expect(await result.current()).toEqual({
                success: false,
                error: "blob unavailable",
            });
        } finally {
            URL.createObjectURL = originalCreateObjectURL;
        }
    });

    test("handles cancelled and invalid import selections", async () => {
        const restoreCancelledPicker = installFilePicker(null, "cancel");
        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: false,
                count: 0,
                error: "No file selected",
            });
        } finally {
            restoreCancelledPicker();
        }

        const restoreInvalidPicker = installFilePicker(
            new File(["text"], "backup.txt")
        );
        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: false,
                count: 0,
                error: "Invalid file type. Please select a file with .sx extension.",
            });
        } finally {
            restoreInvalidPicker();
        }
    });

    test("rejects corrupted and structurally invalid imports", async () => {
        const corruptPicker = installFilePicker(
            new File(["corrupt"], "backup.sx")
        );
        try {
            const { result } = renderHook(() => useImportSaves());
            const importResult = await result.current();
            expect(importResult.success).toBe(false);
            expect(importResult.count).toBe(0);
            expect(importResult.error).toBeString();
        } finally {
            corruptPicker();
        }

        const invalidFormatPicker = installFilePicker(
            makeSaveFile({ not: "an array" })
        );
        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: false,
                count: 0,
                error: "Invalid save file format",
            });
        } finally {
            invalidFormatPicker();
        }
    });

    test("imports valid saves and continues after one failed item", async () => {
        const saves = [
            {
                name: "bad",
                gameData: { progress: 10 },
                timestamp: new Date(),
                version: "2.0.0",
            },
            {
                name: "good",
                gameData: { progress: 20 },
                timestamp: new Date(),
                version: "2.0.0",
                description: "kept",
                screenshot: "shot",
            },
        ];
        const restorePicker = installFilePicker(makeSaveFile(saves));
        const table = db.saves as unknown as {
            add: (value: { name: string }) => Promise<number>;
        };
        const originalAdd = table.add;
        table.add = async (value) => {
            if (value.name === "bad") {
                throw new Error("bad slot");
            }
            return originalAdd.call(db.saves, value);
        };

        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: true,
                count: 1,
                error: null,
            });
        } finally {
            table.add = originalAdd;
            restorePicker();
        }

        expect((await getAllSaves()).map((save) => save.name)).toEqual([
            "good",
        ]);
    });

    test("reports a failure while clearing existing saves during import", async () => {
        const restorePicker = installFilePicker(
            makeSaveFile([
                {
                    name: "1",
                    gameData: { progress: 10 },
                    timestamp: new Date(),
                    version: "2.0.0",
                },
            ])
        );
        const table = db.saves as unknown as { clear: () => Promise<void> };
        const originalClear = table.clear;
        table.clear = async () => {
            throw new Error("clear unavailable");
        };

        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: false,
                count: 0,
                error: "clear unavailable",
            });
        } finally {
            table.clear = originalClear;
            restorePicker();
        }
    });

    test("loads the latest save and exposes loading metadata", async () => {
        Storage.setValue("$.player", { health: 30 });
        const state = structuredClone(Game.getState());
        const id = await saveGame(12, state);
        const saved = await loadGame(12);
        liveQueryValue = saved;

        const { result } = renderHook(() => useLastLoadGame());
        expect(result.current.hasLastSave).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.lastSave?.id).toBe(id);

        Storage.setValue("$.player.health", 90);
        expect(await result.current.loadLastGame()).toBeUndefined();
        expect(Storage.getValue<number>("$.player.health")).toEqual([30]);
    });

    test("handles last-save edge cases", async () => {
        liveQueryValue = null;
        const noSave = renderHook(() => useLastLoadGame());
        expect(noSave.result.current).toMatchObject({
            hasLastSave: false,
            isLoading: false,
            lastSave: null,
        });
        expect(await noSave.result.current.loadLastGame()).toBeUndefined();

        liveQueryValue = {
            id: 1,
            name: "not-a-number",
            gameData: {},
            timestamp: new Date(),
            version: "2.0.0",
        };
        const invalid = renderHook(() => useLastLoadGame());
        await expect(invalid.result.current.loadLastGame()).rejects.toThrow(
            "Invalid save ID"
        );

        liveQueryValue = {
            id: 1,
            name: "999",
            gameData: {},
            timestamp: new Date(),
            version: "2.0.0",
        };
        const missing = renderHook(() => useLastLoadGame());
        expect(await missing.result.current.loadLastGame()).toEqual({
            success: false,
            error: "Game data not found",
        });
    });

    test("reports a database failure while loading the latest save", async () => {
        liveQueryValue = {
            id: 1,
            name: "42",
            gameData: {},
            timestamp: new Date(),
            version: "2.0.0",
        };
        const table = db.saves as unknown as {
            where: (query: unknown) => unknown;
        };
        const originalWhere = table.where;
        table.where = () => {
            throw new Error("latest save unavailable");
        };

        try {
            const { result } = renderHook(() => useLastLoadGame());
            expect(await result.current.loadLastGame()).toEqual({
                success: false,
                error: "latest save unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("queries saves newest-first for the last-save hook", async () => {
        const newest = {
            id: 2,
            name: "2",
            gameData: {},
            timestamp: new Date(),
            version: "2.0.0",
        };
        const table = db.saves as unknown as {
            filter: (predicate: (save: typeof newest) => boolean) => {
                reverse: () => {
                    sortBy: (key: string) => Promise<(typeof newest)[]>;
                };
            };
        };
        const originalFilter = table.filter;
        let filterAcceptedSystemSave = true;
        let sortedBy = "";
        table.filter = (predicate) => {
            filterAcceptedSystemSave = predicate({
                ...newest,
                isSystemSave: true,
            } as typeof newest & { isSystemSave: boolean });
            return {
                reverse: () => ({
                    sortBy: async (key) => {
                        sortedBy = key;
                        return [newest];
                    },
                }),
            };
        };
        executeLiveQuery = true;
        liveQueryValue = newest;

        try {
            renderHook(() => useLastLoadGame());
            await Promise.all(pendingLiveQueries);
        } finally {
            table.filter = originalFilter;
        }

        expect(filterAcceptedSystemSave).toBe(false);
        expect(sortedBy).toBe("timestamp");
    });

    test("selects the newest user save by timestamp", async () => {
        const olderId = await db.saves.add({
            name: "1",
            gameData: { checkpoint: "older" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "2.0.0",
        });
        const newestId = await db.saves.add({
            name: "2",
            gameData: { checkpoint: "newest" },
            timestamp: new Date("2024-01-02T00:00:00.000Z"),
            version: "2.0.0",
        });
        executeLiveQuery = true;
        liveQueryValue = null;

        renderHook(() => useLastLoadGame());
        const [lastSave] = await Promise.all(pendingLiveQueries);

        expect(lastSave).toMatchObject({
            id: newestId,
            name: "2",
            gameData: { checkpoint: "newest" },
        });
        expect(lastSave).not.toMatchObject({ id: olderId });
    });

    test("overwrites an existing slot without creating a duplicate", async () => {
        const originalTimestamp = new Date("2020-01-01T00:00:00.000Z");
        const existingId = await db.saves.add({
            name: "0",
            gameData: { player: { health: 10 } },
            timestamp: originalTimestamp,
            version: "2.0.0",
        });
        const existingSave = await loadGame(0);
        if (!existingSave) throw new Error("Expected existing slot 0 save");
        liveQueryValue = [existingSave];
        Storage.setValue("$.player", { health: 90 });
        const { result } = renderHook(() => useSaveSlots({ count: 1 }));

        expect(result.current[0]?.data?.id).toBe(existingId);
        await act(async () => {
            await result.current[0]?.save();
        });

        const slotSaves = (await getAllSaves()).filter(
            (save) => save.name === "0"
        );
        expect(slotSaves).toHaveLength(1);
        const overwrittenSave = slotSaves[0];
        if (!overwrittenSave)
            throw new Error("Expected overwritten slot 0 save");
        expect(overwrittenSave).toMatchObject({
            id: existingId,
            name: "0",
        });
        expect(overwrittenSave.gameData.player).toEqual({ health: 90 });
        expect(overwrittenSave.timestamp.getTime()).toBeGreaterThan(
            originalTimestamp.getTime()
        );
    });

    test("builds save slots with working save, load and delete actions", async () => {
        Storage.setValue("$.player", { health: 70 });
        const state = structuredClone(Game.getState());
        const slot = {
            id: 1,
            name: "0",
            gameData: state,
            timestamp: new Date(),
            version: "2.0.0",
        };
        liveQueryValue = [slot];
        const { result } = renderHook(() => useSaveSlots({ count: 2 }));

        expect(result.current).toHaveLength(2);
        expect(result.current[0]?.data).toBe(slot);
        expect(result.current[1]?.data).toBeNull();

        await result.current[0]?.save();
        const savedSlot = await loadGame(0);
        expect(savedSlot?.gameData).toHaveProperty("_system.game");
        expect(savedSlot?.gameData.player).toEqual({ health: 70 });
        if (!savedSlot) {
            throw new Error("Expected slot 0 to be saved");
        }
        // IndexedDB structured-clones records. The lightweight test Dexie mock
        // stores references, so clone here to preserve the real DB contract.
        savedSlot.gameData = structuredClone(savedSlot.gameData);

        Storage.setValue("$.player.health", 5);
        await result.current[0]?.load();
        expect(Storage.getValue<number>("$.player.health")).toEqual([70]);

        await result.current[0]?.delete();
        expect(await loadGame(0)).toBeUndefined();

        liveQueryValue = [];
        expect(renderHook(() => useSaveSlots()).result.current).toHaveLength(1);
    });

    test("queries the database for live save-slot updates", async () => {
        await saveGame(0, { player: { health: 88 } });
        executeLiveQuery = true;
        liveQueryValue = [];

        const { result } = renderHook(() => useSaveSlots({ count: 1 }));
        const queried = await Promise.all(pendingLiveQueries);

        expect(result.current).toHaveLength(1);
        expect(queried).toHaveLength(1);
        expect(queried[0]).toEqual([
            expect.objectContaining({
                name: "0",
                gameData: { player: { health: 88 } },
            }),
        ]);
    });
});
