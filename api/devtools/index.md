# Devtools

Developer tooling for React Text Game.

The `rtg` binary is the intended entry point; everything exported here is the
same machinery it uses, for when you would rather script it yourself.

## What this solves

A save records the state of every registered entity. Change that state's shape
and old saves may break - but only some changes are dangerous, and the
dangerous ones are not the obvious ones. Adding a field to an existing entity
is safe because loading merges a save over freshly built defaults. Adding a
whole *entity* is not: loading a save that knows nothing about it clears its
variables instead of defaulting them.

This package captures the shape as a committed snapshot, then diffs later
versions against it and classifies what it finds.

## Usage

```bash
# once, at release time
rtg saves snapshot --entry src/game/registry.ts

# on every commit afterwards
rtg saves check --entry src/game/registry.ts
```

## See

https://reacttextgame.dev/keep-saves-valid

## Interfaces

- [CheckResult](interfaces/CheckResult.md)
- [Finding](interfaces/Finding.md)
- [LoadedGame](interfaces/LoadedGame.md)
- [RegisteredMigration](interfaces/RegisteredMigration.md)
- [SaveSchema](interfaces/SaveSchema.md)

## Type Aliases

- [CaptureSource](type-aliases/CaptureSource.md)
- [FindingCode](type-aliases/FindingCode.md)
- [SchemaKind](type-aliases/SchemaKind.md)
- [Severity](type-aliases/Severity.md)
- [VersionSource](type-aliases/VersionSource.md)

## Variables

- [DEFAULT\_SCHEMA\_DIR](variables/DEFAULT_SCHEMA_DIR.md)
- [SCHEMA\_VERSION](variables/SCHEMA_VERSION.md)
- [SYSTEM\_KEY](variables/SYSTEM_KEY.md)
- [SYSTEM\_SAVE\_NAME](variables/SYSTEM_SAVE_NAME.md)

## Functions

- [buildSchema](functions/buildSchema.md)
- [compareVersions](functions/compareVersions.md)
- [describeKind](functions/describeKind.md)
- [diffSchemas](functions/diffSchemas.md)
- [findLatestSchema](functions/findLatestSchema.md)
- [formatCheckResult](functions/formatCheckResult.md)
- [formatFindings](functions/formatFindings.md)
- [loadGameSchema](functions/loadGameSchema.md)
- [mergeSchemas](functions/mergeSchemas.md)
- [readSchema](functions/readSchema.md)
- [schemaFromDump](functions/schemaFromDump.md)
- [schemaFromSaveFile](functions/schemaFromSaveFile.md)
- [snapshotPath](functions/snapshotPath.md)
- [writeSchema](functions/writeSchema.md)
