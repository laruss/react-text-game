# Type Alias: TextInput

> **TextInput** = [`StaticText`](StaticText.md) \| `ReactNode`

Defined in: [types.ts:81](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/messenger/src/types.ts#L81)

Text an author may pass to a message beat.

A `string` or `number` is frozen as-is, [I18nText](I18nText.md) re-translates, and
anything else (a React node, an element array) is stored as a
[RefText](RefText.md) pointing back at the beat.
