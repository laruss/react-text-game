---
title: Game Clock
description: In-fiction time for React Text Game. Advance game time from actions, persist it with the save, and choose between a deterministic manual clock and real-time flow.
keywords:
    - game clock
    - game time
    - schedule
    - cooldown
    - day night cycle
    - timestamps
    - react text game
image: /img/og-image.webp
---

# Game Clock

Games need a notion of time that is **not** wall-clock time. "Three hours later",
a shop that opens in the morning, a cooldown, the timestamp on a message - all of
these should depend on what happened in the story, not on when the player
happened to be playing.

`Clock` provides that. It lives in the core package under its own entry point,
persists with the save, and by default only moves when your game moves it.

```typescript
import { Clock, HOUR, MINUTE } from "@react-text-game/core/clock";

Clock.now(); // game time in milliseconds
Clock.advance(30 * MINUTE); // from an action handler
new Date(Clock.now()).toLocaleTimeString();
```

## Why not `Date.now()`?

`Date.now()` makes your game depend on when it was played. Two players who make
the same choices see different in-fiction times, a save loaded a week later jumps
a week forward, and tests and screenshots stop being reproducible.

A fresh game therefore starts at a **fixed fictional timestamp**, not at the
current date.

## The one rule

`advance()`, `set()`, `pause()`, `resume()`, `setMode()` and `setScale()` all
change game state, so they belong in an **action handler** - never in a passage
body. A passage's `display()` runs again on every React render, on every save
load, and on every remount, so a clock advanced there would keep advancing.

```typescript
// Wrong: time moves again on every render and every save load.
defineStory("inn", (h) => {
    Clock.advance(8 * HOUR);
    return [h.text("You wake up rested.")];
});

// Right: time moves when the player chooses to sleep.
defineStory("inn", (h) => [
    h.text("A bed, and a long night ahead."),
    h.actions([
        {
            content: "Sleep until morning",
            action: () => {
                Clock.advance(8 * HOUR);
                Game.jumpTo("morning");
            },
        },
    ]),
]);
```

Reading `Clock.now()` while rendering is safe.

## Configuration

```typescript
await Game.init({
    gameName: "My Game",
    clock: {
        startAt: Date.UTC(2031, 4, 12, 8, 30),
        mode: "manual",
        scale: 1,
    },
});
```

| Option    | Default                  | Meaning                                        |
| --------- | ------------------------ | ---------------------------------------------- |
| `startAt` | 2000-01-01, 09:00 UTC    | Game time a fresh game begins at               |
| `mode`    | `"manual"`               | How time advances                              |
| `scale`   | `1`                      | Real-to-game multiplier in `"realtime"` mode   |

## Two modes

### `manual` (default)

Time stands still until the game moves it. Fully deterministic, which makes
saves, replays and tests reproducible. This is what you want for a visual novel
or any story where time is a narrative device.

```typescript
Clock.advance(30 * MINUTE); // "half an hour later"
Clock.set(Date.UTC(2031, 4, 13, 6, 0)); // "the next morning"
```

### `realtime`

Game time flows with real time, multiplied by `scale`. A `scale` of `60` turns
one real second into one game minute.

```typescript
await Game.init({
    gameName: "My Game",
    clock: { mode: "realtime", scale: 60 },
});
```

The current value is **computed on read** from a stored anchor pair, so no timer
has to run for the clock to stay correct across saves, page reloads and suspended
tabs. `Clock.advance()` still works and still re-anchors, so explicit jumps and
continuous flow compose.

Elapsed real time accrues while the game is closed. Call `Clock.pause()` before
unload and `Clock.resume()` on start if you would rather it did not.

You can switch at runtime, and the current game time is preserved:

```typescript
Clock.setMode("realtime");
Clock.setScale(60);
Clock.pause();
Clock.resume();
```

## Reading it in React

`useGameTime()` re-renders whenever the clock is advanced, set, paused, resumed
or reconfigured:

```tsx
import { useGameTime } from "@react-text-game/core";

function DayLabel() {
    const now = useGameTime();
    return <span>{new Date(now).toDateString()}</span>;
}
```

In `"realtime"` mode, flowing time mutates nothing, so nothing triggers a
re-render on its own. Pass an interval when the component has to tick by itself:

```tsx
function LiveClock() {
    const now = useGameTime(1000); // re-render every real second
    return <span>{new Date(now).toLocaleTimeString()}</span>;
}
```

For non-React code, `Clock.subscribe(callback)` fires on every clock state
change.

## Persistence

The clock rides along with every save. On load, game time is restored exactly,
and real-time flow is re-anchored to the moment of loading - so real time that
passed while a save sat on disk never leaks into your story.

## Duration helpers

```typescript
import { DAY, HOUR, MINUTE, SECOND } from "@react-text-game/core/clock";

Clock.advance(2 * DAY + 6 * HOUR);
```

## Related topics

- [Messenger](/messenger) - scheduled message delivery measured in game time
- [Handling Side Effects](/side-effects) - why mutations belong in actions
- [Clock API](/api/core/clock/) - full reference
