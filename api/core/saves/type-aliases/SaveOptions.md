# Type Alias: SaveOptions

> **SaveOptions** = `object`

Defined in: [packages/core/src/saves/types.ts:62](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L62)

Player-facing annotations recorded alongside a save.

## Properties

### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/saves/types.ts:66](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L66)

Game-owned metadata - see [GameSave.meta](../interfaces/GameSave.md#meta)

***

### screenshot?

> `optional` **screenshot**: `string`

Defined in: [packages/core/src/saves/types.ts:68](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L68)

Base64 encoded screenshot

***

### title?

> `optional` **title**: `string`

Defined in: [packages/core/src/saves/types.ts:64](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L64)

Label to show in a slot list
