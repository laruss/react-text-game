# Variable: SCHEMA\_VERSION

> `const` **SCHEMA\_VERSION**: `1` = `1`

Defined in: [types.ts:8](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/devtools/src/types.ts#L8)

Format version of the snapshot files this tool writes and reads.

## Remarks

Bumped only when the on-disk shape changes in a way older tooling cannot
read. `check` refuses snapshots it does not recognise rather than guessing.
