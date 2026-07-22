import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from "bun:test";
import { Game, type InteractiveMap } from "@react-text-game/core";
import type {
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "@react-text-game/core/passages";
import {
    act,
    cleanup,
    fireEvent,
    render,
    renderHook,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createElement,
    type MouseEvent as ReactMouseEvent,
    type RefObject,
} from "react";

import { Hotspot } from "#components/InteractiveMapComponent/Hotspot";
import { HotspotMap } from "#components/InteractiveMapComponent/HotspotMap";
import { HotspotMenu } from "#components/InteractiveMapComponent/HotspotMenu";
import { HotspotMenuItem } from "#components/InteractiveMapComponent/HotspotMenuItem";
import {
    callIfFunction,
    handleMapClick,
    renderChildren,
} from "#components/InteractiveMapComponent/helpers";
import { InteractiveMapComponent } from "#components/InteractiveMapComponent/InteractiveMapComponent";
import { LabelHotspot } from "#components/InteractiveMapComponent/LabelHotspot";
import { SideHotspot } from "#components/InteractiveMapComponent/SideHotspot";
import type { ImagePositionInfo } from "#components/InteractiveMapComponent/types";
import { useSortHotspots } from "#components/InteractiveMapComponent/useSortHotspots";

const positionInfo: ImagePositionInfo = {
    scaleFactor: 0.5,
    offsetLeft: 10,
    offsetTop: 20,
    scaledWidth: 200,
    scaledHeight: 100,
};

const resizeCallbacks: ResizeObserverCallback[] = [];

class TestResizeObserver {
    readonly observe = mock(() => {});
    readonly unobserve = mock(() => {});
    readonly disconnect = mock(() => {});

    constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback);
    }
}

const originalResizeObserver = globalThis.ResizeObserver;

beforeAll(async () => {
    globalThis.ResizeObserver =
        TestResizeObserver as unknown as typeof ResizeObserver;
    Game._resetForTesting();
    await Game.init({
        gameName: "Map tests",
        gameId: "map-tests",
        isDevMode: true,
    });
});

afterEach(() => {
    cleanup();
    resizeCallbacks.length = 0;
    mock.restore();
});

afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    Game._resetForTesting();
});

describe("interactive map helpers", () => {
    test("calls callback values and leaves static values untouched", () => {
        expect(callIfFunction("static")).toBe("static");
        expect(
            callIfFunction((value: number | undefined) => (value ?? 0) + 2, 3)
        ).toBe(5);
    });

    test("clones element children with image position data and preserves text", () => {
        const Probe = ({
            imagePositionInfo,
        }: {
            imagePositionInfo?: ImagePositionInfo;
        }) => createElement("output", null, imagePositionInfo?.scaledWidth);
        const children = renderChildren({
            children: [createElement(Probe, { key: "probe" }), "plain child"],
            positionInfo,
        });

        render(createElement("div", null, children));
        expect(screen.getByText("200")).toBeTruthy();
        expect(screen.getByText("plain child")).toBeTruthy();
    });

    test("copies development click coordinates to the clipboard", async () => {
        Game.updateOptions({ gameName: "Map tests", isDevMode: true });
        const writeText = spyOn(
            navigator.clipboard,
            "writeText"
        ).mockResolvedValue();
        const image = document.createElement("img");
        image.getBoundingClientRect = () =>
            ({ left: 10, top: 20, width: 200, height: 100 }) as DOMRect;
        const ref = { current: image } as RefObject<HTMLImageElement>;

        handleMapClick(
            { clientX: 110, clientY: 70 } as ReactMouseEvent<HTMLImageElement>,
            ref
        );

        await waitFor(() =>
            expect(writeText).toHaveBeenCalledWith("{ x: 50.00, y: 50.00 }")
        );
    });

    test("reports missing map refs and clipboard failures but is inert outside dev mode", async () => {
        const error = spyOn(console, "error").mockImplementation(() => {});
        const writeText = spyOn(
            navigator.clipboard,
            "writeText"
        ).mockRejectedValue(new Error("denied"));

        handleMapClick(
            { clientX: 1, clientY: 1 } as ReactMouseEvent<HTMLImageElement>,
            { current: null }
        );
        expect(error).toHaveBeenCalledWith(
            "Image reference is null or invalid."
        );

        const image = document.createElement("img");
        image.getBoundingClientRect = () =>
            ({ left: 0, top: 0, width: 10, height: 10 }) as DOMRect;
        handleMapClick(
            { clientX: 2, clientY: 2 } as ReactMouseEvent<HTMLImageElement>,
            { current: image }
        );
        await waitFor(() =>
            expect(error).toHaveBeenCalledWith(
                "Failed to copy to clipboard:",
                expect.any(Error)
            )
        );

        Game.updateOptions({ gameName: "Map tests", isDevMode: false });
        writeText.mockClear();
        handleMapClick(
            { clientX: 2, clientY: 2 } as ReactMouseEvent<HTMLImageElement>,
            { current: image }
        );
        expect(writeText).not.toHaveBeenCalled();
    });
});

