# Function: getDatabase()

> **getDatabase**(): [`GameDatabase`](../classes/GameDatabase.md)

Defined in: [packages/core/src/saves/db.ts:90](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/db.ts#L90)

Get the database instance for the game currently configured in options.

## Returns

[`GameDatabase`](../classes/GameDatabase.md)

GameDatabase instance for the current game

## Remarks

Always call this at the point of use. Resolving the database once, at module
scope, would capture the default empty `gameId`: options are applied by
`Game.init()`, which runs after every module has been imported.
