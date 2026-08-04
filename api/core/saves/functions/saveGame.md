# Function: saveGame()

> **saveGame**(`name`, `gameData`, `description?`, `screenshot?`, `version?`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:89](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/saves/db.ts#L89)

Save game data to the database

## Parameters

### name

Name of the save (e.g., slot number or custom name)

`string` | `number`

### gameData

`Record`\<`string`, `unknown`\>

Game state data to save

### description?

`string`

Optional description

### screenshot?

`string`

Optional base64 encoded screenshot

### version?

`string`

Version to stamp the save with. Defaults to the current game
version. Pass the original version when restoring a save that was created by
an older build, otherwise migrations will never run for it.

## Returns

`Promise`\<`number`\>

Promise<number> - The ID of the save
