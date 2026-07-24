# Function: createOrUpdateSystemSave()

> **createOrUpdateSystemSave**(`gameData`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:274](https://github.com/laruss/react-text-game/blob/a568b67a5a70142c4d99c081d8fed675aca313c3/packages/core/src/saves/db.ts#L274)

Creates or updates the system save with the provided game data.

## Parameters

### gameData

`Record`\<`string`, `unknown`\>

The game state data to save as the system initial state.

## Returns

`Promise`\<`number`\>

A promise that resolves to the ID of the system save.
