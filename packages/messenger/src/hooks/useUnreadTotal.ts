import { useGameEntity } from "@react-text-game/core";

import { type Chat, getAllChats } from "#chat";
import { getStore } from "#store";

/**
 * Subscribes a component to the total number of unseen entries.
 *
 * @param chats - Chats to count. Defaults to every defined chat.
 * @returns Total unseen entries, for a single app badge
 *
 * @example
 * ```tsx
 * function MessengerBadge() {
 *   const unread = useUnreadTotal();
 *   return unread > 0 ? <span>{unread}</span> : null;
 * }
 * ```
 */
export const useUnreadTotal = (chats?: Array<Chat>): number => {
    const store = useGameEntity(getStore());
    const listed = chats ?? getAllChats();

    return listed.reduce((total, chat) => {
        const vars = store.chats?.[chat.id];

        return total + (vars?.unread ?? 0);
    }, 0);
};
