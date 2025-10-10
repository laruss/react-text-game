# Save Migration System

A complete solution for versioning and migrating game saves in your text game engine.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Usage Guide](#usage-guide)
- [Semantic Versioning Strategy](#semantic-versioning-strategy)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The migration system allows you to make changes to your game's save structure while maintaining compatibility with existing player saves. When a player loads an old save, the system automatically applies registered migrations to bring the save data up to date.

### Key Features

- ✅ **Automatic**: Migrations run automatically when loading saves
- ✅ **Sequential**: Migrates step-by-step through version history (safer than big jumps)
- ✅ **Testable**: Each migration is a pure function
- ✅ **Transparent**: Logs what migrations were applied
- ✅ **Safe**: Validates migration chain in dev mode
- ✅ **Simple**: Just 1 function per breaking change

## Quick Start

### 1. Register Migrations

When you make a breaking change to your save structure, register a migration:

```typescript
import { registerMigration } from '@react-text-game/core/saves';

// After updating your game version to 1.1.0
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added player inventory system",
  migrate: (save) => ({
    ...save,
    player: {
      ...save.player,
      inventory: [] // Add default value for new field
    }
  })
});
```

### 2. That's It!

Migrations are automatically applied when players load their saves. No additional code needed!

## How It Works

### Migration Chain

When a player loads a save from an older version, the system:

1. **Detects** the version difference
2. **Finds** the shortest migration path using BFS
3. **Applies** each migration sequentially
4. **Validates** the result
5. **Loads** the migrated data

Example migration chain:
```
Save v1.0.0 → Migration(1.0.0→1.1.0) → Migration(1.1.0→1.2.0) → Migration(1.2.0→2.0.0) → Current v2.0.0
```

### Validation

In **dev mode**, the system validates your migration chain on startup:
- Checks for orphaned versions
- Ensures all base versions can reach the current version
- Warns about dead ends

## Usage Guide

### Where to Register Migrations

Register migrations **after** `Game.init()` in your game's entry point:

```typescript
// src/index.tsx or src/App.tsx

import { Game, registerMigration } from '@react-text-game/core';

async function initGame() {
  await Game.init({
    gameName: "My Adventure Game",
    gameVersion: "2.0.0", // Your current version
    isDevMode: import.meta.env.DEV
  });

  // Register all your migrations
  registerMigration({
    from: "1.0.0",
    to: "1.1.0",
    description: "Added inventory",
    migrate: addInventorySystem
  });

  registerMigration({
    from: "1.1.0",
    to: "2.0.0",
    description: "Renamed 'hp' to 'health'",
    migrate: renameHpToHealth
  });
}
```

### Migration Functions

Migrations should be **pure functions** that don't mutate the input:

```typescript
// ✅ GOOD: Returns new object
const migrate = (save) => ({
  ...save,
  newField: "default value"
});

// ❌ BAD: Mutates input
const migrate = (save) => {
  save.newField = "default value";
  return save;
};
```

### Type Safety with Generic Types

The migration system supports TypeScript generics for improved type safety. You can specify the exact shape of your save data for each migration, which provides:

- **Better IDE autocomplete** when working with save data fields
- **Compile-time type checking** for migration logic
- **Self-documenting code** showing what fields the migration affects

#### Using Generic Types

```typescript
// Define the shape of data this migration works with
interface PlayerInventoryData {
  player?: {
    inventory: string[];
  };
}

// Use the generic type parameter
registerMigration<PlayerInventoryData>({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added player inventory",
  migrate: (save) => {
    const player = save.player || {};
    return {
      ...save,
      player: {
        ...player,
        inventory: [], // TypeScript knows this should be string[]
      }
    };
  }
});
```

#### When to Use Generics

**✅ Use generics when:**
- Working with complex nested data structures
- The migration logic is non-trivial
- You want IDE autocomplete for specific fields
- Type safety would help prevent bugs

**⚠️ Optional for:**
- Simple migrations (adding a top-level field)
- One-line transformations
- Migrations where types are obvious

```typescript
// Simple migration - generics optional
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Add settings",
  migrate: (save) => ({ ...save, settings: {} })
});

// Complex migration - generics recommended
interface OldInventoryFormat {
  inventory?: string[];
}

registerMigration<OldInventoryFormat>({
  from: "1.0.0",
  to: "2.0.0",
  description: "Convert inventory to objects",
  migrate: (save) => {
    const items = (save.inventory || []).map((name, i) => ({
      id: `item_${i}`,
      name,
      quantity: 1
    }));
    return { ...save, inventory: items };
  }
});
```

## Semantic Versioning Strategy

Follow [semver](https://semver.org/) to communicate the impact of changes:

| Version Change | Migration? | Example |
|----------------|------------|---------|
| **Patch** (`1.0.0` → `1.0.1`) | ❌ No | Bug fixes, no save structure changes |
| **Minor** (`1.0.0` → `1.1.0`) | ⚠️ Optional | New optional fields with defaults |
| **Major** (`1.0.0` → `2.0.0`) | ✅ Required | Breaking changes, removed/renamed fields |

### When to Register a Migration

Register a migration when you:
- ✅ Add a new required field
- ✅ Rename or remove a field
- ✅ Change the structure of existing data
- ✅ Change data types (string → number)
- ❌ Fix a bug (no migration needed)
- ❌ Add a new passage or entity (no migration needed)

## Best Practices

### 1. Use Descriptive Descriptions

```typescript
// ✅ GOOD
description: "Renamed 'hp' field to 'health' in player object"

// ❌ BAD
description: "Updated player"
```

### 2. Provide Sensible Defaults

```typescript
migrate: (save) => ({
  ...save,
  player: {
    ...save.player,
    inventory: [], // Empty array for new players
    gold: 0,       // Start with 0 gold
    level: 1       // Default level
  }
})
```

### 3. Handle Optional Fields

```typescript
migrate: (save) => {
  const player = save.player as any;
  return {
    ...save,
    player: {
      ...player,
      // Use existing value if present, otherwise default
      health: player.hp ?? player.health ?? 100
    }
  };
};
```

### 4. Test Your Migrations

```typescript
import { runMigrations } from '@react-text-game/core/saves';

describe('Save Migrations', () => {
  it('should migrate from 1.0.0 to 1.1.0', () => {
    const oldSave = {
      player: { name: "Hero" }
    };

    const result = runMigrations(oldSave, "1.0.0", "1.1.0");

    expect(result.success).toBe(true);
    expect(result.data.player.inventory).toEqual([]);
  });
});
```

### 5. Keep Migrations Simple

One migration = one logical change:

```typescript
// ✅ GOOD: One clear change
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added inventory",
  migrate: (save) => ({ ...save, inventory: [] })
});

// ❌ BAD: Multiple unrelated changes
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added inventory, renamed hp, changed level system",
  migrate: (save) => { /* complex changes */ }
});
```

## API Reference

### `registerMigration<T>(migration: SaveMigration<T>)`

Registers a migration function.

**Type Parameters:**
- `T` - Optional generic type specifying the shape of the save data this migration operates on. Extends `MigrationGameSaveState` (which is `Partial<GameSaveState> & Record<string, unknown>`). Defaults to `GameSaveState`.

**Parameters:**
- `migration.from` - Source version (e.g., `"1.0.0"`)
- `migration.to` - Target version (e.g., `"1.1.0"`)
- `migration.description` - Human-readable description
- `migration.migrate` - Pure function that transforms the data

**Throws:** Error if migration already registered for the same from→to path.

**Example:**
```typescript
// With generic type for type safety
interface MyData { player?: { inventory: string[] } }
registerMigration<MyData>({
  from: "1.0.0",
  to: "1.1.0",
  description: "Add inventory",
  migrate: (save) => ({ ...save, player: { ...save.player, inventory: [] } })
});

// Without generic type (uses default GameSaveState)
registerMigration({
  from: "1.1.0",
  to: "1.2.0",
  description: "Add quests",
  migrate: (save) => ({ ...save, quests: [] })
});
```

### `findMigrationPath(from: string, to: string): SaveMigration[] | null`

Finds the shortest migration path between two versions.

**Returns:** Array of migrations to apply, or `null` if no path exists.

### `runMigrations<T>(data, from, to, options?): MigrationResult<T>`

Runs a migration chain.

**Type Parameters:**
- `T` - Optional generic type for the expected result data structure. Defaults to `GameSaveState`.

**Parameters:**
- `data` - The save data to migrate
- `from` - Source version (e.g., `"1.0.0"`)
- `to` - Target version (e.g., `"2.0.0"`)
- `options?` - Optional migration options

**Options:**
- `strict?: boolean` - Throw error if no path found (default: `false`)
- `verbose?: boolean` - Log migration steps (default: dev mode setting)

**Returns:** `MigrationResult<T>` with the following structure:
```typescript
{
  success: boolean;
  data?: T;                    // Migrated data (if successful), defaults to GameSaveState
  error?: string;              // Error message (if failed)
  migrationsApplied: Array<{   // List of applied migrations
    from: string;
    to: string;
    description: string;
  }>;
}
```

**Examples:**
```typescript
// Basic usage without type parameter
const result = runMigrations(oldSave, "1.0.0", "2.0.0");
if (result.success) {
  console.log("Migration successful:", result.data);
}

// Type-safe usage with expected result structure
type NewSaveFormat = {
  player: { stats: { health: number; mana: number } }
} & Record<string, unknown>;

const result = runMigrations<NewSaveFormat>(oldSave, "1.0.0", "2.0.0");
if (result.success && result.data) {
  // TypeScript knows the structure of result.data
  console.log("Health:", result.data.player.stats.health);
}
```

### `validateMigrations(latestVersion: string)`

Validates the migration chain.

**Returns:**
```typescript
{
  valid: boolean;
  issues: string[];  // List of validation issues
}
```

## Examples

### Example 1: Adding a New Field

```typescript
// Game v1.1.0: Added inventory system
registerMigration({
  from: "1.0.0",
  to: "1.1.0",
  description: "Added player inventory",
  migrate: (save) => ({
    ...save,
    player: {
      ...save.player,
      inventory: []
    }
  })
});
```

### Example 2: Renaming a Field

```typescript
// Game v1.2.0: Renamed 'hp' to 'health'
registerMigration({
  from: "1.1.0",
  to: "1.2.0",
  description: "Renamed 'hp' to 'health'",
  migrate: (save) => {
    const { hp, ...playerRest } = save.player as any;
    return {
      ...save,
      player: {
        ...playerRest,
        health: hp ?? 100 // Use existing hp or default to 100
      }
    };
  }
});
```

### Example 3: Restructuring Data

```typescript
// Game v2.0.0: Split player stats into separate object
registerMigration({
  from: "1.2.0",
  to: "2.0.0",
  description: "Restructured player stats",
  migrate: (save) => {
    const player = save.player as any;
    return {
      ...save,
      player: {
        name: player.name,
        stats: {
          health: player.health,
          mana: player.mana,
          strength: player.strength
        }
      }
    };
  }
});
```

### Example 4: Complex Migration Chain

```typescript
// Registering multiple migrations for a complex update path
const migrations = [
  {
    from: "1.0.0",
    to: "1.1.0",
    description: "Added inventory",
    migrate: addInventory
  },
  {
    from: "1.1.0",
    to: "1.2.0",
    description: "Added quest system",
    migrate: addQuests
  },
  {
    from: "1.2.0",
    to: "2.0.0",
    description: "Complete game redesign",
    migrate: redesignGame
  }
];

migrations.forEach(registerMigration);

// A player with save v1.0.0 will automatically go through:
// 1.0.0 → 1.1.0 → 1.2.0 → 2.0.0
```

## Troubleshooting

### "No migration path found"

**Problem:** No registered migrations connect the save version to the current version.

**Solution:** Register missing migrations to complete the chain.

```typescript
// If you have migrations 1.0.0→1.1.0 and 1.2.0→2.0.0
// You need to add 1.1.0→1.2.0 to complete the chain

registerMigration({
  from: "1.1.0",
  to: "1.2.0",
  description: "Bridge version",
  migrate: (save) => save // No changes needed
});
```

### "Dead end detected"

**Problem:** A version has incoming migrations but no outgoing migrations to reach the current version.

**Solution:** Add a migration from the dead-end version to the next version.

### Migration Fails

**Problem:** A migration throws an error or returns invalid data.

**Debug:**
1. Check console for error details
2. Test the migration function in isolation
3. Verify the input data structure matches expectations

```typescript
// Add defensive checks
migrate: (save) => {
  if (!save.player) {
    console.error("Migration failed: save.player is undefined");
    return save; // Return unchanged if something is wrong
  }

  return {
    ...save,
    player: {
      ...save.player,
      inventory: []
    }
  };
}
```

### Dev Mode Warnings

In dev mode, you may see warnings about:
- **Orphaned versions**: Versions with no path to current version
- **Dead ends**: Versions that can't reach the current version
- **Missing migrations**: Gaps in the migration chain

These are helpful for catching migration issues before they affect players.

---

## Support

For issues or questions:
- Check the [main documentation](./README.md)
- Report bugs at [GitHub Issues](https://github.com/laruss/react-text-game/issues)
