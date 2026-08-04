---
title: Build a messenger game
sidebar_label: Build a messenger game
description: End-to-end guide to a playable messenger game with @react-text-game/messenger — contacts, chats, scripts, a chat list and chat view you own, scheduled delivery driven by the game clock, unread badges and replies.
keywords:
    - messenger game tutorial
    - chat simulator react
    - react text game messenger
    - scheduled message delivery
    - unread badge
    - chat list
    - transcript
    - visual novel backlog
image: /img/og-image.webp
---

# Build a messenger game

[Messenger & Transcripts](/messenger) explains what `@react-text-game/messenger`
does and why. This guide is the other half: a working game built on it, from
`bun add` to a phone the player can pull out of their pocket.

:::info The package is headless
It ships state, delivery and selectors — no components. So this guide writes the
chat list and the chat view too, in about 120 lines. That is the point: the
transcript, the cursor and the seen flags are the hard part, and the package owns
them; the bubbles are yours.
:::

## What we are building

A single evening in a city. The player stands on a street, and a phone with two
chats:

- **Anna** — a direct chat driven by a script, with a photo, a typing indicator,
  a message forwarded from a third character, and a reply that branches the story.
- **City feed** — a read-only channel the world pushes into when time passes.

Time is in-fiction: walking for half an hour is what makes Anna's delayed message
arrive.

Everything assumes the setup from
[Build your first game with core + UI](/first-game/core+ui) — `GameProvider`,
`PassageController`, and a `src/game` barrel imported once from the entry point.

## 1. Install and register

```bash npm2yarn
npm install @react-text-game/messenger
```

It needs `@react-text-game/core` 0.9 or newer and the same React peer
dependencies. Importing the package registers its own English strings, so
notices like "Anna joined the chat" work before you write any translations.

Two things are reserved once the package is in play:

- The entity id `messenger`. Every transcript lives in that one engine entity, so
  a game entity with the same id is rejected as a duplicate registration.
- The settings key `messenger:seen`, where the cross-save seen record is kept.

Nothing else changes about the bootstrap: the messenger modules join the barrel
you already import from your entry point.

## 2. The cast: contacts and chats

A contact is a definition, not state — a name, a picture, and any metadata you
want to hang off it. Give the player one too, and their own bubbles get a name
and an avatar like anyone else's.

```ts title="src/game/messenger/contacts.ts"
import { defineContact, m, playerSenderId } from "@react-text-game/messenger";

export const anna = defineContact("anna", {
    name: m.t("contacts.anna"),
    avatar: "/avatars/anna.webp",
});

export const boris = defineContact("boris", {
    name: m.t("contacts.boris"),
    avatar: "/avatars/boris.webp",
});

export const cityDesk = defineContact("city-desk", {
    name: m.t("contacts.cityDesk"),
});

export const you = defineContact(playerSenderId, {
    name: m.t("contacts.you"),
    avatar: "/avatars/you.webp",
});
```

Chats come next. A direct chat inherits its title and picture from its peer; a
channel gets its own and refuses replies structurally.

```ts title="src/game/messenger/chats.ts"
import { defineChat, m } from "@react-text-game/messenger";

import { anna } from "./contacts";

export const annaChat = defineChat("anna", {
    peer: anna,
    maxEntries: 300,
});

export const cityFeed = defineChat("city-feed", {
    title: m.t("chats.cityFeed"),
    avatar: "/avatars/city-feed.webp",
    readOnly: true,
    maxEntries: 100,
});
```

`maxEntries` is worth setting from the start. Transcripts are uncapped by default
so history is never silently lost, but auto-save serializes the whole state tree
into `sessionStorage` on every change, so a chat that runs for hours should have a
ceiling.

:::warning Ids outlive your game
Contact, chat, script and beat ids are written into saved transcripts. Treat them
exactly like passage ids: pick them once, never rename them after release.
:::

## 3. Scripts: the authored side

