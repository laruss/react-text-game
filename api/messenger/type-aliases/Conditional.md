# Type Alias: Conditional\<T\>

> **Conditional**\<`T`\> = `T` \| `false` \| `null` \| `undefined`

Defined in: [scripts/types.ts:18](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/messenger/src/scripts/types.ts#L18)

A value that may be omitted from a beat array.

Falsy entries are skipped when the cursor reaches them, which lets conditional
beats be written inline with `&&`.

## Type Parameters

### T

`T`
