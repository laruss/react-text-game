import { Module, Resource } from "i18next";

/**
 * Configuration options for initializing the i18n system in the game engine.
 * This type defines all available settings for internationalization, including
 * language preferences, translation resources, and optional i18next modules.
 */
export type I18nConfig = {
    /**
     * The default language code to use when no saved language preference exists.
     * Should be an ISO 639-1 language code (e.g., "en", "ru", "de").
     * @default "en"
     */
    defaultLanguage?: string;

    /**
     * The fallback language code to use when a translation is missing in the current language.
     * Should be an ISO 639-1 language code (e.g., "en", "ru", "de").
     * @default "en"
     */
    fallbackLanguage?: string;

    /**
     * Enable debug mode for i18next. When enabled, logs translation keys and warnings
     * to the console, and includes the special "cimode" language in available languages.
     * @default false
     */
    debug?: boolean;

    /**
     * Translation resources organized by language and namespace.
     * Structure: `{ [languageCode]: { [namespace]: { [key]: translation } } }`
     * Example:
     * ```typescript
     * {
     *   en: {
     *     common: { greeting: "Hello" },
     *     passages: { intro: "Welcome to the game" }
     *   },
     *   ru: {
     *     common: { greeting: "Привет" },
     *     passages: { intro: "Добро пожаловать в игру" }
     *   }
     * }
     * ```
     * @default {}
     */
    resources?: Resource;

    /**
     * Optional array of i18next modules/plugins to extend functionality.
     * Common modules include i18next-http-backend, i18next-browser-languagedetector, etc.
     * The initReactI18next module is already included by default.
     * @default []
     * @see https://www.i18next.com/overview/plugins-and-utils
     */
    modules?: Array<Module>;
};
