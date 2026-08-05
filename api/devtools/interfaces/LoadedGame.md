# Interface: LoadedGame

Defined in: [loadEntry.ts:43](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/loadEntry.ts#L43)

What importing a game's modules reveals about its saves.

## Properties

### migrations

> **migrations**: [`RegisteredMigration`](RegisteredMigration.md)[]

Defined in: [loadEntry.ts:47](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/loadEntry.ts#L47)

Every migration the imported modules registered.

***

### schema

> **schema**: [`SaveSchema`](SaveSchema.md)

Defined in: [loadEntry.ts:45](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/loadEntry.ts#L45)

Current save shape, captured from the registered entities and passages.

***

### versionSource

> **versionSource**: [`VersionSource`](../type-aliases/VersionSource.md)

Defined in: [loadEntry.ts:49](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/loadEntry.ts#L49)

Where [SaveSchema.gameVersion](SaveSchema.md#gameversion) was taken from.
