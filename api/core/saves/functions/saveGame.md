# Function: saveGame()

> **saveGame**(`slot`, `gameData`, `options`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:120](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/db.ts#L120)

Save game data to the database

## Parameters

### slot

Slot the save occupies (e.g., a slot number or custom key)

`string` | `number`

### gameData

`Record`\<`string`, `unknown`\>

Game state data to save

### options

[`SaveOptions`](../type-aliases/SaveOptions.md) & `object` = `{}`

Player-facing annotations and, for restores, the version to
stamp the save with. `version` defaults to the current game version; pass the
original when restoring a save created by an older build, otherwise
migrations will never run for it.

## Returns

`Promise`\<`number`\>

Promise<number> - The ID of the save
