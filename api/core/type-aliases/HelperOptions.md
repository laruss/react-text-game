# Type Alias: HelperOptions\<T\>

> **HelperOptions**\<`T`\> = `Omit`\<`T`, `"props"`\> & `T` *extends* `object` ? `NonNullable`\<`TProps`\> : `unknown`

Defined in: [packages/core/src/passages/definition.ts:55](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/passages/definition.ts#L55)

Flattens a component or hotspot type into the single options bag its helper
accepts: everything nested under `props` is hoisted to the top level.

## Type Parameters

### T

`T`

## Remarks

Derived from the source type, so helper options can never drift from the
object shape they build.
