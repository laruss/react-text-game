# Side effects in passages

## Contents

- Why a passage body runs more than once
- One-time events
- RNG that must stay stable
- Visit counters
- Refreshing the screen after a mutation
- Interactive maps and widgets
- Review checklist

## Why a passage body runs more than once

A passage is a display description, not a script that executes once. The engine calls `display()`:

1. when the player navigates to the passage,
2. when a save is loaded and the component remounts,
3. on any ordinary React re-render.

Nothing deduplicates those calls, and no memoization is guaranteed to. A mutation in the body therefore runs an unpredictable number of times. The most common shape of the bug:

1. player enters the treasure room, `display()` grants +100 gold (total 100),
2. player saves,
3. player loads that save, `display()` runs again, +100 gold (total 200),
4. every subsequent load adds another 100.

The save file is now permanently wrong, and no error was ever raised.

## One-time events

Gate the content on a persisted flag, and set the flag in the action.

```ts
const player = createEntity("player", {
    foundArtifact: false,
    inventory: [] as string[],
});

export const secretRoom = defineStory("secret-room", (h) => [
    h.text(
        player.foundArtifact
            ? "The chamber is empty now."
            : "A hidden chamber holds an ancient artifact."
    ),
    h.actions([
        !player.foundArtifact && {
            content: "Take the artifact",
            action: () => {
                player.inventory.push("ancient-artifact");
                player.foundArtifact = true;
                Game.jumpTo(secretRoom);
            },
        },
        player.foundArtifact && { content: "Leave", action: h.jump("main-hall") },
    ]),
]);
```

## RNG that must stay stable

`Math.random()` in a passage body produces a different result on every render, so the screen contradicts itself and a reloaded save shows a different outcome. Draw the value in an action, persist it, and read it during render.

```ts
const encounter = createEntity("encounter", { seed: undefined as number | undefined });

// In the action that leads into the scene:
encounter.seed = Math.random();
Game.jumpTo("road-encounter");

export const roadEncounter = defineStory("road-encounter", (h) => {
    const seed = encounter.seed ?? 0;
    const kind = seed < 0.3 ? "merchant" : seed < 0.7 ? "traveler" : "bandit";

    return [
        h.text(`You meet a ${kind} on the road.`),
        h.actions([
            {
                content: "Approach",
                action: () => {
                    encounter.seed = undefined;
                    Game.jumpTo(`encounter-${kind}`);
                },
            },
        ]),
    ];
});
```

## Visit counters

Increment in the action that performs the transition, never in the body of the passage being counted.

```ts
const world = createEntity("world", { tavernVisits: 0 });

export const tavernDoor = defineStory("tavern-door", (h) => [
    h.text(
        world.tavernVisits === 0
            ? "You have never been inside before."
            : "The barkeep recognises you."
    ),
    h.actions([
        {
            content: "Enter",
            action: () => {
                world.tavernVisits += 1;
                Game.jumpTo("tavern-interior");
            },
        },
    ]),
]);
```

## Refreshing the screen after a mutation

Mutating an entity that the passage reads does not always redraw the passage, because the passage is not a `useGameEntity` consumer. Jump to the same passage to force a fresh render cycle:

```ts
action: () => {
    chest.isOpen = true;
    Game.jumpTo(currentPassage); // new renderId, remount, fresh display()
}
```

Prefer this over reaching for React state. It keeps the screen a function of persisted state, which is what makes save and load correct.

## Interactive maps and widgets

The rule is not specific to stories.

- Interactive-map content callbacks resolve on display, exactly like story content. Reading state to decide which hotspots exist is fine; mutating inside the callback is the same bug. Put it in the hotspot `action`.
- A `Widget` passage is an ordinary React tree, so its render body follows normal React rules: no mutation during render. Use event handlers, and prefer entity writes over `useState` for anything that must survive a save.

## Review checklist

When reviewing or writing a passage, confirm each item:

- [ ] No assignment to an entity field outside an `action` or event handler.
- [ ] No `push`, `splice`, `delete`, or `++` on entity data during render.
- [ ] No `Math.random()`, `Date.now()`, or fetch during render whose result the player can see.
- [ ] Every reward, flag, and counter is guarded so replaying the passage cannot repeat it.
- [ ] Loading a save on this screen twice produces identical state both times.
