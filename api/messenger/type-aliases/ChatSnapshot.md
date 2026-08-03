# Type Alias: ChatSnapshot

> **ChatSnapshot** = `object`

Defined in: [hooks/useChat.ts:15](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L15)

Everything a chat view needs, recomputed whenever the chat changes.

## Properties

### activeScriptId

> **activeScriptId**: `string` \| `null`

Defined in: [hooks/useChat.ts:34](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L34)

***

### avatar

> **avatar**: `string` \| `undefined`

Defined in: [hooks/useChat.ts:22](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L22)

***

### canReply

> **canReply**: `boolean`

Defined in: [hooks/useChat.ts:27](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L27)

`false` in a read-only chat, regardless of what is pending.

***

### entries

> **entries**: [`TranscriptEntry`](TranscriptEntry.md)[]

Defined in: [hooks/useChat.ts:16](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L16)

***

### firstUnreadKey

> **firstUnreadKey**: `string` \| `null`

Defined in: [hooks/useChat.ts:19](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L19)

Anchor for an "unread" divider and for auto-scroll.

***

### isGroup

> **isGroup**: `boolean`

Defined in: [hooks/useChat.ts:25](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L25)

***

### lastActivityAt

> **lastActivityAt**: `number`

Defined in: [hooks/useChat.ts:32](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L32)

***

### lastEntry

> **lastEntry**: [`TranscriptEntry`](TranscriptEntry.md) \| `null`

Defined in: [hooks/useChat.ts:20](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L20)

***

### lastSeenAt

> **lastSeenAt**: `number`

Defined in: [hooks/useChat.ts:33](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L33)

***

### nextDueAt

> **nextDueAt**: `number` \| `null`

Defined in: [hooks/useChat.ts:31](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L31)

***

### participantCount

> **participantCount**: `number`

Defined in: [hooks/useChat.ts:24](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L24)

***

### participants

> **participants**: `string`[]

Defined in: [hooks/useChat.ts:23](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L23)

***

### pendingChoice

> **pendingChoice**: [`PendingChoice`](PendingChoice.md) \| `null`

Defined in: [hooks/useChat.ts:29](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L29)

The reply awaiting the player, or `null` when nothing is pending.

***

### title

> **title**: `string`

Defined in: [hooks/useChat.ts:21](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L21)

***

### typing

> **typing**: `string`[]

Defined in: [hooks/useChat.ts:30](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L30)

***

### unread

> **unread**: `number`

Defined in: [hooks/useChat.ts:17](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/hooks/useChat.ts#L17)
