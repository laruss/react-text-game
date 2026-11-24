# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
