"use client";

import type { MapImage as MapImageType } from "@react-text-game/core/passages";
import { twMerge } from "tailwind-merge";

import { callIfFunction } from "./helpers";
import type { ImagePositionInfo } from "./types";

export type MapImageProps = Readonly<{
    mapImage: MapImageType;
    imagePositionInfo?: ImagePositionInfo;
}>;

/** Renders a decorative map image without pointer or keyboard interaction. */
export const MapImage = ({ mapImage, imagePositionInfo }: MapImageProps) => {
    const scaleFactor = imagePositionInfo?.scaleFactor ?? 1;
    const zoom = Number.parseFloat(mapImage.props?.zoom ?? "100%") / 100;
    const classNames = mapImage.props?.classNames;

    return (
        <div
            id={mapImage.id}
            data-map-entity="image"
            className={twMerge("relative", classNames?.container)}
            style={{
                transform: `scale(${scaleFactor * zoom})`,
                transformOrigin: "center center",
            }}
        >
            <img
                className={twMerge("max-w-none", classNames?.image)}
                src={callIfFunction(mapImage.content)}
                alt={mapImage.props?.alt ?? mapImage.id ?? ""}
            />
        </div>
    );
};
