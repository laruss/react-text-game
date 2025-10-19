import { I18nConfig } from "./types";

/**
 * Default configuration for the i18n system.
 *
 * This configuration is used when no custom i18n config is provided to `initI18n()`.
 * It sets English as both the default and fallback language, disables debug mode,
 * and provides an empty resources object.
 *
 * @constant
 * @type {I18nConfig}
 * @property {string} defaultLanguage - Set to "en" (English)
 * @property {string} fallbackLanguage - Set to "en" (English)
 * @property {boolean} debug - Set to false (debug mode disabled)
 * @property {object} resources - Empty object (no translations by default)
 */
export const DEFAULT_CONFIG = {
    defaultLanguage: "en",
    fallbackLanguage: "en",
    debug: false,
    resources: {},
} as const satisfies I18nConfig;
