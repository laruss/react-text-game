# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
