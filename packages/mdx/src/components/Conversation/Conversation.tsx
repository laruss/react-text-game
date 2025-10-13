import { ConversationComponent } from "@react-text-game/core";

import { SayComponent } from "./Say";

type ConversationProps = Readonly<{
    children: SayComponent | SayComponent[];
}> &
    Pick<ConversationComponent, "appearance"> &
    ConversationComponent["props"];

/**
 * Conversation container component for MDX stories.
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into core game components. Using it in React components
 * will not work as expected.
 */
export const Conversation = (props: ConversationProps) => <>{props}</>;
