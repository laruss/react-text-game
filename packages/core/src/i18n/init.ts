import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { logger } from "#logger";
import { getSetting } from "#saves/db";

import { DEFAULT_CONFIG } from "./constants";
import type { I18nConfig } from "./types";
import { loadUITranslations } from "./utils";

export async function initI18n(config?: I18nConfig) {
    const {
        defaultLanguage = "en",
        fallbackLanguage = "en",
        debug = false,
        resources,
    } = (config || DEFAULT_CONFIG) as I18nConfig;

    // Try to load UI translations (will be empty if UI package not installed)
    const uiTranslations = await loadUITranslations();

    if (Object.keys(uiTranslations).length === 0) {
        logger.log("UI translations not found.");
    } else {
        logger.log("UI translations loaded successfully.");
    }

    // Merge user resources with UI translations
    const mergedResources: typeof resources = {};

    for (const [lang, namespaces] of Object.entries(resources)) {
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

    await i18next.use(initReactI18next).init({
        lng: savedLanguage, // Use saved language or default
        fallbackLng: fallbackLanguage,
        defaultNS: "common",
        debug,
        resources: mergedResources,
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

    logger.log(
        `i18n initialized with language: ${i18next.language}, fallback: ${fallbackLanguage}`
    );
}
