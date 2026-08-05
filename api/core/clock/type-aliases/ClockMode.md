# Type Alias: ClockMode

> **ClockMode** = `"manual"` \| `"realtime"`

Defined in: [types.ts:13](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/clock/types.ts#L13)

How the game clock advances.

## Remarks

- `"manual"` - game time only moves when [Clock.advance](../classes/Clock.md#advance) or
  [Clock.set](../classes/Clock.md#set) is called. Fully deterministic, which makes saves,
  replays, and tests reproducible. This is the default.
- `"realtime"` - game time flows with wall-clock time, multiplied by
  [ClockState.scale](ClockState.md#scale). The value is computed on read, so no timer has to
  run for the clock to stay correct across saves, reloads, and suspended
  tabs.
