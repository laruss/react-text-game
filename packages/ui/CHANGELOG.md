# Changelog

## 0.7.0

### Minor Changes

- 7dc0550: Rework the saves API: fix save isolation between games, and make a named save browser buildable out of the hooks alone.

  ## Fixes

  - **Saves were never isolated by `gameId`.** `db` resolved the database once, while the module was being imported -
    before `Game.init()` had applied any options - so every game on an origin read and wrote the same `-gamedb`
    database, settings included. The database is now resolved at the point of use.

    **Existing saves are carried across automatically.** On first open, a game whose own database holds no player saves
    copies the saves and settings out of `-gamedb`, preserving each save's timestamp and version, and records that it
    has done so. Nothing is copied into a database that already holds saves. The legacy database is read under the
    schema it was written with and left exactly as it was, so games on the same origin that have not upgraded yet keep
    working.

    On a shared origin the legacy database holds saves from several games with no way to tell them apart, so the first
    game to open after upgrading adopts all of them. Delete the ones that do not belong from the slot list.

  - **`saveGame` stored the string `"undefined"`** in `description` and `screenshot` when they were not supplied, so
    every save carried the literal word and consumers had to guard against it. Absent annotations are now absent. Rows
    already written are cleaned up by the database upgrade.

  - **Overwriting a slot replaces the record** rather than merging into it, so a fresh capture no longer inherits the
    title, metadata or screenshot of the save it replaced. The same applies to a save restored from a file over an
    occupied slot.

  - **Importing a save file re-stamped every timestamp** with the moment of import, and deleted the player's saves
    before checking that the file was usable. Import now validates the whole file first, writes each record with the
    timestamp it carries, and does the wipe and the writes in one transaction.

  - **`useLastLoadGame` skipped save migrations.** Loading through "Continue" restored a save written by an older build
    without migrating it, while the same save loaded from a slot list was migrated. Both paths now share one loader.

  ## Breaking changes

  - `GameSave.name` is now `GameSave.slot`, and `GameSave.description` is now `GameSave.title`. Stored records are
    renamed by a Dexie schema upgrade; exported `.sx` files written by older builds are accepted on import.
  - `saveGame(slot, gameData, description, screenshot, version)` takes an options bag:
    `saveGame(slot, gameData, { title, meta, screenshot, version })`.
  - `loadGameByName` is now `loadGameBySlot`.
  - Every save hook returns one discriminated `SaveResult` - `{ success: true, error: null }` or
    `{ success: false, code, error }` - instead of `undefined` on success and one of three shapes on failure. `code` is a
    `SaveErrorCode`: `cancelled`, `not-found`, `bad-file`, `decode-failed`, `migration-failed` or `storage-failed`.
    A player closing the file dialog reports `cancelled`, which a host should stay silent on.
  - `useImportSaves()` now takes `(file?, { mode })` and returns `SaveResult<{ count }>`.

  ## New

  - `SaveOptions` on `useSaveGame(slot, options)` and `slot.save(options)`: a save can finally be given a `title` through
    the hooks a game actually uses.
  - `GameSave.meta` - a game-owned object stored beside `gameData`. The engine never interprets it and migrations never
    touch it, so a slot list can render the in-game day, chapter or location without loading or migrating the save.
  - `updateSave(slot, changes)` and `slot.update(changes)` edit a save's title, metadata or screenshot without
    recapturing state and without moving `timestamp`, so renaming a save no longer sends it to the top of a list ordered
    by recency.
  - `useReadSaveFile()` and `useWriteSaves()` split import into decode and write, so a host can confirm a destructive
    import with the file already chosen. `useWriteSaves` also accepts `{ mode: "merge" }` to pull one save off another
    machine instead of replacing everything.
  - `putSaves(saves, mode)` writes whole records, preserving each one's timestamp and version.

## 0.6.1

### Patch Changes

- 332db0b: Fixed the published output being unloadable under Node's ESM resolver.

  These packages declare `"type": "module"` and only an `exports.import` condition,
  so Node reads their files as ESM — where relative specifiers need an explicit
  file extension and a directory never resolves to its `index.js`. `dist` shipped
  the shortened forms, which bundlers accept but Node rejects with
  `ERR_MODULE_NOT_FOUND` and `ERR_UNSUPPORTED_DIR_IMPORT`. The build now enables
  `tsc-alias`'s `resolveFullPaths`, matching what `core` and `devtools` already did.

  `@react-text-game/ui/i18n` additionally imported its English strings from a JSON
  file, which Node refuses without an `with { type: "json" }` import attribute
  (`ERR_IMPORT_ATTRIBUTE_MISSING`). Because `core` reaches that entry through a
  dynamic import inside `Game.init`, and that import is wrapped in a `try/catch`
  that treats any failure as "the UI package isn't installed", UI strings silently
  fell back to raw translation keys under Node and SSR. The locale is now a
  TypeScript module; the exported `uiTranslations` type is unchanged.

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
