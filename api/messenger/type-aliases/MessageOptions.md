# Type Alias: MessageOptions

> **MessageOptions** = `object`

Defined in: [scripts/types.ts:30](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L30)

Options shared by every message beat.

## Properties

### forwardedFrom?

> `optional` **forwardedFrom**: [`ForwardOriginInput`](ForwardOriginInput.md)

Defined in: [scripts/types.ts:49](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L49)

Marks the message as forwarded from somewhere else.

#### Remarks

The source does not have to be a real message: a contact, an id, or a
free-form label all work.

***

### id?

> `optional` **id**: `string`

Defined in: [scripts/types.ts:40](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L40)

Explicit beat id.

#### Remarks

Beat ids default to `"<scriptId>:<index>"` using the beat's position in
the array as written, so conditional beats never shift them. Set an
explicit id when a beat needs to stay addressable across edits that
reorder the script.

***

### receipt?

> `optional` **receipt**: [`Receipt`](Receipt.md)

Defined in: [scripts/types.ts:52](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L52)

In-fiction delivery state shown to the player.
