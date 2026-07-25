import { defineInteractiveMap, Game } from "@react-text-game/core";

export const testInteractiveMap = defineInteractiveMap(
    "testMap",
    (h) => [
        h.label("Hotspot", {
            action: () => Game.jumpTo("testStory"),
            position: { x: 50, y: 50 },
        }),
        h.label("Hotspot 2", {
            action: () => Game.jumpTo("testMap2"),
            position: { x: 20, y: 20 },
            tooltip: {
                content: "This is a tooltip for Hotspot 2",
                position: "top",
            },
        }),
        h.image(
            {
                idle: "imageHotspot/idle.webp",
                hover: "imageHotspot/hover.webp",
                active: "imageHotspot/active.webp",
                disabled: "imageHotspot/disabled.webp",
            },
            {
                action: () => console.log("Image Hotspot clicked"),
                position: { x: 70, y: 70 },
                tooltip: {
                    content: "This is an image hotspot",
                    position: "bottom",
                },
                zoom: "20%",
            }
        ),
    ],
    { image: "./assets/test/city.webp", bgImage: "./assets/test/img.webp" }
);

export const testInteractiveMap2 = defineInteractiveMap(
    "testMap2",
    (h) => [
        h.label("Hotspot", {
            action: () => Game.jumpTo("testMap"),
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
    { image: "./assets/test/kitchen.webp", bgImage: "./assets/test/img.webp" }
);
