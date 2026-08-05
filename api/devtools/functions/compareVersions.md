# Function: compareVersions()

> **compareVersions**(`left`, `right`): `number`

Defined in: [store.ts:14](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/store.ts#L14)

Compares two version strings by their leading numeric segments.

## Parameters

### left

`string`

### right

`string`

## Returns

`number`

## Remarks

Deliberately loose rather than a full semver implementation: it only has to
order the snapshot files in one directory. Non-numeric suffixes fall back to a
string comparison, so `1.0.0-rc.1` and `1.0.0-rc.2` still order sensibly.
