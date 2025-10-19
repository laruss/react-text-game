/**
 * @module i18n
 *
 * Internationalization (i18n) module for the @react-text-game/core engine.
 *
 * This module provides a complete i18n solution built on top of i18next and react-i18next,
 * designed specifically for text-based games. It includes:
 *
 * - **Initialization:** `initI18n()` function to set up i18n with custom configurations
 * - **React Hooks:** `useGameTranslation()` hook for accessing translations in components
 * - **Utility Functions:** `getGameTranslation()` for translations outside React components
 * - **Type Definitions:** TypeScript types for i18n configuration
 * - **Auto-loading:** Automatic loading and merging of UI package translations
 * - **Persistence:** Automatic saving and loading of language preferences
 *
 * ## Quick Start
 *
 * ```typescript
 * import { initI18n, useGameTranslation } from '@react-text-game/core';
 *
 * // 1. Initialize i18n during game startup
 * await initI18n({
 *   defaultLanguage: 'en',
 *   fallbackLanguage: 'en',
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
 * // 2. Use translations in React components
 * function MyPassage() {
 *   const { t } = useGameTranslation('passages');
 *   return <h1>{t('intro')}</h1>;
 * }
 *
 * // 3. Use translations outside React (e.g., in game logic)
 * const t = getGameTranslation('passages');
 * const text = t('intro');
 * ```
 *
 * ## Organization
 *
 * Translations are organized by **language** and **namespace**:
 *
 * - **Language:** ISO 639-1 language code (e.g., 'en', 'ru', 'de')
 * - **Namespace:** Logical grouping of translations (e.g., 'passages', 'common', 'ui')
 *
 * Common namespaces:
 * - `passages` - Story passages and game content
 * - `common` - Shared text across the game
 * - `ui` - UI-specific text (automatically loaded from UI package if installed)
 *
 * @see {@link initI18n} - Initialize the i18n system
 * @see {@link useGameTranslation} - React hook for translations
 * @see {@link getGameTranslation} - Get translations outside React
 * @see {@link I18nConfig} - Configuration type
 */
export * from './hooks';
export * from './init';
export * from './types';
export { getGameTranslation } from './utils';