A script is a static, addressable sequence of beats. Nothing is delivered when you
define one — the chat's cursor decides when each beat lands.

```ts title="src/game/messenger/scripts.ts"
import { HOUR, MINUTE } from "@react-text-game/core/clock";
import { defineScript } from "@react-text-game/messenger";

import { anna, boris } from "./contacts";

export const annaMeet = defineScript("anna/meet", (m) => [
    m.from(anna).text(m.t("anna.meet.1")),
    m.typing(anna, 1500),
    m.from(anna).text(m.t("anna.meet.2")),
]);

export const annaDecline = defineScript("anna/decline", (m) => [
    m.from(anna).text(m.t("anna.decline.1")),
    m.wait(2 * HOUR),
    m.from(anna).text(m.t("anna.decline.2")),
]);

export const annaOpener = defineScript("anna/opener", (m) => [
    m.from(anna).text(m.t("anna.opener.1")),
    m.typing(anna, 1200),
    m.from(anna).image("/photos/bridge.webp", {
        alt: m.t("anna.opener.bridgeAlt"),
        caption: m.t("anna.opener.bridge"),
    }),
    m.wait(20 * MINUTE),
    m.from(anna).text(m.t("anna.opener.rumor"), { forwardedFrom: boris }),
    m.choice("anna/opener/reply", [
        { content: m.t("anna.opener.reply.yes"), next: annaMeet },
        { content: m.t("anna.opener.reply.no"), next: annaDecline },
    ]),
]);
```

Four beat kinds are doing the work here:

| Beat | Effect |
| --- | --- |
| `m.from(x).text` / `.image` / `.media` / `.video` | appends one message |
| `m.typing(x, ms)` | shows "typing" and holds the next beat for `ms` of **game** time |
| `m.wait(ms)` | holds the next beat for `ms` of game time, silently |
| `m.choice(id, options)` | stops the script until the player answers |

`ms` is game time, not real time, and no live timers are involved: what is due is
derived from the cursor and the clock. A `choice` option's `next` either plays
another script, calls a function, or — omitted — just continues the current one.

:::warning Deliver the whole burst, not one message
`advance()` delivers **exactly one** message and stops there — which leaves a
following `typing` or `wait` beat unconsumed, and therefore no time gate armed.
`deliverDue()` only resumes a chat that *has* a gate armed, so a chat left in that
state sits still forever.

A messenger sim wants the burst: `advance(Number.POSITIVE_INFINITY)` delivers
every message up to the next gate and arms it, which is what lets the runtime take
over from there. Use plain `advance()` only for the Ren'Py-style "tap to reveal the
next line" reading mode, where each tap is its own call.
:::

Note that the builder is the callback's argument, `(m) => [...]`, which shadows
the module-level `m`. That is deliberate: inside a script you always want the
scoped builder.

:::note Conditional beats keep their position
`false && m.from(anna).text(...)` is skipped, but the slot it occupies is not
reused, so a beat's default id — `"<scriptId>:<index>"` — never shifts. Choices
require an explicit id because they must stay addressable no matter what.
:::

## 4. The messenger facade

One optional call fixes the order of the chat list, registers callbacks that
should fire for every chat, and gives you the cross-chat handles.

```ts title="src/game/messenger/index.ts"
import { createAudio } from "@react-text-game/core/audio";
import { defineMessenger, playerSenderId } from "@react-text-game/messenger";

import { annaChat, cityFeed } from "./chats";

export * from "./chats";
export * from "./contacts";
export * from "./scripts";

const notification = createAudio("/audio/notify.ogg", {
    id: "messenger-notify",
    volume: 0.4,
});

export const messenger = defineMessenger({
    chats: [annaChat, cityFeed],
    onSend: ({ entry }) => {
        if (entry.from !== playerSenderId) {
            void notification.play();
        }
    },
});
```

`onSend` fires for every appended entry — incoming, outgoing, and system notices
alike — which is why the sender check is there. A callback that throws is
reported without corrupting the transcript.

