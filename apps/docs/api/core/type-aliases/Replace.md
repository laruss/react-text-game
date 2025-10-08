# Type Alias: Replace\<T, K, TReplace\>

> **Replace**\<`T`, `K`, `TReplace`\> = `Identity`\<`Pick`\<`T`, `Exclude`\<keyof `T`, `K`\>\> & `{ [P in K]: TReplace }`\>

Defined in: types.ts:8

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### TReplace

`TReplace`
