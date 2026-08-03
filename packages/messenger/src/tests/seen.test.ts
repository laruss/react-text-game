import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";

import { SEEN_FLUSH_DEBOUNCE_MS, SEEN_SETTING_KEY } from "#constants";
import { logger } from "#logger";
import {
    createMemorySeenStore,
    createSeenStore,
    type SeenTransport,
    settingsSeenTransport,
} from "#seen";

import { initGame, resetMessenger } from "./helpers";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTransport = () => {
    const writes: Array<Array<string>> = [];

    return {
        writes,
        transport: {
            read: async () => ["stored:0"],
            write: async (beatIds: Array<string>) => {
                writes.push(beatIds);
            },
        } satisfies SeenTransport,
    };
};

describe("seen store", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
    });

    afterEach(() => {
        resetMessenger();
    });

    describe("createSeenStore", () => {
        test("records and reports beats synchronously", () => {
            const { transport } = createTransport();
            const store = createSeenStore(transport);

            expect(store.has("s:0")).toBe(false);

            store.add("s:0");

            expect(store.has("s:0")).toBe(true);
        });

        test("loads persisted beats", async () => {
            const { transport } = createTransport();
            const store = createSeenStore(transport);

            await store.load();

            expect(store.has("stored:0")).toBe(true);
        });

        test("writes once for a burst of additions", async () => {
            const { transport, writes } = createTransport();
            const store = createSeenStore(transport);

            store.add("s:0");
            store.add("s:1");
            store.add("s:2");

            expect(writes).toHaveLength(0);

            await wait(SEEN_FLUSH_DEBOUNCE_MS + 40);

            expect(writes).toEqual([["s:0", "s:1", "s:2"]]);
        });

        test("ignores a beat it already knows", async () => {
            const { transport, writes } = createTransport();
            const store = createSeenStore(transport);

            store.add("s:0");
            await store.flush();
            store.add("s:0");
            await store.flush();

            expect(writes).toEqual([["s:0"], ["s:0"]]);
        });

        test("flush cancels the pending debounce and writes immediately", async () => {
            const { transport, writes } = createTransport();
            const store = createSeenStore(transport);

            store.add("s:0");
            await store.flush();

            expect(writes).toEqual([["s:0"]]);

            await wait(SEEN_FLUSH_DEBOUNCE_MS + 40);

            expect(writes).toHaveLength(1);
        });

        test("reports a failed debounced write instead of rejecting", async () => {
            const error = spyOn(logger, "error");
            const store = createSeenStore({
                read: async () => [],
                write: () => Promise.reject(new Error("no disk")),
            });

            store.add("s:0");
            await wait(SEEN_FLUSH_DEBOUNCE_MS + 40);

            expect(error).toHaveBeenCalledTimes(1);
            expect(error.mock.calls[0]?.[0]).toContain("seen record");
            error.mockRestore();
        });

        test("propagates a failed explicit flush", async () => {
            const store = createSeenStore({
                read: async () => [],
                write: () => Promise.reject(new Error("no disk")),
            });

            store.add("s:0");

            await expect(store.flush()).rejects.toThrow("no disk");
        });
    });

    describe("settingsSeenTransport", () => {
        test("round-trips through the engine settings table", async () => {
            await settingsSeenTransport.write(["s:0", "s:1"]);

            expect(await settingsSeenTransport.read()).toEqual(["s:0", "s:1"]);
        });

        test("defaults to an empty record", async () => {
            expect(SEEN_SETTING_KEY).toBe("messenger:seen");
            expect(Array.isArray(await settingsSeenTransport.read())).toBe(
                true
            );
        });

        test("is the default transport of createSeenStore", async () => {
            const store = createSeenStore();

            store.add("default:0");
            await store.flush();

            expect(await settingsSeenTransport.read()).toContain("default:0");
        });
    });

    describe("createMemorySeenStore", () => {
        test("records without persisting", async () => {
            const store = createMemorySeenStore();

            store.add("s:0");

            expect(store.has("s:0")).toBe(true);

            await store.load();
            await store.flush();

            expect(store.has("s:0")).toBe(true);
        });

        test("stays empty after a load, and never touches the settings table", async () => {
            await settingsSeenTransport.write(["persisted:0"]);
            const store = createMemorySeenStore();

            await store.load();
            store.add("memory:0");
            await store.flush();

            expect(store.has("persisted:0")).toBe(false);
            expect(await settingsSeenTransport.read()).toEqual(["persisted:0"]);
        });
    });
});
