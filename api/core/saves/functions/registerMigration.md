# Function: registerMigration()

> **registerMigration**(`migration`): `void`

Defined in: [packages/core/src/saves/migrations/registry.ts:38](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/saves/migrations/registry.ts#L38)

Registers a migration function for moving from one version to another.

Migrations should be registered during game initialization, typically in
your game's entry point after calling `Game.init()`.

## Parameters

### migration

[`SaveMigration`](../interfaces/SaveMigration.md)

The migration definition

## Returns

`void`

## Throws

Error if a migration with the same from->to path already exists

## Example

```typescript
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added player inventory",
  migrate: (data) => ({
    ...data,
    player: { ...data.player, inventory: [] }
  })
});
```
