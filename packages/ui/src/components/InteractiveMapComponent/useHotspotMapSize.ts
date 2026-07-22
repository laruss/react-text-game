"use client";

import { useEffect, useRef, useState } from "react";

import type {
    ImagePositionInfo,
    UseHotspotMapSizeProps,
    UseHotspotMapSizeResult,
} from "./types";

export const calculateImagePosition = (
    containerWidth: number,
    containerHeight: number,
    naturalWidth: number,
    naturalHeight: number
): ImagePositionInfo => {
    const scaleFactor = Math.min(
        containerWidth / naturalWidth,
        containerHeight / naturalHeight
    );
    const scaledWidth = naturalWidth * scaleFactor;
    const scaledHeight = naturalHeight * scaleFactor;

    return {
        scaleFactor,
        offsetLeft: (containerWidth - scaledWidth) / 2,
        offsetTop: (containerHeight - scaledHeight) / 2,
        scaledWidth,
        scaledHeight,
    };
};

const positionsMatch = (
    left: ImagePositionInfo,
    right: ImagePositionInfo
): boolean =>
    left.scaleFactor === right.scaleFactor &&
    left.offsetLeft === right.offsetLeft &&
    left.offsetTop === right.offsetTop &&
    left.scaledWidth === right.scaledWidth &&
    left.scaledHeight === right.scaledHeight;

export const useHotspotMapSize = ({
    isLoading,
    naturalWidth,
    naturalHeight,
}: UseHotspotMapSizeProps): UseHotspotMapSizeResult => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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
            const nextPosition = calculateImagePosition(
                containerRect.width,
                containerRect.height,
                naturalWidth,
                naturalHeight
            );

            // Apply dimensions and position to the image
            imageRef.current.style.width = `${nextPosition.scaledWidth}px`;
            imageRef.current.style.height = `${nextPosition.scaledHeight}px`;
            imageRef.current.style.marginLeft = `${nextPosition.offsetLeft}px`;
            imageRef.current.style.marginTop = `${nextPosition.offsetTop}px`;

            // Update position info for hotspots
            setPositionInfo((current) =>
                positionsMatch(current, nextPosition) ? current : nextPosition
            );
        };

        if (!isLoading && containerRef.current && imageRef.current) {
            // Initial size update
            updateSize();

            // Set up ResizeObserver to detect any size changes in the container
            const resizeObserver = new ResizeObserver(() => {
                updateSize();
            });

            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }

        return undefined;
    }, [isLoading, naturalWidth, naturalHeight]);

    return {
        containerRef,
        imageRef,
        positionInfo,
    };
};
