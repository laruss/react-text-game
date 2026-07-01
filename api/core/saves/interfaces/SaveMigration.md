# Interface: SaveMigration\<T\>

Defined in: [packages/core/src/saves/migrations/types.ts:93](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L93)

Defines a migration from one game version to another.

Migrations are registered by developers when they make breaking changes
to the game save structure. The migration system will automatically
chain migrations together to migrate saves from any old version to the
current version.

## Examples

Basic migration without specific types:
```typescript
const migration: SaveMigration = {
  from: "1.0.0",
  to: "1.1.0",
  description: "Added inventory system",
  migrate: (save) => ({ ...save, inventory: [] })
};
```

Type-safe migration with specific field types:
```typescript
const migration: SaveMigration<{ player?: { inventory: string[] } }> = {
  from: "1.0.0",
  to: "1.1.0",
  description: "Added inventory system",
  migrate: (save) => {
    const player = save.player || {};
    return {
      ...save,
      player: {
        ...player,
        inventory: [], // TypeScript validates the type
      }
    };
  }
};
```

## Type Parameters

### T

`T` *extends* `MigrationGameSaveState` = `GameSaveState`

The shape of the game save state for this migration. Can be a partial
              type if the migration only touches specific fields. Defaults to GameSaveState.
              Using specific types provides better type safety and IDE autocomplete.

## Properties

### description

> **description**: `string`

Defined in: [packages/core/src/saves/migrations/types.ts:115](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L115)

Human-readable description of what this migration does.
Used for logging and debugging.

#### Examples

```ts
"Added player inventory system"
```

```ts
"Renamed 'hp' field to 'health'"
```

***

### from

> **from**: `string`

Defined in: [packages/core/src/saves/migrations/types.ts:100](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L100)

The source version this migration starts from.
Should be a valid semver string (e.g., "1.0.0", "1.2.3")

***

### migrate

> **migrate**: [`SaveMigrationFn`](../type-aliases/SaveMigrationFn.md)\<`T`\>

Defined in: [packages/core/src/saves/migrations/types.ts:121](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L121)

The migration function that transforms the data.
Should be pure and not mutate the input.

***

### to

> **to**: `string`

Defined in: [packages/core/src/saves/migrations/types.ts:106](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L106)

The target version this migration migrates to.
Should be a valid semver string (e.g., "1.1.0", "2.0.0")
