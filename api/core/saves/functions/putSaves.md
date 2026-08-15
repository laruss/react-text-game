# Function: putSaves()

> **putSaves**(`saves`, `mode`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:221](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/db.ts#L221)

Write whole save records, preserving the timestamp and version each one
carries.

## Parameters

### saves

[`GameSave`](../interfaces/GameSave.md)[]

Records to write

### mode

`"replace"` clears the player's other saves first, `"merge"`
keeps them and overwrites only the slots being written

`"replace"` | `"merge"`

## Returns

`Promise`\<`number`\>

Promise<number> - How many records were written

## Remarks

This is the restore path, and the counterpart to [saveGame](saveGame.md): it takes
saves that already exist rather than capturing the current run. In
`"replace"` mode the wipe and the writes share one transaction, so a failure
partway through leaves the existing saves untouched instead of destroying
them. The system save is never replaced.
