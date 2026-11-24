---
"@react-text-game/messenger": patch
---

Keep the default `messenger` strings in production builds.

The package entry registers the `messenger` namespace through a side-effect
import, but `package.json` listed only `./dist/i18n/index.js` under
`sideEffects`. Bundlers treated the entry as free of side effects and dropped
that import, so a Vite production build of a game that imported only the
messenger API shipped without the default strings, and `typing...` and the
other defaults rendered as raw keys. The entry is now listed too.
