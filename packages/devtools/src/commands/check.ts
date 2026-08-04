import { findMigrationPath } from "@react-text-game/core/saves";

import { diffSchemas } from "#diff";
import { loadGameSchema, type VersionSource } from "#loadEntry";
import { findLatestSchema, readSchema } from "#store";
import type { CheckResult, SaveSchema } from "#types";

/**
 * Inputs for the `saves check` command.
 */
export interface CheckOptions {
    /** Module to import to capture the current shape. */
    entry: string | null;
    /** Snapshot file holding the current shape, instead of importing code. */
    current: string | null;
    /** Snapshot file to compare against, instead of the newest in `directory`. */
    baseline: string | null;
    /** Directory snapshots live in. */
    directory: string;
    /** Explicit version for the current shape, overriding every other source. */
    gameVersion: string | null;
}

/**
 * Compares the current save shape against a baseline snapshot.
 *
 * @remarks
 * The migration-path check needs the game's registered migrations, which only
 * exist once its modules have been imported. With `--current` the result reports
 * shape differences but leaves the path unverified.
 *
 * @param options - See {@link CheckOptions}
 * @returns The comparison, plus the baseline path it used
 * @throws Error if no baseline exists, or a source cannot be read
 */
export const runCheck = async (
    options: CheckOptions
): Promise<{
    result: CheckResult;
    baselinePath: string;
    versionSource: VersionSource | null;
}> => {
    let current: SaveSchema;
    let versionSource: VersionSource | null = null;
    // Only an imported game has a migration registry to interrogate.
    let migrationsKnown = false;

    if (options.current) {
        current = await readSchema(options.current);
    } else if (options.entry) {
        const loaded = await loadGameSchema(options.entry, options.gameVersion);
        current = loaded.schema;
        versionSource = loaded.versionSource;
        migrationsKnown = true;
    } else {
        throw new Error(
            "Pick a source for the current shape: --entry <module> or --current <file.json>."
        );
    }

    const baseline = options.baseline
        ? { path: options.baseline, schema: await readSchema(options.baseline) }
        : await findLatestSchema(options.directory);

    if (!baseline) {
        throw new Error(
            `No baseline snapshot found in ${options.directory}. Create one from the released version first:\n    rtg saves snapshot --entry <module>\nSee https://reacttextgame.dev/keep-saves-valid for how to recover a baseline from a game that is already live.`
        );
    }

    // findMigrationPath reads the engine's registry, which the imported entry
    // populated moments ago against this same engine instance.
    const migrationPathExists = migrationsKnown
        ? findMigrationPath(
              baseline.schema.gameVersion,
              current.gameVersion
          ) !== null
        : null;

    return {
        result: diffSchemas(baseline.schema, current, migrationPathExists),
        baselinePath: baseline.path,
        versionSource,
    };
};
