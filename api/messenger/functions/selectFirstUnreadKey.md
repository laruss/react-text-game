# Function: selectFirstUnreadKey()

> **selectFirstUnreadKey**(`vars`): `string` \| `null`

Defined in: [selectors.ts:11](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/selectors.ts#L11)

Key of the oldest entry the player has not seen, or `null` when the chat is
fully read.

## Parameters

### vars

[`ChatVars`](../type-aliases/ChatVars.md)

## Returns

`string` \| `null`

## Remarks

This is the anchor a chat view scrolls to and the point an "unread" divider
goes above.
