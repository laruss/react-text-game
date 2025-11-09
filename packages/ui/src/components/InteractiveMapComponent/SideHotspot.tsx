"use client";

import {
    SideImageHotspot,
    SideLabelHotspot,
} from "@react-text-game/core/passages";

import { callIfFunction } from "./helpers";
import { ImageHotspot } from "./ImageHotspot";
import { LabelHotspot } from "./LabelHotspot";

type Props = {
    hotspot: SideLabelHotspot | SideImageHotspot;
};

export const SideHotspot = ({ hotspot }: Props) => {
    const tooltipContent = callIfFunction(hotspot.tooltip?.content);

    return (
        <div>
            {hotspot.type === "image" ? (
                <ImageHotspot
                    hotspot={hotspot}
                    tooltipContent={tooltipContent}
                    tooltipPlacement={hotspot.tooltip?.position}
                />
            ) : hotspot.type === "label" ? (
                <LabelHotspot
                    hotspot={hotspot}
                    tooltipContent={tooltipContent}
                    tooltipPlacement={hotspot.tooltip?.position}
                />
            ) : (
                <div>Unknown Hotspot Type</div>
            )}
        </div>
    );
};
