import { type Chat, type ChatCallbacks, getAllChats } from "#chat";
import {
    getSeenStore,
    mergeStoreCallbacks,
    peekChatVars,
    setSeenStore,
} from "#store";
import type { SeenStore } from "#types";

/**
 * Options accepted by {@link defineMessenger}.
 */
export type MessengerOptions = ChatCallbacks & {
    /**
     * Chats this messenger manages.
     *
     * @remarks
     * Optional: every chat created with `defineChat()` is managed anyway. Pass it
     * to fix the order of the chat list.
     */
    chats?: Array<Chat>;

    /**
     * Where the cross-save seen record lives.
     *
     * @remarks
     * Defaults to the engine's settings table. Pass
     * `createMemorySeenStore()` to opt out of cross-save tracking, or your own
     * implementation to persist it elsewhere.
     */
    seenStore?: SeenStore;
};

/**
 * A chat as it appears in a chat list.
 */
export type ChatSummary = {
    chat: Chat;
    title: string;
    avatar: string | undefined;
    unread: number;
    lastActivityAt: number;
};

/**
 * Cross-chat facade: the chat list, the total unread badge, and the delivery tick.
 */
export type Messenger = {
    /** Every managed chat, most recently active first. */
    readonly chats: Array<ChatSummary>;

    /** Total unseen entries across every chat, for a single badge. */
    readonly unreadTotal: number;

    /**
     * Delivers everything that has become due in every chat.
     *
     * @remarks
     * The one call a game needs to wire up. Idempotent, so call it on window
     * focus, on passage change, after moving the clock, or on an interval.
     */
    deliverDueAll(): void;

    /**
     * Loads the cross-save seen record. Call once during bootstrap.
     */
    loadSeen(): Promise<void>;

    /**
     * Forces the cross-save seen record to be written now.
     */
    flushSeen(): Promise<void>;
};

const orderedChats = (preferred: Array<Chat> | undefined): Array<Chat> => {
    if (!preferred) {
        return getAllChats();
    }

    const rest = getAllChats().filter((chat) => !preferred.includes(chat));

    return [...preferred, ...rest];
};

/**
 * Configures messenger-wide behaviour and returns the cross-chat facade.
 *
 * @param options - Store-wide callbacks, chat order, and the seen store
 * @returns The messenger facade
 *
 * @remarks
 * Optional: chats work without it. Call it to register callbacks that should fire
 * for every chat, to fix the order of the chat list, or to swap the seen store.
 * Calling it again merges the new options over the old ones.
 *
 * @example
 * ```typescript
 * import { defineMessenger } from '@react-text-game/messenger';
 *
 * export const messenger = defineMessenger({
 *   chats: [annaChat, squad, news],
 *   onSend: ({ chat, entry }) => {
 *     if (entry.from !== 'player') incoming.play();
 *   },
 * });
 *
 * await messenger.loadSeen();
 * ```
 */
export const defineMessenger = (options: MessengerOptions = {}): Messenger => {
    const { chats: preferred, seenStore, ...callbacks } = options;

    mergeStoreCallbacks(callbacks);

    if (seenStore) {
        setSeenStore(seenStore);
    }

    return {
        get chats() {
            return orderedChats(preferred)
                .map((chat) => ({
                    chat,
                    title: chat.resolvedTitle,
                    avatar: chat.resolvedAvatar,
                    unread: chat.unread,
                    lastActivityAt: peekChatVars(chat.id)?.lastActivityAt ?? 0,
                }))
                .sort(
                    (left, right) => right.lastActivityAt - left.lastActivityAt
                );
        },

        get unreadTotal() {
            return orderedChats(preferred).reduce(
                (total, chat) => total + chat.unread,
                0
            );
        },

        deliverDueAll() {
            for (const chat of orderedChats(preferred)) {
                chat.deliverDue();
            }
        },

        loadSeen() {
            return getSeenStore().load();
        },

        flushSeen() {
            return getSeenStore().flush();
        },
    };
};
