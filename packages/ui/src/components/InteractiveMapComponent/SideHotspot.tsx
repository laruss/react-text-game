"use client";

import {
    SideImageHotspot,
    SideLabelHotspot,
} from "@react-text-game/core/passages";

import { Tooltip } from "#components/common";

import { callIfFunction } from "./helpers";
import { ImageHotspot } from "./ImageHotspot";
import { LabelHotspot } from "./LabelHotspot";

type Props = {
    hotspot: SideLabelHotspot | SideImageHotspot;
};

export const SideHotspot = ({ hotspot }: Props) => {
    const tooltipContent = callIfFunction(hotspot.tooltip?.content);

    return (
        <Tooltip
            content={tooltipContent}
            placement={hotspot.tooltip?.position || "top"}
            disabled={!tooltipContent}
        >
            <div>
                {hotspot.type === "image" ? (
                    <ImageHotspot hotspot={hotspot} />
                ) : hotspot.type === "label" ? (
                    <LabelHotspot hotspot={hotspot} />
                ) : (
                    <div>Unknown Hotspot Type</div>
                )}
            </div>
        </Tooltip>
    );
};
