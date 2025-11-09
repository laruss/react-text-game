import { MapImageHotspot } from "@react-text-game/core/passages";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { createElement } from "react";

import { ImageHotspot } from "#components/InteractiveMapComponent/ImageHotspot";
import { ImagePositionInfo } from "#components/InteractiveMapComponent/types";

describe("ImageHotspot", () => {
    beforeEach(() => {
        // Any setup if needed
    });

    afterEach(() => {
        cleanup();
    });

    describe("Basic Rendering", () => {
        test("renders idle state by default", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const image = screen.getByAltText("test-hotspot");
            expect(image).toBeTruthy();
            expect(image.getAttribute("src")).toBe("/images/idle.png");
        });

        test("renders with custom classNames", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
                props: {
                    classNames: {
                        container: "custom-container",
                        idle: "custom-idle",
                    },
                },
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot })
            );

            const button = container.querySelector(".custom-container");
            expect(button).toBeTruthy();

            const image = container.querySelector(".custom-idle");
            expect(image).toBeTruthy();
        });
    });

    describe("Interactive States", () => {
        test("shows hover state on mouse enter", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                    hover: "/images/hover.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.hover(button);

            await waitFor(() => {
                const image = screen.getByAltText("hotspot hover");
                expect(image).toBeTruthy();
                expect(image.getAttribute("src")).toBe("/images/hover.png");
            });
        });

        test("shows idle state on mouse leave", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                    hover: "/images/hover.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");

            // Hover
            await user.hover(button);
            await waitFor(() => {
                expect(screen.getByAltText("hotspot hover")).toBeTruthy();
            });

            // Unhover
            await user.unhover(button);
            await waitFor(() => {
                const image = screen.getByAltText("test-hotspot");
                expect(image).toBeTruthy();
                expect(image.getAttribute("src")).toBe("/images/idle.png");
            });
        });

        test("shows active state on click", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                    active: "/images/active.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.click(button);

            // Active state should show briefly
            await waitFor(() => {
                const image = screen.queryByAltText("hotspot active");
                expect(image).toBeTruthy();
            });

            // Should return to idle after timeout
            await waitFor(
                () => {
                    const image = screen.queryByAltText("test-hotspot");
                    expect(image).toBeTruthy();
                },
                { timeout: 200 }
            );
        });

        test("calls action on click", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        test("shows disabled state when isDisabled is true", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                    disabled: "/images/disabled.png",
                },
                action: mockAction,
                isDisabled: true,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const image = screen.getByAltText("hotspot disabled");
            expect(image).toBeTruthy();
            expect(image.getAttribute("src")).toBe("/images/disabled.png");

            const button = screen.getByRole("button");
            expect(button.hasAttribute("disabled")).toBe(true);
        });

        test("does not call action when disabled and clicked", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
                isDisabled: true,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockAction).not.toHaveBeenCalled();
        });
    });

    describe("Dynamic Content (Functions)", () => {
        test("handles content as functions", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: () => "/images/dynamic-idle.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const image = screen.getByAltText("test-hotspot");
            expect(image.getAttribute("src")).toBe("/images/dynamic-idle.png");
        });

        test("handles isDisabled as function", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                    disabled: "/images/disabled.png",
                },
                action: mockAction,
                isDisabled: () => true,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            expect(button.hasAttribute("disabled")).toBe(true);
        });
    });

    describe("Scaling with imagePositionInfo", () => {
        test("applies default scale when no imagePositionInfo provided", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            const style = button!.style;
            expect(style.transform).toBe("scale(1)");
        });

        test("applies scaleFactor from imagePositionInfo", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            const imagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0.5,
                offsetLeft: 100,
                offsetTop: 100,
                scaledWidth: 500,
                scaledHeight: 500,
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot, imagePositionInfo })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            const style = button!.style;
            expect(style.transform).toBe("scale(0.5)");
        });

        test("combines scaleFactor with custom zoom prop", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
                props: {
                    zoom: "200%",
                },
            };

            const imagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0.5,
                offsetLeft: 100,
                offsetTop: 100,
                scaledWidth: 500,
                scaledHeight: 500,
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot, imagePositionInfo })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            const style = button!.style;
            // 0.5 (scaleFactor) * 2 (200% zoom) = 1
            expect(style.transform).toBe("scale(1)");
        });

        test("updates scale when imagePositionInfo changes", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            const initialImagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0.5,
                offsetLeft: 100,
                offsetTop: 100,
                scaledWidth: 500,
                scaledHeight: 500,
            };

            const { container, rerender } = render(
                createElement(ImageHotspot, {
                    hotspot,
                    imagePositionInfo: initialImagePositionInfo,
                })
            );

            let button = container.querySelector("button");
            expect(button!.style.transform).toBe("scale(0.5)");

            // Simulate window resize - update imagePositionInfo
            const updatedImagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0.75,
                offsetLeft: 150,
                offsetTop: 150,
                scaledWidth: 750,
                scaledHeight: 750,
            };

            rerender(
                createElement(ImageHotspot, {
                    hotspot,
                    imagePositionInfo: updatedImagePositionInfo,
                })
            );

            button = container.querySelector("button");
            expect(button!.style.transform).toBe("scale(0.75)");
        });

        test("applies transform origin center center", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            const imagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0.5,
                offsetLeft: 100,
                offsetTop: 100,
                scaledWidth: 500,
                scaledHeight: 500,
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot, imagePositionInfo })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            const style = button!.style;
            expect(style.transformOrigin).toBe("center center");
        });
    });

    describe("Edge Cases", () => {
        test("handles missing hover content gracefully", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.hover(button);

            // Should still show idle when hover is missing
            const image = screen.getByAltText("test-hotspot");
            expect(image.getAttribute("src")).toBe("/images/idle.png");
        });

        test("handles missing active content gracefully", async () => {
            const user = userEvent.setup();
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            render(createElement(ImageHotspot, { hotspot }));

            const button = screen.getByRole("button");
            await user.click(button);

            // Should still show idle when active is missing
            const image = screen.getByAltText("test-hotspot");
            expect(image.getAttribute("src")).toBe("/images/idle.png");
        });

        test("handles missing disabled content gracefully", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
                isDisabled: true,
            };

            render(createElement(ImageHotspot, { hotspot }));

            // Should show idle when disabled content is missing
            const image = screen.getByAltText("test-hotspot");
            expect(image.getAttribute("src")).toBe("/images/idle.png");
        });

        test("handles zoom prop correctly", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
                props: {
                    zoom: "150%",
                },
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            // parseFloat("150%") / 100 = 1.5
            const style = button!.style;
            expect(style.transform).toBe("scale(1.5)");
        });

        test("handles zero scaleFactor", () => {
            const mockAction = mock(() => {});
            const hotspot: MapImageHotspot = {
                id: "test-hotspot",
                type: "image",
                position: { x: 50, y: 50 },
                content: {
                    idle: "/images/idle.png",
                },
                action: mockAction,
            };

            const imagePositionInfo: ImagePositionInfo = {
                scaleFactor: 0,
                offsetLeft: 100,
                offsetTop: 100,
                scaledWidth: 500,
                scaledHeight: 500,
            };

            const { container } = render(
                createElement(ImageHotspot, { hotspot, imagePositionInfo })
            );

            const button = container.querySelector("button");
            expect(button).toBeTruthy();
            const style = button!.style;
            // Zero scaleFactor should be preserved (not treated as falsy)
            expect(style.transform).toBe("scale(0)");
        });
    });
});
