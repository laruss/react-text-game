---
"@react-text-game/core": minor
"@react-text-game/ui": patch
---

Build games without `@react-text-game/ui`.

The core engine loaded the UI package's strings through
`import("@react-text-game/ui/i18n")`. A runtime `try/catch` guarded it, but
bundlers resolve literal import specifiers at build time, so a game that ships a
custom UI failed to build in Vite, both in dev (`Could not resolve
"@react-text-game/ui/i18n"`) and in production (`Rollup failed to resolve
import`).

The dependency now points the other way: importing `@react-text-game/ui`
registers its `ui` namespace through `registerTranslations`, as
`@react-text-game/messenger` already does for its namespace, and the core engine
no longer references the UI package at all. Your `translations.resources` still
override the UI defaults key by key. Translations a package registers while
`Game.init()` is still running are no longer lost.

**Upgrade both packages together.** This core release no longer loads the UI
strings itself, so with `@react-text-game/ui` 0.7.0 or older the `ui` namespace
stays empty. The new UI release also works with core 0.9.0 or newer.
