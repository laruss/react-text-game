# Interface: CheckResult

Defined in: [types.ts:112](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L112)

Outcome of comparing a baseline snapshot against the current shape.

## Properties

### baselineVersion

> **baselineVersion**: `string`

Defined in: [types.ts:137](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L137)

Version the baseline snapshot describes.

***

### currentVersion

> **currentVersion**: `string`

Defined in: [types.ts:139](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L139)

Version the current shape declares.

***

### findings

> **findings**: [`Finding`](Finding.md)[]

Defined in: [types.ts:114](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L114)

Every difference found, most severe first.

***

### migrationRequired

> **migrationRequired**: `boolean`

Defined in: [types.ts:122](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L122)

Whether the shape change means old saves need a migration.

#### Remarks

True when any finding is an `error` or a `warning`. Warnings count
because a suspected rename silently loses player data if it really is one.

***

### migrationSatisfied

> **migrationSatisfied**: `boolean`

Defined in: [types.ts:135](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L135)

Whether a registered migration chain already covers the change.

#### Remarks

This is what lets the check go green again: once the version is bumped and
a chain leads from the baseline version to the current one, the work has
been done as far as this tool can tell. It does **not** mean the migration
is correct - only that one exists.

Always `false` when the game's code was not imported, since there is no
registry to consult.
