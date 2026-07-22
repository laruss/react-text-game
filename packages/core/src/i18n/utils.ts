import i18next from "i18next";

type UITranslations = Record<string, Record<string, object>>;
type UITranslationsImporter = () => Promise<{
    readonly uiTranslations: UITranslations;
}>;

/** @internal */
export async function _loadUITranslationsFrom(
    importUITranslations: UITranslationsImporter
): Promise<UITranslations> {
    try {
        const { uiTranslations } = await importUITranslations();
        return uiTranslations;
    } catch (_e) {
        // UI package isn't installed - this is expected for users with custom UIs
        return {};
    }
}

/**
 * Safely loads UI translations from the @react-text-game/ui package.
 *
 * This function attempts to dynamically import translations from the UI package.
 * If the UI package is not installed (which is expected for games using custom UIs),
 * it returns an empty object instead of throwing an error.
 *
 * The returned translations are organized by language code and namespace:
 * `{ [languageCode]: { [namespace]: { [key]: translation } } }`
 *
 * @returns {Promise<Record<string, Record<string, object>>>} A promise that resolves to
 *          UI translations organized by language and namespace, or an empty object if
 *          the UI package is not installed.
 *
 * @example
 * ```typescript
 * const uiTranslations = await loadUITranslations();
 * // Returns: { en: { ui: { save: "Save", load: "Load" } }, ru: { ui: { save: "Сохранить" } } }
 * // Or: {} (if UI package not installed)
 * ```
 */
export function loadUITranslations(): Promise<UITranslations> {
    return _loadUITranslationsFrom(async () => {
        // UI package is a peer dependency and may not be installed.
        // This dynamic import will fail gracefully at runtime if UI package is not available.
        // The optional peer may not resolve while compiling this package standalone.
        // biome-ignore lint/suspicious/noTsIgnore: this optional peer import may or may not resolve for consumers.
        // @ts-ignore
        return import("@react-text-game/ui/i18n");
    });
}

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
