# Function: validateMigrations()

> **validateMigrations**(`latestVersion`): `object`

Defined in: [packages/core/src/saves/migrations/registry.ts:169](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/core/src/saves/migrations/registry.ts#L169)

Validates that the migration registry forms a valid chain.

Checks for:
- Orphaned migrations (from versions with no incoming migrations)
- Dead ends (to versions with no outgoing migrations, except latest)
- Duplicate migrations

## Parameters

### latestVersion

`string`

The current/latest version of the game

## Returns

`object`

Validation result with any issues found

### issues

> **issues**: `string`[]

### valid

> **valid**: `boolean`
