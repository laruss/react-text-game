import type { ReactNode } from "react";

/**
 * Any JSON-serializable value.
 *
 * Everything a chat persists has to survive `JSON.stringify`, because the whole
 * transcript travels inside the game's save snapshot.
 */
export type Json =
    | string
    | number
    | boolean
    | null
    | Array<Json>
    | { [key: string]: Json };

/**
 * Interpolation values handed to i18next.
 */
export type Params = Record<string, string | number | boolean>;

/**
 * A frozen literal string.
 */
export type RawText = {
    kind: "raw";
    text: string;
};

/**
 * A translation key resolved at read time, with its interpolation values frozen
 * at delivery time.
 *
 * @remarks
 * This is the form to prefer in a localized game: the message re-translates when
 * the player switches language, while `params` stay exactly as they were when
 * the message arrived - so "you have 100 gold" never becomes "you have 20 gold"
 * retroactively.
 */
export type I18nText = {
    kind: "i18n";
    key: string;
    params?: Params;
};

/**
 * A pointer back into the script beat that produced the text.
 *
 * @remarks
 * The only form that can carry a React node, since a node cannot be serialized.
 * The content is re-read from the script on every render, so anything dynamic
 * must travel through `params` rather than being interpolated into the node.
 */
export type RefText = {
    kind: "ref";
    scriptId: string;
    beatId: string;
    /** Which text of the beat this refers to, e.g. `"text"`, `"caption"`, `"alt:0"`. */
    slot: string;
};

/**
 * Persisted text in any of its three forms.
 */
export type RichText = RawText | I18nText | RefText;

/**
 * Text that can be persisted without a script to point back to.
 *
 * Used for chat titles, contact names, and forward labels.
 */
export type StaticText = string | number | I18nText;

/**
 * Text an author may pass to a message beat.
 *
 * A `string` or `number` is frozen as-is, {@link I18nText} re-translates, and
 * anything else (a React node, an element array) is stored as a
 * {@link RefText} pointing back at the beat.
 */
export type TextInput = StaticText | ReactNode;

/**
 * A single photo or video inside a message.
 */
export type MediaItem = {
    kind: "image" | "video";
    src: string;
    alt?: RichText;
    /** Preview frame for a video. */
    poster?: string;
    /** Video length in milliseconds, for duration labels. */
    durationMs?: number;
    /** Whether the item should be hidden behind a tap-to-reveal overlay. */
    spoiler?: boolean;
};

/**
 * Author-facing form of {@link MediaItem}, built with `m.image()` / `m.video()`.
 */
export type MediaItemInput = {
    kind: "image" | "video";
    src: string;
    alt?: TextInput;
    poster?: string;
    durationMs?: number;
    spoiler?: boolean;
};

/**
 * In-fiction delivery state of a message - the "ticks" a character sees.
 *
 * @remarks
 * Unrelated to {@link TranscriptEntry.seen}, which tracks whether the *player*
 * has looked at the message.
 */
export type Receipt = "sent" | "delivered" | "read";

/**
 * Where a forwarded message originally came from.
 *
 * @remarks
 * A forward does not have to reference a real message. Pass a contact id to
 * attribute it to a known contact, or a `label` for an unknown source.
 */
export type ForwardOrigin = {
    /** Contact id, or a free-form label for a source with no contact. */
    from: string | { label: RichText };
    /** Original timestamp, if the game wants to show one. */
    at?: number;
    /** Chat the message was forwarded out of, when there is one. */
    sourceChatId?: string;
    /** Key of the original entry, when there is one. */
    sourceKey?: string;
};

/**
 * Author-facing form of {@link ForwardOrigin}.
 */
export type ForwardOriginInput =
    | string
    | { id: string; at?: number; sourceChatId?: string; sourceKey?: string }
    | {
          label: StaticText;
          at?: number;
          sourceChatId?: string;
          sourceKey?: string;
      };

