# Function: resolveClockNow()

> **resolveClockNow**(`clockState`): `number`

Defined in: [clock.ts:42](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/clock.ts#L42)

**`Internal`**

Derives the current game time from a clock state.

Exported so React hooks can compute the same value from a Valtio snapshot
without duplicating the anchor arithmetic.

## Parameters

### clockState

`Readonly`\<[`ClockState`](../type-aliases/ClockState.md)\>

## Returns

`number`
