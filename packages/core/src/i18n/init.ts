import i18next, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import { deepMerge } from "#helpers";
import { logger } from "#logger";
import { getSetting } from "#saves/db";

import { DEFAULT_CONFIG } from "./constants";
import {
    _applyRegisteredTranslations,
    _getRegisteredTranslations,
} from "./registry";
import type { I18nConfig } from "./types";

/**
 * Initializes the i18n (internationalization) system for the game engine.
 *
 * This function sets up i18next with the provided configuration and merges the
 * default translations that packages registered through `registerTranslations`
 * (for example `@react-text-game/ui` and `@react-text-game/messenger`) with
 * user-provided translation resources. It also loads the user's saved language
 * preference from the database.
 *
 * The initialization process:
 * 1. Merges user resources over registered package defaults (user translations take precedence)
 * 2. Loads the saved language preference from the database
 * 3. Initializes i18next with the merged resources and saved language
 * 4. Registers any additional i18next modules provided in the config
 *
 * **Important:** This function should be called once during game initialization,
 * typically before rendering any UI components.
 *
 * @param {I18nConfig} [config] - Optional configuration object. If not provided,
 *                                uses DEFAULT_CONFIG (English as default/fallback language).
 *
 * @returns {Promise<void>} A promise that resolves when i18n initialization is complete.
 *
 * @example
 * ```typescript
 * // Basic initialization with default config (English)
 * await initI18n();
 *
 * // Initialize with custom configuration
 * await initI18n({
 *   defaultLanguage: 'en',
 *   fallbackLanguage: 'en',
 *   debug: false,
 *   resources: {
 *     en: {
 *       passages: { intro: 'Welcome to the game' },
 *       common: { save: 'Save', load: 'Load' }
 *     },
 *     ru: {
 *       passages: { intro: 'Добро пожаловать в игру' },
 *       common: { save: 'Сохранить', load: 'Загрузить' }
 *     }
 *   }
 * });
 *
 * // With additional i18next modules
 * import LanguageDetector from 'i18next-browser-languagedetector';
 *
 * await initI18n({
 *   defaultLanguage: 'en',
 *   resources: { ... },
 *   modules: [LanguageDetector]
 * });
 * ```
 *
 * @see {@link I18nConfig} for configuration options
 * @see {@link useGameTranslation} for using translations in React components
 * @see {@link getGameTranslation} for using translations outside React components
 */
export async function initI18n(config?: I18nConfig) {
    const {
        defaultLanguage = "en",
        fallbackLanguage = "en",
        debug = false,
        resources,
        modules = [],
    } = (config || DEFAULT_CONFIG) as I18nConfig;

    const packageTranslations = _getRegisteredTranslations();

    // User resources take precedence over package defaults registered
    // through registerTranslations().
    const userResources = resources || {};
    const languages = new Set([
        ...Object.keys(packageTranslations),
        ...Object.keys(userResources),
    ]);

    const mergedResources: Resource = {};

    for (const lang of languages) {
        // Merged per key, not per namespace: overriding a single string of a
        // namespace must not drop the rest of that namespace's defaults.
        mergedResources[lang] = deepMerge(
            (packageTranslations[lang] || {}) as Record<string, unknown>,
            (userResources[lang] || {}) as Record<string, unknown>
        ) as Resource[string];
    }

    // Load saved language preference from database (if available)
    const savedLanguage = await getSetting<string>("language", defaultLanguage);

    logger.log(`Saved language: ${savedLanguage}`);

    // Extract all available languages from resources
    const supportedLanguages = Object.keys(mergedResources);

    let i18nInstance = i18next.use(initReactI18next);
    modules.forEach((module) => {
        i18nInstance = i18nInstance.use(module);
    });

    await i18nInstance.init({
        lng: savedLanguage, // Use saved language or default
        fallbackLng: fallbackLanguage,
        supportedLngs: supportedLanguages, // Explicitly list all supported languages
        defaultNS: "common",
        debug,
        resources: mergedResources,
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

    // Packages registered while init was pending missed the snapshot above and
    // found i18next uninitialized or about to be replaced. Re-applying never
    // overwrites, so the author's resources still win.
    _applyRegisteredTranslations();

    logger.log(
        `i18n initialized with language: ${i18next.language}, fallback: ${fallbackLanguage}, supported languages: ${supportedLanguages.join(", ")}`
    );
}
