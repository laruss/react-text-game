"use client";

import type { MapMenu } from "@react-text-game/core/passages";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { HotspotMenuItem } from "./HotspotMenuItem";
import { callIfFunction, getMapPositionStyle } from "./helpers";
import type { ImagePositionInfo } from "./types";

type Props = Readonly<{
    menu: MapMenu;
    imagePositionInfo?: ImagePositionInfo;
}>;

export const HotspotMenu = ({ menu, imagePositionInfo }: Props) => {
    const items = useMemo(() => {
        const resolved = [];
        for (const candidate of menu.items) {
            const item = callIfFunction(candidate);
            if (item !== undefined) {
                resolved.push(item);
            }
        }
        return resolved;
    }, [menu.items]);

    if (items.length === 0) {
        return null; // Don't render the menu if there are no items
    }

    return (
        <div
            className={twMerge(
                "absolute z-10 flex gap-2 p-2 bg-popover/95 border ",
                "border-border rounded-lg shadow-md justify-center items-center",
                menu.direction === "horizontal" ? "flex-row" : "flex-col"
            )}
            style={getMapPositionStyle(
                callIfFunction(menu.position),
                imagePositionInfo
            )}
        >
            {items.map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Menu items are ordered and have no required stable identifier.
                <HotspotMenuItem item={item} key={index} />
            ))}
        </div>
    );
};
