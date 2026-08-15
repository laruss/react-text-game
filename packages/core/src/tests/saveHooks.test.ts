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
    useReadSaveFile,
    useRestartGame,
    useSaveGame,
    useSaveSlots,
    useUpdateSave,
    useWriteSaves,
} = await import("#saves/hooks");
const { clearMigrations, registerMigration } = await import(
    "#saves/migrations"
);
const { Storage } = await import("#storage");

type GameSave = import("#saves/types").GameSave;

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

const OK = { success: true, error: null } as const;

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
        const { result } = renderHook(() => useDeleteAllSaves());

        expect(await result.current()).toEqual(OK);

        expect(await getAllSaves()).toEqual([]);
        expect(await getSystemSave()).toBeDefined();
    });

    test("reports a database failure while deleting every save", async () => {
        const table = db.saves as unknown as {
            toArray: () => Promise<unknown[]>;
        };
        const originalToArray = table.toArray;
        table.toArray = async () => {
            throw new Error("wipe unavailable");
        };

        try {
            const { result } = renderHook(() => useDeleteAllSaves());
            expect(await result.current()).toEqual({
                success: false,
                code: "storage-failed",
                error: "wipe unavailable",
            });
        } finally {
            table.toArray = originalToArray;
        }
    });

    test("deletes one save and reports a database error", async () => {
        await saveGame(3, { progress: 3 });
        const deleteGame = useDeleteGame();

        expect(await deleteGame(3)).toEqual(OK);
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
                code: "storage-failed",
                error: "delete unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("saves the current game state and reports write errors", async () => {
        Storage.setValue("$.player", { health: 64 });
        const saveCurrentGame = useSaveGame();

        expect(await saveCurrentGame(4)).toEqual(OK);
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
                code: "storage-failed",
                error: "disk full",
            });
        } finally {
            table.add = originalAdd;
        }
    });

    test("carries a title, metadata and a screenshot into the save", async () => {
        Storage.setValue("$.player", { health: 64 });
        const saveCurrentGame = useSaveGame();

        expect(
            await saveCurrentGame(4, {
                title: "Before the plumber",
                meta: { day: 3, hour: 14, place: "flat" },
                screenshot: "data:image/png;base64,shot",
            })
        ).toEqual(OK);

        expect(await loadGame(4)).toMatchObject({
            title: "Before the plumber",
            meta: { day: 3, hour: 14, place: "flat" },
            screenshot: "data:image/png;base64,shot",
        });
    });

    test("loads an existing save and rejects an unknown slot", async () => {
        Storage.setValue("$.player", { health: 20 });
        const savedState = structuredClone(Game.getState());
        await saveGame(6, savedState);
        Storage.setValue("$.player.health", 99);

        const loadSavedGame = useLoadGame();
        expect(await loadSavedGame(6)).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([20]);
        expect(await loadSavedGame(999)).toEqual({
            success: false,
            code: "not-found",
            error: "The requested game save does not exist",
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
            slot: "7",
            gameData: oldState,
            timestamp: new Date(),
            version: "1.0.0",
        });

        const loadSavedGame = useLoadGame();
        expect(await loadSavedGame(7)).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([45]);
    });

    test("returns migration and database failures from load", async () => {
        const oldState = structuredClone(Game.getState());
        await db.saves.add({
            slot: "8",
            gameData: oldState,
            timestamp: new Date(),
            version: "0.5.0",
        });
        const loadSavedGame = useLoadGame();

        expect(await loadSavedGame(8)).toEqual({
            success: false,
            code: "migration-failed",
            error: expect.stringContaining(
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
                code: "storage-failed",
                error: "read unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("renames a save without recapturing state or moving its timestamp", async () => {
        Storage.setValue("$.player", { health: 42 });
        await saveGame(9, structuredClone(Game.getState()), {
            title: "First name",
        });
        const before = await loadGame(9);
        Storage.setValue("$.player.health", 1);

        const updateSaveHandler = useUpdateSave();
        expect(await updateSaveHandler(9, { title: "Renamed" })).toEqual(OK);

        const after = await loadGame(9);
        expect(after?.title).toBe("Renamed");
        expect(after?.timestamp).toEqual(before?.timestamp as Date);
        expect(after?.gameData).toEqual(before?.gameData as never);
    });

    test("reports an empty slot and a database failure from a rename", async () => {
        const updateSaveHandler = useUpdateSave();

        expect(await updateSaveHandler(404, { title: "Nothing" })).toEqual({
            success: false,
            code: "not-found",
            error: "The requested game save does not exist",
        });

        const table = db.saves as unknown as {
            where: (query: unknown) => unknown;
        };
        const originalWhere = table.where;
        table.where = () => {
            throw new Error("rename unavailable");
        };
        try {
            expect(await updateSaveHandler(1, { title: "Nope" })).toEqual({
                success: false,
                code: "storage-failed",
                error: "rename unavailable",
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

        expect(restartResult).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([100]);
        expect(Game.currentPassage?.id).toBe(SYSTEM_PASSAGE_NAMES.START_MENU);
        expect(sessionStorage.getItem("gameAutoSave")).toBeNull();
    });

    test("reports when restart has no system save", async () => {
        await db.saves.clear();
        const { result } = renderHook(() => useRestartGame());

        expect(await result.current()).toEqual({
            success: false,
            code: "not-found",
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
            expect(await result.current()).toEqual(OK);
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
            code: "not-found",
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
                code: "storage-failed",
                error: "blob unavailable",
            });
        } finally {
            URL.createObjectURL = originalCreateObjectURL;
        }
    });

    test("tells a cancelled file dialog apart from a real failure", async () => {
        const restoreCancelledPicker = installFilePicker(null, "cancel");
        try {
            const { result } = renderHook(() => useReadSaveFile());
            expect(await result.current()).toEqual({
                success: false,
                code: "cancelled",
                error: "No file selected",
                saves: [],
            });
        } finally {
            restoreCancelledPicker();
        }
    });

    test("rejects a file that is not a save file", async () => {
        const { result } = renderHook(() => useReadSaveFile());

        expect(await result.current(new File(["text"], "backup.txt"))).toEqual({
            success: false,
            code: "bad-file",
            error: "Invalid file type. Please select a file with .sx extension.",
            saves: [],
        });
    });

    test("reads records out of a save file without writing anything", async () => {
        await saveGame(1, { progress: "already here" });
        const { result } = renderHook(() => useReadSaveFile());

        const read = await result.current(
            makeSaveFile([
                {
                    name: "1",
                    description: "From an old build",
                    gameData: { progress: 10 },
                    timestamp: new Date("2024-01-01T00:00:00.000Z"),
                    version: "0.1.0",
                },
            ])
        );

        expect(read.success).toBe(true);
        expect(read.saves).toHaveLength(1);
        expect(read.saves[0]).toMatchObject({
            slot: "1",
            title: "From an old build",
            version: "0.1.0",
        });
        // Reading must not touch storage - that is the whole point of the split.
        expect((await loadGame(1))?.gameData).toEqual({
            progress: "already here",
        });
    });

    test("rejects corrupted and structurally invalid save files", async () => {
        const { result } = renderHook(() => useReadSaveFile());

        const corrupt = await result.current(
            new File(["corrupt"], "backup.sx")
        );
        expect(corrupt.success).toBe(false);
        expect(corrupt).toMatchObject({ code: "decode-failed", saves: [] });

        expect(await result.current(makeSaveFile({ not: "an array" }))).toEqual(
            {
                success: false,
                code: "bad-file",
                error: "Invalid save file format",
                saves: [],
            }
        );

        expect(
            await result.current(makeSaveFile([{ gameData: {} }, "junk"]))
        ).toEqual({
            success: false,
            code: "bad-file",
            error: "Save file holds 2 unreadable record(s)",
            saves: [],
        });
    });

    test("writes records verbatim, replacing or merging as asked", async () => {
        const records: GameSave[] = [
            {
                slot: "1",
                gameData: { progress: 10 },
                timestamp: new Date("2024-01-01T00:00:00.000Z"),
                version: "0.1.0",
            },
        ];
        await saveGame(2, { progress: "mine" });
        const { result } = renderHook(() => useWriteSaves());

        expect(await result.current(records, { mode: "merge" })).toEqual({
            ...OK,
            count: 1,
        });
        expect((await loadGame(2))?.gameData).toEqual({ progress: "mine" });

        expect(await result.current(records)).toEqual({ ...OK, count: 1 });
        expect((await getAllSaves()).map((save) => save.slot)).toEqual(["1"]);
    });

    test("reports a database failure while writing saves", async () => {
        const table = db.saves as unknown as {
            toArray: () => Promise<unknown[]>;
        };
        const originalToArray = table.toArray;
        table.toArray = async () => {
            throw new Error("write unavailable");
        };

        try {
            const { result } = renderHook(() => useWriteSaves());
            expect(await result.current([])).toEqual({
                success: false,
                code: "storage-failed",
                error: "write unavailable",
                count: 0,
            });
        } finally {
            table.toArray = originalToArray;
        }
    });

    test("imports a file and keeps the timestamp each save was taken with", async () => {
        const taken = [
            new Date("2024-01-01T00:00:00.000Z"),
            new Date("2024-06-01T00:00:00.000Z"),
        ];
        const { result } = renderHook(() => useImportSaves());

        expect(
            await result.current(
                makeSaveFile([
                    {
                        name: "1",
                        gameData: { progress: 10 },
                        timestamp: taken[0],
                        version: "0.1.0",
                    },
                    {
                        name: "2",
                        gameData: { progress: 20 },
                        timestamp: taken[1],
                        version: "0.2.0",
                    },
                ])
            )
        ).toEqual({ ...OK, count: 2 });

        const imported = (await getAllSaves()).sort((left, right) =>
            left.slot.localeCompare(right.slot)
        );
        expect(
            imported.map((save) => ({
                slot: save.slot,
                version: save.version,
                timestamp: save.timestamp,
            }))
        ).toEqual([
            { slot: "1", version: "0.1.0", timestamp: taken[0] as Date },
            { slot: "2", version: "0.2.0", timestamp: taken[1] as Date },
        ]);
    });

    test("leaves the existing saves alone when the file is unusable", async () => {
        await saveGame(1, { progress: "precious" });
        const { result } = renderHook(() => useImportSaves());

        expect(
            await result.current(makeSaveFile([{ gameData: {} }]))
        ).toMatchObject({ success: false, code: "bad-file", count: 0 });

        // Nothing is deleted until the whole file has decoded and validated.
        expect((await loadGame(1))?.gameData).toEqual({ progress: "precious" });
    });

    test("reports a cancelled picker through the import wrapper", async () => {
        const restorePicker = installFilePicker(null, "cancel");
        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({
                success: false,
                code: "cancelled",
                error: "No file selected",
                count: 0,
            });
        } finally {
            restorePicker();
        }
    });

    test("imports through the file picker when no file is handed in", async () => {
        const restorePicker = installFilePicker(
            makeSaveFile([
                {
                    name: "1",
                    gameData: { progress: 10 },
                    timestamp: new Date("2024-01-01T00:00:00.000Z"),
                    version: "2.0.0",
                },
            ])
        );

        try {
            const { result } = renderHook(() => useImportSaves());
            expect(await result.current()).toEqual({ ...OK, count: 1 });
        } finally {
            restorePicker();
        }

        expect((await getAllSaves()).map((save) => save.slot)).toEqual(["1"]);
    });

    test("merges an imported save into the saves already on the device", async () => {
        await saveGame(2, { progress: "mine" });
        const { result } = renderHook(() => useImportSaves());

        expect(
            await result.current(
                makeSaveFile([
                    {
                        slot: "1",
                        gameData: { progress: 10 },
                        timestamp: new Date("2024-01-01T00:00:00.000Z"),
                        version: "2.0.0",
                    },
                ]),
                { mode: "merge" }
            )
        ).toEqual({ ...OK, count: 1 });

        expect((await getAllSaves()).map((save) => save.slot).sort()).toEqual([
            "1",
            "2",
        ]);
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
        expect(await result.current.loadLastGame()).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([30]);
    });

    test("migrates the latest save before restoring it", async () => {
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
        oldState.player = { hp: 33 };
        await db.saves.add({
            slot: "13",
            gameData: oldState,
            timestamp: new Date(),
            version: "1.0.0",
        });
        liveQueryValue = await loadGame(13);

        const { result } = renderHook(() => useLastLoadGame());
        expect(await result.current.loadLastGame()).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([33]);
    });

    test("handles last-save edge cases", async () => {
        liveQueryValue = null;
        const noSave = renderHook(() => useLastLoadGame());
        expect(noSave.result.current).toMatchObject({
            hasLastSave: false,
            isLoading: false,
            lastSave: null,
        });
        expect(await noSave.result.current.loadLastGame()).toEqual({
            success: false,
            code: "not-found",
            error: "There is no save to load",
        });

        liveQueryValue = {
            id: 1,
            slot: "999",
            gameData: {},
            timestamp: new Date(),
            version: "2.0.0",
        };
        const missing = renderHook(() => useLastLoadGame());
        expect(await missing.result.current.loadLastGame()).toEqual({
            success: false,
            code: "not-found",
            error: "The requested game save does not exist",
        });
    });

    test("reports a database failure while loading the latest save", async () => {
        liveQueryValue = {
            id: 1,
            slot: "42",
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
                code: "storage-failed",
                error: "latest save unavailable",
            });
        } finally {
            table.where = originalWhere;
        }
    });

    test("queries saves newest-first for the last-save hook", async () => {
        const newest = {
            id: 2,
            slot: "2",
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
            slot: "1",
            gameData: { checkpoint: "older" },
            timestamp: new Date("2024-01-01T00:00:00.000Z"),
            version: "2.0.0",
        });
        const newestId = await db.saves.add({
            slot: "2",
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
            slot: "2",
            gameData: { checkpoint: "newest" },
        });
        expect(lastSave).not.toMatchObject({ id: olderId });
    });

    test("overwrites an existing slot without creating a duplicate", async () => {
        const originalTimestamp = new Date("2020-01-01T00:00:00.000Z");
        const existingId = await db.saves.add({
            slot: "0",
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
            (save) => save.slot === "0"
        );
        expect(slotSaves).toHaveLength(1);
        const overwrittenSave = slotSaves[0];
        if (!overwrittenSave)
            throw new Error("Expected overwritten slot 0 save");
        expect(overwrittenSave).toMatchObject({
            id: existingId,
            slot: "0",
        });
        expect(overwrittenSave.gameData.player).toEqual({ health: 90 });
        expect(overwrittenSave.timestamp.getTime()).toBeGreaterThan(
            originalTimestamp.getTime()
        );
    });

    test("builds save slots with working save, load, update and delete actions", async () => {
        Storage.setValue("$.player", { health: 70 });
        const state = structuredClone(Game.getState());
        const slot = {
            id: 1,
            slot: "0",
            gameData: state,
            timestamp: new Date(),
            version: "2.0.0",
        };
        liveQueryValue = [slot];
        const { result } = renderHook(() => useSaveSlots({ count: 2 }));

        expect(result.current).toHaveLength(2);
        expect(result.current[0]?.data).toBe(slot);
        expect(result.current[1]?.data).toBeNull();

        expect(await result.current[0]?.save({ title: "Chapter 2" })).toEqual(
            OK
        );
        const savedSlot = await loadGame(0);
        expect(savedSlot?.gameData).toHaveProperty("_system.game");
        expect(savedSlot?.gameData.player).toEqual({ health: 70 });
        expect(savedSlot?.title).toBe("Chapter 2");
        if (!savedSlot) {
            throw new Error("Expected slot 0 to be saved");
        }
        // IndexedDB structured-clones records. The lightweight test Dexie mock
        // stores references, so clone here to preserve the real DB contract.
        savedSlot.gameData = structuredClone(savedSlot.gameData);

        expect(
            await result.current[0]?.update({
                title: "Renamed",
                meta: { a: 1 },
            })
        ).toEqual(OK);
        expect(await loadGame(0)).toMatchObject({
            title: "Renamed",
            meta: { a: 1 },
            timestamp: savedSlot.timestamp,
        });

        Storage.setValue("$.player.health", 5);
        expect(await result.current[0]?.load()).toEqual(OK);
        expect(Storage.getValue<number>("$.player.health")).toEqual([70]);

        expect(await result.current[0]?.delete()).toEqual(OK);
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
                slot: "0",
                gameData: { player: { health: 88 } },
            }),
        ]);
    });
});