describe("hotspot variants", () => {
    test("renders and invokes a dynamic label hotspot with a tooltip", async () => {
        const user = userEvent.setup();
        const action = mock(() => {});
        const hotspot: MapLabelHotspot = {
            id: "gate",
            type: "label",
            position: { x: 50, y: 50 },
            content: () => "Enter gate",
            isDisabled: () => false,
            action,
            props: {
                variant: "bordered",
                color: "warning",
                classNames: { button: "gate-button" },
            },
        };

        render(
            createElement(LabelHotspot, {
                hotspot,
                tooltipContent: "Open the gate",
                tooltipPlacement: "right",
            })
        );
        const button = screen.getByRole("button", { name: "Enter gate" });
        expect(button.className).toContain("gate-button");
        await user.click(button);
        expect(action).toHaveBeenCalledTimes(1);
        await user.hover(button.parentElement as HTMLElement);
        await waitFor(() =>
            expect(screen.getByText("Open the gate")).toBeTruthy()
        );
    });

    test("disables label and menu-item actions when configured", async () => {
        const user = userEvent.setup();
        const action = mock(() => {});
        const item = {
            type: "label",
            content: () => "Unavailable",
            isDisabled: () => true,
            action,
            tooltip: { content: () => "Come back later" },
        } as const;

        render(createElement(HotspotMenuItem, { item }));
        const button = screen.getByRole("button", { name: "Unavailable" });
        expect(button.hasAttribute("disabled")).toBe(true);
        await user.click(button);
        expect(action).not.toHaveBeenCalled();
        await user.hover(button.parentElement as HTMLElement);
        await waitFor(() =>
            expect(screen.getByText("Come back later")).toBeTruthy()
        );
    });

    test("positions map image and label hotspots and supports unknown variants", () => {
        const image: MapImageHotspot = {
            type: "image",
            id: "chest",
            position: () => ({ x: 25, y: 40 }),
            content: { idle: "/chest.png" },
            tooltip: { content: () => "Treasure", position: "bottom" },
            action: mock(() => {}),
        };
        const label: MapLabelHotspot = {
            type: "label",
            position: { x: 75, y: 80 },
            content: "Village",
            action: mock(() => {}),
        };
        const { container, rerender } = render(
            createElement(Hotspot, {
                hotspot: image,
                imagePositionInfo: positionInfo,
            })
        );

        let wrapper = container.querySelector(
            "#hotspot-container"
        ) as HTMLElement;
        expect(wrapper.style.left).toBe("60px");
        expect(wrapper.style.top).toBe("60px");
        expect(screen.getByAltText("chest")).toBeTruthy();

        rerender(
            createElement(Hotspot, {
                hotspot: label,
                imagePositionInfo: positionInfo,
            })
        );
        wrapper = container.querySelector("#hotspot-container") as HTMLElement;
        expect(wrapper.style.left).toBe("160px");
        expect(wrapper.style.top).toBe("100px");
        expect(screen.getByText("Village")).toBeTruthy();

        rerender(
            createElement(Hotspot, {
                hotspot: { type: "unknown" } as unknown as MapLabelHotspot,
            })
        );
        expect(screen.getByText("Unknown Hotspot Type")).toBeTruthy();
    });

    test("renders side image, label, and unknown hotspot variants", () => {
        const image: SideImageHotspot = {
            type: "image",
            position: "left",
            id: "compass",
            content: { idle: "/compass.png" },
            action: mock(() => {}),
        };
        const label: SideLabelHotspot = {
            type: "label",
            position: "right",
            content: "Inventory",
            action: mock(() => {}),
        };
        const { rerender } = render(
            createElement(SideHotspot, { hotspot: image })
        );
        expect(screen.getByAltText("compass")).toBeTruthy();

        rerender(createElement(SideHotspot, { hotspot: label }));
        expect(screen.getByText("Inventory")).toBeTruthy();

        rerender(
            createElement(SideHotspot, {
                hotspot: { type: "unknown" } as unknown as SideLabelHotspot,
            })
        );
        expect(screen.getByText("Unknown Hotspot Type")).toBeTruthy();
    });
});

