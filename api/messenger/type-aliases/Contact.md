# Type Alias: Contact

> **Contact** = `object`

Defined in: [contacts.ts:17](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/contacts.ts#L17)

A participant in a chat: an NPC, a channel, or the player.

## Remarks

Contacts are definitions, not persisted state. Their ids end up inside saved
transcripts, so treat a contact id like a passage id: never rename it once a
game has shipped.

## Properties

### avatar?

> `readonly` `optional` **avatar**: `string`

Defined in: [contacts.ts:24](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/contacts.ts#L24)

Avatar image, used as the fallback avatar of a direct chat.

***

### id

> `readonly` **id**: `string`

Defined in: [contacts.ts:18](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/contacts.ts#L18)

***

### meta?

> `readonly` `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [contacts.ts:27](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/contacts.ts#L27)

Arbitrary author data, for example a phone number or an online flag.

***

### name?

> `readonly` `optional` **name**: [`PlainRichText`](PlainRichText.md)

Defined in: [contacts.ts:21](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/contacts.ts#L21)

Display name, resolved through i18next when built with `m.t()`.
