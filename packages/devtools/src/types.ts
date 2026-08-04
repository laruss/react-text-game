/**
 * Format version of the snapshot files this tool writes and reads.
 *
 * @remarks
 * Bumped only when the on-disk shape changes in a way older tooling cannot
 * read. `check` refuses snapshots it does not recognise rather than guessing.
 */
export const SCHEMA_VERSION = 1;

/**
 * Path under which snapshots are stored, relative to the working directory.
 */
export const DEFAULT_SCHEMA_DIR = "save-schemas";

/**
 * Top-level state key owned by the engine rather than by a game entity.
 */
export const SYSTEM_KEY = "_system";

/**
 * A value's *kind*, not its value.
 *
 * @remarks
 * Snapshots deliberately record kinds only. Entity defaults are frequently
 * non-deterministic (`Date.now()` is a common one), so storing values would
 * make every capture differ from the last for no reason.
 *
 * Primitives use their `typeof` name; `null` is its own kind; arrays are
 * `array<kind>`, degrading to `array<unknown>` when empty and `array<mixed>`
 * when elements disagree.
 */
export type SchemaKind = string;

/**
 * Where a snapshot was captured from.
 *
 * - `code` - by importing the game's modules (the richest source: it also knows
 *   the registered passage ids)
 * - `save` - from an exported `.sx` save file
 * - `dump` - from an IndexedDB record copied out of a browser
 */
export type CaptureSource = "code" | "save" | "dump";

/**
 * A comparable description of one version's save shape.
 */
export interface SaveSchema {
    /** See {@link SCHEMA_VERSION}. */
    schemaVersion: number;
    /** Game version this shape belongs to. */
    gameVersion: string;
    /** See {@link CaptureSource}. */
    capturedFrom: CaptureSource;
    /** Sorted ids of every game entity, excluding engine-owned system state. */
    entities: string[];
    /**
     * Sorted ids of every registered passage, or `null` when the capture source
     * could not know them.
     *
     * @remarks
     * Only a `code` capture knows the passage registry. Saves and dumps record
     * just the one id the player was on, so passage checks are skipped for them.
     */
    passages: string[] | null;
    /** Dotted path to kind, for every node in the state tree, sorted by path. */
    paths: Record<string, SchemaKind>;
}

/**
 * How much attention a difference deserves.
 *
 * - `error` - old saves break or lose data without a migration
 * - `warning` - a human has to decide; usually a suspected rename
 * - `info` - harmless, recorded so the diff is complete
 */
export type Severity = "error" | "warning" | "info";

/**
 * The kind of difference a {@link Finding} reports.
 */
export type FindingCode =
    | "entity-added"
    | "entity-removed"
    | "field-added"
    | "field-removed"
    | "kind-changed"
    | "possible-rename"
    | "passage-removed"
    | "version-not-bumped"
    | "missing-migration";

/**
 * One difference between two schemas.
 */
export interface Finding {
    /** See {@link FindingCode}. */
    code: FindingCode;
    /** See {@link Severity}. */
    severity: Severity;
    /**
     * What the finding is about: an entity id, a dotted path, or a passage id.
     * Empty for findings about the schema as a whole.
     */
    subject: string;
    /** Human-readable explanation, including why it matters. */
    message: string;
}

/**
 * Outcome of comparing a baseline snapshot against the current shape.
 */
export interface CheckResult {
    /** Every difference found, most severe first. */
    findings: Finding[];
    /**
     * Whether the shape change means old saves need a migration.
     *
     * @remarks
     * True when any finding is an `error` or a `warning`. Warnings count
     * because a suspected rename silently loses player data if it really is one.
     */
    migrationRequired: boolean;
    /**
     * Whether a registered migration chain already covers the change.
     *
     * @remarks
     * This is what lets the check go green again: once the version is bumped and
     * a chain leads from the baseline version to the current one, the work has
     * been done as far as this tool can tell. It does **not** mean the migration
     * is correct - only that one exists.
     *
     * Always `false` when the game's code was not imported, since there is no
     * registry to consult.
     */
    migrationSatisfied: boolean;
    /** Version the baseline snapshot describes. */
    baselineVersion: string;
    /** Version the current shape declares. */
    currentVersion: string;
}
