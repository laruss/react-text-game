# Type Alias: TranscriptEntry

> **TranscriptEntry** = `object`

Defined in: [types.ts:172](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L172)

One delivered message in a chat's transcript.

## Remarks

Entries are append-only. Forwarding, editing, and deletion are recorded as
metadata on the entry rather than as payload kinds, so any payload can be
forwarded or marked deleted.

## Properties

### at

> **at**: `number`

Defined in: [types.ts:177](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L177)

Game time the entry was delivered at, from `Clock.now()`.

***

### deleted?

> `optional` **deleted**: `boolean`

Defined in: [types.ts:197](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L197)

In-fiction "message deleted" marker. The payload is kept.

***

### edited?

> `optional` **edited**: `boolean`

Defined in: [types.ts:194](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L194)

In-fiction "edited" marker.

***

### forwarded?

> `optional` **forwarded**: [`ForwardOrigin`](ForwardOrigin.md)

Defined in: [types.ts:191](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L191)

Set when the message was forwarded into this chat.

***

### from

> **from**: `string`

Defined in: [types.ts:180](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L180)

Contact id, `"player"`, or `"system"`.

***

### key

> **key**: `string`

Defined in: [types.ts:174](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L174)

Stable, unique within the chat.

***

### origin?

> `optional` **origin**: `object`

Defined in: [types.ts:200](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L200)

Script beat that produced the entry, when it came from a script.

#### beatId

> **beatId**: `string`

#### scriptId

> **scriptId**: `string`

***

### payload

> **payload**: [`Payload`](Payload.md)

Defined in: [types.ts:182](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L182)

***

### receipt?

> `optional` **receipt**: [`Receipt`](Receipt.md)

Defined in: [types.ts:188](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L188)

In-fiction delivery state, controlled by the author.

***

### seen

> **seen**: `boolean`

Defined in: [types.ts:185](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L185)

Whether the player has looked at this entry.
