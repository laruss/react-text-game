"use client";

import type {
    AnyHotspot,
    MapImage,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "@react-text-game/core/passages";
import { useMemo } from "react";

type Props = {
    hotspots: Array<AnyHotspot>;
};

type SideHotspot = SideLabelHotspot | SideImageHotspot;

type ReturnType = {
    mapHotspots: Array<MapImage | MapLabelHotspot | MapImageHotspot>;
    topHotspots: Array<SideHotspot>;
    bottomHotspots: Array<SideHotspot>;
    leftHotspots: Array<SideHotspot>;
    rightHotspots: Array<SideHotspot>;
    menu: Array<MapMenu>;
};

export const sortHotspots = (hotspots: Array<AnyHotspot>): ReturnType => {
    const result: ReturnType = {
        mapHotspots: [],
        topHotspots: [],
        bottomHotspots: [],
        leftHotspots: [],
        rightHotspots: [],
        menu: [],
    };

    for (const hotspot of hotspots) {
        if (hotspot.type === "menu") {
            result.menu.push(hotspot);
        } else if (typeof hotspot.position !== "string") {
            result.mapHotspots.push(hotspot);
        } else {
            result[`${hotspot.position}Hotspots`].push(hotspot);
        }
    }

    return result;
};

export const useSortHotspots = ({ hotspots }: Props): ReturnType =>
    useMemo(() => sortHotspots(hotspots), [hotspots]);
