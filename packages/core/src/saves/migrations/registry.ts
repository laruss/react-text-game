import { logger } from "#logger";

import { SaveMigration } from "./types";

/**
 * In-memory registry of all registered migrations.
 * Maps "from -> to" version pairs to migration objects.
 */
const migrations = new Map<string, SaveMigration>();

/**
 * Helper to create a unique key for a migration edge
 */
const getMigrationKey = (from: string, to: string): string => `${from}→${to}`;

/**
 * Registers a migration function for moving from one version to another.
 *
 * Migrations should be registered during game initialization, typically in
 * your game's entry point after calling `Game.init()`.
 *
 * @param migration - The migration definition
 * @throws Error if a migration with the same from->to path already exists
 *
 * @example
 * ```typescript
 * registerMigration({
 *   from: "1.0.0",
 *   to: "1.1.0",
 *   description: "Added player inventory",
 *   migrate: (data) => ({
 *     ...data,
 *     player: { ...data.player, inventory: [] }
 *   })
 * });
 * ```
 */
export function registerMigration(migration: SaveMigration): void {
    const key = getMigrationKey(migration.from, migration.to);

    if (migrations.has(key)) {
        throw new Error(
            `Migration from ${migration.from} to ${migration.to} is already registered`
        );
    }

    migrations.set(key, migration);
    logger.log(
        `Registered save migration: ${migration.from} → ${migration.to} (${migration.description})`
    );
}

/**
 * Clears all registered migrations.
 * Primarily used for testing.
 *
 * @internal
 */
export function clearMigrations(): void {
    migrations.clear();
}

/**
 * Gets all registered migrations.
 *
 * @returns Array of all registered migration definitions
 */
export function getAllMigrations(): SaveMigration[] {
    return Array.from(migrations.values());
}

/**
 * Finds the shortest migration path from one version to another using BFS.
 *
 * This function builds a graph of all registered migrations and uses
 * breadth-first search to find the shortest sequence of migrations
 * needed to go from the source version to the target version.
 *
 * @param fromVersion - The starting version (e.g., "1.0.0")
 * @param toVersion - The target version (e.g., "2.0.0")
 * @returns Array of migrations to apply in order, or null if no path exists
 *
 * @example
 * ```typescript
 * // Registered migrations: 1.0.0→1.1.0, 1.1.0→1.2.0, 1.2.0→2.0.0
 * const path = findMigrationPath("1.0.0", "2.0.0");
 * // Returns: [migration_1_0_to_1_1, migration_1_1_to_1_2, migration_1_2_to_2_0]
 * ```
 */
export function findMigrationPath(
    fromVersion: string,
    toVersion: string
): SaveMigration[] | null {
    // If versions are the same, no migration needed
    if (fromVersion === toVersion) {
        return [];
    }

    // Build adjacency list of version graph
    const graph = new Map<string, string[]>();
    const migrationMap = new Map<string, SaveMigration>();

    for (const migration of migrations.values()) {
        if (!graph.has(migration.from)) {
            graph.set(migration.from, []);
        }
        graph.get(migration.from)!.push(migration.to);
        migrationMap.set(
            getMigrationKey(migration.from, migration.to),
            migration
        );
    }

    // BFS to find shortest path
    const queue: Array<{ version: string; path: string[] }> = [
        { version: fromVersion, path: [] },
    ];
    const visited = new Set<string>([fromVersion]);

    while (queue.length > 0) {
        const current = queue.shift()!;

        // Check if we reached the target
        if (current.version === toVersion) {
            // Reconstruct the migration path
            const migrationPath: SaveMigration[] = [];
            for (let i = 0; i < current.path.length; i++) {
                const from = i === 0 ? fromVersion : current.path[i - 1];
                const to = current.path[i];
                if (!from || !to) {
                    continue; // Skip if either is undefined
                }
                const migration = migrationMap.get(getMigrationKey(from, to));
                if (migration) {
                    migrationPath.push(migration);
                }
            }
            return migrationPath;
        }

        // Explore neighbors
        const neighbors = graph.get(current.version) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({
                    version: neighbor,
                    path: [...current.path, neighbor],
                });
            }
        }
    }

    // No path found
    return null;
}

/**
 * Validates that the migration registry forms a valid chain.
 *
 * Checks for:
 * - Orphaned migrations (from versions with no incoming migrations)
 * - Dead ends (to versions with no outgoing migrations, except latest)
 * - Duplicate migrations
 *
 * @param latestVersion - The current/latest version of the game
 * @returns Validation result with any issues found
 */
export function validateMigrations(latestVersion: string): {
    valid: boolean;
    issues: string[];
} {
    const issues: string[] = [];
    const allMigrations = getAllMigrations();

    if (allMigrations.length === 0) {
        return { valid: true, issues: [] };
    }

    // Collect all version nodes
    const fromVersions = new Set<string>();
    const toVersions = new Set<string>();

    for (const migration of allMigrations) {
        fromVersions.add(migration.from);
        toVersions.add(migration.to);
    }

    // Find orphaned versions (versions that are targets but have no path from any base version)
    const baseVersions = new Set(
        Array.from(fromVersions).filter((v) => !toVersions.has(v))
    );

    // Check if all versions can reach the latest version
    for (const baseVersion of baseVersions) {
        const path = findMigrationPath(baseVersion, latestVersion);
        if (path === null) {
            issues.push(
                `No migration path from base version ${baseVersion} to latest version ${latestVersion}`
            );
        }
    }

    // Check for dead ends (versions that have no outgoing migrations, except latest)
    for (const toVersion of toVersions) {
        if (toVersion !== latestVersion && !fromVersions.has(toVersion)) {
            issues.push(
                `Dead end detected: Version ${toVersion} has no outgoing migrations`
            );
        }
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
