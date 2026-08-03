import { Clock } from "@react-text-game/core/clock";
import type { ReactNode } from "react";

import { ENTRY_WARN_THRESHOLD, PLAYER_SENDER, SYSTEM_SENDER } from "#constants";
import {
    type Contact,
    resolveSenderAvatar,
    resolveSenderName,
    toSenderId,
} from "#contacts";
import { logger } from "#logger";
import {
    type Beat,
    type ChoiceOption,
    type DeliverableBeatInput,
    getScript,
    type MessageBody,
    resolveBeats,
    type Script,
    warnOnScriptDrift,
} from "#scripts";
import {
    selectFirstUnreadKey,
    selectLastEntry,
    selectTypingContacts,
    selectUnread,
    selectUnseenEntries,
} from "#selectors";
import {
    getChatVars,
    getSeenStore,
    getStoreCallbacks,
    peekChatVars,
    safeCallback,
} from "#store";
import {
    isStaticText,
    type PlainRichText,
    type RefSource,
    resolvePlainRichText,
    toPlainRichText,
    toRichText,
} from "#text";
import type {
    ChatVars,
    ForwardOrigin,
    ForwardOriginInput,
    MediaItem,
    Payload,
    Receipt,
    RichText,
    StaticText,
    TextInput,
    TranscriptEntry,
} from "#types";

/**
 * Whether a chat has one peer or several members.
 */
export type ChatKind = "direct" | "group";

/**
 * A reply the player can currently pick.
 */
export type PendingChoice = {
    choiceId: string;
    options: Array<{ index: number; content: ReactNode }>;
};

/**
 * Optional callbacks fired after a chat changes.
 *
 * @remarks
 * Callbacks run after the state change they describe, and a callback that throws
 * is reported without corrupting the transcript. Chat callbacks fire before the
 * ones registered on `defineMessenger()`.
 */
export type ChatCallbacks = {
    /**
     * Fires for every entry appended to the transcript - from a contact, from the
     * player, and for system notices alike.
     *
     * @example
     * ```typescript
     * defineChat('anna', {
     *   peer: anna,
     *   onSend: ({ entry }) => {
     *     if (entry.from !== 'player') notificationSound.play();
     *   },
     * });
     * ```
     */
    onSend?: (event: { chat: Chat; entry: TranscriptEntry }) => void;

    /** Fires when entries transition to seen, with the entries that changed. */
    onSeen?: (event: { chat: Chat; entries: Array<TranscriptEntry> }) => void;

    /** Fires after the player's reply has been logged. */
    onChoice?: (event: {
        chat: Chat;
        choiceId: string;
        index: number;
        option: ChoiceOption;
    }) => void;

    /** Fires when the set of typing contacts changes. */
    onTyping?: (event: { chat: Chat; typing: Array<string> }) => void;

    /** Fires when a script runs out of beats. */
    onScriptEnd?: (event: { chat: Chat; scriptId: string }) => void;

    /** Fires when a group's membership changes. */
    onParticipantChange?: (event: {
        chat: Chat;
        participants: Array<string>;
        added?: string;
        removed?: string;
    }) => void;
};

/**
 * Options accepted by {@link defineChat}.
 */
export type ChatOptions = ChatCallbacks & {
    /**
     * The single other participant, making this a direct chat.
     *
     * @remarks
     * Its avatar and name become the chat's fallbacks.
     */
    peer?: Contact | string;

    /**
     * Display title. Required in practice for a group; a direct chat falls back
     * to its peer's name.
     */
    title?: StaticText;

    /**
     * Initial members, making this a group chat.
     *
     * @remarks
     * Membership changes during play, so this is only the starting point.
     */
    participants?: Array<Contact | string>;

    /** Initial chat picture. A chat may have none. */
    avatar?: string;

    /**
     * Whether the player can never reply, as in a channel or an announcement
     * feed.
     *
     * @remarks
     * Distinct from simply having no reply available right now - check
     * {@link Chat.canReply} for the structural answer and
     * {@link Chat.pendingChoice} for the transient one.
     */
    readOnly?: boolean;

    /**
     * Keep at most this many entries, dropping the oldest beyond it.
     *
     * @remarks
     * Uncapped by default, so history is never silently lost. Because auto-save
     * serializes the whole state tree into `sessionStorage`, a long-running chat
     * should set a cap; the package warns once a transcript passes
     * {@link ENTRY_WARN_THRESHOLD} without one.
     */
    maxEntries?: number;
};

