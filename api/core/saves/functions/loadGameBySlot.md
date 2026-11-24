# Function: loadGameBySlot()

> **loadGameBySlot**(`slot`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:292](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/saves/db.ts#L292)

Load a game save by its exact slot key, including reserved ones

## Parameters

### slot

`string`

Slot key of the save to load

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if not found
