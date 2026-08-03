# Type Alias: ChatVars

> **ChatVars** = `object`

Defined in: [types.ts:212](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L212)

Persisted state of a single chat.

## Remarks

Everything that can change during play lives here; `defineChat()` only
supplies the initial values. A chat that is missing from an older save is
materialized from its definition on first access, so adding a chat to a game
never needs a save migration.

## Properties

### activeScriptId

> **activeScriptId**: `string` \| `null`

Defined in: [types.ts:216](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L216)

Script currently being played, if any.

***

### avatar?

> `optional` **avatar**: `string` \| `null`

Defined in: [types.ts:244](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L244)

In-fiction avatar. `null` means the avatar was explicitly removed.

***

### beatCounts

> **beatCounts**: `Record`\<`string`, `number`\>

Defined in: [types.ts:222](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L222)

Raw beat count per script, used to warn about script drift.

***

### cursors

> **cursors**: `Record`\<`string`, `number`\>

Defined in: [types.ts:219](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L219)

Next beat index per script, indexed into the script's raw beat array.

***

### entries

> **entries**: [`TranscriptEntry`](TranscriptEntry.md)[]

Defined in: [types.ts:213](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L213)

***

### lastActivityAt

> **lastActivityAt**: `number`

Defined in: [types.ts:259](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L259)

Game time of the newest entry.

***

### lastSeenAt

> **lastSeenAt**: `number`

Defined in: [types.ts:256](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L256)

Game time the chat was last marked seen at.

***

### nextDueAt

> **nextDueAt**: `number` \| `null`

Defined in: [types.ts:232](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L232)

Game time delivery is blocked until, or `null` when nothing is pending.

#### Remarks

This single field replaces a queue of scheduled messages: everything due
is derived from the cursor and the clock, so a save loaded much later
simply delivers what became due while it was away.

***

### nextKey

> **nextKey**: `number`

Defined in: [types.ts:262](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L262)

Counter behind [TranscriptEntry.key](TranscriptEntry.md#key).

***

### participants

> **participants**: `string`[]

Defined in: [types.ts:247](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L247)

Current members, as contact ids. Empty for a direct chat.

***

### pendingChoiceKey

> **pendingChoiceKey**: `string` \| `null`

Defined in: [types.ts:238](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L238)

Choice id awaiting the player's reply, or `null`.

***

### readOnly

> **readOnly**: `boolean`

Defined in: [types.ts:250](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L250)

Whether the player can never reply in this chat.

***

### title?

> `optional` **title**: [`RichText`](RichText.md)

Defined in: [types.ts:241](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L241)

In-fiction title, once renamed.

***

### typingUntil

> **typingUntil**: `Record`\<`string`, `number`\>

Defined in: [types.ts:235](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L235)

Game time each contact's typing indicator expires at.

***

### unread

> **unread**: `number`

Defined in: [types.ts:253](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/types.ts#L253)

Number of entries the player has not seen.
