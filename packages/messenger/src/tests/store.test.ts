import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from "bun:test";
import { Game } from "@react-text-game/core";

import { _clearChats, defineChat } from "#chat";
import { MESSENGER_STORE_ID } from "#constants";
import { logger } from "#logger";
import { m } from "#scripts";
import { createMemorySeenStore } from "#seen";
import {
    _dropStore,
    getAllChatVars,
    getChatVars,
    getSeenStore,
    getStore,
    getStoreCallbacks,
    mergeStoreCallbacks,
    safeCallback,
    setSeenStore,
} from "#store";

import { initGame, resetMessenger } from "./helpers";

describe("store", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
    });

    afterEach(() => {
        resetMessenger();
    });

    test("creates and registers a single entity, lazily", () => {
        const store = getStore();

        expect(store.id).toBe(MESSENGER_STORE_ID);
        expect(getStore()).toBe(store);
    });

    test("materializes a chat's state from its definition on first access", () => {
        const chat = defineChat("squad", { participants: ["anna"] });

        expect(getAllChatVars()).toEqual({});

        const vars = chat.vars;

        expect(vars.participants).toEqual(["anna"]);
        expect(Object.keys(getAllChatVars())).toEqual(["squad"]);
        expect(chat.vars).toBe(vars);
    });

    test("getChatVars returns existing state untouched", () => {
        const initial = () => defineChat("anna").initialVars();
        const first = getChatVars("anna", initial);

        first.unread = 7;

        expect(getChatVars("anna", initial).unread).toBe(7);
    });

    test("repairs a missing chats record after loading a save without one", () => {
        const chat = defineChat("anna");
        chat.push(m.from("anna").text("hey"));

        // A save written before this package existed has nothing for the store,
        // and BaseGameObject.load() clears every variable in that case.
        Game.setState({ _system: { game: { currentPassageId: null } } });

        expect(chat.entries).toEqual([]);
        expect(chat.unread).toBe(0);
    });

    test("a store created after a load still picks up restored state", async () => {
        const chat = defineChat("anna");
        chat.push(m.from("anna").text("hey"));
        const state = structuredClone(Game.getState());

        // Drop the in-memory store without wiping storage, so the next getStore()
        // has to load state that was restored before it existed.
        _clearChats();
        _dropStore();
        Game._resetForTesting();
        await initGame();
        Game.setState(state);

        expect(defineChat("anna").entries).toHaveLength(1);
    });

    describe("seen store", () => {
        test("creates the default one lazily and allows replacing it", () => {
            const first = getSeenStore();

            expect(getSeenStore()).toBe(first);

            const replacement = createMemorySeenStore();
            setSeenStore(replacement);

            expect(getSeenStore()).toBe(replacement);
        });
    });

    describe("store callbacks", () => {
        test("accumulate across calls", () => {
            const onSend = mock(() => {});
            const onSeen = mock(() => {});

            mergeStoreCallbacks({ onSend });
            mergeStoreCallbacks({ onSeen });

            expect(getStoreCallbacks().onSend).toBe(onSend);
            expect(getStoreCallbacks().onSeen).toBe(onSeen);
        });

        test("later calls win for the same key", () => {
            const first = mock(() => {});
            const second = mock(() => {});

            mergeStoreCallbacks({ onSend: first });
            mergeStoreCallbacks({ onSend: second });

            expect(getStoreCallbacks().onSend).toBe(second);
        });
    });

    describe("safeCallback", () => {
        test("does nothing without a callback", () => {
            const error = spyOn(logger, "error");

            safeCallback("onSend", undefined, {});

            expect(error).not.toHaveBeenCalled();
            error.mockRestore();
        });

        test("invokes the callback with its event", () => {
            const callback = mock(() => {});

            safeCallback("onSend", callback, { value: 1 });

            expect(callback).toHaveBeenCalledWith({ value: 1 });
        });

        test("reports a throwing callback instead of rethrowing", () => {
            const error = spyOn(logger, "error");

            expect(() => {
                safeCallback(
                    "onSend",
                    () => {
                        throw new Error("boom");
                    },
                    {}
                );
            }).not.toThrow();

            expect(error).toHaveBeenCalledTimes(1);
            expect(error.mock.calls[0]?.[0]).toContain("onSend");
            error.mockRestore();
        });
    });
});
