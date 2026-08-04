# Save migrations

## Contents

- Which changes need a migration
- Recording and checking the shape
- Writing a migration
- Migrating a removed passage id
- Testing a migration against a real save
- Recovering a baseline from a live game
- What the check cannot see
- Review checklist

## Which changes need a migration

A save holds the variables of every registered entity plus the engine's `_system` paths. On load, each entity merges the saved data over its freshly constructed defaults -- and that merge is the whole story:

| Change | Effect on an old save | Migration |
| --- | --- | --- |
| New field on an existing entity | Keeps its default, because the merge leaves it alone | No |
| Removed field | Reappears as an unused variable | No |
| Renamed field, renamed entity | Value stranded under the old name; the new one takes its default | Yes |
| **New entity** | Variables are **cleared**, not defaulted | Yes |
| Changed type | The game receives a value of the old type | Yes |
| Removed or renamed passage id | `currentPassageId` resolves to nothing, silently | Yes |

Two traps sit outside the table:

- **A new entity is the case most often got wrong.** When a save contains no key at all for an entity, load takes the branch that *deletes* its variables instead of keeping their defaults, so `wallet.gold` is `undefined` on a save that worked before the entity existed.
- **Migrations only run when the versions differ.** Load compares the save's recorded version against the current `gameVersion` and skips migrating when they match. Change the shape without bumping `gameVersion` and a correct migration never executes.

## Recording and checking the shape

Do not decide from the diff. `@react-text-game/devtools` records the shape as a committed file and classifies what changed.

```bash
# once per release; commit the save-schemas/<version>.json it writes
bunx rtg saves snapshot --entry src/game/registry.ts

# on every commit afterwards
bunx rtg saves check --entry src/game/registry.ts
```

Exit codes are `0` nothing to do (or a registered chain already covers the bump), `1` a migration is required and none covers it, `2` bad usage or an unreadable file -- so `check` works as a CI gate.

Point `--entry` at a module that only registers entities and passages. The React entry point imports stylesheets and components and cannot load outside a browser.

The CLI cannot read the `gameVersion` passed to `Game.init()`, for the same reason. Export it from the module the CLI loads and have `Game.init()` read the same value:

```ts
// src/game/registry.ts
export * from "./entities";
export * from "./stories";

export const gameVersion = "0.2.0";
```

Otherwise it falls back to the nearest `package.json`, then to the engine default -- and it prints which source it used every time, because the version check is worthless if the version is wrong.

## Writing a migration

Register migrations at startup, after `Game.init()`. Each one is a pure function from one version's shape to the next; the engine chains them with a shortest-path search, so only adjacent steps need to exist.

```ts
import { registerMigration } from "@react-text-game/core/saves";

registerMigration({
    from: "0.1.0",
    to: "0.2.0",
    description: "Seed the wallet entity and rename name -> title",
    migrate: (save) => ({
        ...save,
        // A new entity: old saves have no key for it, so supply the defaults.
        wallet: { gold: 0, items: [] },
        player: {
            ...(save.player as Record<string, unknown>),
            title: (save.player as { name?: string })?.name ?? "Traveler",
        },
    }),
});
```

- Return a new object; never mutate the input.
- Seed a new entity with the same defaults its `createEntity` call declares, or the migration trades one wrong state for another.
- A rename must carry the old value across. Dropping it is silent data loss, which is exactly what the migration exists to prevent.
- In dev mode `Game.init()` validates the chain and warns about dead ends and unreachable base versions.

## Migrating a removed passage id

Deleting or renaming a passage strands any save left on it. Rewrite the engine's own path:

```ts
registerMigration({
    from: "0.2.0",
    to: "0.3.0",
    description: "Redirect saves left on the removed attic passage",
    migrate: (save) => {
        const system = save._system as
            | { game?: { currentPassageId?: string | null } }
            | undefined;

        if (system?.game?.currentPassageId !== "attic") {
            return save;
        }

        return {
            ...save,
            _system: {
                ...system,
                game: { ...system.game, currentPassageId: "landing" },
            },
        };
    },
});
```

## Testing a migration against a real save

`check` verifies only that a migration *exists*. Prove it works by running real old data through it:

```ts
import { runMigrations } from "@react-text-game/core/saves";

const result = runMigrations(oldSaveData, "0.1.0", "0.2.0");

expect(result.success).toBe(true);
expect(result.data?.wallet).toEqual({ gold: 0, items: [] });
expect(result.data?.player).toMatchObject({ title: "Ada" });
```

Feed it the `gameData` of an actual export from the old build, and keep the test. Do **not** verify by importing a save file through the UI and loading it: import re-stamps each save with the version it was created with, so this only works from `@react-text-game/core` 0.10.0 onwards -- and going through `runMigrations` directly is the assertion you want anyway.

## Recovering a baseline from a live game

Shipped without a snapshot? Every `Game.init()` writes a pristine copy of the default state into the browser under the name `__SYSTEM_INITIAL_STATE__`, so production has been storing the baseline all along.

Capture it **before** deploying the new version, which overwrites that record, and take it from the production origin -- a local dev run has already replaced its own copy.

```bash
# DevTools -> Application -> IndexedDB -> <gameId>-gamedb -> saves
bunx rtg saves snapshot --from-dump system-save.json

# or from any exported save file; --game-id must match the built gameId,
# which the file is encrypted with
bunx rtg saves snapshot --from-save backup.sx --game-id my-game
```

A real save beats the pristine state in one respect: its collections are populated, so element types that empty defaults hide become visible. Neither artifact knows the passage registry, so passage checks are skipped for baselines recovered this way.

## What the check cannot see

- **Element types inside collections that were empty at capture.** A default of `items: [] as string[]` records only "an array", so a change to the element shape is invisible.
- **Meaning changes at an identical shape.** `gold` switching to minor units is undetectable by any structural comparison.
- **Fields that were unset at capture.** `null` or `undefined` then and a string now is not reported, because "was empty" and "was retyped" cannot be distinguished after the fact.

## Review checklist

- [ ] `bunx rtg saves check` passes, or its findings are each accounted for.
- [ ] `gameVersion` was bumped, and the CLI reports it from `--game-version` or an entry export rather than a fallback.
- [ ] Every new entity is seeded with the same defaults its `createEntity` call declares.
- [ ] Every rename carries the old value across instead of dropping it.
- [ ] Removed passage ids are redirected in `_system.game.currentPassageId`.
- [ ] A real save from the previous release round-trips through `runMigrations` in a test.
- [ ] The new `save-schemas/<version>.json` is committed.
