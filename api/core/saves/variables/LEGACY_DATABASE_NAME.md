# Variable: LEGACY\_DATABASE\_NAME

> `const` **LEGACY\_DATABASE\_NAME**: `"-gamedb"` = `"-gamedb"`

Defined in: [packages/core/src/saves/legacy.ts:26](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/legacy.ts#L26)

Name of the database every game wrote to before `gameId` reached the storage
layer.

## Remarks

The database name was built from the configured `gameId`, but it was built
once, while the module was being imported - before `Game.init()` had applied
any options. Every game therefore resolved the default empty id and shared
this one database.
