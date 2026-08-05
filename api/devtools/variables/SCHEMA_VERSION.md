# Variable: SCHEMA\_VERSION

> `const` **SCHEMA\_VERSION**: `1` = `1`

Defined in: [types.ts:8](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/devtools/src/types.ts#L8)

Format version of the snapshot files this tool writes and reads.

## Remarks

Bumped only when the on-disk shape changes in a way older tooling cannot
read. `check` refuses snapshots it does not recognise rather than guessing.
