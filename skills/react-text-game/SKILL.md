---
name: react-text-game
description: Build, refactor, review, or debug projects using @react-text-game/core, @react-text-game/ui, or @react-text-game/mdx. Use for game entities, useGameEntity-backed reactive React components, passages, navigation, saves and migrations, GameProvider wrappers, content preloading, loading and splash screens, interactive maps and hotspots, mapImage decorations, custom UI component slots, MDX story authoring, performance work, and contributions to the react-text-game monorepo where state, bootstrap order, passage lifecycle, or responsive map coordinates must remain correct.
---

# React Text Game

Implement React Text Game changes while preserving the engine contracts that are easy to break during ordinary React or TypeScript refactors. Prefer the smallest package layer that solves the request: core for behavior, UI for presentation, and MDX for authoring transforms.

## Start by classifying the work

1. Identify whether the target is a consumer application or the library monorepo.
2. Locate the affected layer:
   - `@react-text-game/core`: registry, reactive entities, passages, navigation, saves, audio, or i18n.
   - `@react-text-game/ui`: React lifecycle, default presentation, component slots, or map layout.
   - `@react-text-game/mdx`: MDX components, AST transforms, or story compilation.
3. Read the current public types and tests before changing behavior. Do not infer the API from an old example.
4. State the invariant being protected and define a test that proves it.

## Use the official documentation for API details

