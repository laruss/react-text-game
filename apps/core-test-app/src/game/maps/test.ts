import { defineInteractiveMap } from "@react-text-game/core";

export const testInteractiveMap = defineInteractiveMap(
    "testMap",
    (h) => [
        h.label("Hotspot", {
            action: h.jump("testStory"),
            position: { x: 50, y: 50 },
        }),
        h.label("Hotspot 2", {
            action: h.jump("testMap2"),
            position: { x: 20, y: 20 },
            tooltip: {
                content: "This is a tooltip for Hotspot 2",
                position: "top",
            },
        }),
        h.image(
            {
                idle: "imageHotspot/idle.png",
                hover: "imageHotspot/hover.png",
                active: "imageHotspot/active.png",
                disabled: "imageHotspot/disabled.png",
            },
            {
                action: () => console.log("Image Hotspot clicked"),
                // isDisabled: true,
                position: { x: 70, y: 70 },
                zoom: "20%",
                tooltip: {
                    content: "This is an image hotspot",
                    position: "bottom",
                },
            }
        ),
    ],
    {
        image: "city.png",
        bgImage: "img.png",
    }
);

export const testInteractiveMap2 = defineInteractiveMap(
    "testMap2",
    (h) => [
        h.label("Hotspot", {
            action: h.jump("testMap"),
            position: { x: 50, y: 50 },
        }),
        h.label("Hotspot 2", {
            action: () => console.log("Hotspot 2 clicked"),
            position: { x: 20, y: 20 },
            tooltip: {
                content: "This is a tooltip for Hotspot 2",
                position: "top",
            },
        }),
        h.menu(
            [
                h.label("Menu Item 1", {
                    action: () => console.log("Menu Item 1 clicked"),
                }),
                h.label("Menu Item 2", {
                    action: () => console.log("Menu Item 2 clicked"),
                }),
            ],
            { position: { x: 80, y: 80 } }
        ),
    ],
    {
        image: "kitchen.png",
        bgImage: "img.png",
    }
);