const chats = new Map<string, Chat>();

const normalizeForwardOrigin = (input: ForwardOriginInput): ForwardOrigin => {
    if (typeof input === "string") {
        return { from: input };
    }

    const extras = {
        ...(input.at === undefined ? {} : { at: input.at }),
        ...(input.sourceChatId === undefined
            ? {}
            : { sourceChatId: input.sourceChatId }),
        ...(input.sourceKey === undefined
            ? {}
            : { sourceKey: input.sourceKey }),
    };

    if ("label" in input) {
        return { from: { label: toPlainRichText(input.label) }, ...extras };
    }

    return { from: input.id, ...extras };
};

const convertText = (
    input: TextInput,
    ref: RefSource | null,
    label: string
): RichText => {
    if (ref) {
        return toRichText(input, ref);
    }

    if (!isStaticText(input)) {
        throw new Error(
            `chat.push() cannot store ${label} that is not a string or m.t(): ` +
                "rich content has to live in a script so it can be referenced. " +
                "Use defineScript() and chat.play() instead."
        );
    }

    return toPlainRichText(input);
};

const convertBody = (body: MessageBody, ref: RefSource | null): Payload => {
    if (body.kind === "text") {
        return {
            kind: "text",
            text: convertText(
                body.text,
                ref ? { ...ref, slot: "text" } : null,
                "message text"
            ),
        };
    }

    const items: Array<MediaItem> = body.items.map((item, index) => ({
        kind: item.kind,
        src: item.src,
        ...(item.alt === undefined
            ? {}
            : {
                  alt: convertText(
                      item.alt,
                      ref ? { ...ref, slot: `alt:${index}` } : null,
                      "media alt text"
                  ),
              }),
        ...(item.poster === undefined ? {} : { poster: item.poster }),
        ...(item.durationMs === undefined
            ? {}
            : { durationMs: item.durationMs }),
        ...(item.spoiler === undefined ? {} : { spoiler: item.spoiler }),
    }));

    return {
        kind: "media",
        items,
        ...(body.caption === undefined
            ? {}
            : {
                  caption: convertText(
                      body.caption,
                      ref ? { ...ref, slot: "caption" } : null,
                      "media caption"
                  ),
              }),
    };
};

/**
 * A single conversation: its transcript, its delivery cursor, and everything the
 * player has or has not seen in it.
 *
 * @remarks
 * State lives in the messenger store entity, so it survives saves, loads, and
 * remounts. Every method that changes state is an action: call them from event
 * handlers, never while a passage or component renders.
 *
 * @see defineChat - Factory for creating a chat
 */
export class Chat {
    /** Unique, persistent identifier. */
    readonly id: string;

    /** Whether this is a one-to-one chat or a group. */
    readonly kind: ChatKind;

    /** The other participant of a direct chat. */
    readonly peerId: string | undefined;

    /** Upper bound on retained entries. `Infinity` when uncapped. */
    readonly maxEntries: number;

    private readonly definitionTitle: PlainRichText | undefined;
    private readonly definitionAvatar: string | undefined;
    private readonly initialParticipants: Array<string>;
    private readonly initialReadOnly: boolean;
    private readonly callbacks: ChatCallbacks;
    private readonly driftWarned = new Set<string>();
    private lengthWarned = false;

