# Variable: SCHEMA\_VERSION

> `const` **SCHEMA\_VERSION**: `1` = `1`

Defined in: [types.ts:8](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/devtools/src/types.ts#L8)

Format version of the snapshot files this tool writes and reads.

## Remarks

Bumped only when the on-disk shape changes in a way older tooling cannot
read. `check` refuses snapshots it does not recognise rather than guessing.
