"use client";

import { useEffect, useRef, useState } from "react";

import {
    ImagePositionInfo,
    UseHotspotMapSizeProps,
    UseHotspotMapSizeResult,
} from "./types";

export const useHotspotMapSize = ({
    isLoading,
    naturalWidth,
    naturalHeight,
}: UseHotspotMapSizeProps): UseHotspotMapSizeResult => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const [positionInfo, setPositionInfo] = useState<ImagePositionInfo>({
        scaleFactor: 1,
        offsetLeft: 0,
        offsetTop: 0,
        scaledWidth: 0,
        scaledHeight: 0,
    });

    // Update dimensions whenever the container size changes
    useEffect(() => {
        const updateSize = (): void => {
            if (
                !containerRef.current ||
                !imageRef.current ||
                naturalWidth === 0 ||
                naturalHeight === 0
            )
                return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;

            // Calculate scale ratios for both dimensions
            const widthRatio = containerWidth / naturalWidth;
            const heightRatio = containerHeight / naturalHeight;

            // Use the smaller ratio to ensure the image fits entirely
            const scaleFactor = Math.min(widthRatio, heightRatio);

            const scaledWidth = naturalWidth * scaleFactor;
            const scaledHeight = naturalHeight * scaleFactor;

            // Calculate margins to center the image
            const marginLeft = (containerWidth - scaledWidth) / 2;
            const marginTop = (containerHeight - scaledHeight) / 2;

            // Apply dimensions and position to the image
            imageRef.current.style.width = `${scaledWidth}px`;
            imageRef.current.style.height = `${scaledHeight}px`;
            imageRef.current.style.marginLeft = `${marginLeft}px`;
            imageRef.current.style.marginTop = `${marginTop}px`;

            // Update position info for hotspots
            setPositionInfo({
                scaleFactor,
                offsetLeft: marginLeft,
                offsetTop: marginTop,
                scaledWidth,
                scaledHeight,
            });
        };

        if (!isLoading && containerRef.current && imageRef.current) {
            // Initial size update
            updateSize();

            // Set up ResizeObserver to detect any size changes in the container
            resizeObserverRef.current = new ResizeObserver(() => {
                updateSize();
            });

            resizeObserverRef.current.observe(containerRef.current);

            // Also listen for window resize as a fallback
            window.addEventListener("resize", updateSize);
        }

        return () => {
            // Clean up
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            window.removeEventListener("resize", updateSize);
        };
    }, [isLoading, naturalWidth, naturalHeight]);

    return {
        containerRef,
        imageRef,
        positionInfo,
    };
};
