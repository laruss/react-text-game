# @react-text-game/devtools

## 0.1.1

### Patch Changes

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

## 0.1.0

### Minor Changes

- Add `@react-text-game/devtools`: the `rtg` CLI that detects whether a release needs a save migration.

  `rtg saves snapshot` records the shape of your saves as a committed baseline; `rtg saves check` diffs later versions against it, classifies each difference by what it actually does to an old save, and exits non-zero when a migration is required but none is registered. It also catches two failures that are invisible in a code diff: a shape change whose `gameVersion` was not bumped (migrations only run when a save's version differs from the current one), and a deleted passage that old saves still point at. A baseline can be recovered from a game already in production, via an exported `.sx` save or an IndexedDB dump. Both Bun and Node are supported.

  Core changes supporting it:

  - **New** `getSaveSchemaSource()`, which reports the current save shape and the registered passage ids without requiring `Game.init()`.
  - **New** `decodeSf`/`encodeSf` exports from `@react-text-game/core/saves`, now accepting an explicit `gameId` so tooling can read a save file without booting the game it belongs to.
  - **Fixed** `useImportSaves` stamping imported saves with the current game version, which discarded the version they were created with and meant migrations never ran for them. `saveGame()` takes an optional `version` argument to support this.
  - **Fixed** the published `dist` using extensionless relative import specifiers, which plain Node's ESM resolver cannot resolve. `import("@react-text-game/core")` failed with `ERR_MODULE_NOT_FOUND` under Node; it now works, as do all subpath exports.
