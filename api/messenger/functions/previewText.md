# Function: previewText()

> **previewText**(`text`): `string`

Defined in: [resolve.ts:68](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/resolve.ts#L68)

Resolves persisted text to a plain string, for chat list previews and
accessibility labels.

Script references only yield a string when their content is one; anything
richer comes back empty, because a React node has no faithful string form.

## Parameters

### text

[`RichText`](../type-aliases/RichText.md)

Persisted text from a transcript entry

## Returns

`string`
