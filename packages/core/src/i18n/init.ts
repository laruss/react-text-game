import i18next, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import { logger } from "#logger";
import { getSetting } from "#saves/db";

import { DEFAULT_CONFIG } from "./constants";
import type { I18nConfig } from "./types";
import { loadUITranslations } from "./utils";

/**
 * Initializes the i18n (internationalization) system for the game engine.
 *
 * This function sets up i18next with the provided configuration, automatically loads
 * UI translations from the @react-text-game/ui package (if installed), and merges them
 * with user-provided translation resources. It also loads the user's saved language
 * preference from the database.
 *
 * The initialization process:
 * 1. Loads UI translations from the UI package (if available)
 * 2. Merges user resources with UI translations (user translations take precedence)
 * 3. Loads the saved language preference from the database
 * 4. Initializes i18next with the merged resources and saved language
 * 5. Registers any additional i18next modules provided in the config
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

    const uiTranslations = await loadUITranslations();

    if (Object.keys(uiTranslations).length === 0) {
        logger.log("UI translations not found.");
    } else {
        logger.log("UI translations loaded successfully.");
    }

    // Merge user resources with UI translations
    const mergedResources: Resource = {};

    for (const [lang, namespaces] of Object.entries(resources || {})) {
        mergedResources[lang] = {
            ...namespaces,
            // Auto-merge UI translations if available for this language
            ...(uiTranslations[lang] || {}),
        };
    }

    // Add UI translations for languages not provided by user
    for (const [lang, translations] of Object.entries(uiTranslations)) {
        if (!mergedResources[lang]) {
            mergedResources[lang] = translations;
        }
    }

    // Load saved language preference from database (if available)
    const savedLanguage = await getSetting<string>("language", defaultLanguage);

    logger.log(`Saved language: ${savedLanguage}`);

    // Extract all available languages from resources
    const supportedLanguages = Object.keys(mergedResources);

    let i18nInstance = i18next.use(initReactI18next);
    modules.forEach(module => {
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

    logger.log(
        `i18n initialized with language: ${i18next.language}, fallback: ${fallbackLanguage}, supported languages: ${supportedLanguages.join(', ')}`
    );
}
