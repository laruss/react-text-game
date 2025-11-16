"use client";

import {
    LabelHotspot as LabelHotspotType,
    MapLabelHotspot,
} from "@react-text-game/core/passages";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

import { Button, Placement, Tooltip } from "#components/common";

import { callIfFunction } from "./helpers";

type LabelHotspotProps = {
    hotspot: MapLabelHotspot | LabelHotspotType;
    tooltipContent?: string | undefined;
    tooltipPlacement?: Placement | undefined;
};

export const LabelHotspot = ({
    hotspot,
    tooltipContent,
    tooltipPlacement = "top",
}: LabelHotspotProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const content = callIfFunction(hotspot.content);
    const isDisabled = callIfFunction(hotspot.isDisabled);

    return (
        <>
            <div ref={ref}>
                <Button
                    onClick={() => hotspot.action()}
                    disabled={isDisabled}
                    className={twMerge(
                        "pointer-events-auto",
                        hotspot.props?.classNames?.button
                    )}
                    variant={hotspot.props?.variant}
                    color={hotspot.props?.color}
                >
                    {content}
                </Button>
            </div>
            <Tooltip
                content={tooltipContent}
                placement={tooltipPlacement}
                targetRef={ref}
                disabled={!tooltipContent}
            />
        </>
    );
};
