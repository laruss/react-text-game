---
title: First game with core + UI
sidebar_label: With core + UI
description: Build a playable game with @react-text-game/core and @react-text-game/ui — installation, GameProvider options, dev-mode debugging, PassageController, a reactive hero with player-editable stats, and a branching story.
keywords:
    - react text game tutorial
    - GameProvider
    - PassageController
    - game provider options
    - dev mode debugging
    - reactive game entity
    - branching story
    - project structure
---

# Build your first game with core + UI

:::warning This tutorial uses two packages
This is the **core + UI** path. `@react-text-game/core` runs the game and
`@react-text-game/ui` renders it, so you get story rendering, a start menu,
save/load dialogs and a dev-mode drawer without writing a renderer yourself.

Want the engine only, with your own React components? Follow
[Build your first game with core only](/first-game/core) instead.
:::

By the end you will have a hero the player names and builds, a character screen that
writes straight into game state, four story passages, and one road that stays closed
until the hero is perceptive enough to walk it.

## 1. Install the packages

```bash npm2yarn
npm install @react-text-game/core @react-text-game/ui tailwindcss @tailwindcss/vite
```

`react` and `react-dom` (18 or 19) are peer dependencies you already have. The UI
package is styled with Tailwind CSS v4, so register the Tailwind plugin in your
bundler:

```ts title="vite.config.ts"
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
});
```

Then import Tailwind and the library stylesheet from your global CSS entry:

```css title="src/styles.css"
@import "tailwindcss";
@import "@react-text-game/ui/styles";
```

That second import brings in the semantic color tokens (`background`, `card`,
`primary-500`, `muted-foreground`, …), the library keyframes, and a `@source`
directive so your Tailwind build scans the library's own components. Override any
token after the imports to reskin the whole game — see
[Installation](/getting-started) for the details.

## 2. Create the hero

An entity is the game's persistent, reactive state. Every property is included in
saves and every read inside a passage sees the current value.

```ts title="src/game/entities/hero.ts"
import { createEntity } from "@react-text-game/core";

export type Calling = "scholar" | "scout";

/** Points the player distributes between the two stats. */
export const POINT_POOL = 6;

export const hero = createEntity("hero", {
    name: "Wren",
    calling: "scholar" as Calling,
    resolve: 1,
    insight: 1,
    lanternTaken: false,
    marshTaken: false,
});
```

Mutate properties directly — no setters, no dispatch:

```ts
hero.resolve += 1;
hero.calling = "scout";
```

:::note
Every property must have a value. Optional keys (`mana?: number`) are rejected at
compile time, because the proxy cannot tell a missing key from an undefined one. Use
`mana: undefined as number | undefined` when you need optional-like behavior.
:::

## 3. Build the character screen

A **widget** passage is a plain React component, which is what you want for anything
form-like. `useGameEntity` subscribes the component to the hero, so the screen
re-renders as the player edits it; writes go straight to the imported `hero`.

