---
name: react-text-game
description: Builds, reviews, and debugs games made with @react-text-game/core, @react-text-game/ui, or @react-text-game/mdx. Use when writing passages, stories, scenes, dialogue, or branching choices; when modelling game entities and reactive React components; when wiring GameProvider, save/load, migrations, audio, i18n, asset preloading, interactive maps, or custom UI slots; when working with .mdx story files; or when contributing to the react-text-game monorepo. Not for React applications that do not depend on a @react-text-game/* package.
---

# React Text Game

The engine keeps persistent game data in **entities** and describes screens as **passages**. Passages are pure display descriptions that the engine re-renders freely, so the one rule that breaks saved games is mutating state while a passage renders. Start there, then use the smallest layer that solves the request: `core` for behaviour, `ui` for presentation, `mdx` for authoring.

## Route the task

| Task | Read |
| --- | --- |
| Anything that grants, increments, or flags game state | the golden rule below, then [references/side-effects.md](references/side-effects.md) |
| Hotspot placement, coordinate bugs, custom map renderer | [references/interactive-maps.md](references/interactive-maps.md) |
| `GameProvider`, preloading, loading and splash screens, UI slots | [references/ui-and-bootstrap.md](references/ui-and-bootstrap.md) |
| Writing or fixing `.mdx` story files | [references/mdx-authoring.md](references/mdx-authoring.md) |
| Changing the library itself under `packages/` | [references/contributing.md](references/contributing.md) |

## Never mutate game state while a passage renders

`display()` runs again on every React render, on every save load, and on every remount. A mutation in a passage body therefore repeats: the reward is granted twice, the counter double-counts, and the bug surfaces only after the player loads a save.

Put every mutation in an `action` handler. Reading state during render is safe.

```ts
// Wrong: +100 gold on the first visit, and again on every save load.
defineStory("treasure", (h) => {
    player.gold += 100;
    return [h.text("You found a chest!")];
});

// Right: the mutation runs only when the player clicks.
defineStory("treasure", (h) => [
    h.text("You found a chest!"),
    h.actions([
        {
            content: "Open it",
            action: () => {
                player.gold += 100;
                Game.jumpTo("chest-opened");
            },
        },
        { content: "Leave it", action: h.jump("corridor") },
    ]),
]);
```

| Safe while rendering | Only inside `action` |
| --- | --- |
| reading entity values | assigning entity values |
| conditional content | granting items, gold, XP |
| displaying current stats | combat rolls and RNG that must stay stable |
| checking flags | setting flags, counters, visit counts |

The same rule applies to interactive-map hotspot callbacks and to `Widget` render bodies. For one-time events, stable RNG, visit counters, and the refresh-after-mutation idiom, read [references/side-effects.md](references/side-effects.md).

## Register entities and passages by importing them

Entities and passages register as a side effect of module evaluation. Nothing appears in the registry until its module is imported.

- Keep one registry module and import it before rendering game UI:

    ```ts
    // game/index.ts
    export * from "./entities/player";
    export * from "./passages/intro";
    export * from "./maps/world";
    ```

- Registration may happen before `Game.init()`. Navigation, state, options, and save operations require initialization to have finished.
- With `@react-text-game/ui`, `GameProvider` owns initialization. Never call `Game.init()` in a descendant.
- Passage ids and entity ids are persistent identifiers stored in save files. Renaming one breaks existing saves and any navigation that referenced it.
- `Game.jumpTo()`, `Game.setCurrent()`, the `startPassage` option, and `h.jump()` all accept a `PassageTarget`: a passage instance or a registered passage id. Prefer the instance, so a rename cannot silently create a dead link. An unregistered instance is registered on the spot; an unregistered string id throws.

## Define passages with the `define*` factories

All three factories share one shape. The content callback receives a helper toolbox first, display props second:

```ts
defineStory(id, (helpers, props) => components, options?)
defineInteractiveMap(id, (helpers, props) => hotspots, options)
defineWidget(id, reactNodeOrComponent)
```

```ts
import { defineInteractiveMap, defineStory } from "@react-text-game/core";

export const intro = defineStory(
    "intro",
    (h) => [
        h.header("At the forest edge", { level: 1 }),
        h.text(`Courage: ${player.courage}.`),
        player.hasLantern && h.text("Your lantern casts a steady light."),
        h.actions([
            { content: "Enter the forest", action: h.jump("forest") },
            player.hasKey && { content: "Unlock the gate", action: h.jump("gate") },
        ]),
    ],
    { background: { image: "/backgrounds/forest.webp" } }
);

export const worldMap = defineInteractiveMap(
    "world-map",
    (h) => [
        h.label("Harbor", { position: { x: 24, y: 68 }, action: h.jump("harbor") }),
        h.mapImage("/maps/ship.webp", { position: { x: 41, y: 73 }, zoom: "12%" }),
        h.label("Inventory", { position: "top", action: h.jump("inventory") }),
    ],
    { image: "/maps/world.webp" }
);
```

- Story helpers: `text`, `header`, `image`, `video`, `actions`, `conversation`, `include`. Map helpers: `label`, `image`, `mapImage`, `menu`. Both toolboxes also carry `jump(target)` and `when(condition, value)`.
- Each helper takes content first and one **flat** options bag second. Fields that sit under `props` in the raw type are hoisted to the top level; `classNames` stays nested.
- Falsy array entries (`false`, `null`, `undefined`) are dropped, so write conditions inline rather than in a callback that returns `undefined`.
- An action button's caption is `content` and accepts any React node. `ActionType.label` is deprecated but still renders when `content` is absent, so do not break existing stories; write `content` in new code.
- Helpers return plain objects, so hand-written literals stay valid in the same array. Import `storyHelpers` or `mapHelpers` to build content outside a callback body.
- `defineStory<TProps>` and `defineInteractiveMap<TProps>` type the props passed to `display()`.

`newStory`, `newInteractiveMap`, and `newWidget` remain fully supported and produce identical passages. Do not rewrite existing passages to the `define*` form unless asked, and do not mix both forms in one passage.

## Subscribe components with `useGameEntity`

Importing an entity does not subscribe a component to it. Any component that reads entity fields during render must read them from `useGameEntity(entity)`, or mutations will succeed while the screen shows stale values.

```tsx
import { createEntity, useGameEntity } from "@react-text-game/core";

export const player = createEntity("player", { health: 100, name: "Traveler" });

export function PlayerStats() {
    const reactivePlayer = useGameEntity(player);

    return (
        <button type="button" onClick={() => (player.health -= 10)}>
            {reactivePlayer.name}: {reactivePlayer.health} HP
        </button>
    );
}
```

```tsx
// Wrong: no reactive subscription, so the number never updates.
function PlayerStats() {
    return <span>{player.health} HP</span>;
}
```

- Call the hook at the top level, once per entity the component reads.
- Use the returned object for every value read during render, including nested fields and derived calculations.
- Write through the original entity; the hook is the read path.
- For other reactive engine state use the dedicated hooks -- `useCurrentPassage`, `useGameIsStarted`, `useIsStoryMode`, `useAudio`, `useAudioManager` -- rather than copying state into local React state.

## Model persistent state as entities

- `createEntity(id, variables)` requires non-optional keys. Model an optional value as a required key typed `T | undefined`.
- Mutate proxied properties directly. An explicit `entity.save()` is **not** required for persistence: `Game.getState()` saves every registered entity before snapshotting, and both auto-save and the save hooks go through it. Existing calls to `save()` are harmless -- leave them.
- Do not keep gameplay state in `useState` inside a passage. `PassageController` remounts on every `jumpTo`, including a jump to the passage already on screen, so local state resets. Entities survive; component state does not.
- Register a migration whenever the persisted shape of an entity changes, and validate the chain against `gameVersion`.
- Auto-save serialises the whole state tree to `sessionStorage` on a 500 ms debounce. Keep unbounded collections (logs, transcripts, history) capped or archived.

## Import from the published entry points

- `@react-text-game/core` -- `Game`, entities, passages, hooks, `preloadContent`.
- `@react-text-game/core/saves` -- save hooks, Dexie database helpers, `getSetting`/`setSetting`, migrations.
- `@react-text-game/core/i18n` -- `useGameTranslation`, `getGameTranslation`.
- `@react-text-game/core/audio` -- audio tracks and manager.
- `@react-text-game/core/passages` -- **types only**; it has no runtime export, so never import a value from it.
- `@react-text-game/ui`, `@react-text-game/ui/styles`, `@react-text-game/ui/i18n`.
- `@react-text-game/mdx`, `@react-text-game/mdx/plugin`.

## Look up API details in the live docs

For signatures, defaults, and behaviour not covered here, fetch [reacttextgame.dev](https://reacttextgame.dev) instead of guessing. Drop the trailing slash and append `.md` for a Markdown page:

```text
https://reacttextgame.dev/core-concepts.md
https://reacttextgame.dev/custom-ui.md
https://reacttextgame.dev/api/core/functions/useGameEntity.md
```

Inside the monorepo, or against a pinned version, verify against the exported types and tests as well -- the deployed site may document a newer release.

## Place map hotspots with the right helper

- `h.label` -- clickable text control.
- `h.image` -- clickable image button with optional idle, hover, active, and disabled artwork.
- `h.mapImage` -- decorative image. No `action`, tooltip, interactive states, or pointer interception.
- `h.menu` -- several labels grouped at one coordinate. Its items take no `position`.

`position` selects the coordinate space: `{ x, y }` percentages place the element on the fitted map image, while `"top" | "right" | "bottom" | "left"` dock it to an edge rail outside the map's coordinate space.

In dev mode, clicking the map copies the clicked `{ x, y }` to the clipboard -- use it instead of guessing coordinates. Geometry, resize behaviour, and the verification checklist are in [references/interactive-maps.md](references/interactive-maps.md).
