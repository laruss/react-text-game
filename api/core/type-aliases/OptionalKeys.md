# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
