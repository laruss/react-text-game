import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { Clock, MINUTE } from "@react-text-game/core/clock";

import { defineChat } from "#chat";
import { defineMessenger } from "#messenger";
import { defineScript, m } from "#scripts";
import { createMemorySeenStore } from "#seen";
import { getSeenStore, setSeenStore } from "#store";

import { initGame, resetMessenger } from "./helpers";

describe("defineMessenger", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
        setSeenStore(createMemorySeenStore());
    });

    afterEach(() => {
        resetMessenger();
    });

    test("works with no options at all", () => {
        const chat = defineChat("anna");
        const messenger = defineMessenger();

        expect(messenger.chats.map((row) => row.chat)).toEqual([chat]);
        expect(messenger.unreadTotal).toBe(0);
    });

    test("orders listed chats first, then the rest", () => {
        defineChat("anna");
        const boris = defineChat("boris");
        const news = defineChat("news");
        const messenger = defineMessenger({ chats: [news, boris] });

        expect(messenger.chats.map((row) => row.chat.id)).toEqual([
            "news",
            "boris",
            "anna",
        ]);
    });

    test("sorts by most recent activity", () => {
        const anna = defineChat("anna");
        const boris = defineChat("boris");
        const messenger = defineMessenger({ chats: [anna, boris] });

        Clock.advance(MINUTE);
        boris.push(m.from("boris").text("first"));
        Clock.advance(MINUTE);
        anna.push(m.from("anna").text("second"));

        expect(messenger.chats.map((row) => row.chat.id)).toEqual([
            "anna",
            "boris",
        ]);
    });

    test("exposes the title, avatar and unread of each row", () => {
        const chat = defineChat("squad", {
            title: "Squad",
            avatar: "/squad.webp",
        });
        const messenger = defineMessenger({ chats: [chat] });

        chat.push(m.from("anna").text("hey"));

        expect(messenger.chats[0]).toEqual({
            chat,
            title: "Squad",
            avatar: "/squad.webp",
            unread: 1,
            lastActivityAt: 0,
        });
    });

    test("adds up unread across chats", () => {
        const anna = defineChat("anna");
        const boris = defineChat("boris");
        const messenger = defineMessenger({ chats: [anna, boris] });

        anna.push(m.from("anna").text("one"));
        anna.push(m.from("anna").text("two"));
        boris.push(m.from("boris").text("three"));

        expect(messenger.unreadTotal).toBe(3);

        anna.markSeen();

        expect(messenger.unreadTotal).toBe(1);
    });

    test("deliverDueAll delivers what came due in every chat", () => {
        const anna = defineChat("anna");
        const boris = defineChat("boris");
        const messenger = defineMessenger({ chats: [anna, boris] });

        const annaScript = defineScript("anna/s", (helpers) => [
            helpers.wait(MINUTE),
            helpers.from("anna").text("late"),
        ]);
        const borisScript = defineScript("boris/s", (helpers) => [
            helpers.wait(MINUTE),
            helpers.from("boris").text("late too"),
        ]);

        anna.play(annaScript);
        anna.advance();
        boris.play(borisScript);
        boris.advance();

        messenger.deliverDueAll();
        expect(anna.entries).toHaveLength(0);
        expect(boris.entries).toHaveLength(0);

        Clock.advance(MINUTE);
        messenger.deliverDueAll();

        expect(anna.entries).toHaveLength(1);
        expect(boris.entries).toHaveLength(1);
    });

    test("registers callbacks that fire for every chat", () => {
        const onSend = mock(() => {});
        const anna = defineChat("anna");
        const boris = defineChat("boris");
        defineMessenger({ chats: [anna, boris], onSend });

        anna.push(m.from("anna").text("one"));
        boris.push(m.from("boris").text("two"));

        expect(onSend).toHaveBeenCalledTimes(2);
    });

    test("fires the chat callback before the store one", () => {
        const order: Array<string> = [];
        const chat = defineChat("anna", {
            onSend: () => order.push("chat"),
        });
        defineMessenger({ onSend: () => order.push("store") });

        chat.push(m.from("anna").text("one"));

        expect(order).toEqual(["chat", "store"]);
    });

    test("merges options across calls", () => {
        const onSend = mock(() => {});
        const onSeen = mock(() => {});
        const chat = defineChat("anna");

        defineMessenger({ onSend });
        defineMessenger({ onSeen });

        chat.push(m.from("anna").text("one"));
        chat.markSeen();

        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSeen).toHaveBeenCalledTimes(1);
    });

    test("replaces the seen store when one is supplied", () => {
        const seenStore = createMemorySeenStore();

        defineMessenger({ seenStore });

        expect(getSeenStore()).toBe(seenStore);
    });

    test("loads and flushes the seen record", async () => {
        const load = mock(() => Promise.resolve());
        const flush = mock(() => Promise.resolve());
        const messenger = defineMessenger({
            seenStore: {
                has: () => false,
                add: () => {},
                load,
                flush,
            },
        });

        await messenger.loadSeen();
        await messenger.flushSeen();

        expect(load).toHaveBeenCalledTimes(1);
        expect(flush).toHaveBeenCalledTimes(1);
    });
});
