import { useGameEntity, useGameTime } from "@react-text-game/core";

import type { Chat, PendingChoice } from "#chat";
import {
    selectFirstUnreadKey,
    selectLastEntry,
    selectTypingContacts,
} from "#selectors";
import { getStore } from "#store";
import type { ChatVars, TranscriptEntry } from "#types";

/**
 * Everything a chat view needs, recomputed whenever the chat changes.
 */
export type ChatSnapshot = {
    entries: Array<TranscriptEntry>;
    unread: number;
    /** Anchor for an "unread" divider and for auto-scroll. */
    firstUnreadKey: string | null;
    lastEntry: TranscriptEntry | null;
    title: string;
    avatar: string | undefined;
    participants: Array<string>;
    participantCount: number;
    isGroup: boolean;
    /** `false` in a read-only chat, regardless of what is pending. */
    canReply: boolean;
    /** The reply awaiting the player, or `null` when nothing is pending. */
    pendingChoice: PendingChoice | null;
    typing: Array<string>;
    nextDueAt: number | null;
    lastActivityAt: number;
    lastSeenAt: number;
    activeScriptId: string | null;
};

/**
 * Subscribes a component to one chat.
 *
 * @param chat - The chat to observe
 * @returns A snapshot recomputed on every relevant change
 *
 * @remarks
 * Reads go through the store entity's reactive proxy, which tracks property
 * access - so a component watching one chat does not re-render when another chat
 * receives a message. Game time is observed too, so moving the clock expires
 * typing indicators. In `"realtime"` clock mode flowing time mutates nothing and
 * therefore triggers no re-render: drive the view with `useGameTime(tickMs)` or
 * a `deliverDueAll()` interval if indicators have to expire on their own.
 *
 * Rendering never materializes state: a chat nothing has written to yet reports
 * its initial values.
 *
 * @example
 * ```tsx
 * function ChatView({ chat }: { chat: Chat }) {
 *   const { entries, unread, pendingChoice, canReply } = useChat(chat);
 *
 *   return (
 *     <>
 *       <ul>{entries.map((entry) => <li key={entry.key}>{entry.from}</li>)}</ul>
 *       {canReply && pendingChoice?.options.map((option) => (
 *         <button key={option.index} type="button" onClick={() => chat.choose(option.index)}>
 *           {option.content}
 *         </button>
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export const useChat = (chat: Chat): ChatSnapshot => {
    const store = useGameEntity(getStore());
    const now = useGameTime();
    const vars: ChatVars = store.chats?.[chat.id] ?? chat.initialVars();

    return {
        entries: vars.entries,
        unread: vars.unread,
        firstUnreadKey: selectFirstUnreadKey(vars),
        lastEntry: selectLastEntry(vars),
        title: chat.resolvedTitle,
        avatar: chat.resolvedAvatar,
        participants: vars.participants,
        participantCount: vars.participants.length,
        isGroup: chat.isGroup,
        canReply: !vars.readOnly,
        pendingChoice: chat.pendingChoice,
        typing: selectTypingContacts(vars, now),
        nextDueAt: vars.nextDueAt,
        lastActivityAt: vars.lastActivityAt,
        lastSeenAt: vars.lastSeenAt,
        activeScriptId: vars.activeScriptId,
    };
};
