# Function: loadGame()

> **loadGame**(`id`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:139](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/core/src/saves/db.ts#L139)

Load game data from the database

## Parameters

### id

`number`

ID of the save to load

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if not found
