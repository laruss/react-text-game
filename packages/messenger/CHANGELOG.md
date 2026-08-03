# @react-text-game/messenger

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
