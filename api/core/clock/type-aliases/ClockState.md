# Type Alias: ClockState

> **ClockState** = `object`

Defined in: [types.ts:61](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L61)

Reactive state backing the game clock.

## Remarks

Game time is stored as a pair of anchors rather than a running counter:
`anchorGame` is the game time at the moment `anchorReal` was captured. In
`"realtime"` mode the current value is derived from that pair on every read,
which is why the clock needs no interval to stay accurate.

## Properties

### anchorGame

> **anchorGame**: `number`

Defined in: [types.ts:63](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L63)

Game time, in milliseconds, at the last re-anchor.

***

### anchorReal

> **anchorReal**: `number`

Defined in: [types.ts:66](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L66)

Wall-clock time, in milliseconds, at the last re-anchor.

***

### mode

> **mode**: [`ClockMode`](ClockMode.md)

Defined in: [types.ts:69](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L69)

How game time advances.

***

### paused

> **paused**: `boolean`

Defined in: [types.ts:75](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L75)

Whether `"realtime"` accrual is currently frozen.

***

### scale

> **scale**: `number`

Defined in: [types.ts:72](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/types.ts#L72)

Multiplier applied to elapsed wall-clock time in `"realtime"` mode.
