# Type Alias: ForwardOrigin

> **ForwardOrigin** = `object`

Defined in: [types.ts:126](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L126)

Where a forwarded message originally came from.

## Remarks

A forward does not have to reference a real message. Pass a contact id to
attribute it to a known contact, or a `label` for an unknown source.

## Properties

### at?

> `optional` **at**: `number`

Defined in: [types.ts:130](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L130)

Original timestamp, if the game wants to show one.

***

### from

> **from**: `string` \| \{ `label`: [`RichText`](RichText.md); \}

Defined in: [types.ts:128](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L128)

Contact id, or a free-form label for a source with no contact.

***

### sourceChatId?

> `optional` **sourceChatId**: `string`

Defined in: [types.ts:132](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L132)

Chat the message was forwarded out of, when there is one.

***

### sourceKey?

> `optional` **sourceKey**: `string`

Defined in: [types.ts:134](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L134)

Key of the original entry, when there is one.