    /**
     * Creates a chat. Prefer {@link defineChat}.
     *
     * @param id - Unique, persistent identifier
     * @param options - Peer or participants, title, avatar, callbacks
     */
    constructor(id: string, options: ChatOptions = {}) {
        this.id = id;
        this.peerId =
            options.peer === undefined ? undefined : toSenderId(options.peer);
        this.kind = options.participants === undefined ? "direct" : "group";
        this.definitionTitle =
            options.title === undefined
                ? undefined
                : toPlainRichText(options.title);
        this.definitionAvatar = options.avatar;
        this.initialParticipants = (options.participants ?? []).map(toSenderId);
        this.initialReadOnly = options.readOnly ?? false;
        this.maxEntries = options.maxEntries ?? Number.POSITIVE_INFINITY;
        this.callbacks = {
            ...(options.onSend === undefined ? {} : { onSend: options.onSend }),
            ...(options.onSeen === undefined ? {} : { onSeen: options.onSeen }),
            ...(options.onChoice === undefined
                ? {}
                : { onChoice: options.onChoice }),
            ...(options.onTyping === undefined
                ? {}
                : { onTyping: options.onTyping }),
            ...(options.onScriptEnd === undefined
                ? {}
                : { onScriptEnd: options.onScriptEnd }),
            ...(options.onParticipantChange === undefined
                ? {}
                : { onParticipantChange: options.onParticipantChange }),
        };
    }

    /**
     * The initial persisted state of this chat.
     *
     * @remarks
     * Pure: it creates no state and touches no store, so a component may use it
     * as a fallback while rendering a chat nothing has written to yet.
     */
    initialVars(): ChatVars {
        return {
            entries: [],
            activeScriptId: null,
            cursors: {},
            beatCounts: {},
            nextDueAt: null,
            typingUntil: {},
            pendingChoiceKey: null,
            participants: [...this.initialParticipants],
            readOnly: this.initialReadOnly,
            unread: 0,
            lastSeenAt: 0,
            lastActivityAt: 0,
            nextKey: 0,
        };
    }

    /**
     * This chat's persisted state, materialized on first access.
     *
     * @remarks
     * Use it from anything that writes. Read-only accessors go through
     * {@link Chat.readVars} instead, so merely looking at a chat - which is what
     * rendering does - never writes to the store.
     */
    get vars(): ChatVars {
        return getChatVars(this.id, () => this.initialVars());
    }

    /**
     * This chat's persisted state, or its initial values when nothing has
     * written to it yet. Creates nothing.
     */
    private get readVars(): ChatVars {
        return peekChatVars(this.id) ?? this.initialVars();
    }

    /** Delivered entries, oldest first. */
    get entries(): Array<TranscriptEntry> {
        return this.readVars.entries;
    }

    /** Number of entries the player has not seen. */
    get unread(): number {
        return this.readVars.unread;
    }

    /** Key of the oldest unseen entry, or `null`. */
    get firstUnreadKey(): string | null {
        return selectFirstUnreadKey(this.readVars);
    }

    /** Newest entry, or `null` when the transcript is empty. */
    get lastEntry(): TranscriptEntry | null {
        return selectLastEntry(this.readVars);
    }

    /** Whether this chat has several members rather than one peer. */
    get isGroup(): boolean {
        return this.kind === "group";
    }

    /** Current members, as contact ids. */
    get participants(): Array<string> {
        return this.readVars.participants;
    }

    /** How many members the group currently has. */
    get participantCount(): number {
        return this.readVars.participants.length;
    }

    /** Whether the player is structurally barred from replying. */
    get readOnly(): boolean {
        return this.readVars.readOnly;
    }

    /**
     * Whether a reply is possible at all.
     *
     * @remarks
     * `false` in a read-only chat. A writable chat with nothing to answer right
     * now still reports `true` - check {@link Chat.pendingChoice} for that.
     */
    get canReply(): boolean {
        return !this.readVars.readOnly;
    }

