import type { Contact } from "#contacts";
import type {
    ForwardOriginInput,
    I18nText,
    Json,
    MediaItemInput,
    Params,
    Receipt,
    TextInput,
} from "#types";

/**
 * A value that may be omitted from a beat array.
 *
 * Falsy entries are skipped when the cursor reaches them, which lets conditional
 * beats be written inline with `&&`.
 */
export type Conditional<T> = T | false | null | undefined;

/**
 * What a message beat carries.
 */
export type MessageBody =
    | { kind: "text"; text: TextInput }
    | { kind: "media"; items: Array<MediaItemInput>; caption?: TextInput };

/**
 * Options shared by every message beat.
 */
export type MessageOptions = {
    /**
     * Explicit beat id.
     *
     * @remarks
     * Beat ids default to `"<scriptId>:<index>"` using the beat's position in
     * the array as written, so conditional beats never shift them. Set an
     * explicit id when a beat needs to stay addressable across edits that
     * reorder the script.
     */
    id?: string;

    /**
     * Marks the message as forwarded from somewhere else.
     *
     * @remarks
     * The source does not have to be a real message: a contact, an id, or a
     * free-form label all work.
     */
    forwardedFrom?: ForwardOriginInput;

    /** In-fiction delivery state shown to the player. */
    receipt?: Receipt;
};

/**
 * Options for a media message.
 */
export type MediaMessageOptions = MessageOptions & {
    /** Text shown with the media. */
    caption?: TextInput;
};

/**
 * Options for a single media item.
 */
export type MediaItemOptions = {
    alt?: TextInput;
    poster?: string;
    durationMs?: number;
    spoiler?: boolean;
};

/** A message from a specific sender. */
export type MessageBeatInput = {
    type: "message";
    id?: string;
    from: string;
    body: MessageBody;
    forwardedFrom?: ForwardOriginInput;
    receipt?: Receipt;
};

/** An in-fiction system notice, always translated. */
export type SystemBeatInput = {
    type: "system";
    id?: string;
    key: string;
    params?: Params;
};

/** An author-defined payload the package passes through untouched. */
export type CustomBeatInput = {
    type: "custom";
    id?: string;
    from: string;
    name: string;
    data: Json;
};

/** Shows a typing indicator and holds the next beat back for `ms` of game time. */
export type TypingBeatInput = {
    type: "typing";
    id?: string;
    from: string;
    ms: number;
};

/** Holds the next beat back for `ms` of game time. */
export type WaitBeatInput = {
    type: "wait";
    id?: string;
    ms: number;
};

/** One selectable reply. */
export type ChoiceOption = {
    /** Label shown to the player, and logged once chosen. */
    content: TextInput;

    /**
     * What happens after the reply is logged.
     *
     * A script is played in the same chat, a function is called, and omitting it
     * simply continues the current script.
     */
    next?: Script | (() => void);
};

/** Blocks the script until the player picks a reply. */
export type ChoiceBeatInput = {
    type: "choice";
    /** Required: choices stay addressable, so their id must not shift. */
    id: string;
    options: Array<ChoiceOption>;
};

/**
 * Anything a script builder may return.
 */
export type BeatInput =
    | MessageBeatInput
    | SystemBeatInput
    | CustomBeatInput
    | TypingBeatInput
    | WaitBeatInput
    | ChoiceBeatInput;

/**
 * A beat with its id resolved.
 */
export type Beat = BeatInput & { id: string };

/**
 * Beats that append an entry to the transcript.
 */
export type DeliverableBeatInput =
    | MessageBeatInput
    | SystemBeatInput
    | CustomBeatInput;

/**
 * Builders for messages sent by one particular sender.
 */
export type SenderScope = {
    /**
     * A text message.
     *
     * @example
     * ```typescript
     * m.from(anna).text("hey, you up?")
     * m.from(anna).text(m.t("anna.opener"))
     * m.from(anna).text(<>look at <b>this</b></>)
     * ```
     */
    text: (content: TextInput, options?: MessageOptions) => MessageBeatInput;

    /**
     * A media message. One item is a single photo or video, several make an
     * album, and `caption` is the comment shown with them.
     *
     * @example
     * ```typescript
     * m.from(anna).media([m.image("/park.webp")], { caption: m.t("anna.park") })
     * m.from(anna).media([m.image("/1.webp"), m.video("/2.mp4")])
     * ```
     */
    media: (
        items: Array<MediaItemInput>,
        options?: MediaMessageOptions
    ) => MessageBeatInput;

    /** Shorthand for a single-image media message. */
    image: (
        src: string,
        options?: MediaMessageOptions & MediaItemOptions
    ) => MessageBeatInput;

    /** Shorthand for a single-video media message. */
    video: (
        src: string,
        options?: MediaMessageOptions & MediaItemOptions
    ) => MessageBeatInput;

    /** An author-defined payload, passed through to the UI untouched. */
    custom: (
        name: string,
        data: Json,
        options?: Pick<MessageOptions, "id">
    ) => CustomBeatInput;
};

/**
 * Toolbox handed to a {@link defineScript} builder.
 */
export type MessengerHelpers = {
    /** Marks a translation key. See {@link t}. */
    t: (key: string, params?: Params) => I18nText;

    /** Builds an image item for a media message. */
    image: (src: string, options?: MediaItemOptions) => MediaItemInput;

    /** Builds a video item for a media message. */
    video: (src: string, options?: MediaItemOptions) => MediaItemInput;

    /** Scopes the following builders to a sender. */
    from: (sender: Contact | string) => SenderScope;

    /** Builders scoped to the player. */
    player: SenderScope;

    /** An in-fiction system notice such as a member joining. */
    system: (
        key: string,
        params?: Params,
        options?: Pick<MessageOptions, "id">
    ) => SystemBeatInput;

    /** Shows a typing indicator, then delivers the next beat. */
    typing: (
        sender: Contact | string,
        ms: number,
        options?: Pick<MessageOptions, "id">
    ) => TypingBeatInput;

    /** Delays the next beat by `ms` of game time. */
    wait: (ms: number, options?: Pick<MessageOptions, "id">) => WaitBeatInput;

    /** Blocks until the player picks a reply. */
    choice: (id: string, options: Array<ChoiceOption>) => ChoiceBeatInput;

    /** Returns `value` when `condition` is truthy, otherwise `undefined`. */
    when: <T>(condition: unknown, value: T | (() => T)) => T | undefined;
};

/**
 * Callback describing a chat's beats.
 */
export type ScriptBuilder = (
    helpers: MessengerHelpers
) => Array<Conditional<BeatInput>>;

/**
 * A named, addressable sequence of beats.
 */
export type Script = {
    readonly id: string;
    readonly build: ScriptBuilder;
};
