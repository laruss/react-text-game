# Function: Include()

> **Include**(`props`): `Element`

Defined in: [mdx/src/components/Include.tsx:14](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/mdx/src/components/Include.tsx#L14)

Component for including another story passage within the current one.

## Parameters

### props

[`IncludeProps`](../type-aliases/IncludeProps.md)

## Returns

`Element`

## Remarks

**WARNING: This is a compile-time-only component for MDX files.**
Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
and is transformed at compile time into core game components. Using it in React components
will not work as expected.
