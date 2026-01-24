"use client";

import { MapMenu } from "@react-text-game/core/passages";
import { useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

import { callIfFunction } from "./helpers";
import { HotspotMenuItem } from "./HotspotMenuItem";
import { ImagePositionInfo } from "./types";

type Props = Readonly<{
    menu: MapMenu;
    imagePositionInfo?: ImagePositionInfo;
}>;

export const HotspotMenu = ({ menu, imagePositionInfo }: Props) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const items = useMemo(
        () =>
            menu.items
                .map((item) => callIfFunction(item))
                .filter((item) => item !== undefined),
        [menu.items]
    );

    // Position the menu based on percentage coordinates and image position info
    useEffect(() => {
        if (menuRef.current && imagePositionInfo && items.length) {
            const { x, y } = callIfFunction(menu.position);
            const { offsetLeft, offsetTop, scaledWidth, scaledHeight } =
                imagePositionInfo;

            // Calculate position based on percentage of the scaled image
            const xPos = offsetLeft + (x / 100) * scaledWidth;
            const yPos = offsetTop + (y / 100) * scaledHeight;

            menuRef.current.style.left = `${xPos}px`;
            menuRef.current.style.top = `${yPos}px`;
            menuRef.current.style.transform = "translate(-50%, -50%)";
        }
    }, [menu.position, imagePositionInfo, items.length]);

    if (items.length === 0) {
        return null; // Don't render the menu if there are no items
    }

    return (
        <div
            ref={menuRef}
            className={twMerge(
                "absolute z-10 flex gap-2 p-2 bg-popover/95 border ",
                "border-border rounded-lg shadow-md justify-center items-center",
                menu.direction === "horizontal" ? "flex-row" : "flex-col"
            )}
        >
            {items.map((item, index) => (
                <HotspotMenuItem item={item} key={index} />
            ))}
        </div>
    );
};
