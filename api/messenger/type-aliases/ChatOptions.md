# Type Alias: ChatOptions

> **ChatOptions** = [`ChatCallbacks`](ChatCallbacks.md) & `object`

Defined in: [chat.ts:124](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/messenger/src/chat.ts#L124)

Options accepted by [defineChat](../functions/defineChat.md).

## Type Declaration

### avatar?

> `optional` **avatar**: `string`

Initial chat picture. A chat may have none.

### maxEntries?

> `optional` **maxEntries**: `number`

Keep at most this many entries, dropping the oldest beyond it.

#### Remarks

Uncapped by default, so history is never silently lost. Because auto-save
serializes the whole state tree into `sessionStorage`, a long-running chat
should set a cap; the package warns once a transcript passes
[ENTRY\_WARN\_THRESHOLD](../variables/ENTRY_WARN_THRESHOLD.md) without one.

### participants?

> `optional` **participants**: ([`Contact`](Contact.md) \| `string`)[]

Initial members, making this a group chat.

#### Remarks

Membership changes during play, so this is only the starting point.

### peer?

> `optional` **peer**: [`Contact`](Contact.md) \| `string`

The single other participant, making this a direct chat.

#### Remarks

Its avatar and name become the chat's fallbacks.

### readOnly?

> `optional` **readOnly**: `boolean`

Whether the player can never reply, as in a channel or an announcement
feed.

#### Remarks

Distinct from simply having no reply available right now - check
[Chat.canReply](../classes/Chat.md#canreply) for the structural answer and
[Chat.pendingChoice](../classes/Chat.md#pendingchoice) for the transient one.

### title?

> `optional` **title**: [`StaticText`](StaticText.md)

Display title. Required in practice for a group; a direct chat falls back
to its peer's name.
