---
title: Messenger & Transcripts
description: Build messenger-simulator games and Ren'Py-style visual novels with React Text Game. Persistent message logs, unread tracking, group chats, media albums, forwarding and scheduled delivery.
keywords:
    - messenger game
    - chat simulator
    - visual novel
    - renpy
    - transcript
    - unread messages
    - group chat
    - react text game
image: /img/og-image.webp
---

# Messenger & Transcripts

`@react-text-game/messenger` gives you a **persistent, append-only message log
that knows what the player has and has not seen**. That single primitive powers
both a messenger simulator - chat list, unread badges, group chats, media albums,
messages arriving later - and a Ren'Py-style visual novel - a backlog screen and
skip-already-read.

This release is **headless**: state, delivery and selectors, with no components.
UI ships in a later release.

This page is the model and the reference. For a working game built on it — chat
list, chat view, scheduled delivery wired to the clock, replies that branch the
story — follow [Build a messenger game](/messenger-game).

## Install

```bash
bun add @react-text-game/messenger
```

## Why not the story `conversation` component?

Core already renders dialogue with `h.conversation`. The difference is where the
state lives:

|                        | `h.conversation`                   | `@react-text-game/messenger` |
| ---------------------- | ---------------------------------- | ---------------------------- |
| Lives in               | a passage's `display()`             | an engine entity             |
| Survives save / load   | no                                 | yes                          |
| Knows what was shown   | no (resets on remount)             | yes, persistently            |
| Scope                  | one dialogue scene                 | an ongoing conversation      |

Use `h.conversation` for a one-off scene. Reach for this package when the history
has to persist and unread state matters.

## Core idea: script and transcript

Two things, deliberately separate:

- a **script** is authored, static and addressable, like a passage;
- a **transcript** is runtime state: what was actually delivered, in what order,
  with a cursor and per-entry seen flags.

Because the transcript lives in an engine entity, it survives saves, loads and
remounts for free, and participates in auto-save and migrations like any other
entity.

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

export const messenger = defineMessenger({ chats: [annaChat] });
```

Then, **from an action handler**:

```typescript
annaChat.play(opener); // set the cursor
annaChat.advance(); // deliver the next message
```

## The one rule

**Never change a chat while a passage or component renders.** A passage's
`display()` runs again on every React render, on every save load and on every
remount, so a delivery triggered during render would repeat and duplicate
messages. See [Handling Side Effects](/side-effects).

Every state-changing method - `play`, `advance`, `deliverDue`, `push`, `choose`,
`markSeen`, `addParticipant`, `rename`, `setAvatar`, `setReadOnly`, `clear` -
belongs in an event handler. Reading during render is safe, and the hooks never
materialize state.

## Text comes in three forms

Which form is stored is decided by **what you pass**, not by a flag:

| You pass                   | Stored as | Behaviour                                                       |
| -------------------------- | --------- | --------------------------------------------------------------- |
| `"hey"`                    | `raw`     | frozen forever                                                  |
| `m.t("anna.hi", { name })` | `i18n`    | re-translates on language change; interpolation frozen on delivery |
| `<>hey <b>you</b></>`      | `ref`     | re-read from the script beat, since a node cannot be serialized |

In a localized game write everything through `m.t()`. Saves stay small, old
messages re-translate when the player switches language, and interpolation values
are captured at delivery - so "you have 100 gold" never becomes "you have 20 gold"
retroactively.

A `ref` is the only way to put a React node in a message, and its content is
re-evaluated live from the script. Anything dynamic inside one should be frozen
with `m.t()` or a plain string instead.

Read text back with:

```typescript
import { previewText, resolveText } from "@react-text-game/messenger";

resolveText(richText); // renderable content
previewText(richText); // plain string, for list previews
```

## Chats

### Direct and group

```typescript
// one-to-one: title and avatar fall back to the peer
const annaChat = defineChat("anna", { peer: anna });

