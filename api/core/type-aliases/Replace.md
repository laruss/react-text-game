# Type Alias: Replace\<T, K, TReplace\>

> **Replace**\<`T`, `K`, `TReplace`\> = [`Identity`](Identity.md)\<`Pick`\<`T`, `Exclude`\<keyof `T`, `K`\>\> & `{ [P in K]: TReplace }`\>

Defined in: [packages/core/src/types.ts:8](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/types.ts#L8)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### TReplace

`TReplace`
