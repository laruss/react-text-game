---
sidebar_position: 5
title: Saves
description: Build a save browser with named slots, per-save metadata, renaming, and import/export, using the hooks in @react-text-game/core/saves.
---

# Saves

Saves live in IndexedDB, in a database named after the game's `gameId`. Everything a save browser needs is in
`@react-text-game/core/saves`: slots, labels, game-owned metadata, renaming, and encrypted import/export.

## A slot list

`useSaveSlots` is the whole save screen. It gives you one entry per slot, live-updating, with the actions that act on
that slot.

```tsx
import { useSaveSlots } from "@react-text-game/core/saves";

function SaveBrowser() {
    const slots = useSaveSlots({ count: 8 });

    return (
        <ul>
            {slots.map((slot, index) => (
                <li key={index}>
                    <h3>{slot.data?.title ?? `Slot ${index + 1}`}</h3>
                    {slot.data && (
                        <time>
                            {new Date(slot.data.timestamp).toLocaleString()}
                        </time>
                    )}
                    <button onClick={() => slot.save({ title: "Chapter 2" })}>
                        Save
                    </button>
                    <button onClick={() => slot.load()} disabled={!slot.data}>
                        Load
                    </button>
                    <button onClick={() => slot.delete()} disabled={!slot.data}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

Each slot carries:

| Field                | What it does                                                                 |
|----------------------|------------------------------------------------------------------------------|
| `data`               | The `GameSave` in the slot, or `null` when it is empty                        |
| `save(options?)`     | Captures the current run, with an optional title, metadata and screenshot     |
| `load()`             | Restores the run, migrating it first when it predates the current version     |
| `delete()`           | Empties the slot                                                              |
| `update(changes)`    | Edits the title or metadata **without** recapturing state or moving the timestamp |

## Naming a save

`SaveOptions` is accepted by `slot.save()` and by `useSaveGame()`:

```ts
type SaveOptions = {
    title?: string; // player-facing label
    meta?: Record<string, unknown>; // yours; see below
    screenshot?: string; // base64 data URI
};
```

`screenshot` is never produced by the engine — capturing the screen belongs to the host. Pass one if you take one.

## `meta`: describing where in the story a save sits

A save card usually wants to show more than a label: the in-game day and hour, the chapter, the location, which
character the player was. That belongs in `meta`, not in the title and not in `gameData`.

```ts
await slot.save({
    title: "Before the plumber",
    meta: { day: 3, hour: 14, place: "flat", chapter: "Ashcroft" },
});
```

Two properties make it worth reaching for:

- **The engine never interprets it.** It is stored and returned exactly as you wrote it.
- **Save migrations never touch it.** `meta` sits beside `gameData`, not inside it, so it stays readable even when the
  save it annotates was written by an older version and has not been migrated yet — which is what lets a slot list
  render without loading anything.

## Renaming without disturbing the order

`timestamp` records when the run was captured. `update` leaves it alone, so a renamed save keeps its place in a list
ordered by recency:

```ts
await slot.update({ title: newName });
```

`saveGame` always re-stamps `timestamp`, because it captures a new run. Use `update` when no state is being captured —
that is the actual difference between the two.

## Results and error codes

Every save operation returns one shape, discriminated on `success`:

```ts
type SaveResult =
    | { success: true; error: null }
    | { success: false; code: SaveErrorCode; error: string };

type SaveErrorCode =
    | "cancelled"
    | "not-found"
    | "bad-file"
    | "decode-failed"
    | "migration-failed"
    | "storage-failed";
```

`error` is an English sentence meant for a log. Branch on `code`, and localise your own copy from it.

`cancelled` is not a failure the player needs to hear about — it means they closed a file dialog:

```ts
const result = await importSaves();
if (!result.success && result.code !== "cancelled") {
    toast(t(`saves.errors.${result.code}`));
}
```

## Import and export

`useExportSaves()` writes every save to an encrypted `.sx` file named after the game and its version. The file is
encrypted with the game's `gameId`, so one game cannot read another's export.

Import comes in three pieces. Use the two halves when the flow needs to confirm anything, because they let you show the
player what they are about to replace:

```tsx
const readSaveFile = useReadSaveFile();
const writeSaves = useWriteSaves();

