# Function: createOrUpdateSystemSave()

> **createOrUpdateSystemSave**(`gameData`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:274](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/saves/db.ts#L274)

Creates or updates the system save with the provided game data.

## Parameters

### gameData

`Record`\<`string`, `unknown`\>

The game state data to save as the system initial state.

## Returns

`Promise`\<`number`\>

A promise that resolves to the ID of the system save.
