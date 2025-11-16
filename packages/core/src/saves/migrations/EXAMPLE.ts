/**
 * EXAMPLE: Save Migration System Usage
 *
 * This file demonstrates how to use the save migration system in a real game.
 * It shows a complete migration history from version 1.0.0 to 3.0.0.
 */

import { registerMigration, SaveMigration } from "./index";

// ============================================================================
// MIGRATION HISTORY
// ============================================================================

/**
 * Version 1.0.0 → 1.1.0
 * Added: Inventory system
 *
 * In version 1.1.0, we added an inventory system to the game.
 * Players who saved in 1.0.0 don't have an inventory field,
 * so we add an empty array as the default.
 *
 * NOTE: This migration uses the generic type parameter to specify
 * the exact shape of the data it operates on. This provides:
 * - Better type safety when accessing save.player.inventory
 * - IDE autocomplete for the specific fields
 * - Compile-time validation of the migration logic
 */
const migration_1_0_to_1_1: SaveMigration<{
    player?: { inventory: string[] };
}> = {
    from: "1.0.0",
    to: "1.1.0",
    description: "Added player inventory system",
    migrate: (save) => {
        const player = save.player || {};
        return {
            ...save,
            player: {
                ...player,
                inventory: [],
            },
        };
    },
};

/**
 * Version 1.1.0 → 1.2.0
 * Added: Quest tracking system
 *
 * We added a quest system with active and completed quests.
 *
 * NOTE: This migration does NOT use the generic type parameter,
 * relying on the default GameSaveState type. This is fine for simple
 * migrations where type safety is less critical. Use generics when:
 * - You need type safety for complex nested structures
 * - You want IDE autocomplete for specific fields
 * - The migration logic is non-trivial and could benefit from type checking
 */
const migration_1_1_to_1_2: SaveMigration = {
    from: "1.1.0",
    to: "1.2.0",
    description: "Added quest tracking system",
    migrate: (save) => ({
        ...save,
        quests: {
            active: [],
            completed: [],
        },
    }),
};

/**
 * Version 1.2.0 → 2.0.0 (MAJOR VERSION)
 * Changed: Renamed 'hp' to 'health', 'mp' to 'mana'
 * Changed: Moved stats into a separate 'stats' object
 *
 * This is a breaking change that restructures how player stats are stored.
 */
const migration_1_2_to_2_0: SaveMigration = {
    from: "1.2.0",
    to: "2.0.0",
    description:
        "Restructured player stats: renamed hp→health, mp→mana, moved to stats object",
    migrate: (save) => {
        const player = save.player as Record<string, unknown>;

        return {
            ...save,
            player: {
                name: player.name,
                level: player.level ?? 1,
                experience: player.experience ?? 0,
                inventory: player.inventory ?? [],
                stats: {
                    health: player.hp ?? 100,
                    mana: player.mp ?? 50,
                    maxHealth: player.maxHp ?? 100,
                    maxMana: player.maxMp ?? 50,
                    strength: player.strength ?? 10,
                    intelligence: player.intelligence ?? 10,
                    agility: player.agility ?? 10,
                },
            },
        };
    },
};

/**
 * Version 2.0.0 → 2.1.0
 * Added: Skills system
 * Added: Player location tracking
 */
const migration_2_0_to_2_1: SaveMigration = {
    from: "2.0.0",
    to: "2.1.0",
    description: "Added skills system and location tracking",
    migrate: (save) => {
        const player = (save.player || {}) as Record<string, unknown>;
        return {
            ...save,
            player: {
                ...player,
                skills: {
                    combat: 1,
                    magic: 1,
                    crafting: 1,
                },
                location: {
                    passageId: "start",
                    zone: "village",
                },
            },
        };
    },
};

/**
 * Version 2.1.0 → 3.0.0 (MAJOR VERSION)
 * Changed: Completely redesigned inventory system
 * - Old: Array of item names
 * - New: Array of item objects with id, quantity, metadata
 *
 * This migration converts the old simple inventory to the new detailed format.
 */
const migration_2_1_to_3_0: SaveMigration = {
    from: "2.1.0",
    to: "3.0.0",
    description: "Redesigned inventory to use item objects instead of strings",
    migrate: (save) => {
        const player = save.player as Record<string, unknown>;
        const oldInventory = (player.inventory || []) as string[];

        // Count duplicate items
        const itemCounts = new Map<string, number>();
        for (const itemName of oldInventory) {
            itemCounts.set(itemName, (itemCounts.get(itemName) || 0) + 1);
        }

        // Convert to new format
        const newInventory = Array.from(itemCounts.entries()).map(
            ([name, quantity], index) => ({
                id: `item_${index}`,
                name,
                quantity,
                metadata: {},
            })
        );

        return {
            ...save,
            player: {
                ...player,
                inventory: newInventory,
            },
        };
    },
};