## 5. Bootstrap: one runtime component

Three side effects need a home, and none of them may run while a component
renders:

- **`loadSeen()`** — read the cross-save seen record, once, during startup.
- **`deliverDueAll()`** — deliver whatever has become due. Idempotent, so call it
  freely.
- **`flushSeen()`** — force the debounced write out before the tab goes away.

Loading the seen record is genuine startup work, so it belongs in `preload`,
where it delays the game behind the loading screen instead of racing it:

```tsx title="src/main.tsx"
import { GameProvider } from "@react-text-game/ui";

import { App } from "./App";
import { MessengerRuntime } from "./components/messenger/MessengerRuntime";
import { messenger } from "./game/messenger";
import { street } from "./game/passages/street";

const preload = [
    { id: "messenger-seen", load: () => messenger.loadSeen() },
    "/avatars/anna.webp",
    "/photos/bridge.webp",
];

const gameOptions = {
    gameName: "Signal",
    gameId: "signal",
    startPassage: street,
    isDevMode: import.meta.env.DEV,
    // realtime: a 1200 ms typing indicator should read as 1.2 seconds, not wait
    // for the story to move the clock.
    clock: { startAt: Date.UTC(2031, 4, 12, 21, 40), mode: "realtime" as const },
};

export const Root = () => (
    <GameProvider options={gameOptions} preload={preload}>
        <MessengerRuntime />
        <App />
    </GameProvider>
);
```

