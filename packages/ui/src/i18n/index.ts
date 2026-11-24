import { registerTranslations } from "@react-text-game/core/i18n";

import { ui } from "./locales/en/ui";

/**
 * This package's default strings, keyed by language and namespace.
 *
 * @remarks
 * Registered automatically when the package is imported, so a game gets working
 * text without wiring anything. Exported for merging them by hand into
 * `Game.init({ translations: { resources } })`.
 */
export const uiTranslations = {
    en: { ui },
} as const;

registerTranslations(uiTranslations);
