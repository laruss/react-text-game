# Variable: m

> `const` **m**: [`MessengerHelpers`](../type-aliases/MessengerHelpers.md)

Defined in: [scripts/builder.ts:112](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/builder.ts#L112)

Beat builders, normally received as the argument of a [defineScript](../functions/defineScript.md)
callback.

Import it directly when a script is split across files and the builders are
needed outside the callback body, or when pushing a message imperatively with
`chat.push()`.

## Example

```typescript
import { defineScript, m } from '@react-text-game/messenger';

const greeting = () => [m.from(anna).text(m.t('anna.hello'))];

defineScript('anna/opener', (m) => [
  ...greeting(),
  m.typing(anna, 1200),
  m.from(anna).text(m.t('anna.followup')),
]);
```
