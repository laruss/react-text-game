# Type Alias: TextInput

> **TextInput** = [`StaticText`](StaticText.md) \| `ReactNode`

Defined in: [types.ts:81](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/types.ts#L81)

Text an author may pass to a message beat.

A `string` or `number` is frozen as-is, [I18nText](I18nText.md) re-translates, and
anything else (a React node, an element array) is stored as a
[RefText](RefText.md) pointing back at the beat.
