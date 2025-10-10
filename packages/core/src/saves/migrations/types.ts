import { GameSaveState } from "#types";

export type MigrationGameSaveState = Partial<GameSaveState> & Record<string, unknown>;

/**
 * A function that migrates game save data from one version to another.
 *
 * Migration functions should be pure (no side effects) and should always
 * return a new object rather than mutating the input.
 *
 * @template T - The shape of the game save state for this migration. Can be a partial
 *               type if the migration only touches specific fields. Defaults to GameSaveState.
 *
 * @param data - The game save state at the source version
 * @returns The migrated game save state at the target version
 *
 * @example
 * Basic migration without specific types:
 * ```typescript
 * const migrateFn: SaveMigrationFn = (data) => {
 *   return {
 *     ...data,
 *     player: {
 *       ...data.player,
 *       health: data.player.hp ?? 100, // Rename hp to health
 *     }
 *   };
 * };
 * ```
 *
 * @example
 * Type-safe migration with specific field types:
 * ```typescript
 * const migrateFn: SaveMigrationFn<{ player?: { inventory: string[] } }> = (data) => {
 *   const player = data.player || {};
 *   return {
 *     ...data,
 *     player: {
 *       ...player,
 *       inventory: [], // TypeScript knows this should be string[]
 *     }
 *   };
 * };
 * ```
 */
export type SaveMigrationFn<T extends MigrationGameSaveState = GameSaveState> = (data: T) => T;

/**
 * Defines a migration from one game version to another.
 *
 * Migrations are registered by developers when they make breaking changes
 * to the game save structure. The migration system will automatically
 * chain migrations together to migrate saves from any old version to the
 * current version.
 *
 * @template T - The shape of the game save state for this migration. Can be a partial
 *               type if the migration only touches specific fields. Defaults to GameSaveState.
 *               Using specific types provides better type safety and IDE autocomplete.
 *
 * @example
 * Basic migration without specific types:
 * ```typescript
 * const migration: SaveMigration = {
 *   from: "1.0.0",
 *   to: "1.1.0",
 *   description: "Added inventory system",
 *   migrate: (save) => ({ ...save, inventory: [] })
 * };
 * ```
 *
 * @example
 * Type-safe migration with specific field types:
 * ```typescript
 * const migration: SaveMigration<{ player?: { inventory: string[] } }> = {
 *   from: "1.0.0",
 *   to: "1.1.0",
 *   description: "Added inventory system",
 *   migrate: (save) => {
 *     const player = save.player || {};
 *     return {
 *       ...save,
 *       player: {
 *         ...player,
 *         inventory: [], // TypeScript validates the type
 *       }
 *     };
 *   }
 * };
 * ```
 */
export interface SaveMigration<T extends MigrationGameSaveState = GameSaveState> {
    /**
     * The source version this migration starts from.
     * Should be a valid semver string (e.g., "1.0.0", "1.2.3")
     */
    from: string;

    /**
     * The target version this migration migrates to.
     * Should be a valid semver string (e.g., "1.1.0", "2.0.0")
     */
    to: string;

    /**
     * Human-readable description of what this migration does.
     * Used for logging and debugging.
     *
     * @example "Added player inventory system"
     * @example "Renamed 'hp' field to 'health'"
     */
    description: string;

    /**
     * The migration function that transforms the data.
     * Should be pure and not mutate the input.
     */
    migrate: SaveMigrationFn<T>;
}

/**
 * Result of running a migration chain.
 *
 * @template T - The type of the migrated data. Should match the target version's
 *               save state structure. Defaults to GameSaveState.
 *
 * @example
 * ```typescript
 * const result: MigrationResult = runMigrations(oldSave, "1.0.0", "2.0.0");
 * if (result.success) {
 *   console.log("Migrated data:", result.data);
 *   console.log("Applied migrations:", result.migrationsApplied);
 * } else {
 *   console.error("Migration failed:", result.error);
 * }
 * ```
 *
 * @example
 * Type-safe migration result:
 * ```typescript
 * type NewSaveFormat = {
 *   player: { stats: { health: number; mana: number } }
 * } & Record<string, unknown>;
 *
 * const result: MigrationResult<NewSaveFormat> = runMigrations(oldSave, "1.0.0", "2.0.0");
 * if (result.success && result.data) {
 *   // TypeScript knows about the new structure
 *   console.log(result.data.player.stats.health);
 * }
 * ```
 */
export interface MigrationResult<T extends GameSaveState = GameSaveState> {
    /**
     * Whether the migration was successful
     */
    success: boolean;

    /**
     * The migrated data (if successful)
     */
    data?: T;

    /**
     * Error message (if failed)
     */
    error?: string;

    /**
     * List of migrations that were applied, in order
     */
    migrationsApplied: Array<{
        from: string;
        to: string;
        description: string;
    }>;
}

/**
 * Options for migration behavior
 */
export interface MigrationOptions {
    /**
     * Whether to throw an error if no migration path is found.
     * If false, returns the original data unchanged.
     * @default false
     */
    strict?: boolean;

    /**
     * Whether to log migration steps for debugging.
     * @default true in dev mode, false in production
     */
    verbose?: boolean;
}
