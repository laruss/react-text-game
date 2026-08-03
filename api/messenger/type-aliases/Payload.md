# Type Alias: Payload

> **Payload** = \{ `kind`: `"text"`; `text`: [`RichText`](RichText.md); \} \| \{ `caption?`: [`RichText`](RichText.md); `items`: [`MediaItem`](MediaItem.md)[]; `kind`: `"media"`; \} \| \{ `key`: `string`; `kind`: `"system"`; `params?`: [`Params`](Params.md); \} \| \{ `choiceId`: `string`; `chosen`: [`RichText`](RichText.md); `kind`: `"choice"`; \} \| \{ `data`: [`Json`](Json.md); `kind`: `"custom"`; `name`: `string`; \}

Defined in: [types.ts:157](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L157)

What a message is.

## Remarks

One `media` payload covers a single photo, a single video, a captioned item,
and a mixed album - the item count is what distinguishes them.
