# Function: initI18n()

> **initI18n**(`config?`): `Promise`\<`void`\>

Defined in: [init.ts:70](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/i18n/init.ts#L70)

Initializes the i18n (internationalization) system for the game engine.

This function sets up i18next with the provided configuration, automatically loads
UI translations from the @react-text-game/ui package (if installed), and merges them
with user-provided translation resources. It also loads the user's saved language
preference from the database.

The initialization process:
1. Loads UI translations from the UI package (if available)
2. Merges user resources with UI translations (user translations take precedence)
3. Loads the saved language preference from the database
4. Initializes i18next with the merged resources and saved language
5. Registers any additional i18next modules provided in the config

**Important:** This function should be called once during game initialization,
typically before rendering any UI components.

## Parameters

### config?

[`I18nConfig`](../type-aliases/I18nConfig.md)

Optional configuration object. If not provided,
                               uses DEFAULT_CONFIG (English as default/fallback language).

## Returns

`Promise`\<`void`\>

A promise that resolves when i18n initialization is complete.

## Example

```typescript
// Basic initialization with default config (English)
await initI18n();

// Initialize with custom configuration
await initI18n({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  debug: false,
  resources: {
    en: {
      passages: { intro: 'Welcome to the game' },
      common: { save: 'Save', load: 'Load' }
    },
    ru: {
      passages: { intro: 'Добро пожаловать в игру' },
      common: { save: 'Сохранить', load: 'Загрузить' }
    }
  }
});

// With additional i18next modules
import LanguageDetector from 'i18next-browser-languagedetector';

await initI18n({
  defaultLanguage: 'en',
  resources: { ... },
  modules: [LanguageDetector]
});
```

## See

 - [I18nConfig](../type-aliases/I18nConfig.md) for configuration options
 - [useGameTranslation](useGameTranslation.md) for using translations in React components
 - [getGameTranslation](getGameTranslation.md) for using translations outside React components
