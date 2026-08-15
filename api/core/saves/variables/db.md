# Variable: db

> `const` **db**: [`GameDatabase`](../classes/GameDatabase.md)

Defined in: [packages/core/src/saves/db.ts:102](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/db.ts#L102)

The current game's database.

## Remarks

Every property access resolves through [getDatabase](../functions/getDatabase.md), so this reflects
the `gameId` that is configured at the moment it is used rather than the one
present when the module was imported.
