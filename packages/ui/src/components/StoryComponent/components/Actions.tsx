"use client";

import { ActionsComponent, ActionType } from "@react-text-game/core/passages";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "#components/common/Button";
import { Tooltip } from "#components/common/Tooltip";

export type ActionsProps = Readonly<{
    component: ActionsComponent;
}>;

const Action = ({ action }: { action: ActionType }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={ref}>
                <Button
                    color={action.color}
                    variant={action.variant}
                    className={action.className}
                    disabled={action.isDisabled}
                    onClick={action.action}
                >
                    {action.label}
                </Button>
            </div>
            <Tooltip
                targetRef={ref}
                content={action.tooltip?.content}
                placement={action.tooltip?.position}
                disabled={!action.tooltip?.content}
                className={action.tooltip?.className}
            />
        </>
    );
};

export const Actions = ({ component }: ActionsProps) => (
    <div
        id="actions-content"
        className={twMerge(
            "flex flex-wrap gap-2 justify-center items-center",
            component.props?.direction === "vertical" ? "flex-col" : "flex-row",
            component.props?.className
        )}
    >
        {component.content.map((action, index) => (
            <Action action={action} key={index} />
        ))}
    </div>
);
