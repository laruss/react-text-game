import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { Game } from "#game";
import { newInteractiveMap } from "#passages/interactiveMap/fabric";
import { InteractiveMap } from "#passages/interactiveMap/interactiveMap";
import {
    ImageHotspotContentObject,
    InteractiveMapOptions,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "#passages/interactiveMap/types";
import { Storage } from "#storage";

// Counter for unique IDs
let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("InteractiveMap", () => {
    beforeEach(async () => {
        // Clear storage
        Storage.setState({});

        // Re-initialize the game for each test
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        // Reset game state after each test
        Game._resetForTesting();
    });

    describe("Constructor", () => {
        test("creates an interactive map with id and options", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
            };
            const map = new InteractiveMap(id, options);

            expect(map.id).toBe(id);
            expect(map.type).toBe("interactiveMap");
        });

        test("creates a map with complete options", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                caption: "World Map",
                image: "/map.jpg",
                bgImage: "/bg.jpg",
                hotspots: [],
                props: { bgOpacity: 0.5 },
                classNames: { container: "custom-container" },
            };
            const map = new InteractiveMap(id, options);

            expect(map.id).toBe(id);
            expect(map.type).toBe("interactiveMap");
        });
    });

    describe("Factory Function", () => {
        test("newInteractiveMap creates an InteractiveMap instance", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(id, options);

            expect(map).toBeInstanceOf(InteractiveMap);
            expect(map.id).toBe(id);
        });

        test("newInteractiveMap with full options", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                caption: "Test Map",
                image: "/test.jpg",
                bgImage: "/bg.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(id, options);

            expect(map).toBeInstanceOf(InteractiveMap);
            expect(map.id).toBe(id);
        });
    });

    describe("Display Method - Basic", () => {
        test("displays map with static image", () => {
            const options: InteractiveMapOptions = {
                image: "/world-map.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.image).toBe("/world-map.jpg");
            expect(result.hotspots).toHaveLength(0);
        });

        test("displays map with dynamic image function", () => {
            const options: InteractiveMapOptions = {
                image: () => "/dynamic-map.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.image).toBe("/dynamic-map.jpg");
        });

        test("displays map with background image", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                bgImage: "/background.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.image).toBe("/map.jpg");
            expect(result.bgImage).toBe("/background.jpg");
        });

        test("displays map with dynamic background image", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                bgImage: () => "/dynamic-bg.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.bgImage).toBe("/dynamic-bg.jpg");
        });

        test("displays map with caption", () => {
            const options: InteractiveMapOptions = {
                caption: "Kingdom Map",
                image: "/map.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.caption).toBe("Kingdom Map");
        });

        test("displays map with props", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
                props: { bgOpacity: 0.7 },
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.props?.bgOpacity).toBe(0.7);
        });

        test("displays map with classNames", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
                classNames: {
                    container: "container-class",
                    topHotspots: "top-class",
                    bottomHotspots: "bottom-class",
                    leftHotspots: "left-class",
                    rightHotspots: "right-class",
                },
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.classNames?.container).toBe("container-class");
            expect(result.classNames?.topHotspots).toBe("top-class");
            expect(result.classNames?.bottomHotspots).toBe("bottom-class");
            expect(result.classNames?.leftHotspots).toBe("left-class");
            expect(result.classNames?.rightHotspots).toBe("right-class");
        });
    });

    describe("Hotspot Types - Map Label", () => {
        test("displays map with label hotspot", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                content: "Village",
                position: { x: 30, y: 40 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(1);
            expect(result.hotspots[0]?.type).toBe("label");
            expect((result.hotspots[0] as MapLabelHotspot).content).toBe("Village");
            expect((result.hotspots[0] as MapLabelHotspot).position).toEqual({
                x: 30,
                y: 40,
            });
        });

        test("label hotspot with dynamic content", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                content: () => "Dynamic Label",
                position: { x: 50, y: 50 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            // Dynamic content remains as function (resolved by UI layer)
            const resultHotspot = result.hotspots[0] as MapLabelHotspot;
            expect(typeof resultHotspot.content).toBe("function");
            if (typeof resultHotspot.content === "function") {
                expect(resultHotspot.content()).toBe("Dynamic Label");
            }
        });

        test("label hotspot with dynamic position", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                content: "Test",
                position: { x: () => 25, y: () => 75 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            const pos = (result.hotspots[0] as MapLabelHotspot).position;
            expect(typeof pos.x).toBe("function");
            expect(typeof pos.y).toBe("function");
            if (typeof pos.x === "function" && typeof pos.y === "function") {
                expect(pos.x()).toBe(25);
                expect(pos.y()).toBe(75);
            }
        });

        test("label hotspot with all properties", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                id: "village-hotspot",
                content: "Village",
                position: { x: 30, y: 40 },
                action: () => {},
                isDisabled: false,
                tooltip: {
                    content: "Click to visit village",
                    position: "top",
                },
                props: {
                    variant: "bordered",
                    color: "primary",
                    classNames: { button: "custom-button" },
                },
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapLabelHotspot;

            expect(resultHotspot.id).toBe("village-hotspot");
            expect(resultHotspot.isDisabled).toBe(false);
            expect(resultHotspot.tooltip?.content).toBe("Click to visit village");
            expect(resultHotspot.tooltip?.position).toBe("top");
            expect(resultHotspot.props?.variant).toBe("bordered");
            expect(resultHotspot.props?.color).toBe("primary");
            expect(resultHotspot.props?.classNames?.button).toBe("custom-button");
        });

        test("label hotspot with dynamic disabled state", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                content: "Shop",
                position: { x: 50, y: 50 },
                action: () => {},
                isDisabled: () => true,
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            const resultHotspot = result.hotspots[0] as MapLabelHotspot;
            expect(typeof resultHotspot.isDisabled).toBe("function");
            if (typeof resultHotspot.isDisabled === "function") {
                expect(resultHotspot.isDisabled()).toBe(true);
            }
        });

        test("label hotspot with dynamic tooltip", () => {
            const hotspot: MapLabelHotspot = {
                type: "label",
                content: "Door",
                position: { x: 50, y: 50 },
                action: () => {},
                tooltip: {
                    content: () => "Dynamic tooltip",
                    position: "bottom",
                },
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            const resultHotspot = result.hotspots[0] as MapLabelHotspot;
            expect(typeof resultHotspot.tooltip?.content).toBe("function");
            if (typeof resultHotspot.tooltip?.content === "function") {
                expect(resultHotspot.tooltip.content()).toBe("Dynamic tooltip");
            }
        });
    });

    describe("Hotspot Types - Map Image", () => {
        test("displays map with image hotspot", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: { idle: "/icon.png" },
                position: { x: 60, y: 70 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            const imageHotspot = result.hotspots[0] as MapImageHotspot;

            expect(result.hotspots).toHaveLength(1);
            expect(imageHotspot.type).toBe("image");
            expect((imageHotspot.content as ImageHotspotContentObject).idle).toBe(
                "/icon.png"
            );
        });

        test("image hotspot with all image states", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: {
                    idle: "/idle.png",
                    hover: "/hover.png",
                    active: "/active.png",
                    disabled: "/disabled.png",
                },
                position: { x: 50, y: 50 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapImageHotspot;
            const content = resultHotspot.content as ImageHotspotContentObject;

            expect(content.idle).toBe("/idle.png");
            expect(content.hover).toBe("/hover.png");
            expect(content.active).toBe("/active.png");
            expect(content.disabled).toBe("/disabled.png");
        });

        test("image hotspot with dynamic images", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: {
                    idle: () => "/dynamic-idle.png",
                    hover: () => "/dynamic-hover.png",
                },
                position: { x: 50, y: 50 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapImageHotspot;
            const content = resultHotspot.content as ImageHotspotContentObject;

            expect(typeof content.idle).toBe("function");
            expect(typeof content.hover).toBe("function");
        });

        test("image hotspot with zoom and classNames", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: { idle: "/icon.png" },
                position: { x: 50, y: 50 },
                action: () => {},
                props: {
                    zoom: "150%",
                    classNames: {
                        container: "custom-container",
                        idle: "idle-class",
                        hover: "hover-class",
                        active: "active-class",
                        disabled: "disabled-class",
                    },
                },
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapImageHotspot;

            expect(resultHotspot.props?.zoom).toBe("150%");
            expect(resultHotspot.props?.classNames?.container).toBe(
                "custom-container"
            );
            expect(resultHotspot.props?.classNames?.idle).toBe("idle-class");
            expect(resultHotspot.props?.classNames?.hover).toBe("hover-class");
            expect(resultHotspot.props?.classNames?.active).toBe("active-class");
            expect(resultHotspot.props?.classNames?.disabled).toBe(
                "disabled-class"
            );
        });

        test("image hotspot with static string content", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: "/simple-icon.png",
                position: { x: 40, y: 60 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapImageHotspot;

            expect(resultHotspot.type).toBe("image");
            expect(resultHotspot.content).toBe("/simple-icon.png");
        });

        test("image hotspot with function returning string", () => {
            const hotspot: MapImageHotspot = {
                type: "image",
                content: () => "/dynamic-icon.png",
                position: { x: 40, y: 60 },
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as MapImageHotspot;

            expect(resultHotspot.type).toBe("image");
            expect(typeof resultHotspot.content).toBe("function");
            if (typeof resultHotspot.content === "function") {
                expect(resultHotspot.content()).toBe("/dynamic-icon.png");
            }
        });
    });

    describe("Hotspot Types - Side Label", () => {
        test("displays map with side label hotspot - top", () => {
            const hotspot: SideLabelHotspot = {
                type: "label",
                content: "Menu",
                position: "top",
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(1);
            expect((result.hotspots[0] as SideLabelHotspot).position).toBe("top");
        });

        test("side label hotspots on all sides", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Top",
                        position: "top",
                        action: () => {},
                    } as SideLabelHotspot,
                    {
                        type: "label",
                        content: "Bottom",
                        position: "bottom",
                        action: () => {},
                    } as SideLabelHotspot,
                    {
                        type: "label",
                        content: "Left",
                        position: "left",
                        action: () => {},
                    } as SideLabelHotspot,
                    {
                        type: "label",
                        content: "Right",
                        position: "right",
                        action: () => {},
                    } as SideLabelHotspot,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(4);
            expect((result.hotspots[0] as SideLabelHotspot).position).toBe("top");
            expect((result.hotspots[1] as SideLabelHotspot).position).toBe(
                "bottom"
            );
            expect((result.hotspots[2] as SideLabelHotspot).position).toBe("left");
            expect((result.hotspots[3] as SideLabelHotspot).position).toBe(
                "right"
            );
        });
    });

    describe("Hotspot Types - Side Image", () => {
        test("displays map with side image hotspot", () => {
            const hotspot: SideImageHotspot = {
                type: "image",
                content: { idle: "/compass.png" },
                position: "bottom",
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const imageHotspot = result.hotspots[0] as SideImageHotspot;
            const content = imageHotspot.content as ImageHotspotContentObject;

            expect(result.hotspots).toHaveLength(1);
            expect(imageHotspot.position).toBe(
                "bottom"
            );
            expect(content.idle).toBe(
                "/compass.png"
            );
        });

        test("side image hotspots with all image states", () => {
            const hotspot: SideImageHotspot = {
                type: "image",
                content: {
                    idle: "/idle.png",
                    hover: "/hover.png",
                    active: "/active.png",
                    disabled: "/disabled.png",
                },
                position: "left",
                action: () => {},
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [hotspot],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultHotspot = result.hotspots[0] as SideImageHotspot;
            const content = resultHotspot.content as ImageHotspotContentObject;

            expect(content.idle).toBe("/idle.png");
            expect(content.hover).toBe("/hover.png");
            expect(content.active).toBe("/active.png");
            expect(content.disabled).toBe("/disabled.png");
        });
    });

    describe("Hotspot Types - Menu", () => {
        test("displays map with menu hotspot", () => {
            const menu: MapMenu = {
                type: "menu",
                position: { x: 50, y: 50 },
                items: [
                    {
                        type: "label",
                        content: "Option 1",
                        action: () => {},
                    },
                    {
                        type: "label",
                        content: "Option 2",
                        action: () => {},
                    },
                ],
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [menu],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(1);
            expect(result.hotspots[0]?.type).toBe("menu");
            expect((result.hotspots[0] as MapMenu).items).toHaveLength(2);
        });

        test("menu with direction and className", () => {
            const menu: MapMenu = {
                type: "menu",
                position: { x: 50, y: 50 },
                direction: "horizontal",
                items: [
                    {
                        type: "label",
                        content: "Item 1",
                        action: () => {},
                    },
                ],
                props: { className: "menu-class" },
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [menu],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultMenu = result.hotspots[0] as MapMenu;

            expect(resultMenu.direction).toBe("horizontal");
            expect(resultMenu.props?.className).toBe("menu-class");
        });

        test("menu with dynamic position", () => {
            const menu: MapMenu = {
                type: "menu",
                position: { x: () => 25, y: () => 75 },
                items: [
                    {
                        type: "label",
                        content: "Item",
                        action: () => {},
                    },
                ],
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [menu],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultMenu = result.hotspots[0] as MapMenu;

            expect(typeof resultMenu.position.x).toBe("function");
            expect(typeof resultMenu.position.y).toBe("function");
            if (
                typeof resultMenu.position.x === "function" &&
                typeof resultMenu.position.y === "function"
            ) {
                expect(resultMenu.position.x()).toBe(25);
                expect(resultMenu.position.y()).toBe(75);
            }
        });

        test("menu with conditional items", () => {
            const menu: MapMenu = {
                type: "menu",
                position: { x: 50, y: 50 },
                items: [
                    {
                        type: "label",
                        content: "Always",
                        action: () => {},
                    },
                    () => undefined, // Conditional item that's filtered out
                    {
                        type: "label",
                        content: "Also always",
                        action: () => {},
                    },
                ],
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [menu],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();
            const resultMenu = result.hotspots[0] as MapMenu;

            // The menu itself is not filtered, but the conditional logic
            // would happen at render time in the UI
            expect(resultMenu.items).toHaveLength(3);
        });
    });

    describe("Dynamic Hotspots", () => {
        test("filters out undefined hotspots", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Visible",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    } as MapLabelHotspot,
                    () => undefined, // Conditional hotspot
                    {
                        type: "label",
                        content: "Also visible",
                        position: { x: 60, y: 60 },
                        action: () => {},
                    } as MapLabelHotspot,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(2);
            expect((result.hotspots[0] as MapLabelHotspot).content).toBe(
                "Visible"
            );
            expect((result.hotspots[1] as MapLabelHotspot).content).toBe(
                "Also visible"
            );
        });

        test("processes hotspot functions with props", () => {
            let receivedProps: unknown | null = null;
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    // @ts-expect-error TS2322
                    (props: unknown) => {
                        receivedProps = props;
                        return {
                            type: "label",
                            content: "Test",
                            position: { x: 50, y: 50 },
                            action: () => {},
                        } as MapLabelHotspot;
                    },
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const testProps = { hasKey: true, level: 5 };
            map.display(testProps);

            expect(receivedProps).toEqual(testProps);
        });

        test("conditional hotspot based on props", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    // @ts-expect-error TS2322
                    (props: { hasKey: boolean }) =>
                        props.hasKey
                            ? ({
                                  type: "label",
                                  content: "Secret Door",
                                  position: { x: 50, y: 50 },
                                  action: () => {},
                              } as MapLabelHotspot)
                            : undefined,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const resultWithKey = map.display({ hasKey: true });
            expect(resultWithKey.hotspots).toHaveLength(1);

            const resultWithoutKey = map.display({ hasKey: false });
            expect(resultWithoutKey.hotspots).toHaveLength(0);
        });

        test("multiple conditional hotspots", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    // @ts-expect-error TS2322
                    (props: { showA: boolean }) =>
                        props.showA
                            ? ({
                                  type: "label",
                                  content: "A",
                                  position: { x: 25, y: 25 },
                                  action: () => {},
                              } as MapLabelHotspot)
                            : undefined,
                    // @ts-expect-error TS2322
                    (props: { showB: boolean }) =>
                        props.showB
                            ? ({
                                  type: "label",
                                  content: "B",
                                  position: { x: 75, y: 75 },
                                  action: () => {},
                              } as MapLabelHotspot)
                            : undefined,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const resultBoth = map.display({ showA: true, showB: true });
            expect(resultBoth.hotspots).toHaveLength(2);

            const resultA = map.display({ showA: true, showB: false });
            expect(resultA.hotspots).toHaveLength(1);
            expect((resultA.hotspots[0] as MapLabelHotspot).content).toBe("A");

            const resultNone = map.display({ showA: false, showB: false });
            expect(resultNone.hotspots).toHaveLength(0);
        });
    });

    describe("Dynamic Hotspots Array", () => {
        test("hotspots as function returning static array", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: () => [
                    {
                        type: "label",
                        content: "From Function",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    } as MapLabelHotspot,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(1);
            expect((result.hotspots[0] as MapLabelHotspot).content).toBe(
                "From Function"
            );
        });

        test("hotspots function receives props", () => {
            let receivedProps: unknown | null = null;
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                // @ts-expect-error TS2322
                hotspots: (props: unknown) => {
                    receivedProps = props;
                    return [
                        {
                            type: "label",
                            content: "Test",
                            position: { x: 50, y: 50 },
                            action: () => {},
                        } as MapLabelHotspot,
                    ];
                },
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const testProps = { level: 10, hasKey: true };
            map.display(testProps);

            expect(receivedProps).toEqual(testProps);
        });

        test("conditional array generation based on props", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                // @ts-expect-error TS2322
                hotspots: (props: { isInCombat: boolean }) => {
                    if (props.isInCombat) {
                        return [
                            {
                                type: "label",
                                content: "Attack",
                                position: "bottom",
                                action: () => {},
                            } as SideLabelHotspot,
                            {
                                type: "label",
                                content: "Defend",
                                position: "bottom",
                                action: () => {},
                            } as SideLabelHotspot,
                        ];
                    }
                    return [
                        {
                            type: "label",
                            content: "Explore",
                            position: { x: 50, y: 50 },
                            action: () => {},
                        } as MapLabelHotspot,
                        {
                            type: "label",
                            content: "Rest",
                            position: "bottom",
                            action: () => {},
                        } as SideLabelHotspot,
                    ];
                },
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const combatResult = map.display({ isInCombat: true });
            expect(combatResult.hotspots).toHaveLength(2);
            expect((combatResult.hotspots[0] as SideLabelHotspot).content).toBe(
                "Attack"
            );
            expect((combatResult.hotspots[1] as SideLabelHotspot).content).toBe(
                "Defend"
            );

            const exploreResult = map.display({ isInCombat: false });
            expect(exploreResult.hotspots).toHaveLength(2);
            expect((exploreResult.hotspots[0] as MapLabelHotspot).content).toBe(
                "Explore"
            );
            expect((exploreResult.hotspots[1] as SideLabelHotspot).content).toBe(
                "Rest"
            );
        });

        test("empty array from function", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: () => [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(0);
        });

        test("function returning array with conditional hotspots", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                // @ts-expect-error TS2322
                hotspots: (props: { showSecret: boolean; showShop: boolean }) => [
                    {
                        type: "label",
                        content: "Home",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    } as MapLabelHotspot,
                    () =>
                        props.showSecret
                            ? ({
                                  type: "label",
                                  content: "Secret",
                                  position: { x: 80, y: 30 },
                                  action: () => {},
                              } as MapLabelHotspot)
                            : undefined,
                    () =>
                        props.showShop
                            ? ({
                                  type: "label",
                                  content: "Shop",
                                  position: { x: 20, y: 70 },
                                  action: () => {},
                              } as MapLabelHotspot)
                            : undefined,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const allResult = map.display({
                showSecret: true,
                showShop: true,
            });
            expect(allResult.hotspots).toHaveLength(3);

            const secretOnlyResult = map.display({
                showSecret: true,
                showShop: false,
            });
            expect(secretOnlyResult.hotspots).toHaveLength(2);
            expect((secretOnlyResult.hotspots[1] as MapLabelHotspot).content).toBe(
                "Secret"
            );

            const noneResult = map.display({
                showSecret: false,
                showShop: false,
            });
            expect(noneResult.hotspots).toHaveLength(1);
            expect((noneResult.hotspots[0] as MapLabelHotspot).content).toBe(
                "Home"
            );
        });

        test("different arrays for different game states", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                // @ts-expect-error TS2322
                hotspots: (props: { gamePhase: "early" | "mid" | "late" }) => {
                    switch (props.gamePhase) {
                        case "early":
                            return [
                                {
                                    type: "label",
                                    content: "Tutorial",
                                    position: "top",
                                    action: () => {},
                                } as SideLabelHotspot,
                            ];
                        case "mid":
                            return [
                                {
                                    type: "label",
                                    content: "Village",
                                    position: { x: 30, y: 40 },
                                    action: () => {},
                                } as MapLabelHotspot,
                                {
                                    type: "label",
                                    content: "Forest",
                                    position: { x: 70, y: 60 },
                                    action: () => {},
                                } as MapLabelHotspot,
                            ];
                        case "late":
                            return [
                                {
                                    type: "label",
                                    content: "Castle",
                                    position: { x: 50, y: 30 },
                                    action: () => {},
                                } as MapLabelHotspot,
                                {
                                    type: "label",
                                    content: "Dungeon",
                                    position: { x: 50, y: 70 },
                                    action: () => {},
                                } as MapLabelHotspot,
                                {
                                    type: "label",
                                    content: "Final Boss",
                                    position: { x: 80, y: 80 },
                                    action: () => {},
                                } as MapLabelHotspot,
                            ];
                    }
                },
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const earlyResult = map.display({ gamePhase: "early" });
            expect(earlyResult.hotspots).toHaveLength(1);
            expect((earlyResult.hotspots[0] as SideLabelHotspot).content).toBe(
                "Tutorial"
            );

            const midResult = map.display({ gamePhase: "mid" });
            expect(midResult.hotspots).toHaveLength(2);

            const lateResult = map.display({ gamePhase: "late" });
            expect(lateResult.hotspots).toHaveLength(3);
        });

        test("calling display multiple times with different props", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                // @ts-expect-error TS2322
                hotspots: (props: { count: number }) =>
                    Array.from({ length: props.count }, (_, i) => ({
                        type: "label",
                        content: `Hotspot ${i + 1}`,
                        position: { x: (i + 1) * 20, y: 50 },
                        action: () => {},
                    })) as Array<MapLabelHotspot>,
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result1 = map.display({ count: 2 });
            expect(result1.hotspots).toHaveLength(2);

            const result2 = map.display({ count: 5 });
            expect(result2.hotspots).toHaveLength(5);

            const result3 = map.display({ count: 0 });
            expect(result3.hotspots).toHaveLength(0);
        });
    });

    describe("Mixed Hotspots", () => {
        test("displays map with multiple hotspot types", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Village",
                        position: { x: 30, y: 40 },
                        action: () => {},
                    } as MapLabelHotspot,
                    {
                        type: "image",
                        content: { idle: "/treasure.png" },
                        position: { x: 60, y: 70 },
                        action: () => {},
                    } as MapImageHotspot,
                    {
                        type: "label",
                        content: "Menu",
                        position: "top",
                        action: () => {},
                    } as SideLabelHotspot,
                    {
                        type: "image",
                        content: { idle: "/compass.png" },
                        position: "bottom",
                        action: () => {},
                    } as SideImageHotspot,
                    {
                        type: "menu",
                        position: { x: 50, y: 50 },
                        items: [
                            {
                                type: "label",
                                content: "Option",
                                action: () => {},
                            },
                        ],
                    } as MapMenu,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(5);
            expect(result.hotspots[0]?.type).toBe("label");
            expect(result.hotspots[1]?.type).toBe("image");
            expect(result.hotspots[2]?.type).toBe("label");
            expect(result.hotspots[3]?.type).toBe("image");
            expect(result.hotspots[4]?.type).toBe("menu");
        });

        test("mixed static and dynamic hotspots", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Static",
                        position: { x: 25, y: 25 },
                        action: () => {},
                    } as MapLabelHotspot,
                    () =>
                        ({
                            type: "label",
                            content: "Dynamic",
                            position: { x: 75, y: 75 },
                            action: () => {},
                        }) as MapLabelHotspot,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(2);
            expect((result.hotspots[0] as MapLabelHotspot).content).toBe(
                "Static"
            );
            expect((result.hotspots[1] as MapLabelHotspot).content).toBe(
                "Dynamic"
            );
        });
    });

    describe("Integration with Game", () => {
        test("map is registered with Game on creation", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
            };
            newInteractiveMap(id, options);

            const retrieved = Game.getPassageById(id);
            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(id);
            expect(retrieved?.type).toBe("interactiveMap");
        });

        test("can navigate to map using Game.jumpTo", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
            };
            newInteractiveMap(id, options);

            Game.jumpTo(id);

            expect(Game.selfState.currentPassageId).toBe(id);
        });

        test("can retrieve and display current map", () => {
            const id = uniqueId("map");
            const options: InteractiveMapOptions = {
                caption: "Current Map",
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Test",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    } as MapLabelHotspot,
                ],
            };
            newInteractiveMap(id, options);

            Game.jumpTo(id);
            const currentPassage = Game.currentPassage;

            expect(currentPassage).not.toBeNull();
            expect(currentPassage?.type).toBe("interactiveMap");

            const result = (currentPassage as InteractiveMap).display();
            expect(result.caption).toBe("Current Map");
            expect(result.hotspots).toHaveLength(1);
        });

        test("hotspot actions can trigger navigation", () => {
            const mapId = uniqueId("map");
            const targetId = uniqueId("target");

            // Create target passage
            const targetOptions: InteractiveMapOptions = {
                image: "/target.jpg",
                hotspots: [],
            };
            newInteractiveMap(targetId, targetOptions);

            // Create map with hotspot that navigates
            let actionCalled = false;
            const mapOptions: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Go to target",
                        position: { x: 50, y: 50 },
                        action: () => {
                            actionCalled = true;
                            Game.jumpTo(targetId);
                        },
                    } as MapLabelHotspot,
                ],
            };
            newInteractiveMap(mapId, mapOptions);

            Game.jumpTo(mapId);
            const map = Game.currentPassage as InteractiveMap;
            const result = map.display();

            // Simulate clicking the hotspot
            (result.hotspots[0] as MapLabelHotspot).action();

            expect(actionCalled).toBe(true);
            expect(Game.selfState.currentPassageId).toBe(targetId);
        });
    });

    describe("Edge Cases", () => {
        test("empty hotspots array", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(0);
        });

        test("all hotspots return undefined", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [() => undefined, () => undefined, () => undefined],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(0);
        });

        test("display called multiple times returns different results", () => {
            let callCount = 0;
            const options: InteractiveMapOptions = {
                image: () => `/map-${++callCount}.jpg`,
                hotspots: [],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result1 = map.display();
            expect(result1.image).toBe("/map-1.jpg");

            const result2 = map.display();
            expect(result2.image).toBe("/map-2.jpg");
        });

        test("hotspot with all button color variants", () => {
            const colors: Array<
                "default" | "primary" | "secondary" | "success" | "warning" | "danger"
            > = ["default", "primary", "secondary", "success", "warning", "danger"];

            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: colors.map((color, i) => ({
                    type: "label",
                    content: color,
                    position: { x: i * 10, y: i * 10 },
                    action: () => {},
                    props: { color },
                })) as Array<MapLabelHotspot>,
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(6);
            colors.forEach((color, i) => {
                expect(
                    (result.hotspots[i] as MapLabelHotspot).props?.color
                ).toBe(color);
            });
        });

        test("hotspot with all button variants", () => {
            const variants: Array<
                | "solid"
                | "bordered"
                | "light"
                | "flat"
                | "faded"
                | "shadow"
                | "ghost"
            > = ["solid", "bordered", "light", "flat", "faded", "shadow", "ghost"];

            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: variants.map((variant, i) => ({
                    type: "label",
                    content: variant,
                    position: { x: i * 10, y: i * 10 },
                    action: () => {},
                    props: { variant },
                })) as Array<MapLabelHotspot>,
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(7);
            variants.forEach((variant, i) => {
                expect(
                    (result.hotspots[i] as MapLabelHotspot).props?.variant
                ).toBe(variant);
            });
        });

        test("image hotspot with different zoom values", () => {
            const zooms: Array<`${number}%`> = ["50%", "100%", "150%", "200%"];

            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: zooms.map((zoom, i) => ({
                    type: "image",
                    content: { idle: "/icon.png" },
                    position: { x: i * 20, y: i * 20 },
                    action: () => {},
                    props: { zoom },
                })) as Array<MapImageHotspot>,
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect(result.hotspots).toHaveLength(4);
            zooms.forEach((zoom, i) => {
                expect((result.hotspots[i] as MapImageHotspot).props?.zoom).toBe(
                    zoom
                );
            });
        });

        test("menu with empty items array", () => {
            const menu: MapMenu = {
                type: "menu",
                position: { x: 50, y: 50 },
                items: [],
            };
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [menu],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect((result.hotspots[0] as MapMenu).items).toHaveLength(0);
        });

        test("position with edge values (0, 100)", () => {
            const options: InteractiveMapOptions = {
                image: "/map.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Top-Left",
                        position: { x: 0, y: 0 },
                        action: () => {},
                    } as MapLabelHotspot,
                    {
                        type: "label",
                        content: "Bottom-Right",
                        position: { x: 100, y: 100 },
                        action: () => {},
                    } as MapLabelHotspot,
                ],
            };
            const map = newInteractiveMap(uniqueId("map"), options);

            const result = map.display();

            expect((result.hotspots[0] as MapLabelHotspot).position).toEqual({
                x: 0,
                y: 0,
            });
            expect((result.hotspots[1] as MapLabelHotspot).position).toEqual({
                x: 100,
                y: 100,
            });
        });

        test("bgOpacity with different values", () => {
            const opacities = [0, 0.25, 0.5, 0.75, 1];

            opacities.forEach((bgOpacity) => {
                const options: InteractiveMapOptions = {
                    image: "/map.jpg",
                    bgImage: "/bg.jpg",
                    hotspots: [],
                    props: { bgOpacity },
                };
                const map = newInteractiveMap(uniqueId("map"), options);

                const result = map.display();

                expect(result.props?.bgOpacity).toBe(bgOpacity);
            });
        });
    });
});
