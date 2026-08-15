# Function: createOrUpdateSystemSave()

> **createOrUpdateSystemSave**(`gameData`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:421](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/db.ts#L421)

Creates or updates the system save with the provided game data.

## Parameters

### gameData

`Record`\<`string`, `unknown`\>

The game state data to save as the system initial state.

## Returns

`Promise`\<`number`\>

A promise that resolves to the ID of the system save.
