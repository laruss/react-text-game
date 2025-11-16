import { logger } from "#logger";
import { _getOptions } from "#options";
import { GameSaveState } from "#types";

import { findMigrationPath } from "./registry";
import { MigrationOptions, MigrationResult } from "./types";

/**
 * Runs the migration chain to migrate save data from one version to another.
 *
 * This function:
 * 1. Finds the shortest migration path using BFS
 * 2. Applies each migration in sequence
 * 3. Returns the migrated data or error information
 *
 * @param data - The save data to migrate
 * @param fromVersion - The version the save was created with
 * @param toVersion - The target version to migrate to (usually current game version)
 * @param options - Migration behavior options
 * @returns Migration result with success status and migrated data
 *
 * @example
 * ```typescript
 * const result = runMigrations(oldSaveData, "1.0.0", "2.0.0");
 * if (result.success) {
 *   console.log("Migrated data:", result.data);
 * } else {
 *   console.error("Migration failed:", result.error);
 * }
 * ```
 */
export function runMigrations(
    data: GameSaveState,
    fromVersion: string,
    toVersion: string,
    options: MigrationOptions = {}
): MigrationResult {
    const { strict = false, verbose } = options;

    // Determine verbosity (default to dev mode setting)
    const shouldLog = verbose !== undefined ? verbose : _getOptions().isDevMode;

    // If versions match, no migration needed
    if (fromVersion === toVersion) {
        if (shouldLog) {
            logger.log(
                `No migration needed: save version ${fromVersion} matches current version`
            );
        }
        return {
            success: true,
            data,
            migrationsApplied: [],
        };
    }

    // Find migration path
    if (shouldLog) {
        logger.log(
            `Finding migration path from ${fromVersion} to ${toVersion}...`
        );
    }

    const migrationPath = findMigrationPath(fromVersion, toVersion);

    if (migrationPath === null) {
        const errorMsg = `No migration path found from version ${fromVersion} to ${toVersion}`;

        if (strict) {
            throw new Error(errorMsg);
        }

        logger.warn(
            `${errorMsg}. Returning original data. This may cause compatibility issues.`
        );

        return {
            success: false,
            error: errorMsg,
            migrationsApplied: [],
        };
    }

    if (migrationPath.length === 0) {
        return {
            success: true,
            data,
            migrationsApplied: [],
        };
    }

    // Log migration plan
    if (shouldLog) {
        logger.log(
            `Found migration path with ${migrationPath.length} step(s):`
        );
        migrationPath.forEach((m, i) => {
            logger.log(`  ${i + 1}. ${m.from} → ${m.to}: ${m.description}`);
        });
    }

    // Apply migrations sequentially
    let currentData = data;
    const appliedMigrations: MigrationResult["migrationsApplied"] = [];

    try {
        for (const migration of migrationPath) {
            if (shouldLog) {
                logger.log(
                    `Applying migration: ${migration.from} → ${migration.to}`
                );
            }

            // Run migration
            const migratedData = migration.migrate(currentData);

            // Validate migration output
            if (
                !migratedData ||
                typeof migratedData !== "object" ||
                Array.isArray(migratedData)
            ) {
                throw new Error(
                    `Migration ${migration.from} → ${migration.to} returned invalid data type. Expected object, got ${typeof migratedData}`
                );
            }

            currentData = migratedData;
            appliedMigrations.push({
                from: migration.from,
                to: migration.to,
                description: migration.description,
            });

            if (shouldLog) {
                logger.log(
                    `Successfully applied migration: ${migration.from} → ${migration.to}`
                );
            }
        }

        if (shouldLog) {
            logger.log(
                `Migration complete: ${fromVersion} → ${toVersion} (${appliedMigrations.length} steps)`
            );
        }

        return {
            success: true,
            data: currentData,
            migrationsApplied: appliedMigrations,
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);

        logger.error(
            `Migration failed at step ${appliedMigrations.length + 1}: ${errorMsg}`
        );

        return {
            success: false,
            error: errorMsg,
            migrationsApplied: appliedMigrations,
        };
    }
}

/**
 * Convenience function to migrate save data to the current game version.
 *
 * @param data - The save data to migrate
 * @param fromVersion - The version the save was created with
 * @param options - Migration behavior options
 * @returns Migration result
 *
 * @example
 * ```typescript
 * const result = migrateToCurrentVersion(saveData, "1.0.0");
 * if (result.success) {
 *   Game.setState(result.data);
 * }
 * ```
 */
export function migrateToCurrentVersion(
    data: GameSaveState,
    fromVersion: string,
    options?: MigrationOptions
): MigrationResult {
    const currentVersion = _getOptions().gameVersion;
    return runMigrations(data, fromVersion, currentVersion, options);
}
