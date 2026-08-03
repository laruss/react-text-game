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
import { Clock, MINUTE, SECOND } from "@react-text-game/core/clock";
import { createElement } from "react";

import { Chat, defineChat, getAllChats, getChat } from "#chat";
import { ENTRY_WARN_THRESHOLD } from "#constants";
import { defineContact } from "#contacts";
import { logger } from "#logger";
import { resolveText } from "#resolve";
import { defineScript, m } from "#scripts";
import { createMemorySeenStore } from "#seen";
import { setSeenStore } from "#store";
import { t } from "#text";

import { initGame, resetMessenger } from "./helpers";

describe("Chat", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
        setSeenStore(createMemorySeenStore());
    });

    afterEach(() => {
        resetMessenger();
    });

    describe("definition", () => {
        test("defines a direct chat and registers it", () => {
            const anna = defineContact("anna", { name: "Anna" });
            const chat = defineChat("anna", { peer: anna });

            expect(chat.kind).toBe("direct");
            expect(chat.isGroup).toBe(false);
            expect(chat.peerId).toBe("anna");
            expect(getChat("anna")).toBe(chat);
            expect(getAllChats()).toEqual([chat]);
        });

        test("defines a group chat from its participants", () => {
            const anna = defineContact("anna");
            const boris = defineContact("boris");
            const chat = defineChat("squad", {
                title: "Squad",
                participants: [anna, boris],
            });

            expect(chat.kind).toBe("group");
            expect(chat.isGroup).toBe(true);
            expect(chat.participants).toEqual(["anna", "boris"]);
            expect(chat.participantCount).toBe(2);
        });

        test("accepts a bare sender id as the peer", () => {
            expect(defineChat("anna", { peer: "anna" }).peerId).toBe("anna");
        });

        test("rejects a duplicate id", () => {
            defineChat("anna");

            expect(() => defineChat("anna")).toThrow(
                'Chat "anna" is already defined.'
            );
        });

        test("returns undefined for an unknown id", () => {
            expect(getChat("nope")).toBeUndefined();
        });

        test("creates no state until something touches it", () => {
            const chat = defineChat("anna");
            const initial = chat.initialVars();

            expect(initial.entries).toEqual([]);
            expect(initial.unread).toBe(0);
            expect(initial.nextDueAt).toBeNull();
        });

        test("is uncapped by default", () => {
            expect(defineChat("anna").maxEntries).toBe(
                Number.POSITIVE_INFINITY
            );
        });

        test("can be constructed directly without registering", () => {
            const chat = new Chat("loose");

            expect(getChat("loose")).toBeUndefined();
            expect(chat.id).toBe("loose");
        });
    });

    describe("title and avatar", () => {
        test("falls back through definition, peer and id", () => {
            defineContact("anna", { name: "Anna", avatar: "/anna.webp" });

            const direct = defineChat("anna", { peer: "anna" });
            const titled = defineChat("squad", {
                title: "Squad",
                avatar: "/squad.webp",
                participants: [],
            });
            const bare = defineChat("bare");

            expect(direct.resolvedTitle).toBe("Anna");
            expect(direct.resolvedAvatar).toBe("/anna.webp");
            expect(titled.resolvedTitle).toBe("Squad");
            expect(titled.resolvedAvatar).toBe("/squad.webp");
            expect(bare.resolvedTitle).toBe("bare");
            expect(bare.resolvedAvatar).toBeUndefined();
        });

        test("resolves a translated title", () => {
            const chat = defineChat("news", { title: t("messenger:typing") });

            expect(chat.resolvedTitle).toBe("typing...");
        });

        test("honours an in-fiction rename and reset", () => {
            const chat = defineChat("squad", { title: "Squad" });

            chat.rename("Squad v2");
            expect(chat.resolvedTitle).toBe("Squad v2");

            chat.rename(undefined);
            expect(chat.resolvedTitle).toBe("Squad");
        });

        test("falls back to the id when a rename left a script reference", () => {
            const chat = defineChat("squad");
            chat.vars.title = {
                kind: "ref",
                scriptId: "s",
                beatId: "s:0",
                slot: "text",
            };

            expect(chat.resolvedTitle).toBe("squad");
        });

        test("honours setting, removing and resetting the avatar", () => {
            defineContact("anna", { avatar: "/anna.webp" });
            const chat = defineChat("anna", { peer: "anna" });

            chat.setAvatar("/custom.webp");
            expect(chat.resolvedAvatar).toBe("/custom.webp");

            chat.setAvatar(null);
            expect(chat.resolvedAvatar).toBeUndefined();

            chat.setAvatar(undefined);
            expect(chat.resolvedAvatar).toBe("/anna.webp");
        });

        test("a chat without any avatar source has none", () => {
            const chat = defineChat("squad", { participants: [] });

            expect(chat.resolvedAvatar).toBeUndefined();
        });
    });

    describe("push", () => {
        test("appends a text message from a contact", () => {
            const anna = defineContact("anna");
            const chat = defineChat("anna", { peer: anna });

            const entry = chat.push(m.from(anna).text("hey"));

            expect(entry.key).toBe("anna#0");
            expect(entry.from).toBe("anna");
            expect(entry.seen).toBe(false);
            expect(entry.payload).toEqual({
                kind: "text",
                text: { kind: "raw", text: "hey" },
            });
            expect(chat.unread).toBe(1);
            expect(chat.entries).toHaveLength(1);
            expect(chat.lastEntry).toBe(entry);
        });

        test("marks the player's own messages as seen", () => {
            const chat = defineChat("anna");

            const entry = chat.push(m.player.text("on my way"));

            expect(entry.seen).toBe(true);
            expect(chat.unread).toBe(0);
        });

        test("appends a translated message", () => {
            const chat = defineChat("anna");

            const entry = chat.push(m.from("anna").text(t("messenger:typing")));

            expect(entry.payload).toEqual({
                kind: "text",
                text: { kind: "i18n", key: "messenger:typing" },
            });
            expect(
                resolveText(
                    entry.payload.kind === "text"
                        ? entry.payload.text
                        : { kind: "raw", text: "" }
                )
            ).toBe("typing...");
        });

        test("appends an album with a caption and media options", () => {
            const chat = defineChat("anna");

            const entry = chat.push(
                m.from("anna").media(
                    [
                        m.image("/1.webp", { alt: "first", spoiler: true }),
                        m.video("/2.mp4", {
                            poster: "/2.jpg",
                            durationMs: 8000,
                        }),
                    ],
                    { caption: "look" }
                )
            );

            expect(entry.payload).toEqual({
                kind: "media",
                items: [
                    {
                        kind: "image",
                        src: "/1.webp",
                        alt: { kind: "raw", text: "first" },
                        spoiler: true,
                    },
                    {
                        kind: "video",
                        src: "/2.mp4",
                        poster: "/2.jpg",
                        durationMs: 8000,
                    },
                ],
                caption: { kind: "raw", text: "look" },
            });
        });

        test("appends a single media item with no caption", () => {
            const chat = defineChat("anna");

            const entry = chat.push(m.from("anna").image("/1.webp"));

            expect(entry.payload).toEqual({
                kind: "media",
                items: [{ kind: "image", src: "/1.webp" }],
            });
        });

        test("records a forward from a contact", () => {
            const boris = defineContact("boris");
            const chat = defineChat("anna");

            const entry = chat.push(
                m.from("anna").text("look", { forwardedFrom: boris })
            );

            expect(entry.forwarded).toEqual({ from: "boris" });
        });

        test("records a forward from a bare sender id", () => {
            const chat = defineChat("anna");

            const entry = chat.push(
                m.from("anna").text("look", { forwardedFrom: "boris" })
            );

            expect(entry.forwarded).toEqual({ from: "boris" });
        });

        test("records a forward from a source with no contact", () => {
            const chat = defineChat("anna");

            const entry = chat.push(
                m.from("anna").text("look", {
                    forwardedFrom: {
                        label: "Unknown number",
                        at: 1234,
                        sourceChatId: "other",
                        sourceKey: "other#3",
                    },
                })
            );

            expect(entry.forwarded).toEqual({
                from: { label: { kind: "raw", text: "Unknown number" } },
                at: 1234,
                sourceChatId: "other",
                sourceKey: "other#3",
            });
        });

        test("records a forward that carries extra source details by id", () => {
            const chat = defineChat("anna");

            const entry = chat.push(
                m.from("anna").text("look", {
                    forwardedFrom: { id: "boris", at: 99 },
                })
            );

            expect(entry.forwarded).toEqual({ from: "boris", at: 99 });
        });

        test("keeps the in-fiction receipt", () => {
            const chat = defineChat("anna");

            expect(
                chat.push(m.from("anna").text("hey", { receipt: "read" }))
                    .receipt
            ).toBe("read");
        });

        test("appends a system notice and a custom payload", () => {
            const chat = defineChat("anna");

            const system = chat.push(
                m.system("member.joined", { who: "anna" })
            );
            const custom = chat.push(
                m.from("anna").custom("poll", { question: "?" })
            );

            expect(system.from).toBe("system");
            expect(system.payload).toEqual({
                kind: "system",
                key: "member.joined",
                params: { who: "anna" },
            });
            expect(custom.payload).toEqual({
                kind: "custom",
                name: "poll",
                data: { question: "?" },
            });
        });

        test("appends a system notice without params", () => {
            const chat = defineChat("anna");

            expect(chat.push(m.system("typing")).payload).toEqual({
                kind: "system",
                key: "typing",
            });
        });

        test("rejects rich content that has no script behind it", () => {
            const chat = defineChat("anna");

            expect(() =>
                chat.push(m.from("anna").text(createElement("b", null, "bold")))
            ).toThrow("cannot store message text");
        });

        test("rejects a rich caption and a rich alt without a script", () => {
            const chat = defineChat("anna");

            expect(() =>
                chat.push(
                    m.from("anna").media([m.image("/1.webp")], {
                        caption: createElement("b", null, "c"),
                    })
                )
            ).toThrow("cannot store media caption");

            expect(() =>
                chat.push(
                    m.from("anna").media([
                        m.image("/1.webp", {
                            alt: createElement("b", null, "a"),
                        }),
                    ])
                )
            ).toThrow("cannot store media alt text");
        });

        test("rejects a control beat", () => {
            const chat = defineChat("anna");

            expect(() =>
                // biome-ignore lint/suspicious/noExplicitAny: deliberately passing a control beat
                chat.push(m.wait(10) as any)
            ).toThrow('not "wait"');
        });

        test("timestamps entries with game time", () => {
            const chat = defineChat("anna");

            Clock.advance(5 * MINUTE);
            const entry = chat.push(m.from("anna").text("hey"));

            expect(entry.at).toBe(5 * MINUTE);
            expect(chat.vars.lastActivityAt).toBe(5 * MINUTE);
        });
    });

    describe("play and advance", () => {
        test("delivers one message at a time", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.from("anna").text("two"),
            ]);

            chat.play(script);
            expect(chat.entries).toHaveLength(0);
            expect(chat.activeScript).toBe(script);

            chat.advance();
            expect(chat.entries).toHaveLength(1);

            chat.advance();
            expect(chat.entries).toHaveLength(2);
        });

        test("delivers several at once", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.from("anna").text("two"),
                helpers.from("anna").text("three"),
            ]);

            chat.play(script);
            chat.advance(2);

            expect(chat.entries).toHaveLength(2);
        });

        test("records the script beat as the entry origin", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
            ]);

            chat.play(script);
            chat.advance();

            expect(chat.entries[0]?.origin).toEqual({
                scriptId: "s",
                beatId: "s:0",
            });
        });

        test("stores rich content as a resolvable reference", () => {
            const chat = defineChat("anna");
            const node = createElement("b", null, "bold");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text(node),
            ]);

            chat.play(script);
            chat.advance();

            const payload = chat.entries[0]?.payload;

            expect(payload).toEqual({
                kind: "text",
                text: {
                    kind: "ref",
                    scriptId: "s",
                    beatId: "s:0",
                    slot: "text",
                },
            });
            expect(
                resolveText(
                    payload?.kind === "text"
                        ? payload.text
                        : { kind: "raw", text: "" }
                )
            ).toBe(node);
        });

        test("skips a conditional beat that is currently off", () => {
            const chat = defineChat("anna");
            let unlocked = false;
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                unlocked && helpers.from("anna").text("secret"),
                helpers.from("anna").text("three"),
            ]);

            chat.play(script);
            chat.advance(5);

            expect(chat.entries).toHaveLength(2);
            expect(chat.entries[1]?.origin?.beatId).toBe("s:2");

            unlocked = true;
        });

        test("ends the script and reports it", () => {
            const onScriptEnd = mock(() => {});
            const chat = defineChat("anna", { onScriptEnd });
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
            ]);

            chat.play(script);
            chat.advance(5);

            expect(chat.activeScript).toBeNull();
            expect(onScriptEnd).toHaveBeenCalledTimes(1);
        });

        test("does nothing without an active script", () => {
            const chat = defineChat("anna");

            chat.advance();

            expect(chat.entries).toHaveLength(0);
        });

        test("rejects a script that was never registered", () => {
            const chat = defineChat("anna");

            expect(() =>
                chat.play({ id: "loose", build: () => [] })
            ).toThrowError(/not registered/);
            expect(chat.vars.activeScriptId).toBeNull();
        });

        test("does nothing when the active script is no longer registered", () => {
            const chat = defineChat("anna");
            chat.vars.activeScriptId = "gone";

            chat.advance();

            expect(chat.entries).toHaveLength(0);
        });

        test("resets the cursor when a script is replayed", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
            ]);

            chat.play(script);
            chat.advance();
            chat.play(script);
            chat.advance();

            expect(chat.entries).toHaveLength(2);
        });
    });

    describe("scheduled delivery", () => {
        test("holds a message back until the clock reaches it", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.wait(30 * MINUTE),
                helpers.from("anna").text("later"),
            ]);

            chat.play(script);
            chat.advance(5);

            expect(chat.entries).toHaveLength(1);
            expect(chat.nextDueAt).toBe(30 * MINUTE);

            chat.deliverDue();
            expect(chat.entries).toHaveLength(1);

            Clock.advance(30 * MINUTE);
            chat.deliverDue();

            expect(chat.entries).toHaveLength(2);
            expect(chat.nextDueAt).toBeNull();
        });

        test("bursts everything that came due while the game was away", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.wait(MINUTE),
                helpers.from("anna").text("one"),
                helpers.wait(MINUTE),
                helpers.from("anna").text("two"),
                helpers.wait(MINUTE),
                helpers.from("anna").text("three"),
            ]);

            chat.play(script);
            chat.advance(9);
            expect(chat.entries).toHaveLength(0);

            Clock.advance(10 * MINUTE);
            chat.deliverDue();

            expect(chat.entries).toHaveLength(3);
            // the authored schedule is replayed, not stretched: each message keeps
            // the in-fiction time it was due at
            expect(chat.entries.map((entry) => entry.at)).toEqual([
                MINUTE,
                2 * MINUTE,
                3 * MINUTE,
            ]);
        });

        test("shows a typing indicator that expires on its own", () => {
            const anna = defineContact("anna");
            const chat = defineChat("anna", { peer: anna });
            const script = defineScript("s", (helpers) => [
                helpers.typing(anna, 2 * SECOND),
                helpers.from(anna).text("hey"),
            ]);

            chat.play(script);
            chat.advance();

            expect(chat.typingContacts).toEqual(["anna"]);
            expect(chat.entries).toHaveLength(0);

            Clock.advance(2 * SECOND);
            chat.deliverDue();

            expect(chat.typingContacts).toEqual([]);
            expect(chat.entries).toHaveLength(1);
        });

        test("setTyping shows an indicator without holding anything back", () => {
            const chat = defineChat("anna");

            chat.setTyping("anna", SECOND);

            expect(chat.typingContacts).toEqual(["anna"]);
            expect(chat.nextDueAt).toBeNull();
        });

        test("deliverDue is idempotent", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.wait(MINUTE),
                helpers.from("anna").text("one"),
            ]);

            chat.play(script);
            chat.advance();
            Clock.advance(MINUTE);

            chat.deliverDue();
            chat.deliverDue();
            chat.deliverDue();

            expect(chat.entries).toHaveLength(1);
        });
    });

    describe("choices", () => {
        const buildChoiceChat = () => {
            const chat = defineChat("anna");
            const follow = defineScript("follow", (helpers) => [
                helpers.from("anna").text("after"),
            ]);
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("question?"),
                helpers.choice("s/reply", [
                    { content: "yes", next: follow },
                    { content: "no" },
                    {
                        content: "custom",
                        next: () => chat.push(m.player.text("!")),
                    },
                ]),
                helpers.from("anna").text("continued"),
            ]);

            return { chat, script, follow };
        };

        test("blocks until the player replies", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);

            expect(chat.entries).toHaveLength(1);
            expect(chat.pendingChoice).toEqual({
                choiceId: "s/reply",
                options: [
                    { index: 0, content: "yes" },
                    { index: 1, content: "no" },
                    { index: 2, content: "custom" },
                ],
            });
        });

        test("logs the reply and plays the next script", () => {
            const onChoice = mock(() => {});
            const { chat, script, follow } = buildChoiceChat();
            // biome-ignore lint/suspicious/noExplicitAny: attaching a callback post-hoc for the assertion
            (chat as any).callbacks.onChoice = onChoice;

            chat.play(script);
            chat.advance(5);
            chat.choose(0);

            expect(chat.entries[1]?.payload).toEqual({
                kind: "choice",
                choiceId: "s/reply",
                chosen: { kind: "raw", text: "yes" },
            });
            expect(chat.entries[1]?.from).toBe("player");
            expect(chat.activeScript).toBe(follow);
            expect(chat.entries).toHaveLength(3);
            expect(onChoice).toHaveBeenCalledTimes(1);
        });

        test("continues the current script when an option has no next", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);
            chat.choose(1);

            expect(chat.activeScript).toBe(script);
            expect(chat.entries).toHaveLength(3);
            expect(chat.entries[2]?.origin?.beatId).toBe("s:2");
        });

        test("calls a function option and stops there", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);
            chat.choose(2);

            expect(chat.entries).toHaveLength(3);
            expect(chat.entries[2]?.from).toBe("player");
            expect(chat.pendingChoice).toBeNull();
        });

        test("reports no pending choice outside a choice", () => {
            const { chat, script } = buildChoiceChat();

            expect(chat.pendingChoice).toBeNull();

            chat.play(script);
            expect(chat.pendingChoice).toBeNull();
        });

        test("reports no pending choice when the beat is gone", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);
            chat.vars.pendingChoiceKey = "s:0";

            expect(chat.pendingChoice).toBeNull();
        });

        test("rejects a reply when nothing is pending", () => {
            const { chat } = buildChoiceChat();

            expect(() => chat.choose(0)).toThrow("has no pending choice");
        });

        test("rejects a reply in a read-only chat", () => {
            const chat = defineChat("news", { readOnly: true });

            expect(() => chat.choose(0)).toThrow("read-only");
        });

        test("rejects an index that does not exist", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);

            expect(() => chat.choose(9)).toThrow("no option at index 9");
        });

        test("rejects a reply when the choice left the script", () => {
            const { chat, script } = buildChoiceChat();

            chat.play(script);
            chat.advance(5);
            chat.vars.pendingChoiceKey = "s:0";

            expect(() => chat.choose(0)).toThrow("no longer part of script");
        });
    });

    describe("read-only", () => {
        test("separates the structural bar from having nothing pending", () => {
            const open = defineChat("anna");
            const channel = defineChat("news", { readOnly: true });

            expect(open.canReply).toBe(true);
            expect(open.pendingChoice).toBeNull();
            expect(channel.canReply).toBe(false);
            expect(channel.readOnly).toBe(true);
        });

        test("can be opened and closed in-fiction", () => {
            const chat = defineChat("news", { readOnly: true });

            chat.setReadOnly(false);
            expect(chat.canReply).toBe(true);

            chat.setReadOnly(true);
            expect(chat.canReply).toBe(false);
        });
    });

    describe("group membership", () => {
        test("adds a member and records a notice", () => {
            const onParticipantChange = mock(() => {});
            const anna = defineContact("anna");
            const boris = defineContact("boris");
            const chat = defineChat("squad", {
                participants: [anna],
                onParticipantChange,
            });

            chat.addParticipant(boris);

            expect(chat.participants).toEqual(["anna", "boris"]);
            expect(chat.entries[0]?.payload).toEqual({
                kind: "system",
                key: "member.joined",
                params: { who: "boris" },
            });
            expect(onParticipantChange).toHaveBeenCalledTimes(1);
        });

        test("removes a member and records a notice", () => {
            const anna = defineContact("anna");
            const chat = defineChat("squad", { participants: [anna] });

            chat.removeParticipant(anna);

            expect(chat.participants).toEqual([]);
            expect(chat.entries[0]?.payload).toEqual({
                kind: "system",
                key: "member.left",
                params: { who: "anna" },
            });
        });

        test("ignores adding a member twice and removing a non-member", () => {
            const anna = defineContact("anna");
            const chat = defineChat("squad", { participants: [anna] });

            chat.addParticipant(anna);
            chat.removeParticipant("boris");

            expect(chat.participants).toEqual(["anna"]);
            expect(chat.entries).toHaveLength(0);
        });
    });

    describe("seen tracking", () => {
        test("marks everything seen and clears the unread count", () => {
            const onSeen = mock(() => {});
            const chat = defineChat("anna", { onSeen });

            chat.push(m.from("anna").text("one"));
            chat.push(m.from("anna").text("two"));
            expect(chat.unread).toBe(2);
            expect(chat.firstUnreadKey).toBe("anna#0");

            Clock.advance(MINUTE);
            chat.markSeen();

            expect(chat.unread).toBe(0);
            expect(chat.firstUnreadKey).toBeNull();
            expect(chat.vars.lastSeenAt).toBe(MINUTE);
            expect(onSeen).toHaveBeenCalledTimes(1);
        });

        test("does nothing when there is nothing unseen", () => {
            const onSeen = mock(() => {});
            const chat = defineChat("anna", { onSeen });

            chat.markSeen();

            expect(onSeen).not.toHaveBeenCalled();
        });

        test("marks entries up to a key", () => {
            const chat = defineChat("anna");

            chat.push(m.from("anna").text("one"));
            chat.push(m.from("anna").text("two"));
            chat.push(m.from("anna").text("three"));

            chat.markSeenUpTo("anna#1");

            expect(chat.unread).toBe(1);
            expect(chat.firstUnreadKey).toBe("anna#2");
        });

        test("ignores an unknown key", () => {
            const chat = defineChat("anna");
            chat.push(m.from("anna").text("one"));

            chat.markSeenUpTo("anna#99");

            expect(chat.unread).toBe(1);
        });

        test("records script beats in the cross-save seen store", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
            ]);

            chat.play(script);
            chat.advance();

            expect(chat.isSeenEver("s:0")).toBe(false);

            chat.markSeen();

            expect(chat.isSeenEver("s:0")).toBe(true);
        });

        test("records the player's own beats immediately", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.player.text("hi"),
            ]);

            chat.play(script);
            chat.advance();

            expect(chat.isSeenEver("s:0")).toBe(true);
        });
    });

    describe("transcript size", () => {
        test("drops the oldest entries beyond maxEntries", () => {
            const chat = defineChat("anna", { maxEntries: 2 });

            chat.push(m.from("anna").text("one"));
            chat.push(m.from("anna").text("two"));
            chat.push(m.from("anna").text("three"));

            expect(chat.entries).toHaveLength(2);
            expect(chat.entries[0]?.key).toBe("anna#1");
            expect(chat.unread).toBe(2);
        });

        test("warns once when an uncapped transcript grows long", () => {
            const warn = spyOn(logger, "warn");
            const chat = defineChat("anna");

            for (let index = 0; index <= ENTRY_WARN_THRESHOLD; index += 1) {
                chat.push(m.from("anna").text("x"));
            }

            chat.push(m.from("anna").text("x"));

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0]?.[0]).toContain("maxEntries");
            warn.mockRestore();
        });
    });

    describe("clear", () => {
        test("empties the transcript and every cursor", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.wait(MINUTE),
            ]);

            chat.play(script);
            chat.advance(5);
            chat.setTyping("anna", SECOND);
            chat.markSeen();

            chat.clear();

            expect(chat.entries).toHaveLength(0);
            expect(chat.activeScript).toBeNull();
            expect(chat.unread).toBe(0);
            expect(chat.nextDueAt).toBeNull();
            expect(chat.typingContacts).toEqual([]);
            expect(chat.vars.cursors).toEqual({});
            expect(chat.vars.lastActivityAt).toBe(0);
        });
    });

    describe("callbacks", () => {
        test("onSend fires for every appended entry", () => {
            const seen: Array<string> = [];
            const chat = defineChat("anna", {
                onSend: ({ entry }) => {
                    seen.push(entry.from);
                },
            });

            chat.push(m.from("anna").text("one"));
            chat.push(m.player.text("two"));
            chat.push(m.system("typing"));

            expect(seen).toEqual(["anna", "player", "system"]);
        });

        test("onTyping fires when the typing set changes", () => {
            const onTyping = mock(() => {});
            const chat = defineChat("anna", { onTyping });

            chat.setTyping("anna", SECOND);
            Clock.advance(SECOND);
            chat.deliverDue();

            expect(onTyping).toHaveBeenCalledTimes(2);
        });

        test("a throwing callback is reported and does not corrupt the chat", () => {
            const error = spyOn(logger, "error");
            const chat = defineChat("anna", {
                onSend: () => {
                    throw new Error("boom");
                },
            });

            const entry = chat.push(m.from("anna").text("hey"));

            expect(entry.key).toBe("anna#0");
            expect(chat.entries).toHaveLength(1);
            expect(error).toHaveBeenCalledTimes(1);
            error.mockRestore();
        });
    });

    describe("script drift", () => {
        test("warns once when a script changed length", () => {
            const warn = spyOn(logger, "warn");
            const chat = defineChat("anna");
            let extra = true;
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                extra && helpers.from("anna").text("two"),
            ]);

            chat.play(script);
            chat.advance();

            // the array itself gets shorter, which is what shifts default ids
            extra = false;
            chat.vars.beatCounts.s = 5;
            chat.advance();
            chat.advance();

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0]?.[0]).toContain("changed length");
            warn.mockRestore();
        });
    });

    describe("persistence", () => {
        test("survives a save and load round-trip", () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.wait(MINUTE),
                helpers.from("anna").text("two"),
            ]);

            chat.play(script);
            chat.advance(5);
            const state = structuredClone(Game.getState());

            chat.clear();
            expect(chat.entries).toHaveLength(0);

            Game.setState(state);

            expect(chat.entries).toHaveLength(1);
            expect(chat.nextDueAt).toBe(MINUTE);
            expect(chat.activeScript).toBe(script);

            Clock.advance(MINUTE);
            chat.deliverDue();

            expect(chat.entries).toHaveLength(2);
        });
    });
});