// group: its own title, its own picture, several members
const squad = defineChat("squad", {
    title: m.t("chats.squad"),
    participants: [anna, boris],
    avatar: "/avatars/squad.webp",
});
```

Membership changes during play and records an in-fiction notice:

```typescript
squad.addParticipant(carol); // appends a "member.joined" system entry
squad.removeParticipant(boris); // appends a "member.left" system entry
squad.rename(m.t("chats.squadRenamed"));
squad.setAvatar("/avatars/squad-2.webp");
squad.setAvatar(null); // no picture at all
```

Anything that can change during play lives in state; `defineChat()` only supplies
the starting values.

### The chat picture is optional

`resolvedAvatar` walks a fallback chain: an in-fiction change (where `null` means
"removed"), then the definition's avatar, then - for a direct chat - the peer's
avatar, and finally `undefined`.

### Read-only chats

Two different things, kept apart on purpose:

```typescript
const news = defineChat("news", { title: m.t("chats.news"), readOnly: true });

news.canReply; // false - structurally barred, a channel
annaChat.canReply; // true
annaChat.pendingChoice; // null - nothing to answer right now
```

`readOnly` can be toggled in-fiction with `setReadOnly()`, for a group that gets
closed by an administrator.

## Messages

### Media, captions and albums

One payload kind covers all of it; the item count is what distinguishes a single
photo from an album:

```typescript
m.from(anna).media([m.image("/park.webp")]); // one photo
m.from(anna).image("/park.webp", { caption: "look" }); // photo with a comment
m.from(anna).video("/clip.mp4", { poster: "/clip.jpg", durationMs: 8000 });

m.from(anna).media(
    [
        m.image("/1.webp", { alt: m.t("alt.first") }),
        m.video("/2.mp4", { spoiler: true }),
    ],
    { caption: m.t("anna.album") }
); // a mixed album
```

Items carry `alt`, `poster`, `durationMs` and `spoiler`.

### Forwarding

Forwarding is metadata on the message, so **any** payload can be forwarded, and
the source does not have to be a real message:

```typescript
m.from(anna).text(m.t("boris.rumor"), { forwardedFrom: boris });
m.from(anna).text("...", { forwardedFrom: { label: m.t("unknown.number") } });
m.from(anna).media([m.image("/1.webp")], {
    forwardedFrom: { id: "boris", at: earlierTimestamp },
});
```

### System notices and custom payloads

```typescript
m.system("member.joined", { who: anna.id }); // always translated
m.from(anna).custom("poll", { question: "?", options: [] }); // passed through
```

`custom` is the extension hatch for anything the package does not model yet -
voice notes, files, stickers - without breaking saved transcripts.

### Pushing outside a script

```typescript
annaChat.push(m.from(anna).text(m.t("anna.reminder")));
annaChat.push(m.player.text("on my way"));
```

`push` accepts message, system and custom beats. It cannot store React nodes,
because there is no script behind them to reference - use `defineScript()` for
rich content.

## Delivery and scheduling

`m.wait()` and `m.typing()` are measured in **game time** from
[`Clock`](/game-clock), and no live timers are involved: what is due is derived
from the cursor and the clock.

```typescript
const script = defineScript("anna/evening", (m) => [
    m.from(anna).text(m.t("anna.evening.1")),
    m.typing(anna, 1500), // shows "typing", holds the next beat
    m.from(anna).text(m.t("anna.evening.2")),
    m.wait(30 * MINUTE), // arrives half an hour later
    m.from(anna).text(m.t("anna.evening.3")),
]);
```

Wire one call into your game and you are done:

```typescript
messenger.deliverDueAll();
```

It is idempotent, so call it on window focus, when the player opens the
messenger, after moving the clock, or on an interval.

With the default manual clock, a delayed message arrives when the game moves the
clock - which is exactly Ren'Py's "three hours later". In `realtime` mode it
arrives after that much real time.

**Catching up replays the schedule rather than stretching it.** A conversation
written to unfold over three minutes still reads that way when the player returns
an hour later: each message keeps the in-fiction time it was due at.

## Replies

A `choice` beat blocks the script until the player answers:

```typescript
m.choice("anna/opener/reply", [
    { content: m.t("reply.yes"), next: acceptBranch }, // play another script
    { content: m.t("reply.no") }, // continue this one
    { content: m.t("reply.block"), next: () => blockContact(anna) }, // run code
]);
```

```typescript
const pending = annaChat.pendingChoice;
// { choiceId: 'anna/opener/reply', options: [{ index: 0, content: ... }, ...] }

