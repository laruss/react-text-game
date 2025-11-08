"use client";

import { MaybeCallable } from "@react-text-game/core";
import {
    ImageHotspot as ImageHotspotType,
    ImageHotspotContentObject,
    MapImageHotspot,
} from "@react-text-game/core/passages";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { callIfFunction } from "./helpers";
import { ImagePositionInfo } from "./types";

type ImageHotspotProps = {
    hotspot: MapImageHotspot | ImageHotspotType;
    imagePositionInfo?: ImagePositionInfo;
};

export const ImageHotspot = ({
    hotspot,
    imagePositionInfo,
}: ImageHotspotProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const classNames = hotspot.props?.classNames || {};

    const isDisabled = callIfFunction(hotspot.isDisabled);

    const content = useMemo(() => {
        const isObject = typeof hotspot.content === "object";
        if (!isObject) {
            const stringContent = hotspot.content as MaybeCallable<string>;
            return {
                idle: callIfFunction(stringContent), hover: undefined, active: undefined, disabled: undefined };
        }
        const content = hotspot.content as ImageHotspotContentObject;

        return {
            idle: callIfFunction(content.idle),
            hover: callIfFunction(content.hover),
            active: callIfFunction(content.active),
            disabled: callIfFunction(content.disabled),
        };
    }, [hotspot.content]);

    // Calculate the combined scale factor from both the map scaling and custom zoom
    const combinedScale = useMemo(() => {
        const scaleFactor = imagePositionInfo?.scaleFactor ?? 1;
        const customZoom = hotspot.props?.zoom || "100%";
        const zoomValue = parseFloat(customZoom) / 100;
        return scaleFactor * zoomValue;
    }, [imagePositionInfo?.scaleFactor, hotspot.props?.zoom]);

    return (
        <button
            className={twMerge(
                "cursor-pointer disabled:cursor-not-allowed relative",
                classNames.container
            )}
            style={{
                transform: `scale(${combinedScale})`,
                transformOrigin: "center center",
            }}
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
