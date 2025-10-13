import { ReactNode } from "react";

export type VarProps = Readonly<{
    children: ReactNode;
}>;

/**
 * Component for embedding variables in MDX text content.
 * Variables are evaluated at runtime when the story is rendered.
 *
 * @example
 * ```mdx
 * import { player } from '../entities/player';
 *
 * # Hello, <Var>{player.name}</Var>!
 *
 * You have <Var>{player.gold}</Var> gold coins.
 * ```
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into template literals. Using it in React components
 * will not work as expected.
 *
 * This component is only used for type checking and IDE support in MDX files.
 */
export const Var = ({ children }: VarProps) => <>{children}</>;