    /**
     * Title, resolved through the definition and the peer.
     *
     * @remarks
     * Resolution order: an in-fiction rename, then the definition's title, then
     * the peer's name, then the chat id.
     */
    get resolvedTitle(): string {
        const renamed = this.readVars.title;

        if (renamed) {
            return renamed.kind === "ref"
                ? this.id
                : resolvePlainRichText(renamed);
        }

        if (this.definitionTitle) {
            return resolvePlainRichText(this.definitionTitle);
        }

        if (this.peerId) {
            return resolveSenderName(this.peerId);
        }

        return this.id;
    }

    /**
     * Chat picture, or `undefined` when the chat has none.
     *
     * @remarks
     * Resolution order: an in-fiction change (where `null` means the picture was
     * removed), then the definition's avatar, then the peer's avatar.
     */
    get resolvedAvatar(): string | undefined {
        const overridden = this.readVars.avatar;

        if (overridden === null) {
            return undefined;
        }

        if (overridden !== undefined) {
            return overridden;
        }

        if (this.definitionAvatar !== undefined) {
            return this.definitionAvatar;
        }

        return this.peerId === undefined
            ? undefined
            : resolveSenderAvatar(this.peerId);
    }

    /** Contacts currently shown as typing. */
    get typingContacts(): Array<string> {
        return selectTypingContacts(this.readVars, Clock.now());
    }

    /** Script currently being played, or `null`. */
    get activeScript(): Script | null {
        const scriptId = this.readVars.activeScriptId;

        return scriptId === null ? null : (getScript(scriptId) ?? null);
    }

    /**
     * Game time delivery is blocked until, or `null` when nothing is waiting.
     */
    get nextDueAt(): number | null {
        return this.readVars.nextDueAt;
    }

    /**
     * The reply the player is expected to pick, or `null`.
     */
    get pendingChoice(): PendingChoice | null {
        const vars = this.readVars;
        const choiceId = vars.pendingChoiceKey;
        const script = this.activeScript;

        if (choiceId === null || !script) {
            return null;
        }

        const beat = resolveBeats(script).find(
            (candidate) => candidate?.id === choiceId
        );

        if (beat?.type !== "choice") {
            return null;
        }

        return {
            choiceId,
            options: beat.options.map((option, index) => ({
                index,
                content: option.content as ReactNode,
            })),
        };
    }

    /**
     * Whether the player has ever seen a script beat, across every save.
     *
     * @remarks
     * Backs "skip already-read text" and gallery unlocks. Call
     * `messenger.loadSeen()` during bootstrap before relying on it.
     */
    isSeenEver(beatId: string): boolean {
        return getSeenStore().has(beatId);
    }

    /**
     * Starts a script from its first beat.
     *
     * @param script - The script to play
     * @throws Error if the script is not registered
     *
     * @remarks
     * Sets up the cursor without delivering anything, so the game decides when
     * the first message appears. Call {@link Chat.advance} next.
     */
    play(script: Script): void {
        if (getScript(script.id) === undefined) {
            throw new Error(
                `Script "${script.id}" is not registered. Create it with defineScript() ` +
                    "so the chat can resolve its beats after a save is loaded."
            );
        }

        const vars = this.vars;
        const beats = resolveBeats(script);

        vars.activeScriptId = script.id;
        vars.cursors[script.id] = 0;
        vars.beatCounts[script.id] = beats.length;
        vars.nextDueAt = null;
        vars.pendingChoiceKey = null;
    }

    /**
     * Delivers up to `count` messages from the active script.
     *
     * Stops early at a choice, at a `wait` or `typing` beat whose time has not
     * come, and at the end of the script. Control beats do not count towards
     * `count`.
     *
     * @param count - How many messages to deliver
     *
     * @example
     * ```typescript
     * h.actions([{ content: 'Read on', action: () => chat.advance() }]);
     * ```
     */
    advance(count = 1): void {
        this.run(count);
    }

