/**
 * Headless messenger and visual-novel transcript engine for React Text Game.
 *
 * A chat's transcript is an append-only log that lives in an engine entity, so it
 * survives saves, loads, and remounts, and knows exactly what the player has and
 * has not seen. The same primitive powers a messenger simulator (chat list,
 * unread badges, scheduled delivery) and a Ren'Py-style visual novel (backlog,
 * skip-already-read).
 *
 * This release is headless: state, delivery, and selectors, with no components.
 *
 * @example
 * ```typescript
 * import {
 *   defineChat, defineContact, defineMessenger, defineScript, m,
 * } from '@react-text-game/messenger';
 * import { MINUTE } from '@react-text-game/core/clock';
 *
 * const anna = defineContact('anna', { name: m.t('contacts.anna') });
 * const chat = defineChat('anna', { peer: anna });
 *
 * const opener = defineScript('anna/opener', (m) => [
 *   m.from(anna).text(m.t('anna.opener')),
 *   m.typing(anna, 1200),
 *   m.from(anna).media([m.image('/park.webp')], { caption: m.t('anna.park') }),
 *   m.wait(30 * MINUTE),
 *   m.choice('anna/opener/reply', [
 *     { content: m.t('reply.yes') },
 *     { content: m.t('reply.no') },
 *   ]),
 * ]);
 *
 * export const messenger = defineMessenger({ chats: [chat] });
 *
 * // From an action handler, never while rendering:
 * chat.play(opener);
 * chat.advance();
 * ```
 *
 * @module messenger
 */

// Registers this package's default strings on import.
import "./i18n";

export {
    Chat,
    type ChatCallbacks,
    type ChatKind,
    type ChatOptions,
    defineChat,
    getAllChats,
    getChat,
    type PendingChoice,
} from "./chat";
export {
    AUTHOR_I18N_NAMESPACE,
    ENTRY_WARN_THRESHOLD,
    MESSENGER_I18N_NAMESPACE,
    MESSENGER_STORE_ID,
    PLAYER_SENDER,
    SEEN_SETTING_KEY,
    SYSTEM_SENDER,
} from "./constants";
export {
    type Contact,
    type ContactOptions,
    defineContact,
    getContact,
    playerSenderId,
    resolveSenderAvatar,
    resolveSenderName,
} from "./contacts";
export * from "./hooks";
export { messengerTranslations } from "./i18n";
export {
    type ChatSummary,
    defineMessenger,
    type Messenger,
    type MessengerOptions,
} from "./messenger";
export { previewText, resolveSystemText, resolveText } from "./resolve";
export {
    type Beat,
    type BeatInput,
    type ChoiceBeatInput,
    type ChoiceOption,
    type Conditional,
    type CustomBeatInput,
    type DeliverableBeatInput,
    defineScript,
    getScript,
    type MediaItemOptions,
    type MediaMessageOptions,
    type MessageBeatInput,
    type MessageBody,
    type MessageOptions,
    type MessengerHelpers,
    m,
    type Script,
    type ScriptBuilder,
    type SenderScope,
    type SystemBeatInput,
    type TypingBeatInput,
    type WaitBeatInput,
} from "./scripts";
export {
    createMemorySeenStore,
    createSeenStore,
    type SeenTransport,
    settingsSeenTransport,
} from "./seen";
export {
    selectFirstUnreadKey,
    selectLastEntry,
    selectTypingContacts,
    selectUnread,
    selectUnseenEntries,
} from "./selectors";
export {
    isI18nText,
    isStaticText,
    type PlainRichText,
    resolvePlainRichText,
    t,
} from "./text";
export type * from "./types";
