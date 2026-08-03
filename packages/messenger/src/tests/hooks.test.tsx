import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Clock, MINUTE, SECOND } from "@react-text-game/core/clock";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { defineChat } from "#chat";
import { defineContact } from "#contacts";
import { useChat, useChatList, useUnreadTotal } from "#hooks";
import { defineScript, m } from "#scripts";
import { createMemorySeenStore } from "#seen";
import { getStore, setSeenStore } from "#store";

import { initGame, resetMessenger } from "./helpers";

describe("hooks", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
        setSeenStore(createMemorySeenStore());
    });

    afterEach(() => {
        cleanup();
        resetMessenger();
    });

    describe("useChat", () => {
        test("reports the initial values of a chat nothing has touched", () => {
            defineContact("anna", { name: "Anna", avatar: "/anna.webp" });
            const chat = defineChat("anna", { peer: "anna" });

            const { result } = renderHook(() => useChat(chat));

            expect(result.current.entries).toEqual([]);
            expect(result.current.unread).toBe(0);
            expect(result.current.firstUnreadKey).toBeNull();
            expect(result.current.lastEntry).toBeNull();
            expect(result.current.title).toBe("Anna");
            expect(result.current.avatar).toBe("/anna.webp");
            expect(result.current.canReply).toBe(true);
            expect(result.current.pendingChoice).toBeNull();
            expect(result.current.typing).toEqual([]);
            expect(result.current.isGroup).toBe(false);
            expect(result.current.activeScriptId).toBeNull();
        });

        test("does not materialize state while rendering", () => {
            defineContact("anna", { name: "Anna" });
            const chat = defineChat("anna", { peer: "anna" });

            renderHook(() => useChat(chat));

            // Reading the store directly: `chat.vars` would materialize it.
            expect(Object.keys(getStore().chats ?? {})).toEqual([]);
        });

        test("re-renders when a message arrives", async () => {
            const chat = defineChat("anna");

            const { result } = renderHook(() => useChat(chat));

            act(() => {
                chat.push(m.from("anna").text("hey"));
            });

            await waitFor(() => {
                expect(result.current.entries).toHaveLength(1);
            });

            expect(result.current.unread).toBe(1);
            expect(result.current.firstUnreadKey).toBe("anna#0");
            expect(result.current.lastEntry?.key).toBe("anna#0");
        });

        test("re-renders when the chat is marked seen", async () => {
            const chat = defineChat("anna");
            chat.push(m.from("anna").text("hey"));

            const { result } = renderHook(() => useChat(chat));
            expect(result.current.unread).toBe(1);

            act(() => {
                chat.markSeen();
            });

            await waitFor(() => {
                expect(result.current.unread).toBe(0);
            });
        });

        test("does not re-render for another chat's message", async () => {
            const anna = defineChat("anna");
            const boris = defineChat("boris");
            let renders = 0;

            const { result } = renderHook(() => {
                renders += 1;
                return useChat(anna);
            });

            const before = renders;

            act(() => {
                boris.push(m.from("boris").text("hey"));
            });

            await waitFor(() => {
                expect(boris.entries).toHaveLength(1);
            });

            expect(renders).toBe(before);
            expect(result.current.entries).toEqual([]);
        });

        test("expires a typing indicator as game time moves", async () => {
            const chat = defineChat("anna");
            chat.setTyping("anna", SECOND);

            const { result } = renderHook(() => useChat(chat));
            expect(result.current.typing).toEqual(["anna"]);

            act(() => {
                Clock.advance(2 * SECOND);
            });

            await waitFor(() => {
                expect(result.current.typing).toEqual([]);
            });
        });

        test("reports a pending choice and a read-only chat", async () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.choice("s/reply", [{ content: "yes" }]),
            ]);

            const { result } = renderHook(() => useChat(chat));

            act(() => {
                chat.play(script);
                chat.advance();
            });

            await waitFor(() => {
                expect(result.current.pendingChoice?.choiceId).toBe("s/reply");
            });

            act(() => {
                chat.setReadOnly(true);
            });

            await waitFor(() => {
                expect(result.current.canReply).toBe(false);
            });
        });

        test("reports group membership", async () => {
            const anna = defineContact("anna");
            const boris = defineContact("boris");
            const chat = defineChat("squad", {
                title: "Squad",
                participants: [anna],
            });

            const { result } = renderHook(() => useChat(chat));
            expect(result.current.participantCount).toBe(1);
            expect(result.current.isGroup).toBe(true);

            act(() => {
                chat.addParticipant(boris);
            });

            await waitFor(() => {
                expect(result.current.participantCount).toBe(2);
            });
        });

        test("reports the scheduled delivery time", async () => {
            const chat = defineChat("anna");
            const script = defineScript("s", (helpers) => [
                helpers.wait(MINUTE),
                helpers.from("anna").text("late"),
            ]);

            const { result } = renderHook(() => useChat(chat));

            act(() => {
                chat.play(script);
                chat.advance();
            });

            await waitFor(() => {
                expect(result.current.nextDueAt).toBe(MINUTE);
            });
        });
    });

    describe("useChatList", () => {
        test("does not materialize state for the chats it lists", () => {
            defineContact("anna", { name: "Anna" });
            defineChat("anna", { peer: "anna" });
            defineChat("boris", { title: "Boris" });

            renderHook(() => useChatList());

            expect(Object.keys(getStore().chats ?? {})).toEqual([]);
        });

        test("lists every chat, most recently active first", async () => {
            const anna = defineChat("anna");
            const boris = defineChat("boris");

            const { result } = renderHook(() => useChatList());

            expect(result.current.map((row) => row.chat.id)).toEqual([
                "anna",
                "boris",
            ]);
            expect(result.current[0]?.isEmpty).toBe(true);

            act(() => {
                Clock.advance(MINUTE);
                boris.push(m.from("boris").text("hey"));
            });

            await waitFor(() => {
                expect(result.current[0]?.chat).toBe(boris);
            });

            expect(result.current[0]?.unread).toBe(1);
            expect(result.current[0]?.isEmpty).toBe(false);
            expect(result.current[1]?.chat).toBe(anna);
        });

        test("lists only the chats it is given", () => {
            defineChat("anna");
            const boris = defineChat("boris");

            const { result } = renderHook(() => useChatList([boris]));

            expect(result.current).toHaveLength(1);
            expect(result.current[0]?.chat).toBe(boris);
        });
    });

    describe("useUnreadTotal", () => {
        test("adds up unread across chats and updates", async () => {
            const anna = defineChat("anna");
            const boris = defineChat("boris");

            const { result } = renderHook(() => useUnreadTotal());
            expect(result.current).toBe(0);

            act(() => {
                anna.push(m.from("anna").text("one"));
                boris.push(m.from("boris").text("two"));
            });

            await waitFor(() => {
                expect(result.current).toBe(2);
            });

            act(() => {
                anna.markSeen();
            });

            await waitFor(() => {
                expect(result.current).toBe(1);
            });
        });

        test("counts only the chats it is given", async () => {
            const anna = defineChat("anna");
            const boris = defineChat("boris");

            const { result } = renderHook(() => useUnreadTotal([anna]));

            act(() => {
                boris.push(m.from("boris").text("two"));
                anna.push(m.from("anna").text("one"));
            });

            await waitFor(() => {
                expect(result.current).toBe(1);
            });
        });
    });
});
