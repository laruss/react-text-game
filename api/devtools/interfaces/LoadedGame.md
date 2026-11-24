# Interface: LoadedGame

Defined in: [loadEntry.ts:43](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/devtools/src/loadEntry.ts#L43)

What importing a game's modules reveals about its saves.

## Properties

### migrations

> **migrations**: [`RegisteredMigration`](RegisteredMigration.md)[]

Defined in: [loadEntry.ts:47](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/devtools/src/loadEntry.ts#L47)

Every migration the imported modules registered.

***

### schema

> **schema**: [`SaveSchema`](SaveSchema.md)

Defined in: [loadEntry.ts:45](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/devtools/src/loadEntry.ts#L45)

Current save shape, captured from the registered entities and passages.

***

### versionSource

> **versionSource**: [`VersionSource`](../type-aliases/VersionSource.md)

Defined in: [loadEntry.ts:49](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/devtools/src/loadEntry.ts#L49)

Where [SaveSchema.gameVersion](SaveSchema.md#gameversion) was taken from.
