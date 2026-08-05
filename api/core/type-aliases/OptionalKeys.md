# Type Alias: OptionalKeys\<T\>

> **OptionalKeys**\<`T`\> = `{ [K in keyof T]-?: object extends Pick<T, K> ? K : never }`\[keyof `T`\]

Defined in: [packages/core/src/types.ts:14](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/types.ts#L14)

## Type Parameters

### T

`T`