For API signatures, configuration details, or behavior not covered here, consult [reacttextgame.dev](https://reacttextgame.dev) instead of guessing. Prefer the Markdown representation of a documentation page: remove its trailing slash and append `.md`.

```text
https://reacttextgame.dev/core-concepts.md
https://reacttextgame.dev/custom-ui.md
https://reacttextgame.dev/api/core/functions/useGameEntity.md
https://reacttextgame.dev/api/ui/type-aliases/GameProviderProps.md
```

Use the normal HTML page only when its `.md` form is unavailable. When working inside the monorepo or against a pinned package version, also verify the matching exported types and tests because the deployed site may document a newer release.

## Preserve initialization and registry semantics

- Entities and passages register when their modules are evaluated. Import the application's game registry before rendering game-dependent UI.
- Registration may happen before `Game.init()`. Navigation, state, save, and option operations require initialization to have completed.
- With the supplied UI, let `GameProvider` own initialization. Do not call `Game.init()` again in a child.
- Keep the `options` and `components` objects stable when practical. Update a running game through supported option updates; do not reinitialize it because React rendered again.
- Passage ids and entity ids are persistent identifiers. Never silently rename them in saved games or navigation code.
- Late-registered entities may have queued initial state and must participate in auto-save after registration.

Use a registry entry in consumer applications:

```ts
// game/index.ts
export * from "./entities/player";
export * from "./passages/intro";
export * from "./maps/world";
```

## Model state and passages correctly

- Store persistent game data in entities, not component-local React state.
- `createEntity(id, variables)` variables must have required keys. Model an optional value as `T | undefined` on a required key.
- Mutate proxied entity properties directly. Use `Game.getState()` and `Game.setState()` for complete snapshots; preserve internal system paths.
- Register a migration for persisted shape changes. Validate migration chains against the configured game version.
- Treat a passage as a display description. Callable content and conditional hotspots resolve when the passage is displayed.
- Re-entering the same passage through `Game.jumpTo()` must produce a fresh render cycle. Do not cache display output across navigation events.
- Avoid effects for pure derived display data. Memoization may reduce repeated pure display work, but do not depend on it to make side effects run exactly once.

## Subscribe React components with `useGameEntity`

Creating or importing an entity does not by itself subscribe a React component to that entity. Any component that reads entity fields during render must call `useGameEntity(entity)` and render values from the returned reactive object. Otherwise mutations can succeed while the displayed values remain stale.

```tsx
import { createEntity, useGameEntity } from "@react-text-game/core";

export const player = createEntity("player", {
    health: 100,
    name: "Traveler",
});

export function PlayerStats() {
    const reactivePlayer = useGameEntity(player);

    const takeDamage = () => {
        player.health -= 10;
    };

    return (
        <button type="button" onClick={takeDamage}>
            {reactivePlayer.name}: {reactivePlayer.health} HP
        </button>
    );
}
```

Do not render `player.health` directly and expect React to update:

```tsx
// Wrong: this component has no reactive subscription.
function PlayerStats() {
    return <span>{player.health} HP</span>;
}
```

Follow these rules:

- Call the hook at the top level and only after the entity's module has registered it.
- Use the returned object for every entity value read during render, including nested fields and derived calculations.
- Keep writes in the original entity or domain actions; the hook provides the component's reactive read path.
- Use one `useGameEntity` call per entity read by the component.
- Use the dedicated public hook for other reactive engine state, such as `useCurrentPassage`, rather than polling or copying it into local state.

## Protect interactive-map coordinates

Map positions are percentages of the fitted map image, not of the viewport or outer passage container:

```ts
left = offsetLeft + (x / 100) * scaledWidth;
top = offsetTop + (y / 100) * scaledHeight;
transform = "translate(-50%, -50%)";
```

Maintain all of these rules:

- Calculate `scaledWidth`, `scaledHeight`, and letterbox offsets from the image's natural aspect ratio and its actual container.
- Recalculate after image load and container resize. Prefer `ResizeObserver` over duplicate global resize listeners.
- Apply custom image zoom in addition to the fitted-image scale. Do not alter the anchor point when changing visual size.
- Test wide, square-ish, and mobile viewports. Compare hotspot centers numerically, not only by screenshot.
- Keep map controls pointer-interactive while their absolute-position wrapper can remain pointer-transparent.
- Use stable hotspot ids as React keys when provided; preserve ordered-index fallback for anonymous display data.

Choose the correct entity:

- `label`: clickable text control on the map.
- `image`: clickable image button with optional idle, hover, active, and disabled artwork.
- `mapImage`: decorative image at map coordinates. It has no `action`, tooltip, hover/active/disabled state, button semantics, or pointer interception.
- `sideLabel` / `sideImage`: controls in an edge rail, outside map coordinates.
- `menu`: grouped controls anchored at one map coordinate.

## Wrap the application once with `GameProvider`

When using `@react-text-game/ui`, create one stable root wrapper and let it own initialization, preloading, loading UI, splash screens, component overrides, and the game UI lifecycle:

```tsx
import type { NewOptions } from "@react-text-game/core";
import { GameProvider, PassageController } from "@react-text-game/ui";
import type { PropsWithChildren } from "react";
import "./game/registry";

const gameOptions = {
    gameName: "Forest Walk",
    gameId: "forest-walk",
    gameVersion: "1.0.0",
    startPassage: "intro",
    isDevMode: import.meta.env.DEV,
} satisfies NewOptions;

const preload = ["/maps/forest.webp", "/audio/theme.ogg"] as const;

export function GameWrapper({ children }: PropsWithChildren) {
    return (
        <GameProvider
            options={gameOptions}
            preload={preload}
            preloadConcurrency={4}
            showSplashScreenOnDev
        >
            {children}
        </GameProvider>
    );
}

export function GameApp() {
    return (
        <GameWrapper>
            <PassageController />
        </GameWrapper>
    );
}
```

The main `GameProvider` settings are:

- `options` (required): `gameName` plus optional `gameId`, `gameVersion`, `startPassage`, `isDevMode`, `initialState`, `author`, `description`, and `translations`.
- `components`: stable replacements for story, passage, menu, loading, and RTG splash slots.
- `preload`, `preloadConcurrency`, and `onPreloadComplete`: startup assets, queue concurrency, and completion reporting.
- `loadingScreen`: text, background, class names, and styles for the default loading screen.
- `showSplashScreen`, `showSplashScreenOnDev`, `showRTGSplashScreen`, and `splashScreens`: control the built-in and custom splash sequence.

Keep `options`, `components`, `preload`, and splash configuration at module scope when they are static. Do not call `Game.init()` inside descendants of this wrapper. Consult the official `.md` documentation for the complete types and defaults.

## Customize UI through public slots

Prefer composition over forking UI internals. Pass replacements through `GameProvider`:

```tsx
const components = {
    story: {
        Heading: GameHeading,
        Actions: GameActions,
    },
    passages: {
        InteractiveMap: GameMap,
        Empty: GameEmptyState,
    },
};

<GameProvider options={options} components={components}>
    <PassageController />
</GameProvider>;
```

Story slots are `Heading`, `Text`, `Image`, `Video`, `Actions`, and `Conversation`. Passage slots are `Story`, `InteractiveMap`, `Widget`, `Empty`, and `Unknown`; `MainMenu` replaces the start menu. Keep unspecified slots on their defaults.

When replacing an entire renderer:

- Consume the public passage and component prop types.
- Preserve callable field evaluation and navigation-driven refresh.
- Preserve semantic controls and keyboard behavior.
- Preserve the map coordinate contract exactly if rendering interactive maps.

Use core hooks and omit `@react-text-game/ui` entirely when the application already owns every presentation primitive.

## Preserve the bootstrap lifecycle

With `GameProvider`, startup order is fixed: `Game.init()` and `preloadContent()` run in parallel, the loading screen remains until both settle, splash screens run next, and only then does game UI mount.

- Pass startup resources through `preload`; do not start a competing preload effect in a child that is not mounted yet.
- Preload only the first playable scene and likely next scene. Keep the default bounded concurrency unless measurements justify changing `preloadConcurrency`.
- Use image sources for browser fetch plus decode, fetch sources for other cacheable resources, and a custom `{ id, load(signal) }` task for application-specific decoding.
- Treat `PreloadProgress.progress` as item completion, not byte progress. Individual failures are reported and still advance completion so optional content cannot deadlock startup.
- Replace the full loading UI with the `LoadingScreen` component slot. Preserve `progressbar` semantics in custom versions.
- Splash screens run only after loading. `duration` is milliseconds and includes fade-in/out; `isInterruptible` defaults to true.
- Production defaults to the RTG splash. Development skips the sequence unless `showSplashScreenOnDev` is true. Respect `showSplashScreen` and `showRTGSplashScreen` independently.
- Preserve immediate pointer and keyboard skipping for interruptible splash screens and reduced-motion behavior for all bootstrap animations.

## Change MDX without changing story meaning

- Keep AST transforms deterministic and preserve source order.
- Do not execute game actions during compilation; emit runtime callbacks.
- Preserve heading, text, media, conversation, and action mappings when optimizing traversal.
- Add transform tests for static content, expressions, invalid properties, and mixed component order.
- Keep MDX examples executable against the current public exports.

## Optimize with evidence

- Establish test, coverage, package-output, bundle, and hotspot-geometry baselines before refactoring.
- Optimize repeated traversals, duplicate observers, unnecessary effects, eager development logging, and published test artifacts before adding abstractions.
- Keep runtime dependencies targeted and package `sideEffects` metadata honest so consumers can tree-shake safely.
- Do not use memoization everywhere. Measure expensive work and use React composition or stable lifecycle state where correctness depends on evaluation count.
- Compare generated `dist` contents and at least one consumer production bundle after package changes.
- Reject an optimization that changes serialized state, callable evaluation timing, navigation refresh, public types, accessibility, or map coordinates.

## Verify library contributions

In the official monorepo, use Bun and repository scripts only. Add or update tests in every changed publishable package, then run from the repository root:

```bash
bun run lint
bun run typecheck
bun run test:coverage
bun run build
```

Also perform checks proportional to the change:

- Build or pack each affected public package and confirm tests are absent from `dist`.
- Run the example applications that exercise the changed paths.
- For map work, record hotspot center coordinates before and after at multiple viewport sizes and visually inspect styles, hover behavior, click behavior, and `mapImage` non-interactivity.
- Build the documentation site and follow all new internal links and code examples.

Report the protected invariants, tests run, measured output changes, and any remaining compatibility concern. Never describe coordinate safety from screenshots alone when numeric geometry can be checked.
