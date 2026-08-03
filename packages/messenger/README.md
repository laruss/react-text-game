# @react-text-game/messenger

Headless messenger and visual-novel transcript engine for
[React Text Game](https://reacttextgame.dev).

A chat's transcript is an **append-only log that lives in an engine entity**, so it
survives saves, loads and remounts, and knows exactly what the player has and has
not seen. One primitive powers both a messenger simulator - chat list, unread
badges, group chats, media albums, scheduled delivery - and a Ren'Py-style visual
novel - backlog, skip-already-read, unlocked-ending screens.

`v0.1` is **headless**: state, delivery and selectors, with no components. UI
lands in a later release; see [TODO.md](./TODO.md).

## Why not `h.conversation`?

Core already renders dialogue through the story `conversation` component. The
difference is where the state lives:

|                            | `h.conversation` (core story) | `@react-text-game/messenger` |
| -------------------------- | ----------------------------- | ---------------------------- |
| Lives in                   | a passage's `display()`        | an engine entity             |
| Survives save / load       | no                             | yes                          |
| Knows what was shown       | no (`useState`, resets on remount) | yes, persistently       |
| Scope                      | one dialogue scene             | an ongoing conversation      |

Use `h.conversation` for a one-off scene. Use this package when the history has to
persist and unread state matters.

## Install

```bash
bun add @react-text-game/messenger
```

Requires `@react-text-game/core` as a peer.

## Quick start

```typescript
import { MINUTE } from "@react-text-game/core/clock";
import {
    defineChat,
    defineContact,
    defineMessenger,
    defineScript,
    m,
} from "@react-text-game/messenger";

const anna = defineContact("anna", {
    name: m.t("contacts.anna"),
    avatar: "/avatars/anna.webp",
});

export const annaChat = defineChat("anna", { peer: anna });

export const opener = defineScript("anna/opener", (m) => [
    m.from(anna).text(m.t("anna.opener")),
    m.typing(anna, 1200),
    m.from(anna).media([m.image("/park.webp", { alt: m.t("alt.park") })], {
        caption: m.t("anna.park"),
    }),
    m.wait(30 * MINUTE),
    m.choice("anna/opener/reply", [
        { content: m.t("reply.yes") },
        { content: m.t("reply.no") },
    ]),
]);

export const messenger = defineMessenger({
    chats: [annaChat],
    onSend: ({ chat, entry }) => {
        if (entry.from !== "player") incomingSound.play();
    },
});

// From an action handler - never while rendering:
annaChat.play(opener);
annaChat.advance();
```

Reading it back in React:

```tsx
import { useChat, useUnreadTotal } from "@react-text-game/messenger";

function ChatView() {
    const { entries, unread, firstUnreadKey, pendingChoice, canReply } =
        useChat(annaChat);

    return (
        <>
            {entries.map((entry) => (
                <Bubble key={entry.key} entry={entry} />
            ))}
            {canReply &&
                pendingChoice?.options.map((option) => (
                    <button
                        key={option.index}
                        type="button"
                        onClick={() => annaChat.choose(option.index)}
                    >
                        {option.content}
                    </button>
                ))}
        </>
    );
}
```

## The one rule

**Never change a chat while a passage or component renders.** Passage `display()`
runs again on every React render, on every save load and on every remount, so a
delivery triggered during render would repeat and duplicate messages.

Every method that changes state - `play`, `advance`, `deliverDue`, `push`,
`choose`, `markSeen`, `addParticipant`, `rename`, … - belongs in an event handler.
Reading during render is safe, and the hooks never materialize state.

## Text comes in three forms, chosen by what you pass

| You pass                        | Stored as | Behaviour                                       |
| ------------------------------- | --------- | ----------------------------------------------- |
| `"hey"`                         | `raw`     | frozen forever                                  |
| `m.t("anna.hi", { name })`      | `i18n`    | re-translates on language change; params frozen at delivery |
| `<>hey <b>you</b></>`           | `ref`     | re-read from the script beat, since a node cannot be serialized |

In a localized game write everything through `m.t()`: saves stay small, messages
re-translate, and interpolation values are captured at delivery so "you have 100
gold" never becomes "you have 20 gold" retroactively. Anything dynamic inside a
`ref` is re-evaluated live, so freeze it with `m.t()` or a plain string instead.

Read it back with `resolveText(richText)` for renderable content or
`previewText(richText)` for a plain string.

## What the model covers

- **Group chats** - `participants`, a localizable `title`, and membership changes
  that record an in-fiction system notice.
- **Forwarding** - `forwardedFrom` on any message beat. The source can be a
  contact, an id, or a free-form label; it does not have to be a real message.
- **Media** - one `media` payload covers a photo, a video, a caption, and a mixed
  album; the item count is what distinguishes them. Items carry `alt`, `poster`,
  `durationMs` and `spoiler`.
- **Optional chat picture** - resolved from an in-fiction change, then the
  definition, then the peer's avatar.
- **Read-only chats** - `readOnly` bars replies structurally, which is different
  from simply having no reply pending right now.
- **Seen tracking, at four levels** - delivered, player-seen (`seen`, `unread`,
  `firstUnreadKey`), the in-fiction `receipt` ticks, and a cross-save record of
  every beat the player has ever read.
- **Scheduled delivery** - `m.wait()` and `m.typing()` in game time, with no live
  timers: what is due is derived from the cursor and the clock, so a save loaded
  much later simply delivers what came due while it was away.

## Callbacks

All optional, on `defineChat()` for one chat and on `defineMessenger()` for every
chat. Chat callbacks fire first. A callback that throws is reported and cannot
corrupt the transcript.

`onSend` (any appended entry), `onSeen`, `onChoice`, `onTyping`, `onScriptEnd`,
`onParticipantChange`.

## Wiring delivery

`m.wait()` and `m.typing()` are measured in **game time**, from
`@react-text-game/core/clock`. With the default manual clock a delayed message
arrives when the game moves the clock - which is exactly Ren'Py's "three hours
later". In `realtime` mode it arrives after that much real time.

Call `messenger.deliverDueAll()` when the game gains focus, when the player opens
the messenger, after moving the clock, or on an interval. It is idempotent.

## Transcript size

Transcripts are uncapped by default so history is never silently lost. Auto-save
serializes the whole state tree into `sessionStorage`, so set `maxEntries` on a
chat that runs long; the package warns once a transcript passes 1000 entries
without a cap.

## Ids are persistent identifiers

Contact, chat, script and beat ids end up inside saved transcripts. Treat them
like passage ids and never rename them once a game has shipped.

Beat ids default to `"<scriptId>:<index>"` using the position the beat is written
at, so a conditional beat never shifts the ids after it. Give an explicit `id` to
any beat that has to stay addressable across edits that reorder the script; choice
beats require one.

## License

MIT (c) [laruss](https://github.com/laruss)