    /**
     * Delivers everything that has become due, and clears expired typing
     * indicators.
     *
     * @remarks
     * Idempotent: what is due is derived from the cursor and the clock, never
     * from a live timer. Call it when the game gains focus, when the player opens
     * the messenger, after moving the clock, or on an interval - a save loaded
     * long after a message was scheduled simply delivers it now.
     */
    deliverDue(): void {
        this.expireTyping();

        const vars = this.vars;

        if (vars.nextDueAt === null || vars.nextDueAt > Clock.now()) {
            return;
        }

        this.run(Number.POSITIVE_INFINITY);
    }

    /**
     * Appends a message outside of any script.
     *
     * @param beat - A message, system, or custom beat built with `m`
     * @returns The appended entry
     * @throws Error if the beat is a control beat, or carries content that cannot
     * be stored without a script behind it
     *
     * @example
     * ```typescript
     * chat.push(m.from(anna).text(m.t('anna.reminder')));
     * chat.push(m.player.text('on my way'));
     * chat.push(m.from(anna).text('look', { forwardedFrom: boris }));
     * ```
     */
    push(beat: DeliverableBeatInput): TranscriptEntry {
        return this.deliver(beat as Beat, null, Clock.now());
    }

    /**
     * Logs the player's reply and continues.
     *
     * @param index - Which of {@link Chat.pendingChoice}'s options was picked
     * @throws Error if the chat is read-only, nothing is pending, or the index
     * does not exist
     *
     * @remarks
     * After the reply is logged, an option's `next` script is played and advanced,
     * an option's `next` function is called, and an option without `next` simply
     * continues the current script.
     */
    choose(index: number): void {
        if (this.vars.readOnly) {
            throw new Error(
                `Chat "${this.id}" is read-only and takes no replies.`
            );
        }

        const pending = this.vars.pendingChoiceKey;
        const script = this.activeScript;

        if (pending === null || !script) {
            throw new Error(`Chat "${this.id}" has no pending choice.`);
        }

        const beat = resolveBeats(script).find(
            (candidate) => candidate?.id === pending
        );

        if (beat?.type !== "choice") {
            throw new Error(
                `Choice "${pending}" is no longer part of script "${script.id}".`
            );
        }

        const option = beat.options[index];

        if (!option) {
            throw new Error(
                `Choice "${pending}" has no option at index ${index}.`
            );
        }

        this.appendEntry(
            {
                kind: "choice",
                choiceId: pending,
                chosen: toRichText(option.content, {
                    scriptId: script.id,
                    beatId: beat.id,
                    slot: `option:${index}`,
                }),
            },
            { from: PLAYER_SENDER, at: Clock.now() }
        );

        this.vars.pendingChoiceKey = null;

        this.emit("onChoice", {
            chat: this,
            choiceId: pending,
            index,
            option,
        });

        if (typeof option.next === "function") {
            option.next();
            return;
        }

        if (option.next) {
            this.play(option.next);
        }

        this.advance();
    }

    /**
     * Marks every entry as seen.
     *
     * @remarks
     * This is the player-facing notion of "seen", not the in-fiction read
     * receipt. Beats that came from a script are also recorded in the cross-save
     * seen store.
     */
    markSeen(): void {
        this.markEntriesSeen(selectUnseenEntries(this.vars));
    }

    /**
     * Marks entries up to and including `key` as seen.
     *
     * @param key - Entry key to stop at
     *
     * @remarks
     * Use this when the chat view knows how far the player actually scrolled.
     * An unknown key marks nothing.
     */
    markSeenUpTo(key: string): void {
        const vars = this.vars;
        const limit = vars.entries.findIndex((entry) => entry.key === key);

        if (limit === -1) {
            return;
        }

        this.markEntriesSeen(
            vars.entries.slice(0, limit + 1).filter((entry) => !entry.seen)
        );
    }

    /**
     * Shows a typing indicator for `ms` of game time, without holding anything
     * back.
     *
     * @param sender - Who is typing
     * @param ms - How long the indicator lasts, in game time
     */
    setTyping(sender: Contact | string, ms: number): void {
        const id = toSenderId(sender);
        this.vars.typingUntil[id] = Clock.now() + ms;

        this.emit("onTyping", { chat: this, typing: this.typingContacts });
    }

