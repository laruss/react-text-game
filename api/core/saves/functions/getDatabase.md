# Function: getDatabase()

> **getDatabase**(): [`GameDatabase`](../classes/GameDatabase.md)

Defined in: [packages/core/src/saves/db.ts:90](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/db.ts#L90)

Get the database instance for the game currently configured in options.

## Returns

[`GameDatabase`](../classes/GameDatabase.md)

GameDatabase instance for the current game

## Remarks

Always call this at the point of use. Resolving the database once, at module
scope, would capture the default empty `gameId`: options are applied by
`Game.init()`, which runs after every module has been imported.
