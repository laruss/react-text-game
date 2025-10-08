"use client";

import {
    LabelHotspot as LabelHotspotType,
    MapLabelHotspot,
} from "@react-text-game/core/passages";

import { Button } from "#components/common";

import { callIfFunction } from "./helpers";

type LabelHotspotProps = {
    hotspot: MapLabelHotspot | LabelHotspotType;
};

export const LabelHotspot = ({ hotspot }: LabelHotspotProps) => {
    const content = callIfFunction(hotspot.content);
    const isDisabled = callIfFunction(hotspot.isDisabled);

    return (
        <div>
            <Button
                onClick={() => hotspot.action()}
                disabled={isDisabled}
                className={hotspot.props?.classNames?.button}
                variant={hotspot.props?.variant}
                color={hotspot.props?.color}
            >
                {content}
            </Button>
        </div>
    );
};
