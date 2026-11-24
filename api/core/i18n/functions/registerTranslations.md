# Function: registerTranslations()

> **registerTranslations**(`resources`): `void`

Defined in: [registry.ts:48](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/i18n/registry.ts#L48)

Registers default translations contributed by a package.

Companion packages (for example `@react-text-game/ui` and
`@react-text-game/messenger`) ship their own namespace of default strings.
Registering them here means the game author gets working text without
copying resource bundles into `Game.init()`, while still being able to
override any key.

The author's `translations.resources` always take precedence over
registered package defaults.

## Parameters

### resources

`Resource`

i18next resources, keyed by language and then namespace

## Returns

`void`

## Remarks

Call order does not matter. Registering before `Game.init()` folds the
resources into the initial i18next configuration; registering afterwards adds
them through `addResourceBundle` without overwriting existing keys. Calling
this repeatedly accumulates resources, so several packages can contribute.

## Example

```typescript
import { registerTranslations } from '@react-text-game/core/i18n';

registerTranslations({
  en: { myPackage: { greeting: 'Hello' } },
  ru: { myPackage: { greeting: 'Привет' } },
});
```
