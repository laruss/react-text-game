# Type Alias: Replace\<T, K, TReplace\>

> **Replace**\<`T`, `K`, `TReplace`\> = [`Identity`](Identity.md)\<`Pick`\<`T`, `Exclude`\<keyof `T`, `K`\>\> & `{ [P in K]: TReplace }`\>

Defined in: [packages/core/src/types.ts:8](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/types.ts#L8)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### TReplace

`TReplace`
