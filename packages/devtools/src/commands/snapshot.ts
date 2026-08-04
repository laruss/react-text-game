import { readFile } from "node:fs/promises";

import { schemaFromDump, schemaFromSaveFile } from "#artifacts";
import { loadGameSchema, type VersionSource } from "#loadEntry";
import { snapshotPath, writeSchema } from "#store";
import type { SaveSchema } from "#types";

/**
 * Inputs for the `saves snapshot` command.
 *
 * @remarks
 * Every field is required and nullable rather than optional, so callers never
 * have to reason about the difference between an absent key and an undefined one.
 */
export interface SnapshotOptions {
    /** Module to import to capture the current shape. */
    entry: string | null;
    /** Exported `.sx` save file to derive the shape from. */
    fromSave: string | null;
    /** IndexedDB JSON dump to derive the shape from. */
    fromDump: string | null;
    /** The game's `gameId`, required with `fromSave`. */
    gameId: string | null;
    /** Version to record, when the artifact does not state one unambiguously. */
    gameVersion: string | null;
    /** Directory snapshots live in. */
    directory: string;
    /** Explicit output path, overriding the conventional one. */
    out: string | null;
}

const readSchemaFromSource = async (
    options: SnapshotOptions
): Promise<{ schema: SaveSchema; versionSource: VersionSource | null }> => {
    if (options.entry) {
        const loaded = await loadGameSchema(options.entry, options.gameVersion);

        return {
            schema: loaded.schema,
            versionSource: loaded.versionSource,
        };
    }

    if (options.fromSave) {
        if (!options.gameId) {
            throw new Error(
                "--from-save needs --game-id: save files are encrypted with the game's gameId."
            );
        }

        let bytes: Buffer;

        try {
            bytes = await readFile(options.fromSave);
        } catch {
            throw new Error(`Cannot read ${options.fromSave}.`);
        }

        return {
            schema: schemaFromSaveFile(
                bytes,
                options.gameId,
                options.gameVersion ?? undefined
            ),
            versionSource: null,
        };
    }

    if (options.fromDump) {
        let raw: string;

        try {
            raw = await readFile(options.fromDump, "utf8");
        } catch {
            throw new Error(`Cannot read ${options.fromDump}.`);
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(raw);
        } catch {
            throw new Error(`${options.fromDump} is not valid JSON.`);
        }

        return {
            schema: schemaFromDump(parsed, options.gameVersion ?? undefined),
            versionSource: null,
        };
    }

    throw new Error(
        "Pick a source: --entry <module>, --from-save <file.sx> --game-id <id>, or --from-dump <file.json>."
    );
};

/**
 * Captures the current save shape and writes it as a baseline snapshot.
 *
 * Run this once per released version, then commit the file.
 *
 * @param options - See {@link SnapshotOptions}
 * @returns The path written, the schema written to it, and where its version came
 * from (`null` for artifact sources, which state their own version)
 * @throws Error if no source is given, or the source cannot be read
 */
export const runSnapshot = async (
    options: SnapshotOptions
): Promise<{
    path: string;
    schema: SaveSchema;
    versionSource: VersionSource | null;
}> => {
    const { schema, versionSource } = await readSchemaFromSource(options);
    const path =
        options.out ?? snapshotPath(options.directory, schema.gameVersion);

    await writeSchema(path, schema);

    return { path, schema, versionSource };
};
