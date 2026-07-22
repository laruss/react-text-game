# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
