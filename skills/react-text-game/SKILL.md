---
name: react-text-game
description: Build, refactor, review, or debug projects using @react-text-game/core, @react-text-game/ui, or @react-text-game/mdx. Use for game entities, passages, navigation, saves and migrations, content preloading, loading and splash screens, interactive maps and hotspots, mapImage decorations, custom UI component slots, MDX story authoring, performance work, and contributions to the react-text-game monorepo where state, bootstrap order, passage lifecycle, or responsive map coordinates must remain correct.
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
