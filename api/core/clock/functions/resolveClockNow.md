# Function: resolveClockNow()

> **resolveClockNow**(`clockState`): `number`

Defined in: [clock.ts:42](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/clock/clock.ts#L42)

**`Internal`**

Derives the current game time from a clock state.

Exported so React hooks can compute the same value from a Valtio snapshot
without duplicating the anchor arithmetic.

## Parameters

### clockState

`Readonly`\<[`ClockState`](../type-aliases/ClockState.md)\>

## Returns

`number`
