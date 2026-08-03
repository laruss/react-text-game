import { useGameEntity } from "@react-text-game/core";

import { type Chat, getAllChats } from "#chat";
import { getStore } from "#store";
import type { ChatVars } from "#types";

/**
 * One row of a chat list.
 */
export type ChatListItem = {
    chat: Chat;
    title: string;
    avatar: string | undefined;
    unread: number;
    lastActivityAt: number;
    /** `true` when the chat has never received anything. */
    isEmpty: boolean;
};

/**
 * Subscribes a component to every chat, most recently active first.
 *
 * @param chats - Chats to list. Defaults to every defined chat.
 * @returns A row per chat, recomputed whenever any chat changes
 *
 * @example
 * ```tsx
 * function ChatList() {
 *   const rows = useChatList();
 *
 *   return (
 *     <ul>
 *       {rows.map(({ chat, title, unread }) => (
 *         <li key={chat.id}>{title}{unread > 0 && ` (${unread})`}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useChatList = (chats?: Array<Chat>): Array<ChatListItem> => {
    const store = useGameEntity(getStore());
    const listed = chats ?? getAllChats();

    return listed
        .map((chat) => {
            const vars: ChatVars = store.chats?.[chat.id] ?? chat.initialVars();

            return {
                chat,
                title: chat.resolvedTitle,
                avatar: chat.resolvedAvatar,
                unread: vars.unread,
                lastActivityAt: vars.lastActivityAt,
                isEmpty: vars.entries.length === 0,
            };
        })
        .sort((left, right) => right.lastActivityAt - left.lastActivityAt);
};
