# Type Alias: Messenger

> **Messenger** = `object`

Defined in: [messenger.ts:48](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L48)

Cross-chat facade: the chat list, the total unread badge, and the delivery tick.

## Properties

### chats

> `readonly` **chats**: [`ChatSummary`](ChatSummary.md)[]

Defined in: [messenger.ts:50](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L50)

Every managed chat, most recently active first.

***

### unreadTotal

> `readonly` **unreadTotal**: `number`

Defined in: [messenger.ts:53](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L53)

Total unseen entries across every chat, for a single badge.

## Methods

### deliverDueAll()

> **deliverDueAll**(): `void`

Defined in: [messenger.ts:62](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L62)

Delivers everything that has become due in every chat.

#### Returns

`void`

#### Remarks

The one call a game needs to wire up. Idempotent, so call it on window
focus, on passage change, after moving the clock, or on an interval.

***

### flushSeen()

> **flushSeen**(): `Promise`\<`void`\>

Defined in: [messenger.ts:72](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L72)

Forces the cross-save seen record to be written now.

#### Returns

`Promise`\<`void`\>

***

### loadSeen()

> **loadSeen**(): `Promise`\<`void`\>

Defined in: [messenger.ts:67](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/messenger.ts#L67)

Loads the cross-save seen record. Call once during bootstrap.

#### Returns

`Promise`\<`void`\>