```tsx title="src/game/passages/characterSetup.tsx"
import { defineWidget, Game, useGameEntity } from "@react-text-game/core";
import { Button } from "@react-text-game/ui";

import { type Calling, hero, POINT_POOL } from "../entities/hero";
import { crossroads } from "./crossroads";

const CALLINGS: ReadonlyArray<{ id: Calling; blurb: string }> = [
    { id: "scholar", blurb: "reads the world before touching it" },
    { id: "scout", blurb: "touches the world before reading it" },
];

type StatProps = {
    label: string;
    value: number;
    unspent: number;
    onChange: (delta: number) => void;
};

const Stat = ({ label, value, unspent, onChange }: StatProps) => (
    <div className="flex items-center justify-between">
        <span>{label}</span>
        <div className="flex items-center gap-2">
            <Button
                variant="bordered"
                color="default"
                disabled={value <= 1}
                onClick={() => onChange(-1)}
            >
                −
            </Button>
            <span className="w-6 text-center font-mono">{value}</span>
            <Button
                variant="bordered"
                color="default"
                disabled={unspent <= 0}
                onClick={() => onChange(1)}
            >
                +
            </Button>
        </div>
    </div>
);

const CharacterSetup = () => {
    // Subscribes this component to the hero's state.
    const current = useGameEntity(hero);
    const unspent = POINT_POOL - current.resolve - current.insight;

    return (
        <div className="mx-auto flex max-w-md flex-col gap-6 p-8">
            <h1 className="text-2xl font-semibold">Who walks the road?</h1>

            <label className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Name</span>
                <input
                    className="rounded-md border border-input bg-transparent px-2 py-1"
                    value={current.name}
                    onChange={(event) => {
                        hero.name = event.target.value;
                    }}
                />
            </label>

            <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Calling</span>
                {CALLINGS.map((calling) => (
                    <Button
                        key={calling.id}
                        variant={
                            current.calling === calling.id
                                ? "solid"
                                : "bordered"
                        }
                        onClick={() => {
                            hero.calling = calling.id;
                        }}
                    >
                        {calling.id} — {calling.blurb}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                    {unspent} point{unspent === 1 ? "" : "s"} left
                </span>
                <Stat
                    label="Resolve"
                    value={current.resolve}
                    unspent={unspent}
                    onChange={(delta) => {
                        hero.resolve += delta;
                    }}
                />
                <Stat
                    label="Insight"
                    value={current.insight}
                    unspent={unspent}
                    onChange={(delta) => {
                        hero.insight += delta;
                    }}
                />
            </div>

            <Button
                disabled={unspent > 0 || current.name.trim() === ""}
                onClick={() => Game.jumpTo(crossroads)}
            >
                Take the road
            </Button>
        </div>
    );
};

export const characterSetup = defineWidget("character-setup", CharacterSetup);
```

Two things are worth pausing on:

- **Read through the hook, write through the entity.** `useGameEntity(hero)` is what
  makes this component reactive; `hero.resolve += delta` is the write. Reading
  `hero.resolve` directly in a component would show a stale value after the next
  update, because nothing subscribed.
- **`defineWidget` receives the component, not an element.** A function passed to
  `defineWidget` is always rendered as a React component, so hooks work even in
  minified production builds.

## 4. Write the story passages

`defineStory` takes an id and a content callback. The callback runs every time the
passage is displayed, so it always reads current state, and any falsy entry in the
returned array is dropped — which is all you need for branching.

```ts title="src/game/passages/crossroads.ts"
import { defineStory } from "@react-text-game/core";

import { hero } from "../entities/hero";

export const crossroads = defineStory("crossroads", (h) => [
    h.header("The crossroads at dusk", { level: 1 }),
    h.text(`${hero.name} the ${hero.calling} stops where the road splits.`),
    h.text(`Resolve ${hero.resolve} · Insight ${hero.insight}`, {
        className: "font-mono text-sm text-muted-foreground",
    }),
    h.text(
        "One fork is strung with lit lanterns. The other drops into black marsh water."
    ),
    hero.insight < 3 &&
        h.text("The marsh is unreadable to you. Insight 3 would change that.", {
            className: "text-sm italic",
        }),
    h.actions(
        [
            { content: "Follow the lanterns", action: h.jump("lantern-road") },
            hero.insight >= 3 && {
                content: "Wade into the marsh",
                action: h.jump("marsh"),
                color: "secondary",
            },
            {
                content: "Rebuild your hero",
                action: h.jump("character-setup"),
                variant: "bordered",
                color: "default",
            },
        ],
        { direction: "vertical" }
    ),
]);
```

The two roads link back here, so `crossroads` reaches them by **id** rather than by
import — that keeps the module graph acyclic. Everywhere the engine asks for a
passage it accepts either a passage instance or a registered id; prefer the instance
when the import direction allows it, since a renamed passage then cannot become a
dead link.

