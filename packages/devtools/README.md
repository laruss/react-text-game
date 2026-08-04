# @react-text-game/devtools

Development-time CLI for [React Text Game](https://reacttextgame.dev/). It answers
one question you cannot reliably answer by hand: **does this release need a save
migration?**

```bash
bun add -d @react-text-game/devtools
```

The binary is `rtg`, and it runs under both Bun and Node:

```bash
bunx @react-text-game/devtools saves check
npx @react-text-game/devtools saves check
```

## Why

A save stores the state of every registered entity, so changing that state's shape
can break saves your players already have. Which changes are dangerous is not
obvious:

| Change | What happens to an old save | Migration |
| --- | --- | --- |
| New field on an existing entity | Keeps its default, because loading merges over defaults | Not needed |
| Removed field | Comes back as an unused variable | Not needed |
| Renamed field | Value stranded under the old name | **Needed** |
| **A whole new entity** | Variables are **cleared**, not defaulted | **Needed** |
| Changed type | The game gets a value of the old type | **Needed** |
| Removed or renamed passage | The save points at a passage that no longer resolves | **Needed** |

It also catches two failures that are invisible in a diff:

- a shape change whose `gameVersion` was not bumped — migrations only run when a
  save's version differs from the current one, so nothing would migrate;
- a deleted passage, which leaves old saves resolving to no passage at all,
  silently.

## Usage

Export the version from the module you point the CLI at, so the tool and the
running game read one value:

```typescript
// src/game/registry.ts
export * from "./entities";
export * from "./stories";

export const gameVersion = "0.2.0";
```

Record a baseline once per release, and commit the file it writes:

```bash
rtg saves snapshot --entry src/game/registry.ts   # -> save-schemas/0.2.0.json
```

Then check on every commit:

```bash
rtg saves check --entry src/game/registry.ts
```

Exit codes make it a CI gate: `0` nothing to do (or a registered migration already
covers the change), `1` a migration is required, `2` bad usage or an unreadable
file.

Point `--entry` at a module that only registers entities and passages. The React
entry point imports stylesheets and components, which cannot be loaded outside a
browser.

### Already shipped without a baseline?

The baseline is recoverable: every `Game.init()` writes a pristine copy of the
default state into the browser under `__SYSTEM_INITIAL_STATE__`. Capture it from
the production origin **before** deploying the new version, which overwrites it.

```bash
# from an IndexedDB row copied out of DevTools
rtg saves snapshot --from-dump system-save.json

# or from any exported save file
rtg saves snapshot --from-save backup.sx --game-id my-game
```

Both work under plain Node with no loader.

## Limits

`check` is the thing that stops you forgetting, not proof of compatibility. It
cannot see element types inside collections that were empty when captured, meaning
changes at an identical shape (`gold` switching to minor units), or the difference
between a field that was unset and one that was retyped. And it verifies only that
a migration *exists* — never that it is correct.

## Documentation

- [Keep your saves valid](https://reacttextgame.dev/keep-saves-valid) — the full workflow
- [Save migrations](https://reacttextgame.dev/migrations) — writing the migration itself
- [Devtools API](https://reacttextgame.dev/api/devtools/) — the same machinery, for scripting it yourself

## License

MIT
