# Type Alias: Replace\<T, K, TReplace\>

> **Replace**\<`T`, `K`, `TReplace`\> = [`Identity`](Identity.md)\<`Pick`\<`T`, `Exclude`\<keyof `T`, `K`\>\> & `{ [P in K]: TReplace }`\>

Defined in: [types.ts:8](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/types.ts#L8)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### TReplace

`TReplace`
