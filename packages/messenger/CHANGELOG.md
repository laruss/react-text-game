# @react-text-game/messenger

## 0.1.1

### Patch Changes

- 332db0b: Fixed the published output being unloadable under Node's ESM resolver.

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

## 0.1.0

### Minor Changes

- Initial release: a headless messenger and visual-novel transcript engine.

  A chat's transcript is an append-only log that lives in an engine entity, so it
  survives saves, loads and remounts and knows exactly what the player has and has
  not seen. The same primitive powers a messenger simulator - chat list, unread
  badges, scheduled delivery - and a Ren'Py-style visual novel - backlog,
  skip-already-read.

  - `defineContact`, `defineChat`, `defineScript` and `defineMessenger`, with an
    `m` toolbox mirroring core's helpers-first passage factories.
  - Direct and group chats: localizable titles, membership changes that record an
    in-fiction notice, optional chat pictures with a fallback chain, and read-only
    channels kept distinct from "no reply pending right now".
  - One `media` payload covering photos, videos, captions and mixed albums, with
    `alt`, `poster`, `durationMs` and `spoiler` per item.
  - Message forwarding as metadata, so any payload can be forwarded and the source
    need not be a real message.
  - Text stored in whichever of three forms matches what the author passed: a
    frozen string, a translation key that re-translates while its interpolation
    stays frozen, or a reference back to the script beat for React content.
  - Scheduled delivery and typing indicators measured in game time, with no live
    timers. Catching up replays the authored schedule rather than stretching it.
  - Seen tracking at four levels, including a cross-save record that backs
    skip-already-read, galleries and unlocked endings.
  - Optional `onSend`, `onSeen`, `onChoice`, `onTyping`, `onScriptEnd` and
    `onParticipantChange` callbacks, per chat or for every chat.
  - Headless hooks: `useChat`, `useChatList`, `useUnreadTotal`. UI ships in a
    later release.

### Patch Changes

- Updated dependencies
  - @react-text-game/core@0.9.0
