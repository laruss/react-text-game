# Type Alias: SchemaKind

> **SchemaKind** = `string`

Defined in: [types.ts:32](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/types.ts#L32)

A value's *kind*, not its value.

## Remarks

Snapshots deliberately record kinds only. Entity defaults are frequently
non-deterministic (`Date.now()` is a common one), so storing values would
make every capture differ from the last for no reason.

Primitives use their `typeof` name; `null` is its own kind; arrays are
`array<kind>`, degrading to `array<unknown>` when empty and `array<mixed>`
when elements disagree.
