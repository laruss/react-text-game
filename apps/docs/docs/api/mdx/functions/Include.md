# Function: Include()

> **Include**(`props`): `Element`

Defined in: [mdx/src/components/Include.tsx:14](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/mdx/src/components/Include.tsx#L14)

Component for including another story passage within the current one.

## Parameters

### props

`IncludeProps`

## Returns

`Element`

## Remarks

**WARNING: This is a compile-time-only component for MDX files.**
Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
and is transformed at compile time into core game components. Using it in React components
will not work as expected.
