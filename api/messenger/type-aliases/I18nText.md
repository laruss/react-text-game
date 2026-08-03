# Type Alias: I18nText

> **I18nText** = `object`

Defined in: [types.ts:40](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L40)

A translation key resolved at read time, with its interpolation values frozen
at delivery time.

## Remarks

This is the form to prefer in a localized game: the message re-translates when
the player switches language, while `params` stay exactly as they were when
the message arrived - so "you have 100 gold" never becomes "you have 20 gold"
retroactively.

## Properties

### key

> **key**: `string`

Defined in: [types.ts:42](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L42)

***

### kind

> **kind**: `"i18n"`

Defined in: [types.ts:41](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L41)

***

### params?

> `optional` **params**: [`Params`](Params.md)

Defined in: [types.ts:43](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/messenger/src/types.ts#L43)
