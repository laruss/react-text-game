"use client";

import {
    AnyHotspot,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "@react-text-game/core/passages";

type Props = {
    hotspots: Array<AnyHotspot>;
};

type SideHotspot = SideLabelHotspot | SideImageHotspot;

type ReturnType = {
    mapHotspots: Array<MapLabelHotspot | MapImageHotspot>;
    topHotspots: Array<SideHotspot>;
    bottomHotspots: Array<SideHotspot>;
    leftHotspots: Array<SideHotspot>;
    rightHotspots: Array<SideHotspot>;
    menu: Array<MapMenu>;
};

export const useSortHotspots = ({ hotspots }: Props): ReturnType => {
    const sideHotspots = hotspots.filter(
        (hotspot): hotspot is SideLabelHotspot | SideImageHotspot =>
            !("position" in hotspot)
    );

    return {
        mapHotspots: hotspots.filter(
            (hotspot): hotspot is MapLabelHotspot | MapImageHotspot =>
                "position" in hotspot && hotspot.type !== "menu"
        ),
        topHotspots: sideHotspots.filter(
            (hotspot) => hotspot.position === "top"
        ),
        bottomHotspots: sideHotspots.filter(
            (hotspot) => hotspot.position === "bottom"
        ),
        leftHotspots: sideHotspots.filter(
            (hotspot) => hotspot.position === "left"
        ),
        rightHotspots: sideHotspots.filter(
            (hotspot) => hotspot.position === "right"
        ),
        menu: hotspots.filter(
            (hotspot): hotspot is MapMenu => hotspot.type === "menu"
        ),
    };
};
