import { ActionType as CoreAction } from "@react-text-game/core";

export type ActionProps = Readonly<{
    children: string;
    onPerform: () => void;
}> &
    Omit<CoreAction, "label" | "action">;

export const Action = (props: ActionProps) => (
    <>
        { props }
    </>
);

export type ActionType = typeof Action;
