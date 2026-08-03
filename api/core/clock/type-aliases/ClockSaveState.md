# Type Alias: ClockSaveState

> **ClockSaveState** = [`ClockState`](ClockState.md)

Defined in: [types.ts:86](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/core/src/clock/types.ts#L86)

Shape persisted at `$._system.clock`.

## Remarks

`anchorGame` holds the resolved game time at the moment of saving, and
`anchorReal` is re-anchored on load, so real time that passed while the save
sat on disk never leaks into game time.
