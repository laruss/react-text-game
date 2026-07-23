# Function: LanguageToggle()

> **LanguageToggle**(`__namedParameters`): `Element` \| `null`

Defined in: [components/LanguageToggle.tsx:53](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/ui/src/components/LanguageToggle.tsx#L53)

A themed language toggle dropdown component that opens on hover.
Uses the UI package's semantic theming system for automatic dark mode support.

## Parameters

### \_\_namedParameters

[`LanguageToggleProps`](../type-aliases/LanguageToggleProps.md)

## Returns

`Element` \| `null`

## Example

```tsx
// Basic usage
<LanguageToggle />

// With custom language names
<LanguageToggle
  languageNames={{
    en: 'English',
    ru: 'Русский',
    de: 'Deutsch'
  }}
/>

// With custom styling and code display
<LanguageToggle
  className="custom-class"
  showCode={true}
/>
```
