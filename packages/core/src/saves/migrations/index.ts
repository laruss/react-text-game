/**
 * Save Migration System
 *
 * This module provides a complete solution for versioning and migrating game saves.
 * It allows developers to register migration functions that transform save data
 * from older versions to newer versions.
 *
 * ## Key Concepts
 *
 * - **Migration**: A function that transforms save data from version A to version B
 * - **Migration Path**: A sequence of migrations needed to go from an old version to the current version
 * - **Migration Chain**: Migrations are applied sequentially (1.0.0 → 1.1.0 → 1.2.0 → 2.0.0)
 *
 * ## Usage
 *
 * ```typescript
 * import { registerMigration } from '@react-text-game/core/saves';
 *
 * // Register a migration when you make a breaking change
 * registerMigration({
 *   from: "1.0.0",
 *   to: "1.1.0",
 *   description: "Added player inventory system",
 *   migrate: (data) => ({
 *     ...data,
 *     player: {
 *       ...data.player,
 *       inventory: [] // Add default value
 *     }
 *   })
 * });
 * ```
 *
 * Migrations are automatically applied when loading saves via `useLoadGame()`.
 *
 * @module saves/migrations
 */

export {
    clearMigrations,
    findMigrationPath,
    getAllMigrations,
    registerMigration,
    validateMigrations,
} from "./registry";
export { migrateToCurrentVersion, runMigrations } from "./runner";
export type {
    MigrationOptions,
    MigrationResult,
    SaveMigration,
    SaveMigrationFn,
} from "./types";
