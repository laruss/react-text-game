# Class: Chat

Defined in: [chat.ts:274](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L274)

A single conversation: its transcript, its delivery cursor, and everything the
player has or has not seen in it.

## Remarks

State lives in the messenger store entity, so it survives saves, loads, and
remounts. Every method that changes state is an action: call them from event
handlers, never while a passage or component renders.

## See

defineChat - Factory for creating a chat

## Constructors

### Constructor

> **new Chat**(`id`, `options`): `Chat`

Defined in: [chat.ts:301](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L301)

Creates a chat. Prefer [defineChat](../functions/defineChat.md).

#### Parameters

##### id

`string`

Unique, persistent identifier

##### options

[`ChatOptions`](../type-aliases/ChatOptions.md) = `{}`

Peer or participants, title, avatar, callbacks

#### Returns

`Chat`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [chat.ts:276](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L276)

Unique, persistent identifier.

***

### kind

> `readonly` **kind**: [`ChatKind`](../type-aliases/ChatKind.md)

Defined in: [chat.ts:279](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L279)

Whether this is a one-to-one chat or a group.

***

### maxEntries

> `readonly` **maxEntries**: `number`

Defined in: [chat.ts:285](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L285)

Upper bound on retained entries. `Infinity` when uncapped.

***

### peerId

> `readonly` **peerId**: `string` \| `undefined`

Defined in: [chat.ts:282](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L282)

The other participant of a direct chat.

## Accessors

### activeScript

#### Get Signature

> **get** **activeScript**(): [`Script`](../type-aliases/Script.md) \| `null`

Defined in: [chat.ts:488](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L488)

Script currently being played, or `null`.

##### Returns

[`Script`](../type-aliases/Script.md) \| `null`

***

### canReply

#### Get Signature

> **get** **canReply**(): `boolean`

Defined in: [chat.ts:424](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L424)

Whether a reply is possible at all.

##### Remarks