const handleImport = async () => {
    const read = await readSaveFile(); // opens the picker; pass a File to skip it
    if (!read.success) {
        if (read.code !== "cancelled") toast(read.error);
        return;
    }

    const ok = await confirm(
        `Replace every save on this device with ${read.saves.length} from this file?`
    );
    if (!ok) return;

    await writeSaves(read.saves); // or { mode: "merge" }
};
```

`useImportSaves()` remains as the one-call convenience wrapper over both.

- Nothing is deleted until the whole file has decoded and validated, and the wipe and the writes share a transaction.
- Imported saves keep the timestamp and version they were written with, so the order the player knew them by survives a
  round trip through a file, and migrations still select correctly on load.
- `mode: "merge"` overwrites only the slots in the file and leaves the rest alone — the right default for pulling one
  save off another machine, where `"replace"` is right for restoring a backup.

## Reading and writing directly

The hooks cover a save browser. Below them the database functions are exported too:

```ts
import {
    deleteSave,
    getAllSaves,
    loadGame,
    putSaves,
    saveGame,
    updateSave,
} from "@react-text-game/core/saves";

const id = await saveGame(1, gameData, { title: "Before the boss" });
const save = await loadGame(1);
await updateSave(1, { title: "Renamed" });
await deleteSave(1);
```

:::caution `slot`, not `id`
`saveGame` returns the database's own auto-incremented `id`, but `loadGame`, `deleteSave` and `updateSave` all address
a save by its **slot** — the same value you passed to `saveGame`, compared as a string. `loadGame(save.id)` compiles
and is wrong. Pass `save.slot`.
:::

`putSaves(saves, mode)` is the restore path: it writes whole records, keeping each one's timestamp and version, where
`saveGame` captures the current run under a new timestamp.

## One database per game

The database is named `<gameId>-gamedb`. Set a `gameId` in `Game.init()` — without one, two games served from the same
origin (the same itch.io subdomain, the same studio domain, or `localhost` during development) share a database and
each will list the other's saves.

:::info Upgrading from before 0.11.0
Builds before 0.11.0 resolved the database name once, while modules were being imported — before `Game.init()` had
applied any options — so every game wrote to `-gamedb` regardless of its `gameId`.

On first open after upgrading, a game whose own database holds no player saves copies the saves and settings out of
`-gamedb`, preserving each save's timestamp and version, and records that it has done so. The legacy database is left
in place; nothing is copied into a database that already holds saves.

On a shared origin, the legacy database holds saves from several games with no way to tell them apart, so the first
game opened after the upgrade adopts all of them. Delete the ones that do not belong from the slot list.
:::

## The save record

```ts
interface GameSave {
    id?: number; // database primary key - do not address slots with it
    slot: string; // the slot key
    gameData: Record<string, unknown>; // the serialised state tree
    timestamp: Date; // when the run was captured
    version: string; // the game version that wrote it
    title?: string; // player-facing label
    meta?: Record<string, unknown>; // yours, never interpreted or migrated
    screenshot?: string; // base64, host-supplied
    isSystemSave?: boolean; // the pristine baseline; excluded from getAllSaves()
}
```

The engine keeps one reserved record, the system save, holding the untouched initial state that `Game.init()` captures.
It never appears in `getAllSaves()` or in a slot list, and `useRestartGame()` restores from it.

## Every hook

| Hook                  | Returns                                                    |
|-----------------------|------------------------------------------------------------|
| `useSaveSlots`        | A live array of slots with `save`/`load`/`delete`/`update`  |
| `useSaveGame`         | `(slot, options?) => SaveResult`                            |
| `useLoadGame`         | `(slot) => SaveResult`, migrating when needed               |
| `useUpdateSave`       | `(slot, changes) => SaveResult`                             |
| `useDeleteGame`       | `(slot) => SaveResult`                                      |
| `useDeleteAllSaves`   | `() => SaveResult`, keeping the system save                 |
| `useLastLoadGame`     | `{ hasLastSave, loadLastGame, isLoading, lastSave }`        |
| `useRestartGame`      | `() => SaveResult`, restoring the initial state             |
| `useExportSaves`      | `() => SaveResult`                                          |
| `useReadSaveFile`     | `(file?) => SaveResult<{ saves }>`                          |
| `useWriteSaves`       | `(saves, { mode }?) => SaveResult<{ count }>`               |
| `useImportSaves`      | `(file?, { mode }?) => SaveResult<{ count }>`               |

For versioning the shape of `gameData` itself, read [Save Migrations](./migrations.md).
