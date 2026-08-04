import {
    type CaptureSource,
    type SaveSchema,
    SCHEMA_VERSION,
    type SchemaKind,
    SYSTEM_KEY,
} from "#types";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Describes a value's kind without recording the value itself.
 *
 * @param value - Any value found in save state
 * @returns The kind string, e.g. `"number"`, `"object"`, `"array<string>"`
 *
 * @example
 * ```typescript
 * describeKind(7);              // "number"
 * describeKind(null);           // "null"
 * describeKind([]);             // "array<unknown>"
 * describeKind(["a", "b"]);     // "array<string>"
 * describeKind([1, "a"]);       // "array<mixed>"
 * ```
 */
export const describeKind = (value: unknown): SchemaKind => {
    if (value === null) {
        return "null";
    }

    if (Array.isArray(value)) {
        const elementKinds = new Set(value.map(describeKind));

        if (elementKinds.size === 0) {
            // An empty default hides the element type. This is the tool's main
            // blind spot: a change to the element shape cannot be detected here.
            return "array<unknown>";
        }

        const [only] = elementKinds;

        return `array<${elementKinds.size === 1 && only ? only : "mixed"}>`;
    }

    if (isPlainObject(value)) {
        return "object";
    }

    return typeof value;
};

const collectPaths = (
    value: unknown,
    prefix: string,
    into: Map<string, SchemaKind>
): void => {
    for (const [key, child] of Object.entries(value as object)) {
        const path = prefix ? `${prefix}.${key}` : key;

        into.set(path, describeKind(child));

        // Descend into objects only. Array contents are summarised by their kind
        // so that a populated save and an empty one stay comparable.
        if (isPlainObject(child)) {
            collectPaths(child, path, into);
        }
    }
};

const sortPaths = (
    paths: Map<string, SchemaKind>
): Record<string, SchemaKind> =>
    Object.fromEntries(
        Array.from(paths.entries()).sort(([left], [right]) =>
            left.localeCompare(right)
        )
    );

/**
 * Builds a comparable schema from one save state object.
 *
 * Takes the version the state belongs to, the save state itself as
 * `Game.getState()` produces it, the registered passage ids (or `null` when the
 * source cannot know them), and where the state was captured from.
 *
 * @returns A schema ready to be written or diffed
 *
 * @example
 * ```typescript
 * const schema = buildSchema({
 *     gameVersion: "0.1.0",
 *     gameData: { player: { health: 100 } },
 *     passageIds: ["intro"],
 *     capturedFrom: "code",
 * });
 * schema.paths; // { "player": "object", "player.health": "number" }
 * ```
 */
export const buildSchema = ({
    gameVersion,
    gameData,
    passageIds,
    capturedFrom,
}: {
    gameVersion: string;
    gameData: Record<string, unknown>;
    passageIds: string[] | null;
    capturedFrom: CaptureSource;
}): SaveSchema => {
    const paths = new Map<string, SchemaKind>();
    collectPaths(gameData, "", paths);

    return {
        schemaVersion: SCHEMA_VERSION,
        gameVersion,
        capturedFrom,
        entities: Object.keys(gameData)
            .filter((key) => key !== SYSTEM_KEY)
            .sort(),
        passages: passageIds === null ? null : [...passageIds].sort(),
        paths: sortPaths(paths),
    };
};

/**
 * Merges schemas captured from several saves of the same game version.
 *
 * @remarks
 * Exported save files hold one record per slot. Different slots populate
 * different collections, so the union of their paths describes the version
 * better than any single slot does. A concrete element kind always beats
 * `array<unknown>`, which only means "this slot happened to be empty here".
 *
 * @param schemas - One or more schemas for the same version
 * @returns The merged schema
 * @throws Error if `schemas` is empty
 */
export const mergeSchemas = (schemas: SaveSchema[]): SaveSchema => {
    const [first, ...rest] = schemas;

    if (!first) {
        throw new Error("Cannot merge an empty list of schemas");
    }

    if (rest.length === 0) {
        return first;
    }

    const paths = new Map(Object.entries(first.paths));
    const entities = new Set(first.entities);

    for (const schema of rest) {
        for (const entity of schema.entities) {
            entities.add(entity);
        }

        for (const [path, kind] of Object.entries(schema.paths)) {
            const known = paths.get(path);

            if (known === undefined || known === "array<unknown>") {
                paths.set(path, kind);
            }
        }
    }

    return {
        ...first,
        entities: Array.from(entities).sort(),
        paths: sortPaths(paths),
    };
};
