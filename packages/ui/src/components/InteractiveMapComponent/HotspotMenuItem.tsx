"use client";

import { LabelHotspot } from "@react-text-game/core";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

import { Button, Tooltip } from "#components";
import { callIfFunction } from "#components/InteractiveMapComponent/helpers";

export type HotspotMenuItemProps = {
    item: LabelHotspot;
};

export const HotspotMenuItem = ({ item }: HotspotMenuItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const tooltipContent = callIfFunction(item.tooltip?.content);
    const isDisabled = callIfFunction(item.isDisabled) || false;
    const content = callIfFunction(item.content);

    return (
        <>
            <div ref={ref}>
                <Button
                    className={twMerge(
                        "w-full",
                        item.props?.classNames?.button
                    )}
                    variant={item.props?.variant}
                    color={item.props?.color}
                    disabled={isDisabled}
                    onClick={item.action}
                >
                    {content}
                </Button>
            </div>
            <Tooltip
                targetRef={ref}
                content={tooltipContent}
                placement={item.tooltip?.position || "top"}
                disabled={!tooltipContent}
            />
        </>
    );
};
