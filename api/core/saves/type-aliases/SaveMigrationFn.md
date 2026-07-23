# Type Alias: SaveMigrationFn()\<T\>

> **SaveMigrationFn**\<`T`\> = (`data`) => `T`

Defined in: [packages/core/src/saves/migrations/types.ts:47](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/migrations/types.ts#L47)

A function that migrates game save data from one version to another.

Migration functions should be pure (no side effects) and should always
return a new object rather than mutating the input.

## Type Parameters

### T

`T` *extends* `MigrationGameSaveState` = `GameSaveState`

The shape of the game save state for this migration. Can be a partial
              type if the migration only touches specific fields. Defaults to GameSaveState.

## Parameters

### data

`T`

The game save state at the source version

## Returns

`T`

The migrated game save state at the target version

## Examples

Basic migration without specific types:
```typescript
const migrateFn: SaveMigrationFn = (data) => {
  return {
    ...data,
    player: {
      ...data.player,
      health: data.player.hp ?? 100, // Rename hp to health
    }
  };
};
```

Type-safe migration with specific field types:
```typescript
const migrateFn: SaveMigrationFn<{ player?: { inventory: string[] } }> = (data) => {
  const player = data.player || {};
  return {
    ...data,
    player: {
      ...player,
      inventory: [], // TypeScript knows this should be string[]
    }
  };
};
```
