import i18next from "i18next";

/**
 * Gets a translation function (t) scoped to a specific namespace and the current language.
 *
 * This function provides a convenient way to get translations outside of React components
 * (where you would normally use the `useGameTranslation` hook). It uses i18next's `getFixedT`
 * method to create a translation function bound to the current language and specified namespace.
 *
 * The translation function updates automatically when the language changes because it reads
 * `i18next.language` dynamically at call time.
 *
 * @param {string} [namespace='passages'] - The translation namespace to use. Defaults to 'passages'.
 *                                          Common namespaces include 'passages', 'common', 'ui', etc.
 *
 * @returns {i18next.TFunction} A translation function that can be used to translate keys
 *                              within the specified namespace.
 *
 * @example
 * ```typescript
 * // Get translations for passages
 * const t = getGameTranslation('passages');
 * const welcomeText = t('intro'); // "Welcome to the game"
 *
 * // Get translations for common namespace
 * const tCommon = getGameTranslation('common');
 * const greeting = tCommon('greeting'); // "Hello"
 *
 * // Use in non-React contexts (e.g., game logic, utility functions)
 * const t = getGameTranslation();
 * const passageText = t('forest.description');
 * ```
 */
export const getGameTranslation = (namespace: string = "passages") => {
    // Use i18next.language to get the current language dynamically
    return i18next.getFixedT(i18next.language, namespace);
};