    /**
     * Adds a member and records an in-fiction notice.
     *
     * @param contact - Who joined
     */
    addParticipant(contact: Contact | string): void {
        const id = toSenderId(contact);
        const vars = this.vars;

        if (vars.participants.includes(id)) {
            return;
        }

        vars.participants.push(id);
        this.appendEntry(
            { kind: "system", key: "member.joined", params: { who: id } },
            { from: SYSTEM_SENDER, at: Clock.now() }
        );

        this.emit("onParticipantChange", {
            chat: this,
            participants: [...vars.participants],
            added: id,
        });
    }

    /**
     * Removes a member and records an in-fiction notice.
     *
     * @param contact - Who left
     */
    removeParticipant(contact: Contact | string): void {
        const id = toSenderId(contact);
        const vars = this.vars;
        const position = vars.participants.indexOf(id);

        if (position === -1) {
            return;
        }

        vars.participants.splice(position, 1);
        this.appendEntry(
            { kind: "system", key: "member.left", params: { who: id } },
            { from: SYSTEM_SENDER, at: Clock.now() }
        );

        this.emit("onParticipantChange", {
            chat: this,
            participants: [...vars.participants],
            removed: id,
        });
    }

    /**
     * Renames the chat in-fiction.
     *
     * @param title - New title, or `undefined` to fall back to the definition
     */
    rename(title: StaticText | undefined): void {
        const vars = this.vars;

        if (title === undefined) {
            delete vars.title;
            return;
        }

        vars.title = toPlainRichText(title);
    }

    /**
     * Changes the chat picture in-fiction.
     *
     * @param src - New picture, `null` to remove it, or `undefined` to fall back
     * to the definition
     */
    setAvatar(src: string | null | undefined): void {
        const vars = this.vars;

        if (src === undefined) {
            delete vars.avatar;
            return;
        }

        vars.avatar = src;
    }

    /**
     * Opens or closes the chat for replies in-fiction.
     *
     * @param readOnly - Whether replies are barred
     */
    setReadOnly(readOnly: boolean): void {
        this.vars.readOnly = readOnly;
    }

    /**
     * Empties the transcript and resets every cursor.
     *
     * @remarks
     * The cross-save seen record is untouched, because it describes what the
     * player has read across all playthroughs.
     */
    clear(): void {
        const vars = this.vars;
        const initial = this.initialVars();

        vars.entries.splice(0, vars.entries.length);
        vars.activeScriptId = null;
        vars.cursors = {};
        vars.beatCounts = {};
        vars.nextDueAt = null;
        vars.typingUntil = {};
        vars.pendingChoiceKey = null;
        vars.unread = 0;
        vars.lastActivityAt = 0;
        vars.lastSeenAt = 0;
        vars.nextKey = initial.nextKey;
    }

    private run(limit: number): void {
        const script = this.activeScript;

        if (!script) {
            return;
        }

        const vars = this.vars;
        const beats = resolveBeats(script);
        const recorded = vars.beatCounts[script.id];

        if (
            recorded !== undefined &&
            !this.driftWarned.has(script.id) &&
            warnOnScriptDrift(this.id, script.id, recorded, beats.length)
        ) {
            this.driftWarned.add(script.id);
        }

        let delivered = 0;

        // Beats are stamped at the moment they were *due*, not at the moment the
        // game got around to them, and the anchor carries across the whole run.
        // Catching up therefore replays the authored schedule instead of
        // stretching it: a conversation written to unfold over three minutes still
        // reads that way when the player returns an hour later.
        let at = Clock.now();

        while (delivered < limit) {
            if (vars.pendingChoiceKey !== null) {
                return;
            }

            if (vars.nextDueAt !== null) {
                if (vars.nextDueAt > Clock.now()) {
                    return;
                }

                at = vars.nextDueAt;
                vars.nextDueAt = null;
            }

            const cursor = vars.cursors[script.id] ?? 0;

            if (cursor >= beats.length) {
                vars.activeScriptId = null;
                this.emit("onScriptEnd", { chat: this, scriptId: script.id });
                return;
            }

            vars.cursors[script.id] = cursor + 1;

            const beat = beats[cursor];

            if (beat && this.applyBeat(beat, script.id, at)) {
                delivered += 1;
            }
        }
    }

