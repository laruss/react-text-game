import { useTranslation } from "react-i18next";

import { setSetting } from "#saves/db";

/**
 * React hook for accessing translation functionality within game components.
 *
 * This hook provides a translation function (`t`), the current language, available languages,
 * and a method to change the language. It's the primary way to use i18n in React components.
 *
 * The hook automatically:
 * - Re-renders components when the language changes
 * - Persists language changes to the database
 * - Filters out the "cimode" debug language (unless debug mode is enabled)
 *
 * @param {string} [namespace='passages'] - The translation namespace to use. Defaults to 'passages'.
 *                                          Common namespaces include 'passages', 'common', 'ui', etc.
 *
 * @returns {Object} An object containing translation utilities:
 * @returns {Function} t - Translation function. Call with a key to get the translated string.
 *                         Supports interpolation, pluralization, and other i18next features.
 * @returns {Function} changeLanguage - Async function to change the current language.
 *                                      Accepts a language code (e.g., 'en', 'ru') and persists
 *                                      the preference to the database.
 * @returns {string} currentLanguage - The currently active language code (e.g., 'en', 'ru').
 * @returns {string[]} languages - Array of available language codes, excluding 'cimode'
 *                                 (unless debug mode is enabled).
 *
 * @example
 * ```typescript
 * // Basic usage in a React component
 * function MyPassage() {
 *   const { t } = useGameTranslation('passages');
 *
 *   return (
 *     <div>
 *       <h1>{t('intro')}</h1>
 *       <p>{t('description')}</p>
 *     </div>
 *   );
 * }
 *
 * // Language switcher component
 * function LanguageSwitcher() {
 *   const { currentLanguage, languages, changeLanguage } = useGameTranslation();
 *
 *   return (
 *     <select
 *       value={currentLanguage}
 *       onChange={(e) => changeLanguage(e.target.value)}
 *     >
 *       {languages.map(lang => (
 *         <option key={lang} value={lang}>{lang}</option>
 *       ))}
 *     </select>
 *   );
 * }
 *
 * // With interpolation
 * function Greeting() {
 *   const { t } = useGameTranslation('common');
 *
 *   // Translation: "Hello, {{name}}!"
 *   return <p>{t('greeting', { name: 'Player' })}</p>;
 *   // Output: "Hello, Player!"
 * }
 *
 * // Different namespace
 * function UIComponent() {
 *   const { t } = useGameTranslation('ui');
 *
 *   return <button>{t('save')}</button>;
 * }
 * ```
 *
 * @see {@link initI18n} for initializing the i18n system
 * @see {@link getGameTranslation} for using translations outside React components
 */
export function useGameTranslation(namespace: string = "passages") {
    const { t, i18n } = useTranslation(namespace);

    /**
     * Changes the current language and persists the preference to the database.
     *
     * @param {string} lang - ISO 639-1 language code (e.g., 'en', 'ru', 'de')
     * @returns {Promise<void>}
     */
    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
        // Persist language preference to the database
        await setSetting("language", lang);
    };

    const languages = i18n.options.supportedLngs || [];

    // Filter out cimode unless debug is enabled
    const filteredLanguages = i18n.options.debug
        ? languages
        : languages.filter((lng) => lng !== "cimode");

    return {
        t,
        changeLanguage,
        currentLanguage: i18n.language,
        languages: filteredLanguages,
    };
}
