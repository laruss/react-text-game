import { ActionsComponent } from "@react-text-game/core";

import type { ActionType } from "./Action";

type ActionsProps = Readonly<{
    children: ActionType | ActionType[];
}> &
    ActionsComponent["props"];

/**
 * Container for action buttons in MDX stories.
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into core game components. Using it in React components
 * will not work as expected.
 */
export const Actions = (props: ActionsProps) => <>{props}</>;
