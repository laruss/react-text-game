# Type Alias: TextInput

> **TextInput** = [`StaticText`](StaticText.md) \| `ReactNode`

Defined in: [types.ts:81](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/messenger/src/types.ts#L81)

Text an author may pass to a message beat.

A `string` or `number` is frozen as-is, [I18nText](I18nText.md) re-translates, and
anything else (a React node, an element array) is stored as a
[RefText](RefText.md) pointing back at the beat.
