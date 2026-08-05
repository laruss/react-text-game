# Function: selectFirstUnreadKey()

> **selectFirstUnreadKey**(`vars`): `string` \| `null`

Defined in: [selectors.ts:11](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/selectors.ts#L11)

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
