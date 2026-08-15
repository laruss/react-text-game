# Variable: db

> `const` **db**: [`GameDatabase`](../classes/GameDatabase.md)

Defined in: [packages/core/src/saves/db.ts:102](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/db.ts#L102)

The current game's database.

## Remarks

Every property access resolves through [getDatabase](../functions/getDatabase.md), so this reflects
the `gameId` that is configured at the moment it is used rather than the one
present when the module was imported.
