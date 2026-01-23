---
sidebar_position: 4
title: Handling Side Effects
description: Best practices for implementing side effects in React Text Game passages. Learn how to avoid duplicate logic when saving and loading, and structure your game code for reliable state management.
keywords:
    - side effects
    - game state
    - save load
    - best practices
    - passage actions
    - state management
    - react text game
image: /img/og-image.webp
---

# Handling Side Effects

When building interactive narratives with React Text Game, it's important to understand how passages are rendered and how to properly handle side effects like modifying game state, awarding items, or tracking statistics.

## Understanding the Problem

A **side effect** is any operation that modifies state outside the passage's display content - for example, giving the player an item, reducing health, or incrementing a counter.

### How Passages Work

When a passage is displayed, the engine calls its `display()` function to generate the content. This happens:

1. **When the player navigates to the passage** - The first render
2. **When the player saves and loads the game** - React re-mounts the component
3. **When React re-renders** - Due to state changes or parent re-renders

If you put side effects directly in the passage body, they will execute **every time** `display()` is called:

```tsx
// BAD: Side effect in passage body
const treasureRoom = newStory("treasure-room", () => {
    // This runs EVERY TIME the passage is displayed!
    player.gold += 100; // Player gets 100 gold on first visit
    player.gold += 100; // ...and again when loading a save
    player.gold += 100; // ...and again on any re-render

    return [
        { type: "text", content: "You found a treasure chest!" },
        { type: "text", content: `You now have ${player.gold} gold.` },
    ];
});
```

### The Save/Load Problem

Consider this scenario:

1. Player enters the treasure room for the first time
2. `display()` runs, player gets +100 gold (now has 100)
3. Player saves the game
4. Player loads the save
5. `display()` runs again, player gets +100 gold (now has 200!)

This is a critical bug - the player's gold keeps increasing every time they load their save.

## The Solution: Actions, Not Passage Bodies

**Always implement side effects in actions**, not in the passage body. Actions are user-triggered and only execute when the player explicitly clicks a button.

### Correct Pattern

```tsx
// GOOD: Side effect in action
const treasureRoom = newStory("treasure-room", () => [
    { type: "text", content: "You found a treasure chest!" },
    {
        type: "actions",
        content: [
            {
                label: "Open the chest",
                action: () => {
                    // This only runs when the player clicks the button
                    player.gold += 100;
                    Game.jumpTo("treasure-collected");
                },
            },
            {
                label: "Leave it alone",
                action: () => Game.jumpTo("corridor"),
            },
        ],
    },
]);

const treasureCollected = newStory("treasure-collected", () => [
    {
        type: "text",
        content: `You collected 100 gold! You now have ${player.gold} gold.`,
    },
    {
        type: "actions",
        content: [{ label: "Continue", action: () => Game.jumpTo("corridor") }],
    },
]);
```

Now the gold is only awarded when the player **chooses** to open the chest, and loading a save won't duplicate the reward.

## Common Scenarios and Solutions

### Scenario 1: One-Time Events

For events that should only happen once (finding a unique item, triggering a story event):

```tsx
// GOOD: Track one-time events
const player = createEntity("player", {
    foundSecretRoom: false,
    inventory: [] as string[],
});

const secretRoom = newStory("secret-room", () => [
    {
        type: "text",
        content: player.foundSecretRoom
            ? "The secret room is empty now."
            : "You discovered a hidden chamber with an ancient artifact!",
    },
    {
        type: "actions",
        content: player.foundSecretRoom
            ? [{ label: "Leave", action: () => Game.jumpTo("main-hall") }]
            : [
                  {
                      label: "Take the artifact",
                      action: () => {
                          player.inventory.push("ancient-artifact");
                          player.foundSecretRoom = true;
                          player.save();
                          Game.jumpTo("secret-room"); // Refresh to show new state
                      },
                  },
              ],
    },
]);
```

### Scenario 2: Combat or Resource Changes

For passages involving combat or resource management:

```tsx
// GOOD: Combat in actions
const battlePassage = newStory("battle", () => [
    {
        type: "text",
        content: `A goblin appears! Your health: ${player.health}`,
    },
    {
        type: "actions",
        content: [
            {
                label: "Attack",
                action: () => {
                    const damage = Math.floor(Math.random() * 10) + 5;
                    player.health -= damage;
                    player.save();

                    if (player.health <= 0) {
                        Game.jumpTo("game-over");
                    } else {
                        Game.jumpTo("battle-result");
                    }
                },
            },
            {
                label: "Run away",
                action: () => Game.jumpTo("forest"),
            },
        ],
    },
]);
```

### Scenario 3: Random Events

For passages with random content that should stay consistent:

```tsx
// GOOD: Generate random content once and store it
const player = createEntity("player", {
    currentEventSeed: null as number | null,
});

const randomEncounter = newStory("random-encounter", () => {
    // Use stored seed or generate new one
    const seed = player.currentEventSeed ?? Math.random();

    // Determine encounter based on seed (deterministic)
    const encounterType =
        seed < 0.3 ? "merchant" : seed < 0.7 ? "traveler" : "bandit";

    return [
        {
            type: "text",
            content: `You encounter a ${encounterType} on the road.`,
        },
        {
            type: "actions",
            content: [
                {
                    label: "Approach",
                    action: () => {
                        // Clear seed when leaving so next encounter is different
                        player.currentEventSeed = null;
                        player.save();
                        Game.jumpTo(`encounter-${encounterType}`);
                    },
                },
                {
                    label: "Avoid",
                    action: () => {
                        player.currentEventSeed = null;
                        player.save();
                        Game.jumpTo("continue-road");
                    },
                },
            ],
        },
    ];
});

// Set seed before entering the passage
function triggerRandomEncounter() {
    player.currentEventSeed = Math.random();
    player.save();
    Game.jumpTo("random-encounter");
}
```

### Scenario 4: Tracking Visit Counts

For passages that should behave differently based on visit count:

```tsx
// GOOD: Track visits in entity, increment in action
const gameState = createEntity("gameState", {
    tavernVisits: 0,
});

const tavernEntrance = newStory("tavern-entrance", () => [
    {
        type: "text",
        content:
            gameState.tavernVisits === 0
                ? "You enter the tavern for the first time. The smell of ale fills the air."
                : `You return to the tavern. The bartender recognizes you.`,
    },
    {
        type: "actions",
        content: [
            {
                label: "Enter",
                action: () => {
                    gameState.tavernVisits += 1;
                    gameState.save();
                    Game.jumpTo("tavern-interior");
                },
            },
        ],
    },
]);
```

## Interactive Maps

The same principles apply to Interactive Map passages:

```tsx
// GOOD: Side effects in hotspot actions
const worldMap = newInteractiveMap("world-map", {
    image: "/maps/world.jpg",
    hotspots: [
        {
            type: "label",
            content: "Treasure Island",
            position: { x: 70, y: 60 },
            action: () => {
                // Side effect in action - safe!
                if (!player.visitedIsland) {
                    player.visitedIsland = true;
                    player.save();
                }
                Game.jumpTo("treasure-island");
            },
        },
        // Conditional hotspot - reading state is fine in passage body
        () =>
            player.hasMap
                ? {
                      type: "label",
                      content: "Secret Cove",
                      position: { x: 20, y: 80 },
                      action: () => Game.jumpTo("secret-cove"),
                  }
                : undefined,
    ],
});
```

## Summary: The Golden Rule

:::tip The Golden Rule
**Reading state in passage bodies is safe. Modifying state should only happen in actions.**
:::

| Safe in Passage Body       | Must Be in Actions      |
| -------------------------- | ----------------------- |
| Reading entity values      | Modifying entity values |
| Conditional rendering      | Awarding items/gold     |
| Displaying current stats   | Combat calculations     |
| Checking flags             | Setting flags           |
| Generating display content | Incrementing counters   |

By following this pattern, your game will behave correctly when:

- Players navigate between passages
- Players save and load their game
- React re-renders components
- Players revisit passages multiple times

## Related Topics

- [Core Concepts](/docs/core-concepts) - Entity and passage fundamentals
- [Migrations](/docs/migrations) - Handle save compatibility across versions