describe("hotspot menus and sorting", () => {
    test("filters conditional menu entries, positions the menu, and invokes items", async () => {
        const user = userEvent.setup();
        const action = mock(() => {});
        const menu: MapMenu = {
            type: "menu",
            direction: "horizontal",
            position: () => ({ x: 50, y: 50 }),
            items: [
                {
                    type: "label",
                    content: "Inspect",
                    action,
                },
                () => undefined,
            ],
        };

        const { container } = render(
            createElement(HotspotMenu, {
                menu,
                imagePositionInfo: positionInfo,
            })
        );
        const menuElement = container.firstElementChild as HTMLElement;
        expect(menuElement.style.left).toBe("110px");
        expect(menuElement.style.top).toBe("70px");
        expect(menuElement.className).toContain("flex-row");
        await user.click(screen.getByRole("button", { name: "Inspect" }));
        expect(action).toHaveBeenCalledTimes(1);
    });

    test("does not render an empty menu and defaults populated menus to vertical", () => {
        const { container, rerender } = render(
            createElement(HotspotMenu, {
                menu: {
                    type: "menu",
                    position: { x: 0, y: 0 },
                    items: [() => undefined],
                },
            })
        );
        expect(container.innerHTML).toBe("");

        rerender(
            createElement(HotspotMenu, {
                menu: {
                    type: "menu",
                    position: { x: 0, y: 0 },
                    items: [
                        {
                            type: "label",
                            content: "Only",
                            action: mock(() => {}),
                        },
                    ],
                },
            })
        );
        expect(container.firstElementChild?.className).toContain("flex-col");
    });

    test("sorts map and menu hotspots into their public result buckets", () => {
        const mapLabel: MapLabelHotspot = {
            type: "label",
            position: { x: 1, y: 2 },
            content: "Map",
            action: mock(() => {}),
        };
        const menu: MapMenu = {
            type: "menu",
            position: { x: 3, y: 4 },
            items: [],
        };
        const top: SideLabelHotspot = {
            type: "label",
            position: "top",
            content: "Top",
            action: mock(() => {}),
        };
        const bottom: SideLabelHotspot = {
            ...top,
            position: "bottom",
            content: "Bottom",
        };
        const left: SideLabelHotspot = {
            ...top,
            position: "left",
            content: "Left",
        };
        const right: SideLabelHotspot = {
            ...top,
            position: "right",
            content: "Right",
        };
        const { result } = renderHook(() =>
            useSortHotspots({
                hotspots: [mapLabel, menu, top, bottom, left, right],
            })
        );

        expect(result.current.menu).toEqual([menu]);
        expect(result.current.mapHotspots).toEqual([mapLabel]);
        expect(result.current.mapHotspots).not.toContain(top);
        expect(result.current.topHotspots).toEqual([top]);
        expect(result.current.bottomHotspots).toEqual([bottom]);
        expect(result.current.leftHotspots).toEqual([left]);
        expect(result.current.rightHotspots).toEqual([right]);
    });
});

