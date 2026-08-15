# Type Alias: Replace\<T, K, TReplace\>

> **Replace**\<`T`, `K`, `TReplace`\> = [`Identity`](Identity.md)\<`Pick`\<`T`, `Exclude`\<keyof `T`, `K`\>\> & `{ [P in K]: TReplace }`\>

Defined in: [packages/core/src/types.ts:8](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/types.ts#L8)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### TReplace

`TReplace`
