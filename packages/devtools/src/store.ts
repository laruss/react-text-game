import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { type SaveSchema, SCHEMA_VERSION } from "#types";

/**
 * Compares two version strings by their leading numeric segments.
 *
 * @remarks
 * Deliberately loose rather than a full semver implementation: it only has to
 * order the snapshot files in one directory. Non-numeric suffixes fall back to a
 * string comparison, so `1.0.0-rc.1` and `1.0.0-rc.2` still order sensibly.
 */
export const compareVersions = (left: string, right: string): number => {
    const leftParts = left.split(/[.-]/);
    const rightParts = right.split(/[.-]/);
    const length = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < length; index++) {
        const leftPart = leftParts[index] ?? "";
        const rightPart = rightParts[index] ?? "";

        if (leftPart === rightPart) {
            continue;
        }

        const leftNumber = Number(leftPart);
        const rightNumber = Number(rightPart);

        if (Number.isInteger(leftNumber) && Number.isInteger(rightNumber)) {
            return leftNumber - rightNumber;
        }

        return leftPart.localeCompare(rightPart);
    }

    return 0;
};

/**
 * Builds the conventional file path for a version's snapshot.
 *
 * @param directory - Snapshot directory
 * @param gameVersion - Version the snapshot describes
 * @returns The path to write to or read from
 */
export const snapshotPath = (directory: string, gameVersion: string): string =>
    join(directory, `${gameVersion}.json`);

const assertSchema = (value: unknown, source: string): SaveSchema => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error(`${source} does not contain a save schema object.`);
    }

    const schema = value as Partial<SaveSchema>;

    if (schema.schemaVersion !== SCHEMA_VERSION) {
        throw new Error(
            `${source} uses schema version ${String(schema.schemaVersion)}, but this tool understands version ${SCHEMA_VERSION}. Upgrade @react-text-game/devtools, or re-create the snapshot.`
        );
    }

    if (typeof schema.gameVersion !== "string" || !schema.paths) {
        throw new Error(`${source} is missing gameVersion or paths.`);
    }

    return schema as SaveSchema;
};

/**
 * Reads and validates one snapshot file.
 *
 * @param filePath - Path to a snapshot JSON file
 * @returns The parsed schema
 * @throws Error if the file is unreadable, is not JSON, or is not a snapshot
 * this tool understands
 */
export const readSchema = async (filePath: string): Promise<SaveSchema> => {
    let raw: string;

    try {
        raw = await readFile(filePath, "utf8");
    } catch {
        throw new Error(`Cannot read ${filePath}.`);
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error(`${filePath} is not valid JSON.`);
    }

    return assertSchema(parsed, filePath);
};

/**
 * Writes a snapshot, creating the directory if needed.
 *
 * @param filePath - Destination path
 * @param schema - Schema to persist
 */
export const writeSchema = async (
    filePath: string,
    schema: SaveSchema
): Promise<void> => {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(schema, null, 4)}\n`, "utf8");
};

/**
 * Finds the highest-versioned snapshot in a directory.
 *
 * @param directory - Snapshot directory
 * @returns The snapshot and its path, or `null` when the directory holds none
 * @throws Error if a `.json` file in the directory is not a valid snapshot
 */
export const findLatestSchema = async (
    directory: string
): Promise<{ path: string; schema: SaveSchema } | null> => {
    let entries: string[];

    try {
        entries = await readdir(directory);
    } catch {
        return null;
    }

    const candidates = entries.filter((entry) => entry.endsWith(".json"));

    if (candidates.length === 0) {
        return null;
    }

    const loaded = await Promise.all(
        candidates.map(async (entry) => {
            const path = join(directory, entry);

            return { path, schema: await readSchema(path) };
        })
    );

    loaded.sort((left, right) =>
        compareVersions(left.schema.gameVersion, right.schema.gameVersion)
    );

    return loaded.at(-1) ?? null;
};
