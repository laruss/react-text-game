# Variable: messengerTranslations

> `const` **messengerTranslations**: `object`

Defined in: [i18n/index.ts:15](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/i18n/index.ts#L15)

This package's default strings, keyed by language and namespace.

## Type Declaration

### en

> **en**: `object`

#### en.messenger

> **messenger**: `object` = `en`

#### en.messenger.chat.readOnly

> `readonly` **chat.readOnly**: `"You cannot reply in this chat"` = `"You cannot reply in this chat"`

#### en.messenger.divider.today

> `readonly` **divider.today**: `"Today"` = `"Today"`

#### en.messenger.divider.unread

> `readonly` **divider.unread**: `"Unread messages"` = `"Unread messages"`

#### en.messenger.divider.yesterday

> `readonly` **divider.yesterday**: `"Yesterday"` = `"Yesterday"`

#### en.messenger.media.album

> `readonly` **media.album**: `"{{count}} items"` = `"{{count}} items"`

#### en.messenger.media.spoiler

> `readonly` **media.spoiler**: `"Tap to reveal"` = `"Tap to reveal"`

#### en.messenger.member.joined

> `readonly` **member.joined**: `"{{who}} joined the chat"` = `"{{who}} joined the chat"`

#### en.messenger.member.left

> `readonly` **member.left**: `"{{who}} left the chat"` = `"{{who}} left the chat"`

#### en.messenger.message.deleted

> `readonly` **message.deleted**: `"This message was deleted"` = `"This message was deleted"`

#### en.messenger.message.edited

> `readonly` **message.edited**: `"edited"` = `"edited"`

#### en.messenger.message.forwarded

> `readonly` **message.forwarded**: `"Forwarded message"` = `"Forwarded message"`

#### en.messenger.message.forwardedFrom

> `readonly` **message.forwardedFrom**: `"Forwarded from {{who}}"` = `"Forwarded from {{who}}"`

#### en.messenger.typing

> `readonly` **typing**: `"typing..."` = `"typing..."`

## Remarks

Registered automatically when the package is imported, so a game gets working
text without wiring anything. Exported for the rare case of merging them by
hand into `Game.init({ translations: { resources } })`.
