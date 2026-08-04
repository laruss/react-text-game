# Function: t()

> **t**(`key`, `params?`): [`I18nText`](../type-aliases/I18nText.md)

Defined in: [text.ts:43](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/text.ts#L43)

Marks a translation key as a message's text.

The key is resolved every time the message is read, so switching language
re-translates messages that were delivered long ago. Interpolation values are
captured when the message is delivered and never change afterwards.

## Parameters

### key

`string`

Translation key, optionally prefixed with `"namespace:"`

### params?

[`Params`](../type-aliases/Params.md)

Interpolation values, frozen at delivery time

## Returns

[`I18nText`](../type-aliases/I18nText.md)

## Example

```typescript
m.from(anna).text(m.t("anna.opener", { name: player.name }))
m.from(anna).text(m.t("common:greeting"))
```
