import { registerTranslations } from "@react-text-game/core/i18n";

import { MESSENGER_I18N_NAMESPACE } from "#constants";

import { en } from "./en";

/**
 * This package's default strings, keyed by language and namespace.
 *
 * @remarks
 * Registered automatically when the package is imported, so a game gets working
 * text without wiring anything. Exported for the rare case of merging them by
 * hand into `Game.init({ translations: { resources } })`.
 */
export const messengerTranslations = {
    en: { [MESSENGER_I18N_NAMESPACE]: en },
};

registerTranslations(messengerTranslations);
