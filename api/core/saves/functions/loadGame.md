# Function: loadGame()

> **loadGame**(`id`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:135](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/core/src/saves/db.ts#L135)

Load game data from the database

## Parameters

### id

`number`

ID of the save to load

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if not found
