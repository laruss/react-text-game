/**
 * Developer tooling for React Text Game.
 *
 * The `rtg` binary is the intended entry point; everything exported here is the
 * same machinery it uses, for when you would rather script it yourself.
 *
 * ## What this solves
 *
 * A save records the state of every registered entity. Change that state's shape
 * and old saves may break - but only some changes are dangerous, and the
 * dangerous ones are not the obvious ones. Adding a field to an existing entity
 * is safe because loading merges a save over freshly built defaults. Adding a
 * whole *entity* is not: loading a save that knows nothing about it clears its
 * variables instead of defaulting them.
 *
 * This package captures the shape as a committed snapshot, then diffs later
 * versions against it and classifies what it finds.
 *
 * ## Usage
 *
 * ```bash
 * # once, at release time
 * rtg saves snapshot --entry src/game/registry.ts
 *
 * # on every commit afterwards
 * rtg saves check --entry src/game/registry.ts
 * ```
 *
 * @see https://reacttextgame.dev/keep-saves-valid
 *
 * @module
 */

export {
    SYSTEM_SAVE_NAME,
    schemaFromDump,
    schemaFromSaveFile,
} from "./artifacts";
export { diffSchemas } from "./diff";
export {
    type LoadedGame,
    loadGameSchema,
    type RegisteredMigration,
    type VersionSource,
} from "./loadEntry";
export { formatCheckResult, formatFindings } from "./report";
export { buildSchema, describeKind, mergeSchemas } from "./schema";
export {
    compareVersions,
    findLatestSchema,
    readSchema,
    snapshotPath,
    writeSchema,
} from "./store";
export {
    type CaptureSource,
    type CheckResult,
    DEFAULT_SCHEMA_DIR,
    type Finding,
    type FindingCode,
    type SaveSchema,
    SCHEMA_VERSION,
    type SchemaKind,
    type Severity,
    SYSTEM_KEY,
} from "./types";
