# Changelog

## 0.9.0

### Minor Changes

- Add a game clock and a public translation-registration API.

  `@react-text-game/core/clock` is a new entry point exporting `Clock` plus the
  `SECOND`/`MINUTE`/`HOUR`/`DAY` helpers, and the main entry point gains a
  `useGameTime` hook. Game time is in-fiction time: it starts at a fixed fictional
  timestamp rather than `Date.now()`, persists with the save, and by default only
  advances when the game calls `Clock.advance()`. A `"realtime"` mode derives the
  value from a stored anchor pair on every read, so no timer is needed for
  correctness and the clock survives saves, page reloads and suspended tabs. On
  load, game time is restored exactly and real-time flow is re-anchored, so real
  time that passed while a save sat unused never leaks into the story. Configure it
  through the new `clock` option of `Game.init()`.

  `registerTranslations()` from `@react-text-game/core/i18n` lets a companion
  package ship its own namespace of default strings. Precedence runs registered
  package defaults, then `@react-text-game/ui` defaults, then the author's
  `translations.resources`, so a game can always override a package string. Call
  order does not matter: registering after `Game.init()` adds the bundle without
  overwriting keys that are already present.

  Both additions are backwards compatible.

## 0.8.0

### Minor Changes

- Add `content` to story actions and accept passage instances everywhere the engine asks for a passage.

  **`ActionType.content`**

  An action button's caption now lives in `content` and accepts any React node, matching every other story component:

  ```tsx
  h.actions([
    { content: "Go North", action: h.jump("north-path") },
    {
      content: (
        <>
          <KeyIcon /> Unlock the gate
        </>
      ),
      action: h.jump("vault"),
    },
  ]);
  ```

  `ActionType.label` is deprecated. It is still rendered when `content` is absent, so existing stories keep working unchanged, and it will be removed in a future major release.

  MDX authoring is unchanged — an `<Action>`'s caption is still its children — but the compiler now emits `content` instead of the deprecated `label`, and `<Action>` does not accept a `content` prop of its own.

  **`PassageTarget`**

  `Game.jumpTo()`, `Game.setCurrent()`, the `startPassage` option and the `h.jump()` helper all take the new exported `PassageTarget` type: a passage instance (`Story`, `InteractiveMap`, `Widget`, or any other `Passage`) or the id of a registered passage.

  ```ts
  import { intro } from "./game/stories/intro";

  await Game.init({ gameName: "My Game", startPassage: intro });
  Game.jumpTo(intro);
  ```

  `Game.jumpTo()` now registers a passage instance that is missing from the registry instead of throwing, so navigating to an instance never fails with `Passage "..." not found`. A string id that is not registered still throws.

## 0.7.0

### Minor Changes

- Add helpers-first passage factories: `defineStory`, `defineInteractiveMap` and `defineWidget`.

  Every passage type now has a factory with the same shape — `define*(id, (helpers, props) => content, options)` — where the content callback receives a toolbox of builders as its first argument and the display props as its second:

  ```ts
  defineStory("forest", (h) => [
    h.header("The Whispering Woods", { level: 1 }),
    h.text("The forest is ancient and alive."),
    player.hasKey && h.text("The rusty key feels warm in your pocket."),
    h.actions([{ label: "Go deeper", action: h.jump("forest-deep") }]),
  ]);

  defineInteractiveMap(
    "world",
    (h) => [
      h.label("Village", {
        position: { x: 30, y: 40 },
        action: h.jump("village"),
      }),
      h.mapImage("/guard.png", { position: { x: 42, y: 68 }, alt: "Guard" }),
    ],
    { image: "/maps/world.jpg" }
  );
  ```

  Highlights:

  - Helpers (`storyHelpers`, `mapHelpers`) build plain component and hotspot objects, so helper calls and hand-written literals can be mixed in the same array. Both toolboxes are also exported for use outside a callback body.
  - Each helper takes content first and a single **flat** options bag second — fields nested under `props` in the raw type are hoisted to the top level.
  - Falsy array entries (`false`, `null`, `undefined`) are dropped, so conditional content can be written inline with `&&`.
  - `defineStory<TProps>` and `defineInteractiveMap<TProps>` accept typed display props via the new `StoryContentFn` / `MapContentFn` generic aliases. The existing `StoryContent` is a generic _function_ type and cannot express typed props.
  - `defineWidget` is identical to `newWidget` in behaviour and signature; it exists so every passage factory shares the same prefix.

  This release is purely additive. `newStory`, `newInteractiveMap` and `newWidget` are unchanged, fully supported, and not scheduled for removal.

All notable changes to `@react-text-game/core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.1] - 2026-07-22

### Fixed

- Removed the unnecessary TypeScript peer dependency so consumers can use TypeScript 7 without installation warnings

## [0.6.0] - 2026-07-22

### Added

- `preloadContent()` with bounded concurrency, URL deduplication, abort support, image decoding, custom tasks, progress callbacks, and non-blocking failure results
- Decorative `mapImage` interactive-map entities that preserve percentage coordinates without button, hover, or pointer behavior

### Changed

- Reduced hot-path allocations in entity and passage registration, navigation, logging, and initial-state handling
- Save encryption now imports targeted CryptoJS modules to improve consumer tree-shaking without changing the persisted format
- Late-registered entities now join auto-save subscriptions and accept falsy pending initial-state values correctly

## [0.5.18] - 2026-07-01

### Changed

- Updated `dexie` from `^4.2.0` to `^4.4.4`
- Updated `dexie-react-hooks` from `^4.2.0` to `^4.4.0`
- Updated `valtio` from `^2.1.8` to `^2.3.2`

## [0.5.17] - 2026-01-24

### Added

- `AudioTrack.cancelFade()` method to cancel any ongoing fade animation
- `AudioTrack.originalVolume` property to store the configured volume for reliable fadeIn targeting

### Changed

- **Breaking:** `WidgetContent` type now accepts `ReactNode | React.FC` instead of `ReactNode | (() => ReactNode)`. Function content is always treated as a React component and rendered via `createElement`, ensuring hooks work correctly in minified production builds where function names are mangled
- `Widget.display()` now uses `createElement` for function content instead of calling it directly
- `AudioTrack.fadeIn()` now cancels any ongoing fade before starting and uses original volume as target when current volume is 0
- `AudioTrack.fadeOut()` now cancels any ongoing fade before starting
- `AudioTrack.dispose()` now cancels any ongoing fade animation

### Fixed

- Fixed `AudioTrack.fadeIn()` failing when called after a previous fade left volume at 0 by falling back to original configured volume

## [0.5.16] - 2026-01-23

### Added

- Added `_lastDisplayResult` protected property to `Passage` base class for caching display results
- Added `getLastDisplayResult<T>()` method to retrieve cached display result without re-executing content functions
- Added `hasDisplayCache()` method to check if a cached display result exists
- Story, Widget, and InteractiveMap passages now automatically cache their display results after each `display()` call

### Changed

- Passage `display()` method now stores the result in cache before returning
