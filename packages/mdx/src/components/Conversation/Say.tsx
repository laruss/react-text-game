import { ConversationBubble } from "@react-text-game/core";
import { ReactNode } from "react";

export type SayProps = Readonly<{
    children: ReactNode;
}> &
    Pick<ConversationBubble, "who" | "color" | "side"> &
    ConversationBubble["props"];

/**
 * Conversation bubble component for MDX stories.
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into core game components. Using it in React components
 * will not work as expected.
 */
export const Say = (props: SayProps) => <>{props}</>;

export type SayComponent = typeof Say;
