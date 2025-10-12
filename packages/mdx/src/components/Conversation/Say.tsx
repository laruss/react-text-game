import { ConversationBubble } from "@react-text-game/core";
import { ReactNode } from "react";

export type SayProps = Readonly<{
    children: ReactNode;
}> &
    Pick<ConversationBubble, "who" | "color" | "side"> &
    ConversationBubble["props"];

export const Say = (props: SayProps) => <>{props}</>;

export type SayComponent = typeof Say;
