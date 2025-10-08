import { RefObject } from "react";

export interface ImagePositionInfo {
    scaleFactor: number;
    offsetLeft: number;
    offsetTop: number;
    scaledWidth: number;
    scaledHeight: number;
}

export interface UseHotspotMapSizeProps {
    isLoading: boolean;
    naturalWidth: number;
    naturalHeight: number;
}

export interface UseHotspotMapSizeResult {
    containerRef: RefObject<HTMLDivElement | null>;
    imageRef: RefObject<HTMLImageElement | null>;
    positionInfo: ImagePositionInfo;
}
