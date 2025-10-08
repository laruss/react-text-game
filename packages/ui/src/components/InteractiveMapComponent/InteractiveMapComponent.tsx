"use client";

import { InteractiveMap } from "@react-text-game/core";
import { useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

import { Hotspot } from "./Hotspot";
import { HotspotMap } from "./HotspotMap";
import { HotspotMenu } from "./HotspotMenu";
import { SideHotspot } from "./SideHotspot";
import { useSortHotspots } from "./useSortHotspots";

type InteractiveMapProps = {
    interactiveMap: InteractiveMap;
};

export const InteractiveMapComponent = ({
    interactiveMap,
}: InteractiveMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const displayable = useMemo(
        () => interactiveMap.display(),
        [interactiveMap]
    );
    const {
        mapHotspots,
        menu,
        bottomHotspots,
        rightHotspots,
        topHotspots,
        leftHotspots,
    } = useSortHotspots({ hotspots: displayable.hotspots });

    // Create a unique key for the displayable content to trigger animations
    const displayableKey = useMemo(() => {
        return `${displayable.image}-${displayable.bgImage}-${displayable.hotspots.length}`;
    }, [displayable.image, displayable.bgImage, displayable.hotspots.length]);

    return (
        <div className="w-full h-full flex flex-col">
            <div
                key={displayableKey}
                className="flex-grow relative overflow-hidden animate-[fadeIn_0.3s_ease-in-out]"
            >
                {/* Background image container */}
                {displayable.bgImage && (
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${displayable.bgImage})`,
                            opacity: displayable.props?.bgOpacity,
                        }}
                    />
                )}

                {/* Hotspot map container */}
                <div
                    className={twMerge(
                        "h-full w-full flex flex-col",
                        displayable.classNames?.container
                    )}
                >
                    <div
                        className={twMerge(
                            "w-full z-20 overflow-y-hidden overflow-x-auto scrollbar-hide max-h-100",
                            displayable.classNames?.topHotspots
                        )}
                    >
                        {topHotspots.map((hotspot, index) => (
                            <SideHotspot key={index} hotspot={hotspot} />
                        ))}
                    </div>
                    <div className="h-full w-full flex">
                        <div
                            className={twMerge(
                                "h-full z-20 overflow-x-hidden overflow-y-auto scrollbar-hide max-w-100",
                                displayable.classNames?.leftHotspots
                            )}
                        >
                            {leftHotspots.map((hotspot, index) => (
                                <SideHotspot key={index} hotspot={hotspot} />
                            ))}
                        </div>
                        <div
                            ref={mapContainerRef}
                            className="w-full h-full flex justify-center items-center relative z-10"
                        >
                            <HotspotMap imageUrl={displayable.image}>
                                {mapHotspots.map((hotspot, index) => (
                                    <Hotspot key={index} hotspot={hotspot} />
                                ))}
                                {menu.map((menuItem, index) => (
                                    <HotspotMenu
                                        key={`menu-${index}`}
                                        menu={menuItem}
                                    />
                                ))}
                            </HotspotMap>
                        </div>
                        <div
                            className={twMerge(
                                "h-full z-20 overflow-x-hidden overflow-y-auto scrollbar-hide max-w-100",
                                displayable.classNames?.rightHotspots
                            )}
                        >
                            {rightHotspots.map((hotspot, index) => (
                                <SideHotspot key={index} hotspot={hotspot} />
                            ))}
                        </div>
                    </div>
                    <div
                        className={twMerge(
                            "w-full z-20 overflow-y-hidden overflow-x-auto scrollbar-hide max-h-100",
                            displayable.classNames?.bottomHotspots
                        )}
                    >
                        {bottomHotspots.map((hotspot, index) => (
                            <SideHotspot key={index} hotspot={hotspot} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
