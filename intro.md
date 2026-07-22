---
slug: /
title: React Text Game
description: A type-safe React engine for interactive fiction, story passages, maps, reactive entities, and persistent saves.
image: /img/og-image.webp
---

# React Text Game

Build interactive fiction with a small engine layer and use as much—or as little—of the supplied React UI as you want.

React Text Game is split into three libraries:

| Package | Use it for |
| --- | --- |
| `@react-text-game/core` | reactive game entities, passage navigation, saves, migrations, audio, and i18n |
| `@react-text-game/ui` | ready-made story and map renderers, save UI, and replaceable component slots |
| `@react-text-game/mdx` | authoring story passages in MDX |

## A passage in 30 seconds

```tsx title="src/game/intro.ts"
import { Game, newStory } from "@react-text-game/core";

export const intro = newStory("intro", () => [
    { type: "header", content: "The station", props: { level: 1 } },
    { type: "text", content: "The last train is waiting." },
    {
        type: "actions",
        content: [
            {
                label: "Board the train",
                action: () => Game.jumpTo("inside-train"),
            },
        ],
    },
]);
```

Passages and entities register when their modules are imported. `GameProvider` initializes the engine and renders the current passage:

```tsx title="src/main.tsx"
import "./game/intro";
import "@react-text-game/ui/styles";
import { GameProvider, PassageController } from "@react-text-game/ui";

const options = {
    gameName: "Night Train",
    startPassage: "intro",
    isDevMode: import.meta.env.DEV,
};

root.render(
    <GameProvider options={options}>
        <PassageController />
    </GameProvider>
);
```

## Choose your path

- Follow [Installation](/getting-started) and [Build your first game](/first-game) for a working React setup.
- Read [Core concepts](/core-concepts) when you need entities, saves, or custom passage logic.
- Use [Interactive maps](/interactive-maps) for coordinate-safe hotspots and decorative `mapImage` entities.
- Configure [preloading, loading progress, and splash screens](/loading-and-splash-screens) for the startup experience.
- Open [Custom UI](/custom-ui) to replace one primitive, a whole passage renderer, or the entire presentation layer.
- Install the [React Text Game agent skill](/agent-skill) so Codex and other compatible agents follow the library's lifecycle, map-coordinate, and verification contracts.
- Use the [Core API](/api/core/), [UI API](/api/ui/), and [MDX API](/api/mdx/) for exact signatures.

## Design principles

- Game state belongs to core entities, not UI components.
- A passage describes what to display; a renderer decides how it looks.
- Map coordinates are percentages of the fitted source image, so hotspots remain anchored across viewport sizes.
- Callable content is evaluated when a passage is displayed, allowing state-driven stories without a second schema.

The packages are independently usable, fully typed, and published under the MIT license. Source and example applications are available on [GitHub](https://github.com/laruss/react-text-game).
