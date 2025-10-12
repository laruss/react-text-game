import { ActionsComponent } from "@react-text-game/core";

import type { ActionType } from "./Action";

type ActionsProps = Readonly<{
    children: ActionType | ActionType[];
}> &
    ActionsComponent["props"];

export const Actions = (props: ActionsProps) => <>{props}</>;
