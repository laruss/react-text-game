import { ConversationComponent } from "@react-text-game/core";

import { SayComponent } from "./Say";

type ConversationProps = Readonly<{
    children: SayComponent | SayComponent[];
}> &
    Pick<ConversationComponent, "appearance"> &
    ConversationComponent["props"];

export const Conversation = (props: ConversationProps) => <>{props}</>;
