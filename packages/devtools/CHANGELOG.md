# @react-text-game/devtools

## 0.1.0

### Minor Changes

- Add `@react-text-game/devtools`: the `rtg` CLI that detects whether a release needs a save migration.

  `rtg saves snapshot` records the shape of your saves as a committed baseline; `rtg saves check` diffs later versions against it, classifies each difference by what it actually does to an old save, and exits non-zero when a migration is required but none is registered. It also catches two failures that are invisible in a code diff: a shape change whose `gameVersion` was not bumped (migrations only run when a save's version differs from the current one), and a deleted passage that old saves still point at. A baseline can be recovered from a game already in production, via an exported `.sx` save or an IndexedDB dump. Both Bun and Node are supported.

  Core changes supporting it:

  - **New** `getSaveSchemaSource()`, which reports the current save shape and the registered passage ids without requiring `Game.init()`.
  - **New** `decodeSf`/`encodeSf` exports from `@react-text-game/core/saves`, now accepting an explicit `gameId` so tooling can read a save file without booting the game it belongs to.
  - **Fixed** `useImportSaves` stamping imported saves with the current game version, which discarded the version they were created with and meant migrations never ran for them. `saveGame()` takes an optional `version` argument to support this.
  - **Fixed** the published `dist` using extensionless relative import specifiers, which plain Node's ESM resolver cannot resolve. `import("@react-text-game/core")` failed with `ERR_MODULE_NOT_FOUND` under Node; it now works, as do all subpath exports.
