# Function: validateMigrations()

> **validateMigrations**(`latestVersion`): `object`

Defined in: [packages/core/src/saves/migrations/registry.ts:169](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/migrations/registry.ts#L169)

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
