# Type Alias: I18nConfig

> **I18nConfig** = `object`

Defined in: [types.ts:8](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L8)

Configuration options for initializing the i18n system in the game engine.
This type defines all available settings for internationalization, including
language preferences, translation resources, and optional i18next modules.

## Properties

### debug?

> `optional` **debug**: `boolean`

Defined in: [types.ts:28](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L28)

Enable debug mode for i18next. When enabled, logs translation keys and warnings
to the console, and includes the special "cimode" language in available languages.

#### Default

```ts
false
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [types.ts:14](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L14)

The default language code to use when no saved language preference exists.
Should be an ISO 639-1 language code (e.g., "en", "ru", "de").

#### Default

```ts
"en"
```

***

### fallbackLanguage?

> `optional` **fallbackLanguage**: `string`

Defined in: [types.ts:21](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L21)

The fallback language code to use when a translation is missing in the current language.
Should be an ISO 639-1 language code (e.g., "en", "ru", "de").

#### Default

```ts
"en"
```

***

### modules?

> `optional` **modules**: `Module`[]

Defined in: [types.ts:57](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L57)

Optional array of i18next modules/plugins to extend functionality.
Common modules include i18next-http-backend, i18next-browser-languagedetector, etc.
The initReactI18next module is already included by default.

#### Default

```ts
[]
```

#### See

https://www.i18next.com/overview/plugins-and-utils

***

### resources?

> `optional` **resources**: `Resource`

Defined in: [types.ts:48](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/i18n/types.ts#L48)

Translation resources organized by language and namespace.
Structure: `{ [languageCode]: { [namespace]: { [key]: translation } } }`
Example:
```typescript
{
  en: {
    common: { greeting: "Hello" },
    passages: { intro: "Welcome to the game" }
  },
  ru: {
    common: { greeting: "Привет" },
    passages: { intro: "Добро пожаловать в игру" }
  }
}
```

#### Default

```ts
{}
```
