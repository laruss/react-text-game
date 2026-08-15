# Interface: GameSave

Defined in: [packages/core/src/saves/types.ts:4](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L4)

Represents a saved game state

## Properties

### gameData

> **gameData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/saves/types.ts:17](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L17)

Serialized game state data

***

### id?

> `optional` **id**: `number`

Defined in: [packages/core/src/saves/types.ts:6](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L6)

Database auto-generated ID. Never use it to address a slot - see [GameSave.slot](#slot).

***

### isSystemSave?

> `optional` **isSystemSave**: `boolean`

Defined in: [packages/core/src/saves/types.ts:56](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L56)

Mark as system save (won't be shown in UI)

***

### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/saves/types.ts:54](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L54)

Free-form annotation owned by the game (optional).

#### Remarks

The engine stores and returns it untouched, and save migrations never
see it. That is what makes it safe to render a slot list from: it stays
readable even when the [GameSave.gameData](#gamedata) beside it was written by
an older version and has not been migrated yet.

#### Example

```ts
slot.save({ title: "Before the boss", meta: { day: 3, place: "flat" } });
```

***

### screenshot?

> `optional` **screenshot**: `string`

Defined in: [packages/core/src/saves/types.ts:37](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L37)

Base64 encoded screenshot (optional).

#### Remarks

The engine never produces one - capturing the screen is the host's job.
Pass it through [SaveOptions.screenshot](../type-aliases/SaveOptions.md#screenshot) to fill it.

***

### slot

> **slot**: `string`

Defined in: [packages/core/src/saves/types.ts:15](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L15)

Slot the save occupies, as a string.

#### Remarks

This is the key every slot-addressed function takes: `loadGame`,
`deleteSave`, `updateSave` and the `useSaveSlots` actions all match on it.
It is *not* [GameSave.id](#id), which is the database's own primary key.

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/core/src/saves/types.ts:27](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L27)

When the run was captured.

#### Remarks

Set once, when the state is written. Editing a save's label through
`updateSave` leaves it alone, and importing a save file restores the
timestamp the save was taken with, so ordering by it survives a round
trip through a file.

***

### title?

> `optional` **title**: `string`

Defined in: [packages/core/src/saves/types.ts:39](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L39)

Player-facing label for the save (optional)

***

### version

> **version**: `string`

Defined in: [packages/core/src/saves/types.ts:29](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L29)

Game version when the save was created
