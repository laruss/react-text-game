import { PLAYER_SENDER } from "#constants";
import { type Contact, toSenderId } from "#contacts";
import { t } from "#text";
import type { Json, MediaItemInput } from "#types";

import type {
    ChoiceBeatInput,
    ChoiceOption,
    CustomBeatInput,
    MediaItemOptions,
    MediaMessageOptions,
    MessageBeatInput,
    MessageBody,
    MessageOptions,
    MessengerHelpers,
    SenderScope,
    SystemBeatInput,
    TypingBeatInput,
    WaitBeatInput,
} from "./types";

const mediaItem = (
    kind: "image" | "video",
    src: string,
    options: MediaItemOptions = {}
): MediaItemInput => ({
    kind,
    src,
    ...(options.alt === undefined ? {} : { alt: options.alt }),
    ...(options.poster === undefined ? {} : { poster: options.poster }),
    ...(options.durationMs === undefined
        ? {}
        : { durationMs: options.durationMs }),
    ...(options.spoiler === undefined ? {} : { spoiler: options.spoiler }),
});

const messageBeat = (
    from: string,
    body: MessageBody,
    options: MessageOptions = {}
): MessageBeatInput => ({
    type: "message",
    from,
    body,
    ...(options.id === undefined ? {} : { id: options.id }),
    ...(options.forwardedFrom === undefined
        ? {}
        : { forwardedFrom: options.forwardedFrom }),
    ...(options.receipt === undefined ? {} : { receipt: options.receipt }),
});

const mediaBody = (
    items: Array<MediaItemInput>,
    options: MediaMessageOptions
): MessageBody => ({
    kind: "media",
    items,
    ...(options.caption === undefined ? {} : { caption: options.caption }),
});

const createSenderScope = (from: string): SenderScope => ({
    text: (content, options) =>
        messageBeat(from, { kind: "text", text: content }, options),

    media: (items, options = {}) =>
        messageBeat(from, mediaBody(items, options), options),

    image: (src, options = {}) =>
        messageBeat(
            from,
            mediaBody([mediaItem("image", src, options)], options),
            options
        ),

    video: (src, options = {}) =>
        messageBeat(
            from,
            mediaBody([mediaItem("video", src, options)], options),
            options
        ),

    custom: (name, data: Json, options = {}): CustomBeatInput => ({
        type: "custom",
        from,
        name,
        data,
        ...(options.id === undefined ? {} : { id: options.id }),
    }),
});

/**
 * Beat builders, normally received as the argument of a {@link defineScript}
 * callback.
 *
 * Import it directly when a script is split across files and the builders are
 * needed outside the callback body, or when pushing a message imperatively with
 * `chat.push()`.
 *
 * @example
 * ```typescript
 * import { defineScript, m } from '@react-text-game/messenger';
 *
 * const greeting = () => [m.from(anna).text(m.t('anna.hello'))];
 *
 * defineScript('anna/opener', (m) => [
 *   ...greeting(),
 *   m.typing(anna, 1200),
 *   m.from(anna).text(m.t('anna.followup')),
 * ]);
 * ```
 */
export const m: MessengerHelpers = {
    t,

    image: (src, options) => mediaItem("image", src, options),

    video: (src, options) => mediaItem("video", src, options),

    from: (sender: Contact | string) => createSenderScope(toSenderId(sender)),

    player: createSenderScope(PLAYER_SENDER),

    system: (key, params, options = {}): SystemBeatInput => ({
        type: "system",
        key,
        ...(params === undefined ? {} : { params }),
        ...(options.id === undefined ? {} : { id: options.id }),
    }),

    typing: (sender, ms, options = {}): TypingBeatInput => ({
        type: "typing",
        from: toSenderId(sender),
        ms,
        ...(options.id === undefined ? {} : { id: options.id }),
    }),

    wait: (ms, options = {}): WaitBeatInput => ({
        type: "wait",
        ms,
        ...(options.id === undefined ? {} : { id: options.id }),
    }),

    choice: (id: string, options: Array<ChoiceOption>): ChoiceBeatInput => ({
        type: "choice",
        id,
        options,
    }),

    when: <T>(condition: unknown, value: T | (() => T)): T | undefined => {
        if (!condition) {
            return undefined;
        }

        return typeof value === "function" ? (value as () => T)() : value;
    },
};
