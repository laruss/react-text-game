# Function: loadGameByName()

> **loadGameByName**(`name`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:144](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/saves/db.ts#L144)

Load a game save by its name

## Parameters

### name

`string`

Name of the save to load

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if not found
