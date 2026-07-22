# Interface: MigrationResult\<T\>

Defined in: [packages/core/src/saves/migrations/types.ts:155](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/types.ts#L155)

Result of running a migration chain.

## Examples

```typescript
const result: MigrationResult = runMigrations(oldSave, "1.0.0", "2.0.0");
if (result.success) {
  console.log("Migrated data:", result.data);
  console.log("Applied migrations:", result.migrationsApplied);
} else {
  console.error("Migration failed:", result.error);
}
```

Type-safe migration result:
```typescript
type NewSaveFormat = {
  player: { stats: { health: number; mana: number } }
} & Record<string, unknown>;

const result: MigrationResult<NewSaveFormat> = runMigrations(oldSave, "1.0.0", "2.0.0");
if (result.success && result.data) {
  // TypeScript knows about the new structure
  console.log(result.data.player.stats.health);
}
```

## Type Parameters

### T

`T` *extends* `GameSaveState` = `GameSaveState`

The type of the migrated data. Should match the target version's
              save state structure. Defaults to GameSaveState.

## Properties

### data?

> `optional` **data**: `T`

Defined in: [packages/core/src/saves/migrations/types.ts:164](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/types.ts#L164)

The migrated data (if successful)

***

### error?

> `optional` **error**: `string`

Defined in: [packages/core/src/saves/migrations/types.ts:169](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/types.ts#L169)

Error message (if failed)

***

### migrationsApplied

> **migrationsApplied**: `object`[]

Defined in: [packages/core/src/saves/migrations/types.ts:174](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/types.ts#L174)

List of migrations that were applied, in order

#### description

> **description**: `string`

#### from

> **from**: `string`

#### to

> **to**: `string`

***

### success

> **success**: `boolean`

Defined in: [packages/core/src/saves/migrations/types.ts:159](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/types.ts#L159)

Whether the migration was successful
