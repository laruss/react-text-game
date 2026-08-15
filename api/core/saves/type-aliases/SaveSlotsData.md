# Type Alias: SaveSlotsData

> **SaveSlotsData** = `object`

Defined in: [packages/core/src/saves/types.ts:139](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L139)

Represents the state of save slots, used by React hooks

## Properties

### data

> **data**: [`GameSave`](../interfaces/GameSave.md)[]

Defined in: [packages/core/src/saves/types.ts:149](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L149)

Array of game saves

***

### error

> **error**: `Error` \| `null`

Defined in: [packages/core/src/saves/types.ts:147](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L147)

Error object if an error occurred

***

### isEmpty

> **isEmpty**: `boolean`

Defined in: [packages/core/src/saves/types.ts:141](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L141)

Whether there are no saves

***

### isError

> **isError**: `boolean`

Defined in: [packages/core/src/saves/types.ts:145](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L145)

Whether there was an error loading saves

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/core/src/saves/types.ts:143](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L143)

Whether saves are currently being loaded
