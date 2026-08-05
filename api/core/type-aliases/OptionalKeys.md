# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
