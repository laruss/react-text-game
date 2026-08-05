### I18N: WHAT SHIPPED, AND WHAT IS STILL OPEN

This file started as a proposal written before any i18n code existed. The engine
was built differently, so it has been rewritten to describe what actually ships,
which parts of the proposal were dropped, and what is left.

User-facing documentation lives in `apps/docs/docs/i18n.md`. This file is for
maintainers and does not repeat it.

#### The shipped design

Runtime i18next. No code generation, no build step, no CLI.

- **Core owns the configuration.** `Game.init({ translations })` forwards the
  config straight to `initI18n()` (`packages/core/src/game.ts:631`,
  `packages/core/src/i18n/init.ts`). The config type is `I18nConfig`:
  `defaultLanguage`, `fallbackLanguage`, `debug`, `resources`, `modules`.
- **Resources are plain objects.** The author passes
  `{ [lang]: { [namespace]: { ... } } }` and calls `t()` themselves. Nothing is
  extracted from passage source.
- **Three layers, merged per key.** Package defaults registered through
  `registerTranslations()`, then `@react-text-game/ui` defaults, then the
  author's `resources`. `deepMerge` runs per key rather than per namespace, so
  overriding one string does not drop the rest of that namespace.
- **Persistence.** The active language is a row in the saves database
  (`getSetting`/`setSetting` under `"language"`), read during `initI18n` and
  written by `changeLanguage`.
- **Access.** `useGameTranslation(namespace)` inside React (it also returns
  `changeLanguage`, `currentLanguage` and `languages`), `getGameTranslation(namespace)`
  outside it. Both default to the `passages` namespace.
- **Packages contribute defaults.** `registerTranslations()` accumulates
  resources; before init they fold into the i18next config, after init they go
  through `addResourceBundle` without overwriting existing keys.
- **UI package.** Ships the English `ui` namespace plus the `LanguageToggle`
  component. Core loads it through an optional dynamic import, so a game with a
  custom UI and no `@react-text-game/ui` installed just gets an empty object.
- **Messenger package.** Ships the English `messenger` namespace and registers it
  on import, so importing the package is enough.

Locale files are TypeScript modules, not JSON: Node's ESM resolver requires an
`with { type: "json" }` import attribute, which would make the entry unloadable
under plain Node when core reaches it through the dynamic import.

#### What the original proposal wanted, and what happened to it

| Proposed | Outcome |
| --- | --- |
| Auto-extraction of string literals from `newStory` / `newInteractiveMap` display functions | Not built. Authors write resources by hand. |
| Shadow files in `translations/passages/` mirroring `src/passages/` | Dropped. There is no generated code and no second import path. |
| Separate dev and prod generation modes | Dropped along with the shadow files. |
| `rtg-i18n` CLI: `generate`, `watch`, `update`, `--force` | Never built. No such binary exists anywhere in the repo. |
| `rtg-i18n.config.js` | Not needed. The config is the `translations` field of `Game.init`. |
| A dedicated `@react-text-game/i18n` package | Shipped inside core, exposed at the `@react-text-game/core/i18n` subpath. |
| MDX strategy: frontmatter markers vs per-language files vs JSON-only | Never decided. `packages/mdx` has no i18n awareness at all. |
| Copying UI translation files into the user's project | Replaced by the dynamic import plus `registerTranslations`, so nothing is copied. |

The runtime half of the proposal survived roughly as designed - namespaces,
automatic injection of a `t` function, UI package defaults that the author can
override. The code-generation half did not.

#### Still open

- **MDX passages cannot be translated.** Text written in a `.mdx` file is
  compiled straight into story components by the recma plugin, with no key and no
  `t()` call anywhere in the pipeline. This is the largest remaining gap, and it
  is the part the original proposal spent most of its length on. Deciding the MDX
  strategy is a prerequisite for any extraction tooling.
- **Only English defaults ship.** `packages/ui/src/i18n/locales/en/ui.ts` and
  `packages/messenger/src/i18n/en.ts` are the only locale files in the repo. A
  game supporting another language has to restate the whole `ui` namespace in its
  own resources.
- **No extraction or key-audit tooling.** Nothing reports keys that a game
  references but never defines, or defines but never uses.
- **`supportedLngs` is frozen at init.** `initI18n` computes it once from the
  merged resources; `registerTranslations` called after init only adds resource
  bundles and never extends the list, so a language first introduced by a late
  registration will not appear in `languages` and cannot be switched to. Packages
  register on import today, which is before `Game.init`, so this only bites late
  registration.
- **Two namespace defaults disagree.** `initI18n` sets i18next's `defaultNS` to
  `"common"`, while `useGameTranslation` and `getGameTranslation` default to
  `"passages"`. Harmless as long as callers pass a namespace, but worth
  reconciling.
- **Three UI components call `useTranslation("ui")` from react-i18next directly**
  (`MainMenu`, `SaveLoadModal`, `SaveSlot`) instead of core's
  `useGameTranslation`. Equivalent for read-only lookups, but inconsistent with
  the rest of the codebase.