```ts title="src/game/passages/lanternRoad.ts"
import { defineStory, Game } from "@react-text-game/core";

import { hero } from "../entities/hero";
import { crossroads } from "./crossroads";
import { ending } from "./ending";

export const lanternRoad = defineStory("lantern-road", (h) => [
    h.header("The lantern road", { level: 1 }),
    h.text("Every lantern is lit, and nobody is here to have lit them."),
    hero.calling === "scholar"
        ? h.text("You count nineteen. Nineteen is the wrong number, and you know why.")
        : h.text("You walk the verge instead of the road, where the light cannot reach."),
    h.conversation(
        [
            {
                content: "Late to be walking.",
                who: { name: "Lamplighter" },
                side: "left",
            },
            {
                content: "Late to be lighting.",
                who: { name: hero.name },
                side: "right",
            },
        ],
        { appearance: "byClick" }
    ),
    h.actions([
        {
            content: "Take a lantern and walk on",
            action: () => {
                hero.lanternTaken = true;
                Game.jumpTo(ending);
            },
        },
        {
            content: "Back to the crossroads",
            action: h.jump(crossroads),
            variant: "bordered",
            color: "default",
        },
    ]),
]);
```

```ts title="src/game/passages/marsh.ts"
import { defineStory, Game } from "@react-text-game/core";

import { hero } from "../entities/hero";
import { crossroads } from "./crossroads";
import { ending } from "./ending";

export const marsh = defineStory("marsh", (h) => [
    h.header("Black water", { level: 1 }),
    h.text("You read the water the way you would read a page, and it reads back."),
    hero.resolve >= 4
        ? h.text("It finds nothing in you that flinches.")
        : h.text("Something in you flinches, and the water keeps it."),
    h.actions([
        {
            content: "Cross",
            action: () => {
                hero.marshTaken = true;
                hero.resolve += 1;
                Game.jumpTo(ending);
            },
        },
        {
            content: "Back to the crossroads",
            action: h.jump(crossroads),
            variant: "bordered",
            color: "default",
        },
    ]),
]);
```

```ts title="src/game/passages/ending.ts"
import { defineStory, Game } from "@react-text-game/core";

import { hero } from "../entities/hero";

export const ending = defineStory("ending", (h) => [
    h.header("Morning", { level: 1 }),
    h.text(`${hero.name} reaches the far town at first light.`),
    hero.marshTaken &&
        h.text("The marsh water dried in your boots and left a line of salt."),
    hero.lanternTaken &&
        h.text("The lantern is still burning, and it should not be."),
    h.text(`Resolve ${hero.resolve} · Insight ${hero.insight}`, {
        className: "font-mono text-sm text-muted-foreground",
    }),
    h.actions([
        {
            content: "Walk it again",
            action: () => {
                hero.lanternTaken = false;
                hero.marshTaken = false;
                Game.jumpTo("character-setup");
            },
        },
    ]),
]);
```

