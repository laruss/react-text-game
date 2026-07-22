# Function: runMigrations()

> **runMigrations**(`data`, `fromVersion`, `toVersion`, `options`): [`MigrationResult`](../interfaces/MigrationResult.md)

Defined in: [packages/core/src/saves/migrations/runner.ts:32](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/migrations/runner.ts#L32)

Runs the migration chain to migrate save data from one version to another.

This function:
1. Finds the shortest migration path using BFS
2. Applies each migration in sequence
3. Returns the migrated data or error information

## Parameters

### data

`GameSaveState`

The save data to migrate

### fromVersion

`string`

The version the save was created with

### toVersion

`string`

The target version to migrate to (usually current game version)

### options

[`MigrationOptions`](../interfaces/MigrationOptions.md) = `{}`

Migration behavior options

## Returns

[`MigrationResult`](../interfaces/MigrationResult.md)

Migration result with success status and migrated data

## Example

```typescript
const result = runMigrations(oldSaveData, "1.0.0", "2.0.0");
if (result.success) {
  console.log("Migrated data:", result.data);
} else {
  console.error("Migration failed:", result.error);
}
```