A custom preload task is just an id and a `load` function, so anything awaitable
fits — see [Loading and splash screens](/loading-and-splash-screens#preload-game-content).

Delivery and flushing then live in one small component with no markup:

```tsx title="src/components/messenger/MessengerRuntime.tsx"
import { Clock } from "@react-text-game/core/clock";
import { useEffect } from "react";

import { messenger } from "@/game/messenger";

/**
 * Owns every messenger side effect. Effects, never render.
 */
export const MessengerRuntime = () => {
    useEffect(() => {
        const deliver = () => {
            messenger.deliverDueAll();
        };

        // On mount, whenever the story moves the clock, when the tab comes back,
        // and once a second - because in realtime mode nothing announces that a
        // gate has opened.
        deliver();
        const unsubscribe = Clock.subscribe(deliver);
        const interval = setInterval(deliver, 1000);
        window.addEventListener("focus", deliver);

        return () => {
            unsubscribe();
            clearInterval(interval);
            window.removeEventListener("focus", deliver);
        };
    }, []);

    useEffect(() => {
        const flush = () => {
            void messenger.flushSeen();
        };

        window.addEventListener("pagehide", flush);

        return () => {
            window.removeEventListener("pagehide", flush);
        };
    }, []);

    return null;
};
```

Three wake-ups, three different jobs:

- **`Clock.subscribe`** fires when the clock is advanced, set, paused or
  reconfigured, so every `Clock.advance()` anywhere in the game delivers what that
  jump made due — no passage has to remember to.
- **The interval** exists because flowing realtime mutates nothing and therefore
  announces nothing. It is also what expires typing indicators: `deliverDue()`
  clears expired ones on every call, whether or not anything is due. With the
  default manual clock the interval is harmless — a closed gate is a no-op — so
  leaving it in costs nothing.
- **`focus`** catches up a tab that was in the background.

:::danger The one rule
Never change a chat while a passage or component renders. A passage's `display()`
runs again on every React render, every save load and every remount, so a delivery
triggered during render repeats and duplicates messages. Event handlers and
effects are safe. See [Handling side effects](/side-effects).

*Reading* during render is safe and expected — including `chat.entries` and
`chat.lastEntry`, which never materialize state.
:::

## 6. The chat list

`useChatList()` subscribes a component to every chat and returns one row each,
most recently active first.

```tsx title="src/components/messenger/ChatList.tsx"
import {
    type Chat,
    previewText,
    resolveSystemText,
    useChatList,
} from "@react-text-game/messenger";

const preview = (chat: Chat): string => {
    const entry = chat.lastEntry;

    if (!entry) {
        return "";
    }

    switch (entry.payload.kind) {
        case "text":
            return previewText(entry.payload.text);
        case "media":
            return entry.payload.caption
                ? previewText(entry.payload.caption)
                : resolveSystemText("media.album", {
                      count: entry.payload.items.length,
                  });
        case "system":
            return resolveSystemText(entry.payload.key, entry.payload.params);
        case "choice":
            return previewText(entry.payload.chosen);
        default:
            return "";
    }
};

type ChatListProps = Readonly<{ onOpen: (chat: Chat) => void }>;

export const ChatList = ({ onOpen }: ChatListProps) => {
    const rows = useChatList();

    return (
        <ul className="divide-y divide-border">
            {rows.map(({ chat, title, avatar, unread }) => (
                <li key={chat.id}>
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/40"
                        onClick={() => onOpen(chat)}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt=""
                                className="size-10 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span className="size-10 shrink-0 rounded-full bg-muted" />
                        )}
                        <span className="min-w-0 flex-1">
                            <span className="block font-medium">{title}</span>
                            <span className="block truncate text-sm text-muted-foreground">
                                {preview(chat)}
                            </span>
                        </span>
                        {unread > 0 && (
                            <span className="shrink-0 rounded-full bg-primary-500 px-2 text-sm text-primary-foreground">
                                {unread}
                            </span>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );
};
```

`previewText` is the plain-string cousin of `resolveText`: it translates an
`m.t()` key and returns a frozen string as-is, but a message whose content is a
React node has no faithful string form and comes back empty. Write list-visible
messages as strings or `m.t()` keys.

A single badge for the whole app is one hook:

```tsx
import { useUnreadTotal } from "@react-text-game/messenger";

export const MessengerBadge = () => {
    const unread = useUnreadTotal();

    return unread > 0 ? (
        <span className="rounded-full bg-danger-500 px-2 text-xs text-danger-foreground">
            {unread}
        </span>
    ) : null;
};
```

## 7. The chat view

One bubble component, switching on the payload kind. Five kinds exist: `text`,
`media`, `system`, `choice` (the player's logged reply) and `custom` (your
extension hatch).

```tsx title="src/components/messenger/Entry.tsx"
import {
    type ForwardOrigin,
    playerSenderId,
    previewText,
    resolveSenderName,
    resolveSystemText,
    resolveText,
    type TranscriptEntry,
} from "@react-text-game/messenger";

const forwardedLabel = (origin: ForwardOrigin): string =>
    typeof origin.from === "string"
        ? resolveSenderName(origin.from)
        : previewText(origin.from.label);

export const Entry = ({ entry }: Readonly<{ entry: TranscriptEntry }>) => {
    const { payload } = entry;

    if (payload.kind === "system") {
        return (
            <p className="my-2 text-center text-xs text-muted-foreground">
                {resolveSystemText(payload.key, payload.params)}
            </p>
        );
    }

    const mine = entry.from === playerSenderId;

    return (
        <div className={mine ? "flex justify-end" : "flex justify-start"}>
            <div className="max-w-[80%] rounded-lg bg-card p-2 shadow-sm">
                {!mine && (
                    <span className="block text-xs text-primary-500">
                        {resolveSenderName(entry.from)}
                    </span>
                )}

                {entry.forwarded && (
                    <span className="block text-xs italic text-muted-foreground">
                        {resolveSystemText("message.forwardedFrom", {
                            who: forwardedLabel(entry.forwarded),
                        })}
                    </span>
                )}

                {payload.kind === "text" && <p>{resolveText(payload.text)}</p>}

                {payload.kind === "choice" && (
                    <p>{resolveText(payload.chosen)}</p>
                )}

                {payload.kind === "media" && (
                    <>
                        <div className="flex flex-wrap gap-1">
                            {payload.items.map((item) => (
                                <img
                                    key={item.src}
                                    src={
                                        item.kind === "video"
                                            ? (item.poster ?? item.src)
                                            : item.src
                                    }
                                    alt={item.alt ? previewText(item.alt) : ""}
                                    className="max-w-full rounded"
                                />
                            ))}
                        </div>
                        {payload.caption && (
                            <p className="mt-1">{resolveText(payload.caption)}</p>
                        )}
                    </>
                )}

                {payload.kind === "custom" && (
                    <p className="text-xs text-muted-foreground">
                        [{payload.name}]
                    </p>
                )}
            </div>
        </div>
    );
};
```

`resolveText` is what turns persisted text back into something renderable: a
frozen string comes back as-is, an `m.t()` key is translated in the current
language, and a React node is re-read live from its script beat.

Now the view itself. `useChat(chat)` hands over everything it needs in one
snapshot.

```tsx title="src/components/messenger/ChatView.tsx"
import {
    type Chat,
    resolveSenderName,
    resolveSystemText,
    useChat,
} from "@react-text-game/messenger";
import { useEffect, useState } from "react";

import { Entry } from "./Entry";

type ChatViewProps = Readonly<{ chat: Chat; onBack: () => void }>;

export const ChatView = ({ chat, onBack }: ChatViewProps) => {
    const { entries, title, canReply, pendingChoice, typing } = useChat(chat);

    // Frozen on open: markSeen() clears firstUnreadKey on the very next paint,
    // and a divider that vanishes as you look at it is worse than none.
    const [unreadAnchor] = useState(() => chat.firstUnreadKey);

    // A mutation, so it belongs in an effect. Re-runs when new entries arrive
    // while the view is open; marking an already-seen chat seen does nothing.
    useEffect(() => {
        chat.markSeen();
    }, [chat, entries.length]);

    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center gap-2 border-b border-border p-3">
                <button type="button" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <span className="font-medium">{title}</span>
            </header>

            <div className="flex-1 space-y-2 overflow-auto p-3">
                {entries.map((entry) => (
                    <div key={entry.key}>
                        {entry.key === unreadAnchor && (
                            <p className="my-2 text-center text-xs uppercase text-muted-foreground">
                                {resolveSystemText("divider.unread")}
                            </p>
                        )}
                        <Entry entry={entry} />
                    </div>
                ))}

                {typing.map((id) => (
                    <p
                        key={id}
                        className="text-sm italic text-muted-foreground"
                    >
                        {resolveSenderName(id)} {resolveSystemText("typing")}
                    </p>
                ))}
            </div>

            <footer className="border-t border-border p-3">
                {!canReply && (
                    <p className="text-sm text-muted-foreground">
                        {resolveSystemText("chat.readOnly")}
                    </p>
                )}

                {canReply &&
                    pendingChoice?.options.map((option) => (
                        <button
                            key={option.index}
                            type="button"
                            className="mb-2 block w-full rounded-md border border-input p-2 text-left last:mb-0"
                            onClick={() => {
                                // choose() logs the reply and delivers one
                                // message; the burst then runs on to the next
                                // time gate and arms it.
                                chat.choose(option.index);
                                chat.advance(Number.POSITIVE_INFINITY);
                            }}
                        >
                            {option.content}
                        </button>
                    ))}
            </footer>
        </div>
    );
};
```

`canReply` and `pendingChoice` answer two different questions on purpose:
`canReply` is structural — `false` in a channel, forever — while `pendingChoice`
is transient, and `null` in a perfectly writable chat with nothing to answer
right now.

`markSeenUpTo(entryKey)` is the alternative to `markSeen()` when the view knows
how far the player actually scrolled.

## 8. Put the phone in a passage

A widget passage is a plain React component, which is exactly what a phone
screen wants to be.

```tsx title="src/game/passages/phone.tsx"
import { defineWidget, Game } from "@react-text-game/core";
import type { Chat } from "@react-text-game/messenger";
import { useState } from "react";

import { ChatList } from "@/components/messenger/ChatList";
import { ChatView } from "@/components/messenger/ChatView";

const Phone = () => {
    const [open, setOpen] = useState<Chat | null>(null);

    if (open) {
        // Keyed by chat id so switching chats remounts the view and re-freezes
        // its unread divider.
        return (
            <ChatView
                key={open.id}
                chat={open}
                onBack={() => setOpen(null)}
            />
        );
    }

    return (
        <div className="mx-auto flex h-full max-w-md flex-col border-x border-border">
            <header className="flex items-center justify-between border-b border-border p-3">
                <span className="font-semibold">Signal</span>
                <button type="button" onClick={() => Game.jumpTo("street")}>
                    Put the phone away
                </button>
            </header>
            <ChatList onOpen={setOpen} />
        </div>
    );
};

export const phone = defineWidget("phone", Phone);
```

Which chat is open is `useState`, and rightly so: it is throwaway view state,
gone the moment the player navigates away. What must survive — the transcript,
the cursor, the seen flags — is already in the store entity.

## 9. Let the world drive the phone

The story passage is where the phone becomes a game rather than a chat log. It
starts scripts, and it moves the clock.

```ts title="src/game/passages/street.ts"
import { defineStory, Game } from "@react-text-game/core";
import { Clock, HOUR, MINUTE } from "@react-text-game/core/clock";
import { m } from "@react-text-game/messenger";

import { annaChat, annaOpener, cityDesk, cityFeed } from "../messenger";
import { phone } from "./phone";

export const street = defineStory("street", (h) => [
    h.header("Rustaveli Avenue", { level: 1 }),
    h.text("The rain has stopped. Your phone is in your pocket."),
    h.actions(
        [
            { content: "Check your phone", action: h.jump(phone) },
            annaChat.entries.length === 0 && {
                content: "Text Anna first",
                action: () => {
                    annaChat.play(annaOpener);
                    annaChat.advance(Number.POSITIVE_INFINITY);
                    Game.jumpTo(phone);
                },
            },
            {
                content: "Walk for half an hour",
                action: () => {
                    Clock.advance(30 * MINUTE);
                },
            },
            {
                content: "Go home and sleep",
                action: () => {
                    Clock.advance(8 * HOUR);
                    cityFeed.push(m.from(cityDesk).text(m.t("feed.morning")));
                },
            },
        ],
        { direction: "vertical" }
    ),
]);
```

Four things worth naming here:

- **`play` then `advance`.** `play(script)` only sets the cursor — it delivers
  nothing, so the game decides when the first message lands. The burst that
  follows delivers up to the typing beat and arms it; the runtime does the rest.
- **Reading a chat inside `display()` is fine.** `annaChat.entries.length === 0`
  runs on every render and writes nothing, so the "text Anna first" option
  disappears once the conversation exists — the falsy entry is simply dropped.
- **Advancing the clock is all it takes.** `Clock.advance(30 * MINUTE)` makes the
  `m.wait(20 * MINUTE)` beat due; `MessengerRuntime`'s `Clock.subscribe` delivers
  it. In realtime mode that same message would have arrived by itself twenty real
  minutes later — burning the time in-fiction is the shortcut, not the only path.
  If you would rather be explicit, call `messenger.deliverDueAll()` in the action
  right after; it is idempotent either way.
- **`push` writes outside any script.** Good for world events. It cannot store a
  React node, because there is no script beat to point back to; strings and
  `m.t()` keys only.

Catching up replays the authored schedule instead of stretching it: sleeping
eight hours delivers the 20-minute message *and* the two-hour follow-up, each
stamped with the in-fiction time it was due at, so the conversation still reads
in order.

## 10. Localize the strings

Author keys — everything you wrote as `m.t("anna.opener.1")` — resolve against
the **`passages`** namespace, the same one story text uses. The package's own
notices live in the **`messenger`** namespace and every key there is overridable.

```ts title="src/game/i18n.ts"
export const resources = {
    en: {
        passages: {
            "contacts.anna": "Anna",
            "contacts.boris": "Boris",
            "contacts.cityDesk": "City Desk",
            "contacts.you": "You",
            "chats.cityFeed": "City feed",
            "anna.opener.1": "you still out?",
            "anna.opener.bridge": "the bridge is empty, come look",
            "anna.opener.bridgeAlt": "An empty bridge at night",
            "anna.opener.rumor": "boris says they're closing the metro early",
            "anna.opener.reply.yes": "on my way",
            "anna.opener.reply.no": "not tonight",
            "anna.meet.1": "good. bring something warm",
            "anna.meet.2": "i'll be at the second lamp",
            "anna.decline.1": "ok",
            "anna.decline.2": "i waited an hour, for the record",
            "feed.morning": "Metro service resumes at 06:00.",
        },
        messenger: {
            // Overriding one of the package's own strings.
            typing: "is typing…",
        },
    },
};
```

Wire it into the game options and the whole transcript follows the player's
language:

```ts
const gameOptions = {
    gameName: "Signal",
    translations: { defaultLanguage: "en", fallbackLanguage: "en", resources },
};
```

This is why `m.t()` beats a plain string in a localized game. The stored message
is a key, so old messages re-translate when the language changes, and saves stay
small. Interpolation values are frozen at delivery, so `m.t("wallet", { gold })`
never rewrites history when the player's gold changes.

## 11. Where the state lives

| Thing | Where it lives | Survives a save? | Survives a *different* save? |
| --- | --- | --- | --- |
| Transcript, cursor, unread, membership | the `messenger` engine entity | yes | no |
| Per-entry `seen` | inside the transcript | yes | no |
| "has the player ever read this beat" | settings, key `messenger:seen` | yes | **yes** |
| Which chat is open, scroll position | React state | no | no |

The cross-save level is what makes skip-already-read and unlocked-gallery screens
possible, and it is why it cannot live in the save:

```ts
if (annaChat.isSeenEver("anna/opener:2")) {
    // The player has read this beat in some playthrough — offer a skip.
}
```

Two consequences worth knowing:

- **Adding a chat to a shipped game needs no save migration.** Defining a chat
  creates no state; a chat missing from an older save is materialized from its
  definition the first time something touches it.
- **Editing a script that saves already reference can.** Beat ids default to
  positions, so inserting a beat shifts the ids after it. In dev mode the package
  warns when a script's beat count changed since a transcript played it — give
  explicit ids to beats you expect to reorder around.

## 12. Checklist

Before you call it done:

- Every state change — `play`, `advance`, `deliverDue`, `push`, `choose`,
  `markSeen`, `addParticipant`, `rename`, `setAvatar`, `setReadOnly`, `clear` —
  is in an event handler or an effect, never in render.
- Every `play()` and every `choose()` is followed by
  `advance(Number.POSITIVE_INFINITY)`, so no chat is left with an unconsumed
  control beat and no armed gate.
- `deliverDueAll()` runs on mount, on clock changes, on tab focus, and on an
  interval in realtime mode.
- `loadSeen()` finishes during bootstrap; `flushSeen()` runs before the tab closes.
- Long-running chats have `maxEntries`.
- Contact, chat, script and choice ids are final.
- Anything that shows up in a chat-list preview is a string or an `m.t()` key,
  not a React node.

## Related topics

- [Messenger & Transcripts](/messenger) — the full model: groups, receipts,
  albums, custom payloads, seen levels
- [Game clock](/game-clock) — the time base every `wait` and `typing` beat is
  measured in
- [Handling side effects](/side-effects) — why mutations belong in actions
- [Internationalization](/i18n) — namespaces and language switching
- [Messenger API](/api/messenger/) — exact signatures
