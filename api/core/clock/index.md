# Clock

Game clock module for the react-text-game engine.

Provides in-fiction time that is independent of wall-clock time, persists
with the save, and by default only advances when the game advances it.

## Example

```typescript
import { Clock, HOUR, MINUTE } from '@react-text-game/core/clock';
import { useGameTime } from '@react-text-game/core';

// Advance time from an action handler.
Clock.advance(30 * MINUTE);

// Read it anywhere.
const inGameDate = new Date(Clock.now());

// Render it reactively.
function ClockDisplay() {
  const now = useGameTime();
  return <span>{new Date(now).toLocaleTimeString()}</span>;
}
```

## Classes

- [Clock](classes/Clock.md)

## Type Aliases

- [ClockMode](type-aliases/ClockMode.md)
- [ClockOptions](type-aliases/ClockOptions.md)
- [ClockSaveState](type-aliases/ClockSaveState.md)
- [ClockState](type-aliases/ClockState.md)

## Variables

- [CLOCK\_STORAGE\_PATH](variables/CLOCK_STORAGE_PATH.md)
- [DAY](variables/DAY.md)
- [DEFAULT\_CLOCK\_OPTIONS](variables/DEFAULT_CLOCK_OPTIONS.md)
- [DEFAULT\_CLOCK\_START\_AT](variables/DEFAULT_CLOCK_START_AT.md)
- [HOUR](variables/HOUR.md)
- [MINUTE](variables/MINUTE.md)
- [SECOND](variables/SECOND.md)

## Functions

- [resolveClockNow](functions/resolveClockNow.md)
