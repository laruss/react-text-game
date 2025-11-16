import { ActionType as CoreAction } from "@react-text-game/core";

export type ActionProps = Readonly<{
    children: string;
    onPerform: () => void;
}> &
    Omit<CoreAction, "label" | "action">;

/**
 * Action button component for MDX stories.
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into core game components. Using it in React components
 * will not work as expected.
 */
export const Action = (props: ActionProps) => <>{props}</>;

export type ActionType = typeof Action;
