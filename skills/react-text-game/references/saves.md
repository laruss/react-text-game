# Saves

Everything a save browser needs is in `@react-text-game/core/saves`. For versioning the shape of `gameData` itself,
read [migrations.md](migrations.md) instead -- that is a different problem.

- Building a slot list
- Naming a save, and where the rest of the card's data belongs
- Renaming without disturbing the order
- Results and error codes
- Import and export
- One database per game

## Building a slot list

`useSaveSlots` is the whole screen. Do not reach past it to `saveGame` + `Game.getState()`: everything it used to be
missing is now on the slot.

```tsx
const slots = useSaveSlots({count: 8});

<button onClick={() => slots[i].save({title, meta: {day: clock.day, place: player.room}})}>Save</button>
<button onClick={() => slots[i].update({title: renamed})}>Rename</button>
```

| On each slot      | Does                                                                          |
|-------------------|-------------------------------------------------------------------------------|
| `data`            | the `GameSave`, or `null` for an empty slot                                    |
| `save(options?)`  | captures the current run with an optional `title`, `meta`, `screenshot`        |
| `load()`          | restores it, migrating first when the save predates the current version        |
| `delete()`        | empties the slot                                                              |
| `update(changes)` | edits `title`/`meta`/`screenshot` **without** recapturing state or re-stamping |

## Naming a save, and where the rest of the card's data belongs

`title` is the player's label. Everything else the card shows -- in-game day and hour, chapter, location, which
character the player was -- goes in `meta`, a game-owned object stored beside `gameData`:

```ts
slot.save({title: "Before the plumber", meta: {day: 3, hour: 14, place: "flat"}});
```

- **Do not encode the in-game moment into the title.** The player renaming the save then destroys the only record of
  when it was taken.
- **Do not unpack `gameData` to render a card.** It is the engine's serialised state tree; a UI that reads it is
  coupled to the save shape and has to be migrated alongside it.
- `meta` is never interpreted by the engine and never touched by migrations, so it stays readable even when the save
  beside it is from an older version and has not been migrated yet. That is what makes a slot list renderable without
  loading anything.
- `screenshot` is the host's to fill. The engine produces none -- capturing the canvas or the DOM is game territory.

## Renaming without disturbing the order

`timestamp` is when the *run* was captured. `saveGame` always re-stamps it, because it captures a new run; `update`
leaves it alone. So renaming through `update` keeps a save in place in a list ordered by recency, and reaching into
`db.saves.update()` from a component is never necessary.

## Results and error codes

Every hook returns one shape:

```ts
type SaveResult = { success: true; error: null } | { success: false; code: SaveErrorCode; error: string };
```

`code` is `cancelled | not-found | bad-file | decode-failed | migration-failed | storage-failed`. Branch on it;
`error` is an English sentence for a log, not for the player.

**`cancelled` is not an error.** It means the player closed a file dialog. Say nothing:

```ts
if (!result.success && result.code !== "cancelled") toast(t(`saves.errors.${result.code}`));
```

## Import and export

`useExportSaves()` downloads every save as a `.sx` file encrypted with the game's `gameId`.

Import is three hooks. Use the two halves whenever the flow confirms anything, because `useImportSaves` picks the file
and writes in one call and so cannot show the player what they are about to replace:

```ts
const read = await useReadSaveFile()(); // pass a File to skip the picker
if (!read.success) return;              // read.code === "cancelled" when the dialog closed
if (!confirmed(read.saves.length)) return;
await useWriteSaves()(read.saves);      // or { mode: "merge" }
```

- Nothing is deleted until the whole file decodes and validates; the wipe and the writes share a transaction.
- Imported records keep their own timestamp and version, so the order the player knew survives the round trip and
  migrations still select correctly on load.
- `mode: "merge"` overwrites only the slots in the file. Right for pulling one save off another machine; `"replace"`
  (the default) is right for restoring a backup.

## One database per game

The database is `<gameId>-gamedb`. **Always set `gameId` in `Game.init()`** -- without one, two games on the same
origin (one itch.io subdomain, one studio domain, or `localhost` in development) share a database and each lists the
other's saves.

Builds before 0.11.0 resolved that name once while modules were importing, before `Game.init()` had applied options,
so every game wrote to `-gamedb` whatever its `gameId`. From 0.11.0, a game whose own database holds no player saves
copies the saves and settings out of `-gamedb` on first open, keeping timestamps and versions, and records that it has
done so. On a shared origin, the first game opened after the upgrade adopts every save in there -- there is no field
distinguishing them -- so the player deletes the strays from the slot list.

## Addressing a save

`GameSave.slot` is the key every function takes. `GameSave.id` is the database's own primary key and addresses
nothing: `loadGame(save.id)` compiles, and silently reads the slot whose number happens to equal that id.

```ts
await loadGame(save.slot);   // right
await loadGame(save.id);     // compiles, wrong
```

Records written before 0.11.0 spell these fields `name` and `description`; a Dexie schema upgrade renames them on
open, and import accepts either spelling from a `.sx` file.