/**
 * What a message is.
 *
 * @remarks
 * One `media` payload covers a single photo, a single video, a captioned item,
 * and a mixed album - the item count is what distinguishes them.
 */
export type Payload =
    | { kind: "text"; text: RichText }
    | { kind: "media"; items: Array<MediaItem>; caption?: RichText }
    | { kind: "system"; key: string; params?: Params }
    | { kind: "choice"; choiceId: string; chosen: RichText }
    | { kind: "custom"; name: string; data: Json };

/**
 * One delivered message in a chat's transcript.
 *
 * @remarks
 * Entries are append-only. Forwarding, editing, and deletion are recorded as
 * metadata on the entry rather than as payload kinds, so any payload can be
 * forwarded or marked deleted.
 */
export type TranscriptEntry = {
    /** Stable, unique within the chat. */
    key: string;

    /** Game time the entry was delivered at, from `Clock.now()`. */
    at: number;

    /** Contact id, `"player"`, or `"system"`. */
    from: string;

    payload: Payload;

    /** Whether the player has looked at this entry. */
    seen: boolean;

    /** In-fiction delivery state, controlled by the author. */
    receipt?: Receipt;

    /** Set when the message was forwarded into this chat. */
    forwarded?: ForwardOrigin;

    /** In-fiction "edited" marker. */
    edited?: boolean;

    /** In-fiction "message deleted" marker. The payload is kept. */
    deleted?: boolean;

    /** Script beat that produced the entry, when it came from a script. */
    origin?: { scriptId: string; beatId: string };
};

/**
 * Persisted state of a single chat.
 *
 * @remarks
 * Everything that can change during play lives here; `defineChat()` only
 * supplies the initial values. A chat that is missing from an older save is
 * materialized from its definition on first access, so adding a chat to a game
 * never needs a save migration.
 */
export type ChatVars = {
    entries: Array<TranscriptEntry>;

    /** Script currently being played, if any. */
    activeScriptId: string | null;

    /** Next beat index per script, indexed into the script's raw beat array. */
    cursors: Record<string, number>;

    /** Raw beat count per script, used to warn about script drift. */
    beatCounts: Record<string, number>;

    /**
     * Game time delivery is blocked until, or `null` when nothing is pending.
     *
     * @remarks
     * This single field replaces a queue of scheduled messages: everything due
     * is derived from the cursor and the clock, so a save loaded much later
     * simply delivers what became due while it was away.
     */
    nextDueAt: number | null;

    /** Game time each contact's typing indicator expires at. */
    typingUntil: Record<string, number>;

    /** Choice id awaiting the player's reply, or `null`. */
    pendingChoiceKey: string | null;

    /** In-fiction title, once renamed. */
    title?: RichText;

    /** In-fiction avatar. `null` means the avatar was explicitly removed. */
    avatar?: string | null;

    /** Current members, as contact ids. Empty for a direct chat. */
    participants: Array<string>;

    /** Whether the player can never reply in this chat. */
    readOnly: boolean;

    /** Number of entries the player has not seen. */
    unread: number;

    /** Game time the chat was last marked seen at. */
    lastSeenAt: number;

    /** Game time of the newest entry. */
    lastActivityAt: number;

    /** Counter behind {@link TranscriptEntry.key}. */
    nextKey: number;
};

/**
 * Cross-save record of which script beats the player has ever seen.
 *
 * Backs "skip already-read text", galleries, and unlocked-ending screens, all of
 * which have to outlive a single save slot. The default implementation keeps an
 * in-memory set and persists it through the engine's settings table.
 */
export type SeenStore = {
    /** Whether a beat has ever been seen. Synchronous by design. */
    has(beatId: string): boolean;

    /** Records a beat as seen. Persisting may be debounced. */
    add(beatId: string): void;

    /** Loads persisted data. Call once during bootstrap. */
    load(): Promise<void>;

    /** Forces any pending write to complete. */
    flush(): Promise<void>;
};