// ============================================================================
// MIGRATION REGISTRATION
// ============================================================================

/**
 * Call this function during game initialization to register all migrations.
 *
 * @example
 * ```typescript
 * import { Game } from '@react-text-game/core';
 * import { registerAllMigrations } from './migrations';
 *
 * async function initGame() {
 *   await Game.init({ gameVersion: "3.0.0", ... });
 *   registerAllMigrations();
 * }
 * ```
 */
export function registerAllMigrations() {
    // Register in chronological order for clarity
    // The order doesn't actually matter - the system uses BFS to find the path
    registerMigration(migration_1_0_to_1_1);
    registerMigration(migration_1_1_to_1_2);
    registerMigration(migration_1_2_to_2_0);
    registerMigration(migration_2_0_to_2_1);
    registerMigration(migration_2_1_to_3_0);

    console.log(
        "✓ Registered 5 save migrations covering versions 1.0.0 → 3.0.0"
    );
}

// ============================================================================
// TESTING MIGRATIONS
// ============================================================================

/**
 * Example test data for each version.
 * Use these to test your migrations.
 */
export const testSaves = {
    "1.0.0": {
        player: {
            name: "Hero",
            hp: 80,
            mp: 30,
            maxHp: 100,
            maxMp: 50,
            level: 5,
            experience: 1200,
        },
    },
    "1.1.0": {
        player: {
            name: "Hero",
            hp: 80,
            mp: 30,
            maxHp: 100,
            maxMp: 50,
            level: 5,
            experience: 1200,
            inventory: ["sword", "potion", "potion"],
        },
    },
    "2.0.0": {
        player: {
            name: "Hero",
            level: 5,
            experience: 1200,
            inventory: ["sword", "potion", "potion"],
            stats: {
                health: 80,
                mana: 30,
                maxHealth: 100,
                maxMana: 50,
                strength: 12,
                intelligence: 8,
                agility: 10,
            },
        },
        quests: {
            active: ["main_quest_1"],
            completed: ["tutorial"],
        },
    },
};

/**
 * Example test function to verify migrations work correctly.
 *
 * @example
 * ```typescript
 * import { testMigrationChain } from './migrations/example';
 *
 * // In your test file or dev console
 * testMigrationChain();
 * ```
 */
export async function testMigrationChain() {
    const { runMigrations } = await import("./runner");

    console.group("Testing Save Migration Chain");

    // Test 1.0.0 → 3.0.0 (full chain)
    console.log("\nTest 1: Migrating from 1.0.0 to 3.0.0");
    const result1 = runMigrations(testSaves["1.0.0"], "1.0.0", "3.0.0", {
        verbose: true,
    });
    console.log(
        result1.success ? "✓ Success" : "✗ Failed:",
        result1.error || result1.data
    );

    // Test 1.1.0 → 3.0.0 (partial chain)
    console.log("\nTest 2: Migrating from 1.1.0 to 3.0.0");
    const result2 = runMigrations(testSaves["1.1.0"], "1.1.0", "3.0.0");
    console.log(
        result2.success ? "✓ Success" : "✗ Failed:",
        result2.error || result2.data
    );

    // Test 2.0.0 → 3.0.0 (single migration)
    console.log("\nTest 3: Migrating from 2.0.0 to 3.0.0");
    const result3 = runMigrations(testSaves["2.0.0"], "2.0.0", "3.0.0");
    console.log(
        result3.success ? "✓ Success" : "✗ Failed:",
        result3.error || result3.data
    );

    console.groupEnd();
}

// ============================================================================
// USAGE IN YOUR GAME
// ============================================================================

/**
 * How to integrate this into your game:
 *
 * 1. Create a migrations file (like this one) in your game
 * 2. Define migration functions for each version change
 * 3. Call registerAllMigrations() after Game.init()
 * 4. Migrations will automatically apply when players load old saves
 *
 * Example:
 *
 * ```typescript
 * // src/index.tsx
 * import { Game } from '@react-text-game/core';
 * import { registerAllMigrations } from './game/migrations';
 *
 * async function init() {
 *   await Game.init({
 *     gameName: "My Adventure",
 *     gameVersion: "3.0.0",
 *     isDevMode: import.meta.env.DEV
 *   });
 *
 *   registerAllMigrations();
 *
 *   // Dev mode will validate your migration chain
 *   // and warn if there are any issues
 * }
 * ```
 */
