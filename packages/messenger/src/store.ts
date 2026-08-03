import { createEntity, type SimpleObject } from "@react-text-game/core";

import type { ChatCallbacks } from "#chat";
import { MESSENGER_STORE_ID } from "#constants";
import { logger } from "#logger";
import { createSeenStore } from "#seen";
import type { ChatVars, SeenStore } from "#types";

/**
 * Variables held by the messenger store entity.
 */
export type MessengerStoreVars = {
    chats: Record<string, ChatVars>;
};

/**
 * The engine entity every chat's transcript lives inside.
 *
 * @remarks
 * One entity holds every chat rather than one entity per chat: the engine saves
 * every registered entity on every snapshot anyway, so splitting them would buy
 * nothing while risking id collisions between a chat and a game entity. Valtio
 * tracks property access, so a component reading one chat does not re-render when
 * another chat changes.
 */
export type MessengerStore = SimpleObject<MessengerStoreVars>;

let store: MessengerStore | null = null;
let seenStore: SeenStore | null = null;
let storeCallbacks: ChatCallbacks = {};

/**
 * Returns the store entity, creating and registering it on first use.
 *
 * @remarks
 * Created lazily so importing this package never registers an entity a game does
 * not use, and loaded immediately so a store created after `Game.setState()` still
 * picks up the state that was restored before it existed.
 *
 * @internal
 */
export const getStore = (): MessengerStore => {
    if (!store) {
        store = createEntity(MESSENGER_STORE_ID, {
            chats: {} as Record<string, ChatVars>,
        });
        store.load();
    }

    return store;
};

/**
 * Guarantees the store has a chats record.
 *
 * @remarks
 * `BaseGameObject.load()` clears every variable when storage has nothing for the
 * entity, which happens whenever a save written before the messenger existed is
 * loaded. Repairing here keeps that case from turning into a crash.
 *
 * @internal
 */
const ensureChats = (): Record<string, ChatVars> => {
    const current = getStore();

    if (!current.chats) {
        current.chats = {};
    }

    return current.chats;
};

/**
 * Returns a chat's persisted state, materializing it from its definition the
 * first time it is touched.
 *
 * @remarks
 * Lazy materialization is what lets a game add a chat without writing a save
 * migration: a chat missing from an older save simply starts from its initial
 * values.
 *
 * @internal
 */
export const getChatVars = (
    chatId: string,
    createInitial: () => ChatVars
): ChatVars => {
    const chats = ensureChats();
    const existing = chats[chatId];

    if (existing) {
        return existing;
    }

    const initial = createInitial();
    chats[chatId] = initial;

    return chats[chatId] as ChatVars;
};

/**
 * Returns a chat's persisted state without creating it.
 *
 * @remarks
 * The read-only counterpart of {@link getChatVars}. Rendering must never
 * materialize state: a component that only looks at a chat would otherwise write
 * initial values for it into every subsequent save, and mutate a proxy it is
 * subscribed to mid-render.
 *
 * @internal
 */
export const peekChatVars = (chatId: string): ChatVars | undefined =>
    ensureChats()[chatId];

/**
 * Returns the state of every chat that has been materialized.
 *
 * @internal
 */
export const getAllChatVars = (): Record<string, ChatVars> => ensureChats();

/**
 * Returns the active cross-save seen store, creating the default one on first
 * use.
 *
 * @internal
 */
export const getSeenStore = (): SeenStore => {
    if (!seenStore) {
        seenStore = createSeenStore();
    }

    return seenStore;
};

/**
 * Replaces the cross-save seen store.
 *
 * @internal
 */
export const setSeenStore = (next: SeenStore): void => {
    seenStore = next;
};

/**
 * Callbacks registered for every chat through `defineMessenger()`.
 *
 * @internal
 */
export const getStoreCallbacks = (): ChatCallbacks => storeCallbacks;

/**
 * Merges store-wide callbacks, so several `defineMessenger()` calls accumulate.
 *
 * @internal
 */
export const mergeStoreCallbacks = (callbacks: ChatCallbacks): void => {
    storeCallbacks = { ...storeCallbacks, ...callbacks };
};

/**
 * Invokes an author callback without letting a failure corrupt the transcript.
 *
 * @remarks
 * Callbacks run after the state change they describe, so a throwing callback
 * cannot leave a chat half-updated. The failure is reported rather than
 * swallowed.
 *
 * @internal
 */
export const safeCallback = <TEvent>(
    name: string,
    callback: ((event: TEvent) => void) | undefined,
    event: TEvent
): void => {
    if (!callback) {
        return;
    }

    try {
        callback(event);
    } catch (error) {
        logger.error(`The ${name} callback threw.`, error);
    }
};

/**
 * Clears persisted chat state and drops the store. Tests only.
 *
 * @remarks
 * Also wipes the store's slot in storage, so state cannot leak from one test into
 * the next through the module-level storage object. Pair it with
 * `Game._resetForTesting()`, which clears the entity registry the store was
 * registered in.
 *
 * @internal
 */
export const _resetStore = (): void => {
    if (store) {
        store.chats = {};
        store.save();
    }

    _dropStore();
};

/**
 * Drops the in-memory store without touching storage, so a save can be restored
 * into a freshly created store. Tests only.
 *
 * @internal
 */
export const _dropStore = (): void => {
    store = null;
    seenStore = null;
    storeCallbacks = {};
};
