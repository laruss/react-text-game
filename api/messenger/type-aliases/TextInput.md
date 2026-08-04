# Type Alias: TextInput

> **TextInput** = [`StaticText`](StaticText.md) \| `ReactNode`

Defined in: [types.ts:81](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L81)

Text an author may pass to a message beat.

A `string` or `number` is frozen as-is, [I18nText](I18nText.md) re-translates, and
anything else (a React node, an element array) is stored as a
[RefText](RefText.md) pointing back at the beat.
