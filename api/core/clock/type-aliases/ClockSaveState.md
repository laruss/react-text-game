# Type Alias: ClockSaveState

> **ClockSaveState** = `Omit`\<[`ClockState`](ClockState.md), `"anchorReal"`\>

Defined in: [types.ts:91](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/clock/types.ts#L91)

Shape persisted at `$._system.clock`.

## Remarks

`anchorGame` holds the resolved game time at the moment of saving.
[ClockState.anchorReal](ClockState.md#anchorreal) is deliberately not persisted: loading always
re-anchors it to the current wall clock, so real time that passed while a save
sat unused never leaks into game time. Storing it would keep a value nothing
reads and make consecutive snapshots differ even when nothing changed.

Saves written before this field was dropped remain loadable - the extra key is
simply ignored - so no migration is required.
