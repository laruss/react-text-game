# Function: loadGameIntoState()

> **loadGameIntoState**(`slot`): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useLoadGame.ts:18](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useLoadGame.ts#L18)

Loads the save in a slot, applying migrations when it predates the current
game version.

## Parameters

### slot

Slot to load, *not* the save's database id

`string` | `number`

## Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

The outcome of the load

## Remarks

Shared by [useLoadGame](useLoadGame.md) and `useLastLoadGame` so that both paths into a
save run the same migrations.
