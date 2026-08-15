# Function: loadGame()

> **loadGame**(`slot`): `Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Defined in: [packages/core/src/saves/db.ts:279](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/db.ts#L279)

Load the save occupying a slot

## Parameters

### slot

Slot to read, *not* [GameSave.id](../interfaces/GameSave.md#id)

`string` | `number`

## Returns

`Promise`\<[`GameSave`](../interfaces/GameSave.md) \| `undefined`\>

Promise<GameSave | undefined> - The save data or undefined if the slot is empty
