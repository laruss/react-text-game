# Type Alias: ChatCallbacks

> **ChatCallbacks** = `object`

Defined in: [chat.ts:78](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L78)

Optional callbacks fired after a chat changes.

## Remarks

Callbacks run after the state change they describe, and a callback that throws
is reported without corrupting the transcript. Chat callbacks fire before the
ones registered on `defineMessenger()`.

## Properties

### onChoice()?

> `optional` **onChoice**: (`event`) => `void`

Defined in: [chat.ts:99](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L99)

Fires after the player's reply has been logged.

#### Parameters

##### event

###### chat

[`Chat`](../classes/Chat.md)

###### choiceId

`string`

###### index

`number`

###### option

[`ChoiceOption`](ChoiceOption.md)

#### Returns

`void`

***

### onParticipantChange()?

> `optional` **onParticipantChange**: (`event`) => `void`

Defined in: [chat.ts:113](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L113)

Fires when a group's membership changes.

#### Parameters

##### event

###### added?

`string`

###### chat

[`Chat`](../classes/Chat.md)

###### participants

`string`[]

###### removed?

`string`

#### Returns

`void`

***

### onScriptEnd()?

> `optional` **onScriptEnd**: (`event`) => `void`

Defined in: [chat.ts:110](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L110)

Fires when a script runs out of beats.

#### Parameters

##### event

###### chat

[`Chat`](../classes/Chat.md)

###### scriptId

`string`

#### Returns

`void`

***

### onSeen()?

> `optional` **onSeen**: (`event`) => `void`

Defined in: [chat.ts:96](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L96)

Fires when entries transition to seen, with the entries that changed.

#### Parameters

##### event

###### chat

[`Chat`](../classes/Chat.md)

###### entries

[`TranscriptEntry`](TranscriptEntry.md)[]

#### Returns

`void`

***

### onSend()?

> `optional` **onSend**: (`event`) => `void`

Defined in: [chat.ts:93](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L93)

Fires for every entry appended to the transcript - from a contact, from the
player, and for system notices alike.

#### Parameters

##### event

###### chat

[`Chat`](../classes/Chat.md)

###### entry

[`TranscriptEntry`](TranscriptEntry.md)

#### Returns

`void`

#### Example

```typescript
defineChat('anna', {
  peer: anna,
  onSend: ({ entry }) => {
    if (entry.from !== 'player') notificationSound.play();
  },
});
```

***

### onTyping()?

> `optional` **onTyping**: (`event`) => `void`

Defined in: [chat.ts:107](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L107)

Fires when the set of typing contacts changes.

#### Parameters

##### event

###### chat

[`Chat`](../classes/Chat.md)

###### typing

`string`[]

#### Returns

`void`
