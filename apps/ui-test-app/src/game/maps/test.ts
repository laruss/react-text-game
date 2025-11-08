import { Game, newInteractiveMap } from "@react-text-game/core";

export const testInteractiveMap = newInteractiveMap("testMap", {
    image: "city.png",
    bgImage: "img.png",
    hotspots: [
        () => ({
            action: () => Game.jumpTo("testStory"),
            type: "label",
            content: "Hotspot",
            position: { x: 50, y: 50 },
        }),
        {
            action: () => Game.jumpTo("testMap2"),
            type: "label",
            content: "Hotspot 2",
            position: { x: 20, y: 20 },
            tooltip: {
                content: "This is a tooltip for Hotspot 2",
                position: "top",
            },
        },
        () => ({
            action: () => console.log("Image Hotspot clicked"),
            type: "image",
            content: {
                idle: "imageHotspot/idle.png",
                hover: "imageHotspot/hover.png",
                active: "imageHotspot/active.png",
                disabled: "imageHotspot/disabled.png",
            },
            // isDisabled: true,
            position: { x: 70, y: 70 },
            props: { zoom: "20%" },
            tooltip: {
                content: "This is an image hotspot",
                position: "left",
            },
        }),
    ],
});

export const testInteractiveMap2 = newInteractiveMap("testMap2", {
    image: "kitchen.png",
    bgImage: "img.png",
    hotspots: [
        () => ({
            action: () => Game.jumpTo("testMap"),
            type: "label",
            content: "Hotspot",
            position: { x: 50, y: 50 },
        }),
        {
            action: () => console.log("Hotspot 2 clicked"),
            type: "label",
            content: "Hotspot 2",
            position: { x: 20, y: 20 },
            tooltip: {
                content: "This is a tooltip for Hotspot 2",
                position: "top",
            },
        },
        {
            type: "menu",
            items: [
                {
                    type: "label",
                    content: "Menu Item 1",
                    action: () => console.log("Menu Item 1 clicked"),
                },
                () => ({
                    type: "label",
                    content: "Menu Item 2",
                    action: () => console.log("Menu Item 2 clicked"),
                }),
            ],
            position: { x: 80, y: 80 },
        },
    ],
});
