# Type Alias: MessengerOptions

> **MessengerOptions** = [`ChatCallbacks`](ChatCallbacks.md) & `object`

Defined in: [messenger.ts:13](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/messenger.ts#L13)

Options accepted by [defineMessenger](../functions/defineMessenger.md).

## Type Declaration

### chats?

> `optional` **chats**: [`Chat`](../classes/Chat.md)[]

Chats this messenger manages.

#### Remarks

Optional: every chat created with `defineChat()` is managed anyway. Pass it
to fix the order of the chat list.

### seenStore?

> `optional` **seenStore**: [`SeenStore`](SeenStore.md)

Where the cross-save seen record lives.

#### Remarks

Defaults to the engine's settings table. Pass
`createMemorySeenStore()` to opt out of cross-save tracking, or your own
implementation to persist it elsewhere.
