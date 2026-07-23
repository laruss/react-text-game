# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