`h` is the story toolbox: `h.text`, `h.header`, `h.image`, `h.video`, `h.actions`,
`h.conversation` and `h.include` build components, `h.jump(target)` builds a
navigation handler, and `h.when(condition, value)` builds a conditional one. Each
builder takes its content first and one flat options bag second. The complete list
of components and options is in [Core concepts](/core-concepts#story-passages).

## 5. Register the game

Entities and passages register as their modules are imported, so export them all from
one barrel and import that barrel exactly once from your entry point. Without it a
production bundler is free to tree-shake a passage nobody imports by name.

```ts title="src/game/index.ts"
export * from "./entities/hero";
export * from "./passages/characterSetup";
export * from "./passages/crossroads";
export * from "./passages/lanternRoad";
export * from "./passages/marsh";
export * from "./passages/ending";
```

## 6. Mount GameProvider and PassageController

`GameProvider` owns the engine lifecycle: it awaits `Game.init()`, preloads assets,
runs the loading and splash phases, provides the component registry and the save/load
dialog, and mounts the dev tools. `PassageController` renders whatever passage is
current.

```tsx title="src/main.tsx"
import "./styles.css";
import "./game";

import { GameProvider } from "@react-text-game/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { characterSetup } from "./game/passages/characterSetup";

const gameOptions = {
    gameName: "The Lantern Road",
    gameId: "lantern-road",
    gameVersion: "0.1.0",
    author: "you",
    startPassage: characterSetup,
    isDevMode: import.meta.env.DEV,
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GameProvider options={gameOptions}>
            <App />
        </GameProvider>
    </StrictMode>
);
```

```tsx title="src/App.tsx"
import { PassageController, SaveButton } from "@react-text-game/ui";

export const App = () => (
    <div className="flex h-screen flex-col bg-background text-foreground">
        <header className="flex items-center justify-between border-b border-border p-3">
            <span className="font-semibold">The Lantern Road</span>
            <SaveButton isIconOnly />
        </header>
        <main className="flex-1 overflow-auto">
            <PassageController />
        </main>
    </div>
);
```

Start the app. You should be able to name the hero, spend its four free points, walk
the lantern road, come back, move a point into insight, and find the marsh open.

:::note Keep `options` stable
`GameProvider` calls `Game.updateOptions()` whenever the identity of the `options`
object changes. Declaring it at module scope, as above, means that happens exactly
once. An inline object literal would re-apply options on every render of the parent.
:::

## 7. GameProvider options

The `options` prop is the engine configuration and is passed straight to
`Game.init()`. Only `gameName` is required.

| Option | Type | Default | What it does |
| --- | --- | --- | --- |
| `gameName` | `string` | — | Required. The title shown in the default main menu, and part of the exported-saves file name |
| `gameId` | `string` | `""` | Names the IndexedDB save database and seeds the save-file encryption key. Set it once and never change it — a new value points the game at an empty save store |
| `gameVersion` | `string` | `"1.0.0"` | Version checked by save migrations and shown in the default main menu |
| `description` | `string` | `""` | Free-form description stored with the game options |
| `author` | `string` | `""` | Shown under the title in the default main menu |
| `startPassage` | `Passage \| string` | `"start-passage"` | The passage the player opens on. Accepts an instance or a registered id, and may be registered after `init()` |
| `isDevMode` | `boolean` | `false` | Enables the dev tools described below. Must be `false` in production |
| `initialState` | `Record<string, unknown>` | `{}` | Overrides entity defaults, keyed by entity id. Handy for jumping into a mid-game state while writing |
| `translations` | `I18nConfig` | English only | Locales and resources — see [Internationalization](/i18n) |
| `clock` | `ClockOptions` | manual clock at a fixed fictional date | In-fiction time — see [Game clock](/game-clock) |

`startPassage` decides what the player sees first. Point it at your own passage, as
this tutorial does, to drop the player straight into the game. Leave it out and the
game boots into the UI package's main menu instead (**New game**, **Continue**,
**Load game**) — in that case give your opening passage the id `start-passage`, which
is what **New game** navigates to.

`GameProvider` itself takes these props alongside `options`:

| Prop | Default | What it does |
| --- | --- | --- |
| `components` | `{}` | Registry that replaces individual renderers — story primitives, whole passage renderers, `MainMenu`, `LoadingScreen`, `RTGSplashScreen`. See [Custom UI](/custom-ui) |
| `preload` | `[]` | Assets loaded before the game mounts; a non-empty list enables the loading screen |
| `preloadConcurrency` | `6` | How many assets load at once |
| `loadingScreen` | — | Background, rotating text and progress-bar styling for the default loading screen |
| `onPreloadComplete` | — | Called with the preload result, including per-asset failures |
| `showSplashScreen` | `true` | Master switch for the splash sequence |
| `showSplashScreenOnDev` | `false` | Allows splash screens while `isDevMode` is on |
| `showRTGSplashScreen` | `true` | Adds the built-in React Text Game screen first |
| `splashScreens` | `[]` | Your own splash screens, after the built-in one |

The startup sequence and every asset option are covered in
[Loading and splash screens](/loading-and-splash-screens).

## 8. Debug the running game

`isDevMode` is the single switch. With `isDevMode: import.meta.env.DEV` it is on
during development and off in a production build. In Next.js use
`process.env.NODE_ENV !== "production"` instead.

When it is on, `GameProvider` mounts two surfaces:

- **The dev drawer**, docked at the bottom center — click the handle to open it. It
  shows the current passage id, a **Jump to passage ID** box for skipping straight to
  any passage, a **Save state on reload** toggle, and two live JSON inspectors with
  refresh and copy buttons: **Current state** (the whole serialized game, exactly
  what a save contains) and **Current Passage data** (the passage object plus its last
  cached display result — the fastest way to see what your content callback actually
  produced).
- **The app menu**, a small button at the bottom left. Hover it to toggle dev mode at
  runtime, which is useful for checking how the game looks without the dev chrome.

