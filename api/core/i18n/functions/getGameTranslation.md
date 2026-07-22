# Function: getGameTranslation()

> **getGameTranslation**(`namespace?`): `TFunction`\<`string`, `undefined`\>

Defined in: [utils.ts:84](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/i18n/utils.ts#L84)

Gets a translation function (t) scoped to a specific namespace and the current language.

This function provides a convenient way to get translations outside of React components
(where you would normally use the `useGameTranslation` hook). It uses i18next's `getFixedT`
method to create a translation function bound to the current language and specified namespace.

The translation function updates automatically when the language changes because it reads
`i18next.language` dynamically at call time.

## Parameters

### namespace?

`string` = `"passages"`

The translation namespace to use. Defaults to 'passages'.
                                         Common namespaces include 'passages', 'common', 'ui', etc.

## Returns

`TFunction`\<`string`, `undefined`\>

A translation function that can be used to translate keys
                             within the specified namespace.

## Example

```typescript
// Get translations for passages
const t = getGameTranslation('passages');
const welcomeText = t('intro'); // "Welcome to the game"

// Get translations for common namespace
const tCommon = getGameTranslation('common');
const greeting = tCommon('greeting'); // "Hello"

// Use in non-React contexts (e.g., game logic, utility functions)
const t = getGameTranslation();
const passageText = t('forest.description');
```
