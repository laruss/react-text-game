---
"@react-text-game/messenger": patch
"@react-text-game/ui": patch
"@react-text-game/mdx": patch
---

Fixed the published output being unloadable under Node's ESM resolver.

These packages declare `"type": "module"` and only an `exports.import` condition,
so Node reads their files as ESM — where relative specifiers need an explicit
file extension and a directory never resolves to its `index.js`. `dist` shipped
the shortened forms, which bundlers accept but Node rejects with
`ERR_MODULE_NOT_FOUND` and `ERR_UNSUPPORTED_DIR_IMPORT`. The build now enables
`tsc-alias`'s `resolveFullPaths`, matching what `core` and `devtools` already did.

`@react-text-game/ui/i18n` additionally imported its English strings from a JSON
file, which Node refuses without an `with { type: "json" }` import attribute
(`ERR_IMPORT_ATTRIBUTE_MISSING`). Because `core` reaches that entry through a
dynamic import inside `Game.init`, and that import is wrapped in a `try/catch`
that treats any failure as "the UI package isn't installed", UI strings silently
fell back to raw translation keys under Node and SSR. The locale is now a
TypeScript module; the exported `uiTranslations` type is unchanged.
