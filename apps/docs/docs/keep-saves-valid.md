---
title: Keep your saves valid
description: Find out whether a release needs a save migration before your players do, using the rtg saves CLI.
keywords:
    - save migrations
    - save compatibility
    - devtools
    - schema drift
    - rtg cli
image: /img/og-image.webp
---

# Keep your saves valid

You shipped 0.1. You are building 0.2. Somewhere in those commits you renamed a
field, added an entity, or deleted a passage — and you will not find out whether
that broke anyone's save until a player loads one.

[Save migrations](/migrations) are the fix. This guide is about the harder
question that comes first: **do I need one this time?**

`@react-text-game/devtools` answers it. It records the shape of your saves as a
committed file, then compares later versions against that baseline and tells you
which differences matter.

## What actually breaks

The classification is not intuitive, so it is worth knowing before you trust any
tool. When a save is loaded, each entity merges the saved data over its freshly
constructed defaults. That single detail decides everything:

| Change | What happens to an old save | Migration |
| --- | --- | --- |
| New field on an existing entity | The merge leaves the field at its default | Not needed |
| Removed field | Comes back as an unused variable | Not needed |
| Renamed field | Value stays under the old name; the new one is left at its default | **Needed** |
| **A whole new entity** | Variables are **cleared**, not defaulted | **Needed** |
| Changed type | The game gets a value of the old type | **Needed** |
| Removed or renamed passage | The save points at a passage that no longer resolves | **Needed** |

:::danger A new entity is the one everybody gets wrong
Adding a *field* is safe. Adding an *entity* is not. When a save contains no data
at all for an entity, loading takes a different branch and wipes that entity's
variables instead of keeping their defaults — so `wallet.gold` becomes
`undefined` and your code breaks on a save that used to work.
:::

Two more traps the table cannot show:

- **Migrations only run when the version differs.** Loading compares the save's
  version against the current one and skips migrating when they match. Change the
  shape without bumping `gameVersion` and your migration never executes, however
  correctly you wrote it.
- **A dangling passage fails silently.** A save whose `currentPassageId` no longer
  exists resolves to no passage at all, with no error.

## Install

```bash npm2yarn
npm install --save-dev @react-text-game/devtools
```

The CLI is called `rtg`, and it runs under both Bun and Node:

```bash
bunx @react-text-game/devtools saves check
npx @react-text-game/devtools saves check
```

## Tell the tool which version it is looking at

Do this once, before anything else. Games pass `gameVersion` to `Game.init()`
from the React entry point, which imports stylesheets and components — so the CLI
cannot load that file to read it. Instead, export the version from the module you
point the CLI at:

```typescript title="src/game/registry.ts"
export * from "./entities";
export * from "./maps";
export * from "./stories";

// Read by @react-text-game/devtools, and by Game.init() below.
export const gameVersion = "0.2.0";
```

```tsx title="src/main.tsx"
import { gameVersion } from "./game/registry";

await Game.init({ gameName: "Night Train", gameVersion });
```

Now both the running game and the tool read one value. If you skip this, the CLI
falls back to your `package.json` version, and says so on every run. It refuses
to be silent about a guess, because the version check is worthless if the version
is wrong.

## The workflow

Two commands, on two very different schedules.

### Once per release: `snapshot`

```bash
bunx rtg saves snapshot --entry src/game/registry.ts
```

This writes `save-schemas/0.2.0.json`. **Commit it.** That file is what future
versions are compared against, and it is why you never need the old version's
source code lying around.

:::warning Point --entry at your registry, not your app
The entry module must be loadable outside a browser, so give it a module that
only registers entities and passages. Aim it at `src/main.tsx` and the import
dies on the first stylesheet.
:::

### On every commit: `check`

```bash
bunx rtg saves check --entry src/game/registry.ts
```

Run this continuously, not once at the end of the release. At the end you have
fifty commits and no idea which one changed the shape; today you have one, and
the fix is obvious while the change is still fresh.

