# Type Alias: Conditional\<T\>

> **Conditional**\<`T`\> = `T` \| `false` \| `null` \| `undefined`

Defined in: [scripts/types.ts:18](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L18)

A value that may be omitted from a beat array.

Falsy entries are skipped when the cursor reaches them, which lets conditional
beats be written inline with `&&`.

## Type Parameters

### T

`T`
