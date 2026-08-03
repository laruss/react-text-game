# Function: registerTranslations()

> **registerTranslations**(`resources`): `void`

Defined in: [registry.ts:47](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/core/src/i18n/registry.ts#L47)

Registers default translations contributed by a package.

Companion packages (for example `@react-text-game/messenger`) ship their own
namespace of default strings. Registering them here means the game author
gets working text without copying resource bundles into `Game.init()`, while
still being able to override any key.

Precedence is: registered package defaults, then `@react-text-game/ui`
defaults, then the author's `translations.resources` - the author always wins.

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
