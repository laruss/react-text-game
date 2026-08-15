# Type Alias: SaveUpdate

> **SaveUpdate** = `object`

Defined in: [packages/core/src/saves/types.ts:78](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L78)

Fields of an existing save that can be edited without recapturing state.

## Remarks

Only the keys carrying a value are written; the rest of the save is left
exactly as it was, `timestamp` included.

## Properties

### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/saves/types.ts:82](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L82)

Game-owned metadata - see [GameSave.meta](../interfaces/GameSave.md#meta)

***

### screenshot?

> `optional` **screenshot**: `string`

Defined in: [packages/core/src/saves/types.ts:84](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L84)

Base64 encoded screenshot

***

### title?

> `optional` **title**: `string`

Defined in: [packages/core/src/saves/types.ts:80](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L80)

Label to show in a slot list
