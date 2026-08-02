# Changelog

## 0.6.0

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

All notable changes to `@react-text-game/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-07-24

### Fixed

- Splash screens now play only when the game is opened in a new tab and no longer replay when the tab is reloaded. `GameProvider` tracks the splash sequence per tab session via `sessionStorage`, which persists across in-tab reloads but is empty for a freshly opened tab.

## [0.4.1] - 2026-07-22

### Fixed

- Removed the unnecessary TypeScript peer dependency so consumers can use TypeScript 7 without installation warnings

## [0.4.0] - 2026-07-22

### Added

- Configurable loading screen with the RTG logo, accessible progress, background images, rotating text, class/style hooks, and a complete `LoadingScreen` component slot
- Ordered splash screens with 1.5-second defaults, fade-in/out, immediate pointer and keyboard skipping, non-interruptible entries, dev-mode control, and a replaceable RTG brand screen
- `GameProvider` preloading lifecycle and `onPreloadComplete` results
- Non-interactive `mapImage` rendering for decorative map artwork
- Story, passage, bootstrap, and main-menu component slots for application-owned UI

### Changed

- `GameProvider` now initializes the engine and preloads content in parallel, then renders loading, splash, and game phases in deterministic order without duplicate Strict Mode work
- Interactive maps share one resize observer and preserve hotspot centers across fitted image sizes
- Passage rendering avoids duplicate display work while keeping navigation refresh behavior
- Bootstrap animations respect `prefers-reduced-motion`

## [0.3.17] - 2026-01-24

### Changed

- `GameProvider` now passes `MainMenu` component directly to `newWidget` instead of calling it as a function, aligning with core package widget changes
- `HotspotMenu` now centers menu items with `justify-center items-center` classes
- `HotspotMenuItem` button now has full width (`w-full`) for consistent menu item sizing
- `Conversation` component now applies custom `backgroundColor` to the content bubble instead of the container
- Moved `i18next` and `react-i18next` from dependencies to peerDependencies for better dependency management

### Fixed

- Removed duplicate `border-border` class from Conversation left-side bubble styles

## [0.3.16] - 2026-01-23

### Fixed

- `CurrentPassageData` component in DevModeDrawer now uses `getLastDisplayResult()` instead of calling `display()` directly, preventing unintended side effects when inspecting passage data in development mode
