# Changelog

## 0.3.0

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

All notable changes to `@react-text-game/mdx` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-07-22

### Fixed

- Removed the unnecessary TypeScript peer dependency so consumers can use TypeScript 7 without installation warnings

## [0.2.0] - 2026-07-22

### Added

- Public `ConversationProps` and `IncludeProps` types for custom authoring components

### Changed

- Consolidated component transformation into single-pass validation and construction paths
- Reused static action color and variant lookup sets and removed intermediate arrays in MDX structure processing
- Preserved source order, runtime callbacks, and generated story meaning while reducing transform allocations
