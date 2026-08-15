# Type Alias: Conditional\<T\>

> **Conditional**\<`T`\> = `T` \| `false` \| `null` \| `undefined`

Defined in: [scripts/types.ts:18](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/messenger/src/scripts/types.ts#L18)

A value that may be omitted from a beat array.

Falsy entries are skipped when the cursor reaches them, which lets conditional
beats be written inline with `&&`.

## Type Parameters

### T

`T`
