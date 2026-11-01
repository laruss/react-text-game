# Function: loadGameBySlot()

> **loadGameBySlot**(`slot`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:292](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/saves/db.ts#L292)

Load a game save by its exact slot key, including reserved ones

## Parameters

### slot

`string`

Slot key of the save to load

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if not found
