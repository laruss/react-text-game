"use client";

import { ReactNode, SyntheticEvent, useState } from "react";

import { Spinner } from "#components/common/Spinner";

import { handleMapClick, renderChildren } from "./helpers";
import { useHotspotMapSize } from "./useHotspotMapSize";

type HotspotMapProps = {
    imageUrl: string;
    children?: ReactNode;
};

export const HotspotMap = ({ imageUrl, children }: HotspotMapProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [naturalDimensions, setNaturalDimensions] = useState({
        width: 0,
        height: 0,
    });

    const { containerRef, imageRef, positionInfo } = useHotspotMapSize({
        isLoading,
        naturalWidth: naturalDimensions.width,
        naturalHeight: naturalDimensions.height,
    });

    const handleImageLoad = () => {
        if (imageRef.current) {
            setNaturalDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
            setIsLoading(false);
        }
    };

    const handleImageError = (
        error: SyntheticEvent<HTMLImageElement, Event>
    ) => {
        console.error("Failed to load image:", error);
        setIsLoading(false);
        throw error;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Spinner />
                </div>
            )}
            <div className="relative w-full h-full overflow-hidden">
                <img
                    ref={imageRef}
                    src={imageUrl}
                    className="absolute"
                    style={{
                        opacity: isLoading ? 0 : 1,
                        transition: "opacity 0.3s ease",
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    alt="Exploration map"
                    onClick={(e) => handleMapClick(e, imageRef)}
                />
            </div>
            {!isLoading && (
                <div>{renderChildren({ positionInfo, children })}</div>
            )}
        </div>
    );
};