annaChat.choose(0);
```

The reply is logged to the transcript as a `choice` payload from the player, so
the history reads like a real conversation rather than a monologue.

## Seen tracking, at four levels

Easy to conflate, so the package keeps them apart:

| Level        | Where it lives           | Meaning                                    |
| ------------ | ------------------------ | ------------------------------------------ |
| delivered    | `entries`                | the message arrived, in-fiction            |
| `seen`       | per entry, in the save   | the **player** actually looked at it       |
| `receipt`    | per entry, in the save   | the **character's** ticks, author-controlled |
| seen-ever    | settings, **outside** the save | the player has read this beat in *any* playthrough |

```typescript
annaChat.unread; // badge count
annaChat.firstUnreadKey; // anchor for an "unread" divider and auto-scroll
annaChat.markSeen();
annaChat.markSeenUpTo(entryKey); // when you know how far they scrolled

annaChat.isSeenEver("anna/opener:3"); // skip-already-read, galleries, endings
await messenger.loadSeen(); // during bootstrap
await messenger.flushSeen(); // before the tab closes
```

The player's own messages count as seen immediately - you do not get an unread
badge for what you just sent.

The cross-save level is what makes skip-already-read and unlocked-ending screens
possible; it cannot live in the save, because it has to outlive a single slot.
Swap it out with `createMemorySeenStore()` if your game has no use for it.

## Callbacks

All optional. Register them per chat, or on `defineMessenger()` for every chat -
chat callbacks fire first, and a callback that throws is reported without
corrupting the transcript.

```typescript
defineChat("anna", {
    peer: anna,
    onSend: ({ chat, entry }) => {
        if (entry.from !== "player") incoming.play();
    },
    onSeen: ({ entries }) => {},
    onChoice: ({ choiceId, index }) => {},
    onTyping: ({ typing }) => {},
    onScriptEnd: ({ scriptId }) => {},
    onParticipantChange: ({ participants, added, removed }) => {},
});
```

`onSend` fires for **every** appended entry - from a contact, from the player, and
for system notices alike.

## Reading it in React

```tsx
import { useChat, useChatList, useUnreadTotal } from "@react-text-game/messenger";

function ChatView({ chat }) {
    const { entries, unread, firstUnreadKey, pendingChoice, canReply, typing } =
        useChat(chat);

    return (
        <>
            {entries.map((entry) => (
                <Bubble key={entry.key} entry={entry} />
            ))}
            {typing.length > 0 && <TypingIndicator />}
            {canReply &&
                pendingChoice?.options.map((option) => (
                    <button
                        key={option.index}
                        type="button"
                        onClick={() => chat.choose(option.index)}
                    >
                        {option.content}
                    </button>
                ))}
        </>
    );
}

function ChatList() {
    const rows = useChatList(); // most recently active first
    const total = useUnreadTotal();
    ...
}
```

Every chat's state lives in one entity, and Valtio tracks property access, so a
component watching one chat does not re-render when another chat receives a
message.

## Ids are persistent identifiers

Contact, chat, script and beat ids end up inside saved transcripts. Treat them
like passage ids: never rename one once a game has shipped.

Beat ids default to `"<scriptId>:<index>"`, using the position the beat is
written at - so a conditional beat never shifts the ids after it:

```typescript
defineScript("anna/opener", (m) => [
    m.from(anna).text("one"), // anna/opener:0
    player.knowsBoris && m.from(anna).text("two"), // anna/opener:1, skipped when false
    m.from(anna).text("three"), // anna/opener:2 either way
]);
```

Give an explicit `id` to any beat that must stay addressable across edits that
reorder the script; `choice` beats require one. In dev mode the package warns when
a script's length changed since a transcript referenced it, because that is the
signature of default ids having shifted.

## Transcript size

Transcripts are uncapped by default, so history is never silently lost. Auto-save
serializes the whole state tree into `sessionStorage`, so a chat that runs long
should set a cap:

```typescript
defineChat("anna", { peer: anna, maxEntries: 500 });
```

The package warns once a transcript passes 1000 entries without one.

## Related topics

- [Build a messenger game](/messenger-game) - the same primitives, assembled into a playable game
- [Game Clock](/game-clock) - the time base for scheduled delivery
- [Handling Side Effects](/side-effects) - why mutations belong in actions
- [Internationalization](/i18n) - how the `messenger` namespace is merged
- [Messenger API](/api/messenger/) - full reference
