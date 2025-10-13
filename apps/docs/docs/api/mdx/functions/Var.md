# Function: Var()

> **Var**(`__namedParameters`): `Element`

Defined in: [mdx/src/components/Var.tsx:28](https://github.com/laruss/react-text-game/blob/6b9098a8e439fedc8e81574fd40f3e2840d770e8/packages/mdx/src/components/Var.tsx#L28)

Component for embedding variables in MDX text content.
Variables are evaluated at runtime when the story is rendered.

## Parameters

### \_\_namedParameters

[`VarProps`](../type-aliases/VarProps.md)

## Returns

`Element`

## Example

```mdx
import { player } from '../entities/player';

# Hello, <Var>{player.name}</Var>!

You have <Var>{player.gold}</Var> gold coins.
```

## Remarks

**WARNING: This is a compile-time-only component for MDX files.**
Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
and is transformed at compile time into template literals. Using it in React components
will not work as expected.

This component is only used for type checking and IDE support in MDX files.
