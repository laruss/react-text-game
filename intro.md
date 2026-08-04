---
slug: /
title: React Text Game
description: A type-safe React engine for interactive fiction, story passages, maps, reactive entities, and persistent saves.
image: /img/og-image.webp
---

# React Text Game

Build interactive fiction with a small engine layer and use as much—or as little—of the supplied React UI as you want.

React Text Game is split into four libraries:

| Package | Use it for |
| --- | --- |
| `@react-text-game/core` | reactive game entities, passage navigation, saves, migrations, audio, the game clock, and i18n |
| `@react-text-game/ui` | ready-made story and map renderers, save UI, and replaceable component slots |
| `@react-text-game/mdx` | authoring story passages in MDX |
| `@react-text-game/messenger` | persistent chat transcripts with unread tracking, for messenger sims and visual novels |

Only `core` is required. Each of the others is optional and independently usable.

One more package ships as a development tool rather than a library:

| Package | Use it for |
| --- | --- |
| `@react-text-game/devtools` | the `rtg` CLI, which tells you whether a release needs a [save migration](/keep-saves-valid) |

## A passage in 30 seconds

```tsx title="src/game/intro.ts"
import { defineStory } from "@react-text-game/core";

export const intro = defineStory("intro", (h) => [
    h.header("The station", { level: 1 }),
    h.text("The last train is waiting."),
    h.actions([{ content: "Board the train", action: h.jump("inside-train") }]),
]);
```

The content callback receives a toolbox of component builders (`h`) as its first argument, so you never have to write component objects by hand.

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
- Build chat-driven stories with [Messenger & Transcripts](/messenger) when message history has to persist and unread state matters.
- Reach for the [Game Clock](/game-clock) whenever the story needs in-fiction time: schedules, cooldowns, or "three hours later".
- Open [Custom UI](/custom-ui) to replace one primitive, a whole passage renderer, or the entire presentation layer.
- Install the [React Text Game agent skill](/agent-skill) so Codex and other compatible agents follow the library's lifecycle, map-coordinate, and verification contracts.
- Run [Keep your saves valid](/keep-saves-valid) before every release so a shape change never reaches players unmigrated.
- Use the [Core API](/api/core/), [UI API](/api/ui/), [MDX API](/api/mdx/), [Messenger API](/api/messenger/), and [Devtools API](/api/devtools/) for exact signatures.

## Design principles

- Game state belongs to core entities, not UI components.
- A passage describes what to display; a renderer decides how it looks.
- Map coordinates are percentages of the fitted source image, so hotspots remain anchored across viewport sizes.
- Callable content is evaluated when a passage is displayed, allowing state-driven stories without a second schema.

The packages are independently usable, fully typed, and published under the MIT license. Source and example applications are available on [GitHub](https://github.com/laruss/react-text-game).
