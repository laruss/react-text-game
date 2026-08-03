# @react-text-game/messenger TODO

`v0.1` ships the headless engine only. Everything below is deliberately out of
scope for it.

## UI (next release)

Principle: every component is a thin consumer of the headless hooks. No logic in
components, and no gameplay state in `useState` - `PassageController` remounts on
every `jumpTo`, including a jump to the passage already on screen, so local state
would reset while the transcript survives.

### Component inventory

- [ ] `ChatList` + `ChatListItem` (avatar with fallback chain, title, last-message
      preview via `previewText`, unread badge)
- [ ] `ChatWindow` (header, transcript, composer)
- [ ] `GroupHeader` with participant count, plus a participant sheet
- [ ] `Bubble` variants: text, media, album, system, choice
- [ ] `ForwardHeader` ("Forwarded from X") as a wrapper around any bubble
- [ ] `DeletedBubble` and an `edited` marker driven by the entry flags
- [ ] `AlbumGrid` layouts for 1 / 2 / 3 / 4+ items, mixed photo and video
- [ ] `VideoBubble` with poster, duration label and controls
- [ ] `SpoilerOverlay` for `MediaItem.spoiler`
- [ ] `MediaViewer` / lightbox with album navigation
- [ ] `MessageMeta`: game-time stamp plus `receipt` ticks
- [ ] `TypingIndicator` driven by `ChatSnapshot.typing`
- [ ] `UnreadDivider` anchored on `firstUnreadKey`
- [ ] `DateDivider` using the `divider.today` / `divider.yesterday` keys
- [ ] `ReplyChoices` driven by `ChatSnapshot.pendingChoice`
- [ ] `ReadOnlyNotice`, distinct from "no reply available right now"
- [ ] `JumpToUnread` scroll anchor

### Behaviour

- [ ] auto-scroll policy: stick to the bottom only when the player is already there
- [ ] sticky date headers
- [ ] virtualization for long transcripts
- [ ] preload media through `preloadContent` from core
- [ ] optional typewriter reveal for text
- [ ] incoming-message sound through `@react-text-game/core/audio`
- [ ] accessibility: live region for incoming messages, keyboard navigation of
      replies
- [ ] right-to-left layouts

### Theming and integration

- [ ] use the semantic Tailwind tokens of `@react-text-game/ui` by class name, with
      no code dependency on that package
- [ ] slots in `ComponentsProvider` (`components.messenger.*`)
- [ ] decide: full-screen messenger app (a `Widget` passage) versus a chat window
      embedded inside a story
- [ ] decide whether a native `PassageType` of `"chat"` is worth widening the core
      union for

## Engine, deferred

- [ ] `replyTo`: quoting an earlier entry (metadata alongside `forwarded`)
- [ ] payload kinds for voice notes, files, stickers and locations - today these go
      through the `custom` payload
- [ ] mentions (`@player`) as a distinct flavour of unread
- [ ] reactions on entries
- [ ] in-fiction edit and delete as operations rather than plain flags
- [ ] transcript search
- [ ] archiving a trimmed transcript tail into Dexie, and deciding how that
      interacts with loading an earlier save
- [ ] `catchUp` policies beyond burst: replay with delays, collapse to the last
      message
- [ ] pinned / muted / archived chats in the chat list
- [ ] disabled choice options with a reason, for locked replies
- [ ] authoring scripts in MDX - `packages/mdx` already has a compile-time `<Say>`,
      but its recma plugin only registers stories
- [ ] limited rollback: truncate the transcript plus a ring buffer of
      `Game.getState()` snapshots
- [ ] gallery and unlocked-ending screens built on the cross-save seen record
- [ ] `offlinePolicy` for `Clock` in realtime mode: today elapsed real time accrues
      while the game is closed, and `Clock.pause()` is the only opt-out
