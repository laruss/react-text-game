# Type Alias: Payload

> **Payload** = \{ `kind`: `"text"`; `text`: [`RichText`](RichText.md); \} \| \{ `caption?`: [`RichText`](RichText.md); `items`: [`MediaItem`](MediaItem.md)[]; `kind`: `"media"`; \} \| \{ `key`: `string`; `kind`: `"system"`; `params?`: [`Params`](Params.md); \} \| \{ `choiceId`: `string`; `chosen`: [`RichText`](RichText.md); `kind`: `"choice"`; \} \| \{ `data`: [`Json`](Json.md); `kind`: `"custom"`; `name`: `string`; \}

Defined in: [types.ts:157](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L157)

What a message is.

## Remarks

One `media` payload covers a single photo, a single video, a captioned item,
and a mixed album - the item count is what distinguishes them.
