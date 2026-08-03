import { getGameTranslation } from "@react-text-game/core/i18n";

import { AUTHOR_I18N_NAMESPACE, MESSENGER_I18N_NAMESPACE } from "#constants";
import type {
    I18nText,
    Params,
    RawText,
    RichText,
    StaticText,
    TextInput,
} from "#types";

/**
 * Text that can be persisted without a script beat to point back to.
 */
export type PlainRichText = RawText | I18nText;

/**
 * Identifies which text of a beat a {@link RefText} points at.
 */
export type RefSource = {
    scriptId: string;
    beatId: string;
    slot: string;
};

/**
 * Marks a translation key as a message's text.
 *
 * The key is resolved every time the message is read, so switching language
 * re-translates messages that were delivered long ago. Interpolation values are
 * captured when the message is delivered and never change afterwards.
 *
 * @param key - Translation key, optionally prefixed with `"namespace:"`
 * @param params - Interpolation values, frozen at delivery time
 *
 * @example
 * ```typescript
 * m.from(anna).text(m.t("anna.opener", { name: player.name }))
 * m.from(anna).text(m.t("common:greeting"))
 * ```
 */
export const t = (key: string, params?: Params): I18nText =>
    params === undefined
        ? { kind: "i18n", key }
        : { kind: "i18n", key, params };

/**
 * Whether a value was produced by {@link t}.
 */
export const isI18nText = (value: unknown): value is I18nText =>
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "i18n";

/**
 * Converts text that has no script beat behind it.
 *
 * @remarks
 * Used for chat titles, contact names, and forward labels - values that are
 * persisted but cannot carry a React node.
 */
export const toPlainRichText = (input: StaticText): PlainRichText => {
    if (isI18nText(input)) {
        return input;
    }

    return { kind: "raw", text: String(input) };
};

/**
 * Converts author text into its persisted form.
 *
 * The resulting kind follows the input: a string or number is frozen as-is,
 * {@link t} output re-translates, and anything else is stored as a reference
 * back to the script beat, because a React node cannot be serialized.
 */
export const toRichText = (input: TextInput, ref: RefSource): RichText => {
    if (typeof input === "string" || typeof input === "number") {
        return { kind: "raw", text: String(input) };
    }

    if (isI18nText(input)) {
        return input;
    }

    return {
        kind: "ref",
        scriptId: ref.scriptId,
        beatId: ref.beatId,
        slot: ref.slot,
    };
};

/**
 * Whether the input can be persisted without a script beat behind it.
 */
export const isStaticText = (input: TextInput): input is StaticText =>
    typeof input === "string" || typeof input === "number" || isI18nText(input);

/**
 * Translates a key in the namespace author message keys resolve against.
 *
 * @internal
 */
export const translateAuthorKey = (key: string, params?: Params): string =>
    getGameTranslation(AUTHOR_I18N_NAMESPACE)(key, params ?? {});

/**
 * Translates one of this package's own strings.
 *
 * @internal
 */
export const translateMessengerKey = (key: string, params?: Params): string =>
    getGameTranslation(MESSENGER_I18N_NAMESPACE)(key, params ?? {});

/**
 * Resolves text that carries no script reference to a display string.
 */
export const resolvePlainRichText = (text: PlainRichText): string =>
    text.kind === "raw" ? text.text : translateAuthorKey(text.key, text.params);
