# Function: createOrUpdateSystemSave()

> **createOrUpdateSystemSave**(`gameData`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:278](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/saves/db.ts#L278)

Creates or updates the system save with the provided game data.

## Parameters

### gameData

`Record`\<`string`, `unknown`\>

The game state data to save as the system initial state.

## Returns

`Promise`\<`number`\>

A promise that resolves to the ID of the system save.