`false` in a read-only chat. A writable chat with nothing to answer right
now still reports `true` - check [Chat.pendingChoice](#pendingchoice) for that.

##### Returns

`boolean`

***

### entries

#### Get Signature

> **get** **entries**(): [`TranscriptEntry`](../type-aliases/TranscriptEntry.md)[]

Defined in: [chat.ts:378](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L378)

Delivered entries, oldest first.

##### Returns

[`TranscriptEntry`](../type-aliases/TranscriptEntry.md)[]

***

### firstUnreadKey

#### Get Signature

> **get** **firstUnreadKey**(): `string` \| `null`

Defined in: [chat.ts:388](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L388)

Key of the oldest unseen entry, or `null`.

##### Returns

`string` \| `null`

***

### isGroup

#### Get Signature

> **get** **isGroup**(): `boolean`

Defined in: [chat.ts:398](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L398)

Whether this chat has several members rather than one peer.

##### Returns

`boolean`

***

### lastEntry

#### Get Signature

> **get** **lastEntry**(): [`TranscriptEntry`](../type-aliases/TranscriptEntry.md) \| `null`

Defined in: [chat.ts:393](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L393)

Newest entry, or `null` when the transcript is empty.

##### Returns

[`TranscriptEntry`](../type-aliases/TranscriptEntry.md) \| `null`

***

### nextDueAt

#### Get Signature

> **get** **nextDueAt**(): `number` \| `null`

Defined in: [chat.ts:497](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L497)

Game time delivery is blocked until, or `null` when nothing is waiting.

##### Returns

`number` \| `null`

***

### participantCount

#### Get Signature

> **get** **participantCount**(): `number`

Defined in: [chat.ts:408](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L408)

How many members the group currently has.

##### Returns

`number`

***

### participants

#### Get Signature

> **get** **participants**(): `string`[]

Defined in: [chat.ts:403](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L403)

Current members, as contact ids.

##### Returns

`string`[]

***

### pendingChoice

#### Get Signature

> **get** **pendingChoice**(): [`PendingChoice`](../type-aliases/PendingChoice.md) \| `null`

Defined in: [chat.ts:504](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L504)

The reply the player is expected to pick, or `null`.

##### Returns

[`PendingChoice`](../type-aliases/PendingChoice.md) \| `null`

***

### readOnly

#### Get Signature

> **get** **readOnly**(): `boolean`

Defined in: [chat.ts:413](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L413)

Whether the player is structurally barred from replying.

##### Returns

`boolean`

***

### resolvedAvatar

#### Get Signature

> **get** **resolvedAvatar**(): `string` \| `undefined`

Defined in: [chat.ts:462](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L462)

Chat picture, or `undefined` when the chat has none.

##### Remarks

Resolution order: an in-fiction change (where `null` means the picture was
removed), then the definition's avatar, then the peer's avatar.

##### Returns

`string` \| `undefined`

***

### resolvedTitle

#### Get Signature

> **get** **resolvedTitle**(): `string`

Defined in: [chat.ts:435](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L435)

Title, resolved through the definition and the peer.

##### Remarks

Resolution order: an in-fiction rename, then the definition's title, then
the peer's name, then the chat id.

##### Returns

`string`

***

### typingContacts

#### Get Signature

> **get** **typingContacts**(): `string`[]

Defined in: [chat.ts:483](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L483)

Contacts currently shown as typing.

##### Returns

`string`[]

***

### unread

#### Get Signature

> **get** **unread**(): `number`

Defined in: [chat.ts:383](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L383)

Number of entries the player has not seen.

##### Returns

`number`

***

### vars

#### Get Signature

> **get** **vars**(): [`ChatVars`](../type-aliases/ChatVars.md)

Defined in: [chat.ts:365](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L365)

This chat's persisted state, materialized on first access.

##### Remarks

Use it from anything that writes. Read-only accessors go through
Chat.readVars instead, so merely looking at a chat - which is what
rendering does - never writes to the store.

##### Returns

[`ChatVars`](../type-aliases/ChatVars.md)

## Methods

### addParticipant()

> **addParticipant**(`contact`): `void`

Defined in: [chat.ts:759](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L759)

Adds a member and records an in-fiction notice.

#### Parameters

##### contact

Who joined

`string` | [`Contact`](../type-aliases/Contact.md)

#### Returns

`void`

***

### advance()

> **advance**(`count`): `void`

Defined in: [chat.ts:583](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L583)

Delivers up to `count` messages from the active script.

Stops early at a choice, at a `wait` or `typing` beat whose time has not
come, and at the end of the script. Control beats do not count towards
`count`.

#### Parameters

##### count

`number` = `1`

How many messages to deliver

#### Returns

`void`

#### Example

```typescript
h.actions([{ content: 'Read on', action: () => chat.advance() }]);
```

***

### choose()

> **choose**(`index`): `void`

Defined in: [chat.ts:640](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L640)

Logs the player's reply and continues.

#### Parameters

##### index

`number`

Which of [Chat.pendingChoice](#pendingchoice)'s options was picked

#### Returns

`void`

#### Throws

Error if the chat is read-only, nothing is pending, or the index
does not exist

#### Remarks

After the reply is logged, an option's `next` script is played and advanced,
an option's `next` function is called, and an option without `next` simply
continues the current script.

***

### clear()

> **clear**(): `void`

Defined in: [chat.ts:856](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L856)

Empties the transcript and resets every cursor.

#### Returns

`void`

#### Remarks

The cross-save seen record is untouched, because it describes what the
player has read across all playthroughs.

***

### deliverDue()

> **deliverDue**(): `void`

Defined in: [chat.ts:597](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L597)

Delivers everything that has become due, and clears expired typing
indicators.

#### Returns

`void`

#### Remarks

Idempotent: what is due is derived from the cursor and the clock, never
from a live timer. Call it when the game gains focus, when the player opens
the messenger, after moving the clock, or on an interval - a save loaded
long after a message was scheduled simply delivers it now.

***

### initialVars()

> **initialVars**(): [`ChatVars`](../type-aliases/ChatVars.md)

Defined in: [chat.ts:339](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L339)

The initial persisted state of this chat.

#### Returns

[`ChatVars`](../type-aliases/ChatVars.md)

#### Remarks

Pure: it creates no state and touches no store, so a component may use it
as a fallback while rendering a chat nothing has written to yet.

***

### isSeenEver()

> **isSeenEver**(`beatId`): `boolean`

Defined in: [chat.ts:537](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L537)

Whether the player has ever seen a script beat, across every save.

#### Parameters

##### beatId

`string`

#### Returns

`boolean`

#### Remarks

Backs "skip already-read text" and gallery unlocks. Call
`messenger.loadSeen()` during bootstrap before relying on it.

***

### markSeen()

> **markSeen**(): `void`

Defined in: [chat.ts:714](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L714)

Marks every entry as seen.

#### Returns

`void`

#### Remarks

This is the player-facing notion of "seen", not the in-fiction read
receipt. Beats that came from a script are also recorded in the cross-save
seen store.

***

### markSeenUpTo()

> **markSeenUpTo**(`key`): `void`

Defined in: [chat.ts:727](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L727)

Marks entries up to and including `key` as seen.

#### Parameters

##### key

`string`

Entry key to stop at

#### Returns

`void`

#### Remarks

Use this when the chat view knows how far the player actually scrolled.
An unknown key marks nothing.

***

### play()

> **play**(`script`): `void`

Defined in: [chat.ts:551](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L551)

Starts a script from its first beat.

#### Parameters

##### script

[`Script`](../type-aliases/Script.md)

The script to play

#### Returns

`void`

#### Throws

Error if the script is not registered

#### Remarks

Sets up the cursor without delivering anything, so the game decides when
the first message appears. Call [Chat.advance](#advance) next.

***

### push()

> **push**(`beat`): [`TranscriptEntry`](../type-aliases/TranscriptEntry.md)

Defined in: [chat.ts:624](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L624)

Appends a message outside of any script.

#### Parameters

##### beat

[`DeliverableBeatInput`](../type-aliases/DeliverableBeatInput.md)

A message, system, or custom beat built with `m`

#### Returns

[`TranscriptEntry`](../type-aliases/TranscriptEntry.md)

The appended entry

#### Throws

Error if the beat is a control beat, or carries content that cannot
be stored without a script behind it

#### Example

```typescript
chat.push(m.from(anna).text(m.t('anna.reminder')));
chat.push(m.player.text('on my way'));
chat.push(m.from(anna).text('look', { forwardedFrom: boris }));
```

***

### removeParticipant()

> **removeParticipant**(`contact`): `void`

Defined in: [chat.ts:785](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L785)

Removes a member and records an in-fiction notice.

#### Parameters

##### contact

Who left

`string` | [`Contact`](../type-aliases/Contact.md)

#### Returns

`void`

***

### rename()

> **rename**(`title`): `void`

Defined in: [chat.ts:812](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L812)

Renames the chat in-fiction.

#### Parameters

##### title

New title, or `undefined` to fall back to the definition

[`StaticText`](../type-aliases/StaticText.md) | `undefined`

#### Returns

`void`

***

### setAvatar()

> **setAvatar**(`src`): `void`

Defined in: [chat.ts:829](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L829)

Changes the chat picture in-fiction.

#### Parameters

##### src

New picture, `null` to remove it, or `undefined` to fall back
to the definition

`string` | `null` | `undefined`

#### Returns

`void`

***

### setReadOnly()

> **setReadOnly**(`readOnly`): `void`

Defined in: [chat.ts:845](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L845)

Opens or closes the chat for replies in-fiction.

#### Parameters

##### readOnly

`boolean`

Whether replies are barred

#### Returns

`void`

***

### setTyping()

> **setTyping**(`sender`, `ms`): `void`

Defined in: [chat.ts:747](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/chat.ts#L747)

Shows a typing indicator for `ms` of game time, without holding anything
back.

#### Parameters

##### sender

Who is typing

`string` | [`Contact`](../type-aliases/Contact.md)

##### ms

`number`

How long the indicator lasts, in game time

#### Returns

`void`
