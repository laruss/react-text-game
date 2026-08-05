# Type Alias: AssertNoOptionals\<T\>

> **AssertNoOptionals**\<`T`\> = \[[`OptionalKeys`](OptionalKeys.md)\<`T`\>\] *extends* \[`never`\] ? `unknown` : `object`

Defined in: [packages/core/src/types.ts:25](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/core/src/types.ts#L25)

A utility type that enforces the absence of optional keys in a given type `T`.
If `T` contains any optional keys, it will produce a compile-time error listing the keys
that need to be removed or made required.

## Type Parameters

### T

`T`

The object type to be validated for optional keys.
