---
title: First game with core only
sidebar_label: With core only
description: Build a text game on @react-text-game/core alone — a reactive entity, two story passages, an explicit Game.init(), and a passage renderer you write yourself.
keywords:
    - react text game core
    - core only tutorial
    - Game.init
    - useCurrentPassage
    - custom passage renderer
    - defineStory
---

# Build your first game with core only

:::info This tutorial uses one package
This is the **core-only** path: `@react-text-game/core` runs the game and *you* write
the renderer, the layout, the buttons and the startup UI. Choose it when your
application already has its own design system.

For the supplied story renderer, start menu, save dialogs and dev tools, follow
[Build your first game with core + UI](/first-game/core+ui) instead.
:::

This example has one reactive entity, two story passages, and about thirty lines of
rendering code. Copy the files into an existing React + TypeScript application.

## 1. Install

```bash npm2yarn
npm install @react-text-game/core
```

`react` and `react-dom` (18 or 19) are peer dependencies. There is no stylesheet and
no Tailwind requirement on this path — core ships no markup.

## 2. Create game state

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

## 3. Create passages

```ts title="src/game/passages.ts"
import { defineStory, Game } from "@react-text-game/core";

import { player } from "./player";

export const intro = defineStory("intro", (h) => [
    h.header("At the forest edge", { level: 1 }),
    h.text(
        `Courage: ${player.courage}. A narrow path disappears into the fog.`
    ),
    h.actions([
        {
            content: "Enter the forest",
            action: () => {
                player.courage += 1;
                Game.jumpTo("forest");
            },
        },
    ]),
]);

export const forest = defineStory("forest", (h) => [
    h.header("Under the trees", { level: 1 }),
    h.text(`Your courage is now ${player.courage}.`),
    h.actions([{ content: "Return", action: h.jump("intro") }]),
]);
```

The content callback runs each time the passage is displayed, so returning to `intro`
shows the current state.

`h` is the story helper toolbox: `h.text`, `h.header`, `h.image`, `h.video`,
`h.actions`, `h.conversation` and `h.include` build components, while
`h.jump(passageId)` builds a navigation handler and `h.when(condition, value)` builds a
conditional one. Anything falsy in the array is dropped, so conditional content can be
written inline:

```ts
export const clearing = defineStory("clearing", (h) => [
    h.text("A quiet clearing opens up."),
    player.courage > 2 && h.text("You feel ready for whatever comes next."),
]);
```

Every component a passage can return is a plain, serializable object — that is what
makes writing your own renderer straightforward. The full list is in
[Core concepts](/core-concepts#story-passages).

## 4. Write a renderer

A story passage hands you `{ components, options }` from `display()`. Walk the array
and emit whatever markup your application uses:

```tsx title="src/StoryView.tsx"
import type { Component, Story } from "@react-text-game/core";

const renderComponent = (component: Component, index: number) => {
    switch (component.type) {
        case "header": {
            const Tag = `h${component.props?.level ?? 1}` as "h1";
            return <Tag key={index}>{component.content}</Tag>;
        }
        case "text":
            return <p key={index}>{component.content}</p>;
        case "image":
            return (
                <img
                    key={index}
                    src={component.content}
                    alt={component.props?.alt ?? ""}
                />
            );
        case "actions":
            return (
                <div key={index} className="actions">
                    {component.content.map((action, actionIndex) => (
                        <button
                            key={actionIndex}
                            type="button"
                            onClick={action.action}
                            disabled={action.isDisabled}
                        >
                            {action.content ?? action.label}
                        </button>
                    ))}
                </div>
            );
        default:
            return null;
    }
};

export const StoryView = ({ story }: { story: Story }) => {
    const { components } = story.display();

    return <article>{components.map(renderComponent)}</article>;
};
```

Handle only the component types your game actually uses; the `default` branch keeps
the renderer safe as you add more.

## 5. Render the current passage

`useCurrentPassage()` returns a tuple: the current passage and a render id that
changes on every navigation. Using it as a React key remounts the view when the player
jumps to the passage they are already on.

```tsx title="src/App.tsx"
import { type Story, useCurrentPassage } from "@react-text-game/core";

import { StoryView } from "./StoryView";

export const App = () => {
    const [passage, renderId] = useCurrentPassage();

    if (!passage) {
        return <p>Nothing to show.</p>;
    }

    if (passage.type === "story") {
        return <StoryView key={renderId} story={passage as Story} />;
    }

    return <p>Unsupported passage type: {passage.type}</p>;
};
```

## 6. Initialize the engine

Passages and entities register as their modules are imported, and they may register
before initialization. Navigation, saves, state and options, however, all require
`Game.init()` to have resolved — on this path that lifecycle is yours to own, so
render only after it settles.

```tsx title="src/main.tsx"
import { Game } from "@react-text-game/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { intro } from "./game/passages";

const root = createRoot(document.getElementById("root")!);

Game.init({
    gameName: "Forest Walk",
    startPassage: intro,
    isDevMode: import.meta.env.DEV,
}).then(() => {
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
```

Import a single registry module from your entry point so a production bundler cannot
drop a passage nobody imports by name, as described in
[Installation](/getting-started#register-game-modules-before-rendering).

Start your application and select **Enter the forest**. The next passage should show
`Courage: 1`; returning and entering again should increment it.

## What core gives you, and what you own

| Concern | Core | You |
| --- | --- | --- |
| Reactive entities, passage registry, navigation | ✅ | |
| Save/load, migrations, audio, clock, i18n APIs | ✅ | |
| `window.Game` / `window.ReactTextGame` console helpers under `isDevMode` | ✅ | |
| `preloadContent()` for asset loading | ✅ | |
| Passage markup, buttons, modals, animations | | ✅ |
| Loading screen, splash screens, start menu | | ✅ |
| Save/load UI and screenshots | | ✅ |
| Debug UI | | ✅ |

`isDevMode: true` still exposes `window.Game` and `window.ReactTextGame` — with
`.currentPassage`, `.state`, `.passages`, `.jumpTo(id)`, `.getState()` and
`.setState(state)` — so you can drive the game from the browser console without any UI
of your own. It also turns session auto-save off, so a reload starts from your entity
defaults.

Reactive state in your own components comes from the core hooks:

```tsx
import { useGameEntity } from "@react-text-game/core";

import { player } from "./game/player";

export const CourageBadge = () => {
    const current = useGameEntity(player);

    return <span>Courage: {current.courage}</span>;
};
```

Read through `useGameEntity` and write directly to the entity (`player.courage += 1`).
The other hooks are `useCurrentPassage`, `useGameIsStarted`, `useIsStoryMode`,
`useGameTime`, `useAudio` and `useAudioManager`.

## Where to go next

- Add a visual scene with [Interactive maps](/interactive-maps) — the hotspot
  coordinates are percentages, so your renderer stays viewport-safe.
- Load assets before the first frame with `preloadContent()`, described in
  [Loading and splash screens](/loading-and-splash-screens#preload-game-content).
- Add persistence and version upgrades with [Save migrations](/migrations).
- Move narrative content into [MDX](/mdx-integration).
- Adopt only the parts of the UI package you want — see [Custom UI](/custom-ui) and
  the [core + UI tutorial](/first-game/core+ui).
