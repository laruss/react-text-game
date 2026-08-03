# Messenger

Headless messenger and visual-novel transcript engine for React Text Game.

A chat's transcript is an append-only log that lives in an engine entity, so it
survives saves, loads, and remounts, and knows exactly what the player has and
has not seen. The same primitive powers a messenger simulator (chat list,
unread badges, scheduled delivery) and a Ren'Py-style visual novel (backlog,
skip-already-read).

This release is headless: state, delivery, and selectors, with no components.

## Example

```typescript
import {
  defineChat, defineContact, defineMessenger, defineScript, m,
} from '@react-text-game/messenger';
import { MINUTE } from '@react-text-game/core/clock';

const anna = defineContact('anna', { name: m.t('contacts.anna') });
const chat = defineChat('anna', { peer: anna });

const opener = defineScript('anna/opener', (m) => [
  m.from(anna).text(m.t('anna.opener')),
  m.typing(anna, 1200),
  m.from(anna).media([m.image('/park.webp')], { caption: m.t('anna.park') }),
  m.wait(30 * MINUTE),
  m.choice('anna/opener/reply', [
    { content: m.t('reply.yes') },
    { content: m.t('reply.no') },
  ]),
]);

export const messenger = defineMessenger({ chats: [chat] });

// From an action handler, never while rendering:
chat.play(opener);
chat.advance();
```

## Classes

- [Chat](classes/Chat.md)

## Type Aliases

- [Beat](type-aliases/Beat.md)
- [BeatInput](type-aliases/BeatInput.md)
- [ChatCallbacks](type-aliases/ChatCallbacks.md)
- [ChatKind](type-aliases/ChatKind.md)
- [ChatListItem](type-aliases/ChatListItem.md)
- [ChatOptions](type-aliases/ChatOptions.md)
- [ChatSnapshot](type-aliases/ChatSnapshot.md)
- [ChatSummary](type-aliases/ChatSummary.md)
- [ChatVars](type-aliases/ChatVars.md)
- [ChoiceBeatInput](type-aliases/ChoiceBeatInput.md)
- [ChoiceOption](type-aliases/ChoiceOption.md)
- [Conditional](type-aliases/Conditional.md)
- [Contact](type-aliases/Contact.md)
- [ContactOptions](type-aliases/ContactOptions.md)
- [CustomBeatInput](type-aliases/CustomBeatInput.md)
- [DeliverableBeatInput](type-aliases/DeliverableBeatInput.md)
- [ForwardOrigin](type-aliases/ForwardOrigin.md)
- [ForwardOriginInput](type-aliases/ForwardOriginInput.md)
- [I18nText](type-aliases/I18nText.md)
- [Json](type-aliases/Json.md)
- [MediaItem](type-aliases/MediaItem.md)
- [MediaItemInput](type-aliases/MediaItemInput.md)
- [MediaItemOptions](type-aliases/MediaItemOptions.md)
- [MediaMessageOptions](type-aliases/MediaMessageOptions.md)
- [MessageBeatInput](type-aliases/MessageBeatInput.md)
- [MessageBody](type-aliases/MessageBody.md)
- [MessageOptions](type-aliases/MessageOptions.md)
- [Messenger](type-aliases/Messenger.md)
- [MessengerHelpers](type-aliases/MessengerHelpers.md)
- [MessengerOptions](type-aliases/MessengerOptions.md)
- [Params](type-aliases/Params.md)
- [Payload](type-aliases/Payload.md)
- [PendingChoice](type-aliases/PendingChoice.md)
- [PlainRichText](type-aliases/PlainRichText.md)
- [RawText](type-aliases/RawText.md)
- [Receipt](type-aliases/Receipt.md)
- [RefText](type-aliases/RefText.md)
- [RichText](type-aliases/RichText.md)
- [Script](type-aliases/Script.md)
- [ScriptBuilder](type-aliases/ScriptBuilder.md)
- [SeenStore](type-aliases/SeenStore.md)
- [SeenTransport](type-aliases/SeenTransport.md)
- [SenderScope](type-aliases/SenderScope.md)
- [StaticText](type-aliases/StaticText.md)
- [SystemBeatInput](type-aliases/SystemBeatInput.md)
- [TextInput](type-aliases/TextInput.md)
- [TranscriptEntry](type-aliases/TranscriptEntry.md)
- [TypingBeatInput](type-aliases/TypingBeatInput.md)
- [WaitBeatInput](type-aliases/WaitBeatInput.md)

## Variables

- [AUTHOR\_I18N\_NAMESPACE](variables/AUTHOR_I18N_NAMESPACE.md)
- [ENTRY\_WARN\_THRESHOLD](variables/ENTRY_WARN_THRESHOLD.md)
- [m](variables/m.md)
- [MESSENGER\_I18N\_NAMESPACE](variables/MESSENGER_I18N_NAMESPACE.md)
- [MESSENGER\_STORE\_ID](variables/MESSENGER_STORE_ID.md)
- [messengerTranslations](variables/messengerTranslations.md)
- [PLAYER\_SENDER](variables/PLAYER_SENDER.md)
- [playerSenderId](variables/playerSenderId.md)
- [SEEN\_SETTING\_KEY](variables/SEEN_SETTING_KEY.md)
- [settingsSeenTransport](variables/settingsSeenTransport.md)
- [SYSTEM\_SENDER](variables/SYSTEM_SENDER.md)

## Functions

- [createMemorySeenStore](functions/createMemorySeenStore.md)
- [createSeenStore](functions/createSeenStore.md)
- [defineChat](functions/defineChat.md)
- [defineContact](functions/defineContact.md)
- [defineMessenger](functions/defineMessenger.md)
- [defineScript](functions/defineScript.md)
- [getAllChats](functions/getAllChats.md)
- [getChat](functions/getChat.md)
- [getContact](functions/getContact.md)
- [getScript](functions/getScript.md)
- [isI18nText](functions/isI18nText.md)
- [isStaticText](functions/isStaticText.md)
- [previewText](functions/previewText.md)
- [resolvePlainRichText](functions/resolvePlainRichText.md)
- [resolveSenderAvatar](functions/resolveSenderAvatar.md)
- [resolveSenderName](functions/resolveSenderName.md)
- [resolveSystemText](functions/resolveSystemText.md)
- [resolveText](functions/resolveText.md)
- [selectFirstUnreadKey](functions/selectFirstUnreadKey.md)
- [selectLastEntry](functions/selectLastEntry.md)
- [selectTypingContacts](functions/selectTypingContacts.md)
- [selectUnread](functions/selectUnread.md)
- [selectUnseenEntries](functions/selectUnseenEntries.md)
- [t](functions/t.md)
- [useChat](functions/useChat.md)
- [useChatList](functions/useChatList.md)
- [useUnreadTotal](functions/useUnreadTotal.md)
