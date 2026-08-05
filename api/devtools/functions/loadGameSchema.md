# Function: loadGameSchema()

> **loadGameSchema**(`entryPath`, `gameVersion`): `Promise`\<[`LoadedGame`](../interfaces/LoadedGame.md)\>

Defined in: [loadEntry.ts:192](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/loadEntry.ts#L192)

Imports a game's modules and captures the shape of its saves.

## Parameters

### entryPath

`string`

Path to the module to import, absolute or relative to cwd

### gameVersion

Explicit version, taking precedence over every other
source. See [VersionSource](../type-aliases/VersionSource.md) for the fallback chain.

`string` | `null`

## Returns

`Promise`\<[`LoadedGame`](../interfaces/LoadedGame.md)\>

The captured schema, the registered migrations, and where the version
came from

## Remarks

Entities and passages register as a side effect of being imported, so this
only has to load the module and then ask the engine what it now knows. It
never calls `Game.init()`: initialization opens the IndexedDB save database,
which does not exist outside a browser.

Point `entryPath` at a module that registers entities and passages - typically
`src/game/registry.ts` - rather than at the React entry point.

## Throws

Error with actionable guidance if the module cannot be imported
