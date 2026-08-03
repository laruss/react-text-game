# Messenger transcripts

Applies to `@react-text-game/messenger`: persistent chat logs for messenger-simulator games and Ren'Py-style visual novels. Read this before adding chats, messages, delivery, or unread state.

## Contents

- What this package is for
- Script versus transcript
- The mutation rule
- Text forms
- Chats
- Messages
- Delivery
- Replies
- Seen tracking
- Callbacks
- Ids
- Verification

## What this package is for

A **persistent, append-only message log that knows what the player has and has not seen**. Reach for it when history must survive saves and unread state matters.

Do not reach for it for a one-off dialogue scene: core's story `conversation` component already covers that. The two are not interchangeable -- `h.conversation` keeps its reveal progress in `useState` and resets on remount, and nothing about it is persisted.

The `0.1` release is headless. There are no components; do not invent imports for them.

## Script versus transcript

- A **script** (`defineScript`) is authored, static and addressable, like a passage.
- A **transcript** is runtime state: the delivered entries, a per-script cursor, seen flags, and the next due time.

Transcripts live in one engine entity (`messenger`), so they participate in save, load, auto-save and migrations like any other entity. State is materialized lazily from a chat's definition on first access, which is why adding a chat to a shipped game needs no save migration.

## The mutation rule

Never change a chat while a passage or component renders. `display()` runs again on every React render, on every save load and on every remount, so a delivery triggered during render duplicates messages.

Action handlers only: `play`, `advance`, `deliverDue`, `push`, `choose`, `markSeen`, `markSeenUpTo`, `setTyping`, `addParticipant`, `removeParticipant`, `rename`, `setAvatar`, `setReadOnly`, `clear`.

Reading during render is safe. `useChat`, `useChatList` and `useUnreadTotal` never materialize state -- a chat nothing has written to reports its initial values.

## Text forms

The stored form follows the argument type. There is no mode flag.

| Passed | Stored | Behaviour |
| --- | --- | --- |
| `string` or `number` | `raw` | frozen forever |
| `m.t(key, params)` | `i18n` | re-translates on language change; `params` frozen at delivery |
| React node | `ref` | re-read live from the script beat |

Prefer `m.t()` in a localized game: saves stay small, old messages re-translate, and interpolation is frozen so a past message never rewrites itself. A `ref` is the only way to carry a React node, and its content is re-evaluated live -- freeze anything dynamic with `m.t()` or a plain string instead.

`chat.push()` cannot store a `ref`, because there is no beat to point at; it throws a message telling the author to use a script. Read text back with `resolveText` (renderable) or `previewText` (plain string).

## Chats

- `peer` makes a direct chat; `participants` makes a group. A group carries its own localizable `title` and its membership changes during play.
- Everything mutable lives in state; `defineChat` supplies only initial values. That covers `title`, `avatar`, `participants` and `readOnly`.
- `resolvedAvatar` falls back through an in-fiction change (`null` means removed), the definition, then a direct chat's peer avatar. A chat may legitimately have none.
- `readOnly` bars replies structurally, as in a channel. That is **not** the same as having no reply pending right now: check `canReply` for the structural answer and `pendingChoice` for the transient one. `choose()` throws in a read-only chat.
- `maxEntries` is unbounded by default so history is never silently lost. Auto-save serialises the whole state tree, so cap a chat that runs long; the package warns once past 1000 entries without a cap.

## Messages

One `media` payload covers a photo, a video, a caption and a mixed album -- the item count is the difference. Items carry `alt`, `poster`, `durationMs` and `spoiler`.

Forwarding is metadata (`forwardedFrom`), not a payload kind, so any payload can be forwarded. The source need not be a real message: pass a contact, an `{ id }`, or a `{ label }` for an unknown sender.

`system` beats are always translated through this package's `messenger` namespace. `custom` is the extension hatch for anything not modelled yet -- voice notes, files, stickers -- without breaking saved transcripts.

## Delivery

`m.wait()` and `m.typing()` are measured in **game time** from `Clock`, and there are no live timers: what is due is derived from the cursor and the clock, which is why a save loaded much later simply delivers what came due while it was away.

- `play(script)` sets the cursor without delivering anything.
- `advance(count)` delivers up to `count` messages, stopping at a choice, at a not-yet-due wait, and at the end of the script. Control beats do not count towards `count`.
- `deliverDue()` clears expired typing and bursts everything now due. Idempotent -- wire `messenger.deliverDueAll()` to window focus, passage change, clock movement, or an interval.

Catching up **replays the authored schedule rather than stretching it**: each entry keeps the in-fiction time it was due at, so a conversation written to unfold over three minutes still reads that way an hour later. Do not "fix" this by stamping `Clock.now()`.

## Replies

A `choice` beat blocks until the player answers. `choose(index)` logs the reply as a `choice` payload from the player, then plays an option's `next` script, calls its `next` function, or continues the current script. It throws when the chat is read-only, nothing is pending, or the index does not exist.

## Seen tracking

Four distinct levels; do not conflate them.

| Level | Where | Meaning |
| --- | --- | --- |
| delivered | `entries` | the message arrived, in-fiction |
| `seen` | per entry, in the save | the **player** looked at it |
| `receipt` | per entry, in the save | the **character's** ticks, author-controlled |
| seen-ever | settings table, **outside** the save | read in *any* playthrough |

`unread` and `firstUnreadKey` derive from `seen`. The player's own messages count as seen immediately. The cross-save level backs skip-already-read, galleries and unlocked endings, and cannot live in the save because it has to outlive a slot; call `messenger.loadSeen()` during bootstrap and `flushSeen()` before unload, or swap in `createMemorySeenStore()`.

## Callbacks

All optional, on `defineChat` for one chat and on `defineMessenger` for every chat. Chat callbacks fire first, after the state change they describe, and a throwing callback is reported without corrupting the transcript.

`onSend` fires for **every** appended entry -- contact, player and system alike. Also available: `onSeen`, `onChoice`, `onTyping`, `onScriptEnd`, `onParticipantChange`.

Callbacks are not persisted; they live on the definition.

## Ids

Contact, chat, script and beat ids are stored inside saved transcripts. Treat them like passage ids and never rename one once a game has shipped.

Beat ids default to `"<scriptId>:<index>"` using the position the beat is **written** at, before falsy entries are skipped -- so a conditional beat never shifts the ids after it. Do not compact a script's beat array or index the cursor into a filtered array; both break saved transcripts. Give an explicit `id` to any beat that must survive a reordering edit; `choice` beats require one.

Reserved ids: the store entity is `messenger`, and `player` and `system` are reserved sender ids.

## Verification

- Tests live in `packages/messenger/src/tests`, and behaviour changes need tests there.
- `Clock` is injectable via `Clock._setNowProvider`, and `Clock.advance()` drives scheduled delivery deterministically -- never sleep on real time.
- Reset between tests with the package's registry clears plus `Game._resetForTesting()`; leaving the store's slot in storage leaks state into the next test.
- The root `happydom.ts` preload already mocks Dexie, so the settings-backed seen store works in tests.
