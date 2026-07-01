# Function: findMigrationPath()

> **findMigrationPath**(`fromVersion`, `toVersion`): [`SaveMigration`](../interfaces/SaveMigration.md)\<`GameSaveState`\>[] \| `null`

Defined in: [packages/core/src/saves/migrations/registry.ts:90](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/registry.ts#L90)

Finds the shortest migration path from one version to another using BFS.

This function builds a graph of all registered migrations and uses
breadth-first search to find the shortest sequence of migrations
needed to go from the source version to the target version.

## Parameters

### fromVersion

`string`

The starting version (e.g., "1.0.0")

### toVersion

`string`

The target version (e.g., "2.0.0")

## Returns

[`SaveMigration`](../interfaces/SaveMigration.md)\<`GameSaveState`\>[] \| `null`

Array of migrations to apply in order, or null if no path exists

## Example

```typescript
// Registered migrations: 1.0.0→1.1.0, 1.1.0→1.2.0, 1.2.0→2.0.0
const path = findMigrationPath("1.0.0", "2.0.0");
// Returns: [migration_1_0_to_1_1, migration_1_1_to_1_2, migration_1_2_to_2_0]
```
