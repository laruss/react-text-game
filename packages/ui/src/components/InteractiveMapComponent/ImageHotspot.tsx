"use client";

import {
    ImageHotspot as ImageHotspotType,
    MapImageHotspot,
} from "@react-text-game/core/passages";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { callIfFunction } from "./helpers";

type ImageHotspotProps = {
    hotspot: MapImageHotspot | ImageHotspotType;
};

export const ImageHotspot = ({ hotspot }: ImageHotspotProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const classNames = hotspot.props?.classNames || {};

    const isDisabled = callIfFunction(hotspot.isDisabled);

    const content = useMemo(
        () => ({
            idle: callIfFunction(hotspot.content.idle),
            hover: callIfFunction(hotspot.content.hover),
            active: callIfFunction(hotspot.content.active),
            disabled: callIfFunction(hotspot.content.disabled),
        }),
        [hotspot.content]
    );

    return (
        <button
            className={twMerge(
                "cursor-pointer disabled:cursor-not-allowed relative",
                classNames.container
            )}
            style={{ zoom: hotspot.props?.zoom || "100%" }}
            disabled={isDisabled}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => {
                setIsActive(true);
                hotspot.action();
                setTimeout(() => setIsActive(false), 100);
            }}
        >
            {isActive && content.active ? (
                <img
                    className={classNames.active}
                    src={content.active}
                    alt="hotspot active"
                />
            ) : isHovering && content.hover ? (
                <img
                    className={classNames.hover}
                    src={content.hover}
                    alt="hotspot hover"
                />
            ) : isDisabled && content.disabled ? (
                <img
                    className={classNames.disabled}
                    src={content.disabled}
                    alt="hotspot disabled"
                />
            ) : (
                <img
                    className={classNames.idle}
                    src={content.idle}
                    alt={hotspot.id || "hotspot"}
                />
            )}
        </button>
    );
};