describe("HotspotMap and InteractiveMapComponent", () => {
    test("loads and sizes the map, then supplies dimensions to children and resize callbacks", async () => {
        const Probe = ({
            imagePositionInfo,
        }: {
            imagePositionInfo?: ImagePositionInfo;
        }) =>
            createElement(
                "output",
                { "data-testid": "position" },
                imagePositionInfo?.scaleFactor
            );
        const { container } = render(
            createElement(
                HotspotMap,
                { imageUrl: "/world.png" },
                createElement(Probe)
            )
        );
        const map = container.querySelector("#hotspot-map") as HTMLDivElement;
        const image = screen.getByAltText(
            "Exploration map"
        ) as HTMLImageElement;
        map.getBoundingClientRect = () =>
            ({ width: 400, height: 200, left: 0, top: 0 }) as DOMRect;
        Object.defineProperty(image, "naturalWidth", { value: 800 });
        Object.defineProperty(image, "naturalHeight", { value: 400 });

        expect(container.querySelector(".animate-spin")).toBeTruthy();
        fireEvent.click(image);
        fireEvent.load(image);

        await waitFor(() => {
            expect(screen.getByTestId("position").textContent).toBe("0.5");
            expect(image.style.width).toBe("400px");
            expect(image.style.height).toBe("200px");
        });
        expect(resizeCallbacks).toHaveLength(1);
        const resizeCallback = resizeCallbacks.at(0);
        if (!resizeCallback)
            throw new Error("Resize callback was not registered");
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            fireEvent(window, new Event("resize"));
        });
    });

    test("stops loading and reports map image failures", () => {
        const error = spyOn(console, "error").mockImplementation(() => {});
        const { container } = render(
            createElement(HotspotMap, { imageUrl: "/missing.png" })
        );
        const image = screen.getByAltText(
            "Exploration map"
        ) as HTMLImageElement;
        const reactPropsKey = Object.keys(image).find((key) =>
            key.startsWith("__reactProps$")
        );
        expect(reactPropsKey).toBeDefined();
        if (!reactPropsKey) throw new Error("React props were not attached");
        const reactProps = (
            image as unknown as Record<
                string,
                { onError: (event: Event) => void }
            >
        )[reactPropsKey];
        if (!reactProps)
            throw new Error("React error handler was not attached");
        const imageError = new Event("error");
        let thrown: unknown;

        act(() => {
            try {
                reactProps.onError(imageError);
            } catch (caught) {
                thrown = caught;
            }
        });
        expect(thrown).toBe(imageError);
        expect(error).toHaveBeenCalledWith("Failed to load image:", imageError);
        expect(container.querySelector(".animate-spin")).toBeNull();
    });

    test("renders background, map hotspots, menus, and custom classes", async () => {
        const mapAction = mock(() => {});
        const interactiveMap = {
            display: mock(() => ({
                image: "/map.png",
                bgImage: "/background.png",
                props: { bgOpacity: 0.4 },
                classNames: {
                    container: "map-layout",
                    topHotspots: "top-style",
                },
                hotspots: [
                    {
                        type: "label",
                        position: { x: 50, y: 50 },
                        content: "Town",
                        action: mapAction,
                    },
                    {
                        type: "menu",
                        position: { x: 25, y: 25 },
                        items: [
                            {
                                type: "label",
                                content: "Look",
                                action: mapAction,
                            },
                        ],
                    },
                    {
                        type: "label",
                        position: "top",
                        content: "North",
                        action: mapAction,
                    },
                    {
                        type: "label",
                        position: "bottom",
                        content: "South",
                        action: mapAction,
                    },
                    {
                        type: "label",
                        position: "left",
                        content: "West",
                        action: mapAction,
                    },
                    {
                        type: "label",
                        position: "right",
                        content: "East",
                        action: mapAction,
                    },
                ],
            })),
        } as unknown as InteractiveMap;
        const { container } = render(
            createElement(InteractiveMapComponent, { interactiveMap })
        );

        const background = container.querySelector(
            "#background-image-container"
        ) as HTMLElement;
        expect(background.style.backgroundImage).toContain("/background.png");
        expect(background.style.opacity).toBe("0.4");
        expect(
            container.querySelector("#hotspot-map-container")?.className
        ).toContain("map-layout");
        expect(
            container.querySelector("#top-hotspots-container")?.className
        ).toContain("top-style");
        expect(screen.getByAltText("Exploration map").getAttribute("src")).toBe(
            "/map.png"
        );
        expect(screen.getByRole("button", { name: "North" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "South" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "West" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "East" })).toBeTruthy();
    });
});
