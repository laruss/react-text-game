# Function: migrateToCurrentVersion()

> **migrateToCurrentVersion**(`data`, `fromVersion`, `options?`): [`MigrationResult`](../interfaces/MigrationResult.md)

Defined in: [packages/core/src/saves/migrations/runner.ts:184](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/migrations/runner.ts#L184)

Convenience function to migrate save data to the current game version.

## Parameters

### data

`GameSaveState`

The save data to migrate

### fromVersion

`string`

The version the save was created with

### options?

[`MigrationOptions`](../interfaces/MigrationOptions.md)

Migration behavior options

## Returns

[`MigrationResult`](../interfaces/MigrationResult.md)

Migration result

## Example

```typescript
const result = migrateToCurrentVersion(saveData, "1.0.0");
if (result.success) {
  Game.setState(result.data);
}
```