`Game.init()` also exposes console helpers on `window`:

```js
Game.jumpTo("marsh"); // navigate from the console
ReactTextGame.currentPassage; // the current passage object
ReactTextGame.state; // full serialized state
ReactTextGame.passages; // every registered passage
ReactTextGame.getPassage("ending");
ReactTextGame.getState();
ReactTextGame.setState(snapshot);
ReactTextGame.Storage; // the raw JSONPath store
```

Dev mode changes two more behaviors you should know about:

- **Session auto-save is off**, so a page reload starts from your entity defaults
  instead of resuming the last session. That is what you want while editing content;
  in production the engine restores the session and auto-saves changes.
- **Save migrations are validated** against `gameVersion` at startup, and any gap is
  logged as a warning. See [Save migrations](/migrations).

:::danger Never ship dev mode
Dev mode publishes the entire game state on `window`, disables session auto-save, and
mounts the debug UI. Ship with `isDevMode: false`.
:::

## 9. What PassageController does

`PassageController` is the whole renderer in one component. It subscribes to the
current passage, picks a renderer from `passage.type`, and keys the result on the
navigation render id — so jumping to the passage you are already on remounts it,
restarting animations and clearing local component state.

| Current passage | Renderer slot | Created by |
| --- | --- | --- |
| `story` | `Story` | `defineStory` |
| `interactiveMap` | `InteractiveMap` | `defineInteractiveMap` |
| `widget` | `Widget` | `defineWidget` |
| none | `Empty` | — |
| anything else | `Unknown` | a custom `Passage` subclass |

A few practical rules:

- It must be rendered inside `GameProvider`, which supplies the component registry
  and guarantees the engine is initialized.
- It fills its parent, so give it a sized container — `flex-1 overflow-auto` above.
- Persistent chrome (header, HUD, save button, toasts) belongs beside it as a
  `GameProvider` child, not inside it, so navigation never unmounts it.
- Replace any slot through `components.passages` when you want your own layout while
  keeping initialization, navigation, saves and error boundaries. See
  [Custom UI](/custom-ui).

## 10. Recommended project structure

The layout this tutorial builds up, with the pieces you will add next:

```text
src/
├── game/
│   ├── entities/
│   │   └── hero.ts            # createEntity — reactive, saved state
│   ├── passages/
│   │   ├── characterSetup.tsx # widget: React screens and forms
│   │   ├── crossroads.ts      # defineStory
│   │   ├── lanternRoad.ts
│   │   ├── marsh.ts
│   │   ├── ending.ts
│   │   └── worldMap.ts        # defineInteractiveMap
│   └── index.ts               # the barrel: entities first, then passages
├── components/                # your own React components and slot overrides
├── App.tsx                    # layout: chrome + PassageController
├── main.tsx                   # GameProvider + options
└── styles.css                 # Tailwind + @react-text-game/ui/styles
```

What matters about it:

- **One file per passage, one file per entity.** Passage files stay readable, and the
  file name matching the passage id makes a story easy to find from a save or from
  the dev drawer.
- **`src/game/index.ts` is the only registry.** Export entities before passages so a
  passage module never reads an entity that has not been constructed yet, and import
  the barrel once from `main.tsx`.
- **Passage ids are part of your save format.** A save stores the current passage id,
  so renaming an id breaks existing saves. Prefer passage instances over id strings
  where the import direction allows it.
- **`.ts` for narrative, `.tsx` only where you need JSX.** Stories rarely need JSX;
  widgets and slot overrides always do. Reach for MDX when writers, not developers,
  own the prose.
- **State lives in entities, never in components.** A component's `useState` is gone
  on the next navigation and is never saved.

## Where to go next

- Add a visual scene with [Interactive maps](/interactive-maps).
- Move narrative content into [MDX](/mdx-integration) so writers can work in Markdown.
- Restyle one primitive or replace a whole renderer in [Custom UI](/custom-ui).
- Configure preloading and the startup sequence in [Loading and splash screens](/loading-and-splash-screens).
- Keep old saves loadable with [Save migrations](/migrations).
- Drop the UI package entirely with the [core-only tutorial](/first-game/core).
