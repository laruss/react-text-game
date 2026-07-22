"use client";

import type {
    MapImage,
    MapImageHotspot,
    MapLabelHotspot,
} from "@react-text-game/core/passages";

import { callIfFunction, getMapPositionStyle } from "./helpers";
import { ImageHotspot } from "./ImageHotspot";
import { LabelHotspot } from "./LabelHotspot";
import { MapImage as MapImageComponent } from "./MapImage";
import type { ImagePositionInfo } from "./types";

type HotspotProps = {
    hotspot: MapImage | MapImageHotspot | MapLabelHotspot;
    imagePositionInfo?: ImagePositionInfo;
};

export const Hotspot = ({ hotspot, imagePositionInfo }: HotspotProps) => {
    const position = callIfFunction(hotspot.position);

    return (
        <div
            className="absolute z-10 pointer-events-none"
            id="hotspot-container"
            style={getMapPositionStyle(position, imagePositionInfo)}
        >
            {hotspot.type === "mapImage" ? (
                <MapImageComponent
                    mapImage={hotspot}
                    {...(imagePositionInfo && { imagePositionInfo })}
                />
            ) : hotspot.type === "image" ? (
                <ImageHotspot
                    hotspot={hotspot}
                    tooltipContent={callIfFunction(hotspot.tooltip?.content)}
                    tooltipPlacement={hotspot.tooltip?.position}
                    {...(imagePositionInfo && { imagePositionInfo })}
                />
            ) : hotspot.type === "label" ? (
                <LabelHotspot
                    hotspot={hotspot}
                    tooltipContent={callIfFunction(hotspot.tooltip?.content)}
                    tooltipPlacement={hotspot.tooltip?.position}
                />
            ) : (
                <div>Unknown Hotspot Type</div>
            )}
        </div>
    );
};
