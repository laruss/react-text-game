# Function: migrateLegacySaves()

> **migrateLegacySaves**(): `Promise`\<\{ `saves`: `number`; `settings`: `number`; \}\>

Defined in: [packages/core/src/saves/legacy.ts:146](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/legacy.ts#L146)

Copies saves and settings out of the shared pre-`gameId` database on first
open.

## Returns

`Promise`\<\{ `saves`: `number`; `settings`: `number`; \}\>

How many saves and settings were copied

## Remarks

Fixing the database name alone would strand every existing player: their
saves stay in [LEGACY\_DATABASE\_NAME](../variables/LEGACY_DATABASE_NAME.md) while the game opens an empty
`<gameId>-gamedb`. This copies them across once, and only into a database
that holds no player saves of its own, so it can never overwrite newer
progress. The legacy database is left in place - recovering data is easier
than un-deleting it.

Called by `Game.init()` before anything reads storage. Safe to call again:
the copy is recorded in a setting and skipped afterwards.
