# Function: updateSave()

> **updateSave**(`slot`, `changes`): `Promise`\<`boolean`\>

Defined in: [packages/core/src/saves/db.ts:183](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/db.ts#L183)

Edit a save's annotations without recapturing the game state.

## Parameters

### slot

Slot of the save to edit

`string` | `number`

### changes

[`SaveUpdate`](../type-aliases/SaveUpdate.md)

Fields to write. Only the keys carrying a value are touched.

## Returns

`Promise`\<`boolean`\>

Promise<boolean> - Whether a save occupied that slot

## Remarks

Unlike [saveGame](saveGame.md) this leaves `timestamp` alone, so renaming a save
does not move it to the top of a list ordered by recency.
