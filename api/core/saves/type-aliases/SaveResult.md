# Type Alias: SaveResult\<TData\>

> **SaveResult**\<`TData`\> = `object` & `TData` \| `object` & `TData`

Defined in: [packages/core/src/saves/types.ts:116](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/types.ts#L116)

Result of every save operation, discriminated on `success`.

## Type Parameters

### TData

`TData` = `unknown`

Extra fields carried by both branches, so a caller can
read them without narrowing first.

## Example

```ts
const result = await slot.save({ title: "Chapter 2" });
if (!result.success && result.code !== "cancelled") {
    toast(result.error);
}
```
