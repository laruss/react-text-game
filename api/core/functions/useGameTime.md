# Function: useGameTime()

> **useGameTime**(`tickMs?`): `number`

Defined in: [packages/core/src/hooks/useGameTime.ts:34](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/hooks/useGameTime.ts#L34)

React hook returning the current game time in milliseconds.

Re-renders whenever the clock is advanced, set, paused, resumed, or
reconfigured. In `"realtime"` mode flowing time mutates nothing, so pass
`tickMs` when the component has to update on its own - a ticking clock
display, a countdown, a "last seen" label.

## Parameters

### tickMs?

`number`

Optional interval, in real milliseconds, forcing a re-render

## Returns

`number`

Game time in milliseconds, suitable for `new Date(...)`

## Example

```tsx
import { useGameTime } from '@react-text-game/core';

// Updates only when the game moves the clock.
function DayLabel() {
  const now = useGameTime();
  return <span>{new Date(now).toDateString()}</span>;
}

// Updates every real second, for a live clock in realtime mode.
function LiveClock() {
  const now = useGameTime(1000);
  return <span>{new Date(now).toLocaleTimeString()}</span>;
}
```