    private applyBeat(beat: Beat, scriptId: string, at: number): boolean {
        if (beat.type === "wait") {
            this.vars.nextDueAt = at + beat.ms;
            return false;
        }

        if (beat.type === "typing") {
            this.vars.typingUntil[beat.from] = at + beat.ms;
            this.vars.nextDueAt = at + beat.ms;
            this.emit("onTyping", { chat: this, typing: this.typingContacts });
            return false;
        }

        if (beat.type === "choice") {
            this.vars.pendingChoiceKey = beat.id;
            return false;
        }

        this.deliver(beat, scriptId, at);

        return true;
    }

    private deliver(
        beat: Beat,
        scriptId: string | null,
        at: number
    ): TranscriptEntry {
        if (
            beat.type === "wait" ||
            beat.type === "typing" ||
            beat.type === "choice"
        ) {
            throw new Error(
                `chat.push() takes a message, system, or custom beat, not "${beat.type}".`
            );
        }

        const ref: RefSource | null =
            scriptId === null
                ? null
                : { scriptId, beatId: beat.id, slot: "text" };

        if (beat.type === "system") {
            return this.appendEntry(
                {
                    kind: "system",
                    key: beat.key,
                    ...(beat.params === undefined
                        ? {}
                        : { params: beat.params }),
                },
                {
                    from: SYSTEM_SENDER,
                    at,
                    ...(scriptId === null
                        ? {}
                        : { origin: { scriptId, beatId: beat.id } }),
                }
            );
        }

        if (beat.type === "custom") {
            return this.appendEntry(
                { kind: "custom", name: beat.name, data: beat.data },
                {
                    from: beat.from,
                    at,
                    ...(scriptId === null
                        ? {}
                        : { origin: { scriptId, beatId: beat.id } }),
                }
            );
        }

        return this.appendEntry(convertBody(beat.body, ref), {
            from: beat.from,
            at,
            ...(beat.forwardedFrom === undefined
                ? {}
                : { forwarded: normalizeForwardOrigin(beat.forwardedFrom) }),
            ...(beat.receipt === undefined ? {} : { receipt: beat.receipt }),
            ...(scriptId === null
                ? {}
                : { origin: { scriptId, beatId: beat.id } }),
        });
    }

    private appendEntry(
        payload: Payload,
        options: {
            from: string;
            at: number;
            origin?: { scriptId: string; beatId: string };
            forwarded?: ForwardOrigin;
            receipt?: Receipt;
        }
    ): TranscriptEntry {
        const vars = this.vars;
        const at = options.at;
        const seen = options.from === PLAYER_SENDER;

        const entry: TranscriptEntry = {
            key: `${this.id}#${vars.nextKey}`,
            at,
            from: options.from,
            payload,
            seen,
            ...(options.receipt === undefined
                ? {}
                : { receipt: options.receipt }),
            ...(options.forwarded === undefined
                ? {}
                : { forwarded: options.forwarded }),
            ...(options.origin === undefined ? {} : { origin: options.origin }),
        };

        vars.nextKey += 1;
        vars.entries.push(entry);
        vars.lastActivityAt = at;

        // Read the entry back out of the store so callers get the reactive object
        // rather than the detached literal that was pushed.
        const stored = vars.entries.at(-1) as TranscriptEntry;

        this.trim();
        vars.unread = selectUnread(vars);

        if (seen && options.origin) {
            getSeenStore().add(options.origin.beatId);
        }

        this.emit("onSend", { chat: this, entry: stored });

        return stored;
    }

