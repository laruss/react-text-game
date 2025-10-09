import { ActionsComponent } from "@react-text-game/core/passages";
import { twMerge } from "tailwind-merge";

import { Button } from "#components/common/Button";
import { Tooltip } from "#components/common/Tooltip";

export type ActionsProps = Readonly<{
    component: ActionsComponent;
}>;

export const Actions = ({ component }: ActionsProps) => (
    <div
        className={twMerge(
            "flex flex-wrap gap-2 justify-center items-center",
            component.props?.direction === "vertical" ? "flex-col" : "flex-row",
            component.props?.className
        )}
    >
        {component.content.map((action, index) => (
            <Tooltip
                key={index}
                disabled={!action.tooltip?.content}
                content={action.tooltip?.content}
                className={action.tooltip?.className}
                placement={action.tooltip?.position}
            >
                <div>
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
            </Tooltip>
        ))}
    </div>
);
