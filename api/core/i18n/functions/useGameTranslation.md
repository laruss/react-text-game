# Function: useGameTranslation()

> **useGameTranslation**(`namespace?`): `object`

Defined in: [hooks/useGameTranslation.ts:79](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/i18n/hooks/useGameTranslation.ts#L79)

React hook for accessing translation functionality within game components.

This hook provides a translation function (`t`), the current language, available languages,
and a method to change the language. It's the primary way to use i18n in React components.

The hook automatically:
- Re-renders components when the language changes
- Persists language changes to the database
- Filters out the "cimode" debug language (unless debug mode is enabled)

## Parameters

### namespace?

`string` = `"passages"`

The translation namespace to use. Defaults to 'passages'.
                                         Common namespaces include 'passages', 'common', 'ui', etc.

## Returns

An object containing translation utilities:

### changeLanguage()

> **changeLanguage**: (`lang`) => `Promise`\<`void`\>

Changes the current language and persists the preference to the database.

#### Parameters

##### lang

`string`

ISO 639-1 language code (e.g., 'en', 'ru', 'de')

#### Returns

`Promise`\<`void`\>

### currentLanguage

> **currentLanguage**: `string` = `i18n.language`

### languages

> **languages**: readonly `string`[] = `filteredLanguages`

### t

> **t**: `TFunction`\<`string`, `undefined`\>

## Example

```typescript
// Basic usage in a React component
function MyPassage() {
  const { t } = useGameTranslation('passages');

  return (
    <div>
      <h1>{t('intro')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

// Language switcher component
function LanguageSwitcher() {
  const { currentLanguage, languages, changeLanguage } = useGameTranslation();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  );
}

// With interpolation
function Greeting() {
  const { t } = useGameTranslation('common');

  // Translation: "Hello, {{name}}!"
  return <p>{t('greeting', { name: 'Player' })}</p>;
  // Output: "Hello, Player!"
}

// Different namespace
function UIComponent() {
  const { t } = useGameTranslation('ui');

  return <button>{t('save')}</button>;
}
```

## See

 - [initI18n](initI18n.md) for initializing the i18n system
 - [getGameTranslation](getGameTranslation.md) for using translations outside React components