    private trim(): void {
        const vars = this.vars;

        if (this.maxEntries === Number.POSITIVE_INFINITY) {
            if (
                !this.lengthWarned &&
                vars.entries.length > ENTRY_WARN_THRESHOLD
            ) {
                this.lengthWarned = true;
                logger.warn(
                    `Chat "${this.id}" holds more than ${ENTRY_WARN_THRESHOLD} entries and has no maxEntries. ` +
                        "Auto-save serializes the whole state tree, so consider capping the transcript."
                );
            }

            return;
        }

        const excess = vars.entries.length - this.maxEntries;

        if (excess > 0) {
            vars.entries.splice(0, excess);
        }
    }

    private markEntriesSeen(entries: Array<TranscriptEntry>): void {
        if (entries.length === 0) {
            return;
        }

        const vars = this.vars;
        const seenStore = getSeenStore();

        for (const entry of entries) {
            entry.seen = true;

            if (entry.origin) {
                seenStore.add(entry.origin.beatId);
            }
        }

        vars.unread = selectUnread(vars);
        vars.lastSeenAt = Clock.now();

        this.emit("onSeen", { chat: this, entries });
    }

    private expireTyping(): void {
        const vars = this.vars;
        let changed = false;
        const now = Clock.now();

        for (const id of Object.keys(vars.typingUntil)) {
            if ((vars.typingUntil[id] ?? 0) <= now) {
                delete vars.typingUntil[id];
                changed = true;
            }
        }

        if (changed) {
            this.emit("onTyping", { chat: this, typing: this.typingContacts });
        }
    }

    private emit<TName extends keyof ChatCallbacks>(
        name: TName,
        event: Parameters<NonNullable<ChatCallbacks[TName]>>[0]
    ): void {
        safeCallback(
            name,
            this.callbacks[name] as ((value: typeof event) => void) | undefined,
            event
        );
        safeCallback(
            name,
            getStoreCallbacks()[name] as
                | ((value: typeof event) => void)
                | undefined,
            event
        );
    }
}

/**
 * Defines a chat.
 *
 * @param id - Unique, persistent identifier. It keys the transcript inside saves,
 * so treat it like a passage id and never rename it once a game has shipped.
 * @param options - Peer or participants, title, avatar, read-only flag, callbacks
 * @returns The chat
 * @throws Error if the id is already taken
 *
 * @remarks
 * Defining a chat creates no state: the transcript is materialized the first time
 * something writes to it, which is also why adding a chat to a shipped game needs
 * no save migration. Reading a chat - including rendering it - creates nothing.
 *
 * @example
 * ```typescript
 * import { defineChat, defineContact, m } from '@react-text-game/messenger';
 *
 * const anna = defineContact('anna', { name: m.t('contacts.anna') });
 * const boris = defineContact('boris', { name: m.t('contacts.boris') });
 *
 * // one-to-one
 * export const annaChat = defineChat('anna', { peer: anna });
 *
 * // group with a title, a picture and members
 * export const squad = defineChat('squad', {
 *   title: m.t('chats.squad'),
 *   participants: [anna, boris],
 *   avatar: '/avatars/squad.webp',
 * });
 *
 * // an announcement channel the player cannot answer
 * export const news = defineChat('news', {
 *   title: m.t('chats.news'),
 *   readOnly: true,
 * });
 * ```
 */
export const defineChat = (id: string, options: ChatOptions = {}): Chat => {
    if (chats.has(id)) {
        throw new Error(`Chat "${id}" is already defined.`);
    }

    const chat = new Chat(id, options);
    chats.set(id, chat);

    return chat;
};

/**
 * Looks up a defined chat.
 */
export const getChat = (id: string): Chat | undefined => chats.get(id);

/**
 * Every defined chat, in definition order.
 */
export const getAllChats = (): Array<Chat> => Array.from(chats.values());

/**
 * Clears every defined chat. Tests only.
 *
 * @internal
 */
export const _clearChats = (): void => {
    chats.clear();
};
