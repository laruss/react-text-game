# Type Alias: SaveSlotsData

> **SaveSlotsData** = `object`

Defined in: [packages/core/src/saves/types.ts:42](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L42)

Represents the state of save slots, used by React hooks

## Properties

### data

> **data**: [`GameSave`](../interfaces/GameSave.md)[]

Defined in: [packages/core/src/saves/types.ts:52](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L52)

Array of game saves

***

### error

> **error**: `Error` \| `null`

Defined in: [packages/core/src/saves/types.ts:50](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L50)

Error object if an error occurred

***

### isEmpty

> **isEmpty**: `boolean`

Defined in: [packages/core/src/saves/types.ts:44](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L44)

Whether there are no saves

***

### isError

> **isError**: `boolean`

Defined in: [packages/core/src/saves/types.ts:48](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L48)

Whether there was an error loading saves

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/core/src/saves/types.ts:46](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/types.ts#L46)

Whether saves are currently being loaded