It exits `0` when there is nothing to do, `1` when a migration is required, and
`2` when it could not run at all — so it works as a CI gate:

```yaml title=".github/workflows/ci.yml"
- run: bunx rtg saves check --entry src/game/registry.ts
```

The loop converges: change the shape, `check` fails, bump `gameVersion` and
register the migration, `check` passes again.

## Reading the output

```text
Baseline: save-schemas/0.1.0.json
Version 0.2.0, from entry export.

Comparing 0.1.0 (baseline) against 0.2.0 (current).

[error] wallet (entity-added)
    Entity "wallet" is new. Loading an older save clears its variables instead
    of keeping their defaults, so it needs a migration that seeds it.

[warning] player.name (possible-rename)
    "player.name" disappeared and "player.title" appeared with the same type. If
    this is a rename, old saves keep the value under "player.name" and
    "player.title" falls back to its default - migrate it. If the two are
    unrelated, no migration is needed.

[info] player.level (field-added)
    "player.level" is new. Loading merges the save over the defaults, so old
    saves pick up its default value.

Migration required: 1 error, 0 warnings, 1 note.
```

- `error` — old saves break or lose data.
- `warning` — only you can decide. A rename and an unrelated add/remove pair look
  identical from the outside.
- `info` — recorded for completeness; nothing to do.

Once a registered chain covers the version bump, the same findings are reported
with a different verdict and a zero exit code. The tool checks that a migration
*exists*, never that it is *correct*.

## Starting from a game that is already live

If you shipped 0.1 without a snapshot, the baseline is recoverable — your
production build has been writing it into every player's browser all along. On
each `Game.init()` the engine stores a pristine copy of the default state under
the name `__SYSTEM_INITIAL_STATE__`.

:::warning Do this before you deploy the new version
The record is overwritten by the first `Game.init()` of whatever version runs
next. Capture it from the production origin while production is still 0.1.
:::

**From the production site's IndexedDB.** Open your live game, then DevTools →
Application → IndexedDB → `<gameId>-gamedb` → `saves`, and copy the
`__SYSTEM_INITIAL_STATE__` row into a JSON file:

```bash
bunx rtg saves snapshot --from-dump system-save.json
```

It also accepts a whole table copy, or just the `gameData` object if you pass
`--game-version`.

**From a real save file.** Any `.sx` export from 0.1 works too — your own or one
a player sends you. In one way it is better than the pristine state: its
collections are populated, so element types that empty defaults hide become
visible.

```bash
bunx rtg saves snapshot --from-save backup.sx --game-id my-game
```

`--game-id` has to match the `gameId` the game was built with, since save files
are encrypted with it.

Neither artifact knows your passage registry, so passage checks are skipped for
baselines recovered this way. Both work under plain Node with no loader.

## Testing that the migration is right

`check` stops at "a migration exists". To know it works, run a real 0.1 save
through it:

```typescript
import { runMigrations } from "@react-text-game/core/saves";

const result = runMigrations(oldSaveData, "0.1.0", "0.2.0");

expect(result.success).toBe(true);
expect(result.data?.wallet).toEqual({ gold: 100 });
```

Export a save from the old build, decrypt it, and feed its `gameData` in. Keep
that as a test and it will outlive your memory of the change.

## What it cannot catch

Worth knowing so you do not over-trust a green run:

- **Element types inside empty collections.** A default of `items: [] as string[]`
  records only "an array", so changing what the elements look like is invisible.
  Recovering a baseline from a real save (above) avoids this, because its arrays
  have contents.
- **Meaning changes at an identical shape.** If `gold` starts counting minor
  units, the shape is untouched and no tool can see it.
- **Values that were empty at capture time.** A field that was `null` then and a
  string now is reported as nothing at all, because "unset" and "retyped" are
  indistinguishable after the fact.

Treat `check` as the thing that stops you forgetting, not as proof of
compatibility.

## See also

- [Save migrations](/migrations) — writing the migration once you know you need one
- [Devtools API](/api/devtools/) — the same machinery, for scripting it yourself
