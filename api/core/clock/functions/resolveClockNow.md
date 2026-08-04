# Function: resolveClockNow()

> **resolveClockNow**(`clockState`): `number`

Defined in: [clock.ts:42](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/clock/clock.ts#L42)

**`Internal`**

Derives the current game time from a clock state.

Exported so React hooks can compute the same value from a Valtio snapshot
without duplicating the anchor arithmetic.

## Parameters

### clockState

`Readonly`\<[`ClockState`](../type-aliases/ClockState.md)\>

## Returns

`number`
