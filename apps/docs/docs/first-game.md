---
title: Build your first game
description: Create a reactive player, two passages, and a working React entry point.
---

# Build your first game

This example has one reactive entity and two story passages. Copy the three files into an existing React + TypeScript application after completing [Installation](/getting-started).

## 1. Create game state

```ts title="src/game/player.ts"
import { createEntity } from "@react-text-game/core";

export const player = createEntity("player", {
    name: "Traveler",
    courage: 0,
});
```

Entity properties are reactive and included in game saves. Mutate them directly:

```ts
player.courage += 1;
```

## 2. Create passages

```tsx title="src/game/passages.ts"
import { Game, newStory } from "@react-text-game/core";
import { player } from "./player";

export const intro = newStory("intro", () => [
    { type: "header", content: "At the forest edge", props: { level: 1 } },
    {
        type: "text",
        content: `Courage: ${player.courage}. A narrow path disappears into the fog.`,
    },
    {
        type: "actions",
        content: [
            {
                label: "Enter the forest",
                action: () => {
                    player.courage += 1;
                    Game.jumpTo("forest");
                },
            },
        ],
    },
]);

export const forest = newStory("forest", () => [
    { type: "header", content: "Under the trees", props: { level: 1 } },
    { type: "text", content: () => `Your courage is now ${player.courage}.` },
    {
        type: "actions",
        content: [
            { label: "Return", action: () => Game.jumpTo("intro") },
        ],
    },
]);
```

The content factory runs each time the passage is displayed, so returning to `intro` shows the current state.

## 3. Render the current passage

```tsx title="src/main.tsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./game/passages";
import "./styles.css";
import { GameProvider, PassageController } from "@react-text-game/ui";

const gameOptions = {
    gameName: "Forest Walk",
    startPassage: "intro",
    isDevMode: import.meta.env.DEV,
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GameProvider options={gameOptions}>
            <main className="min-h-screen">
                <PassageController />
            </main>
        </GameProvider>
    </StrictMode>
);
```

Start your application and select **Enter the forest**. The next passage should show `Courage: 1`; returning and entering again should increment it.

## Where to go next

- Add a visual scene with [Interactive maps](/interactive-maps).
- Replace the supplied buttons or complete passage renderer in [Custom UI](/custom-ui).
- Add persistence and version upgrades with [Save migrations](/migrations).
- Move narrative content into [MDX](/mdx-integration).
