# Function: saveGame()

> **saveGame**(`name`, `gameData`, `description?`, `screenshot?`): `Promise`\<`number`\>

Defined in: [packages/core/src/saves/db.ts:86](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/db.ts#L86)

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

## Returns

`Promise`\<`number`\>

Promise<number> - The ID of the save
