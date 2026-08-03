# Function: resolveClockNow()

> **resolveClockNow**(`clockState`): `number`

Defined in: [clock.ts:42](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/core/src/clock/clock.ts#L42)

**`Internal`**

Derives the current game time from a clock state.

Exported so React hooks can compute the same value from a Valtio snapshot
without duplicating the anchor arithmetic.

## Parameters

### clockState

`Readonly`\<[`ClockState`](../type-aliases/ClockState.md)\>

## Returns

`number`
