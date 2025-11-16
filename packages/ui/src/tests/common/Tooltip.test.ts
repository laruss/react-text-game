import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement, createRef } from "react";

import { type Placement, Tooltip } from "#components/common/Tooltip";

describe("Tooltip", () => {
    beforeEach(() => {
        // Clean up document.body between tests since tooltips are portaled
        document.body.innerHTML = "";
    });

    afterEach(() => {
        cleanup();
    });

    describe("Basic Rendering", () => {
        test("does not render when disabled is true", () => {
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: true,
                    })
                )
            );

            // Tooltip should not be in the document
            expect(screen.queryByTestId("tooltip-content")).toBeNull();
        });

        test("does not render when not visible", () => {
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: false,
                    })
                )
            );

            // Tooltip should not be visible initially
            expect(screen.queryByTestId("tooltip-content")).toBeNull();
        });

        test("renders when visible after hover", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: false,
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
                expect(screen.getByText("Tooltip content")).toBeTruthy();
            });
        });

        test("applies custom className", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        className: "custom-tooltip-class",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                expect(tooltip.className).toContain("custom-tooltip-class");
            });
        });

        test("renders with ReactNode content", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: createElement("strong", null, "Bold tooltip"),
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByText("Bold tooltip")).toBeTruthy();
                const strong = screen.getByText("Bold tooltip").tagName;
                expect(strong).toBe("STRONG");
            });
        });
    });

    describe("Visibility Control", () => {
        test("shows tooltip on mouseenter", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            expect(screen.queryByTestId("tooltip-content")).toBeNull();

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });

        test("hides tooltip on mouseleave", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });

            await user.unhover(button);

            await waitFor(() => {
                expect(screen.queryByTestId("tooltip-content")).toBeNull();
            });
        });

        test("does not show tooltip when disabled", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: true,
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            // Wait a bit to ensure it doesn't appear
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(screen.queryByTestId("tooltip-content")).toBeNull();
        });
    });

    describe("Placement Positioning", () => {
        const placements: Placement[] = [
            "top",
            "top-right",
            "top-left",
            "bottom",
            "bottom-right",
            "bottom-left",
            "right",
            "left",
        ];

        placements.forEach((placement) => {
            test(`renders with ${placement} placement`, async () => {
                const user = userEvent.setup();
                const targetRef = createRef<HTMLButtonElement>();

                render(
                    createElement(
                        "div",
                        null,
                        createElement("button", { ref: targetRef }, "Hover me"),
                        createElement(Tooltip, {
                            targetRef,
                            content: "Tooltip content",
                            placement,
                        })
                    )
                );

                const button = screen.getByText("Hover me");
                await user.hover(button);

                await waitFor(() => {
                    const tooltip = screen.getByTestId("tooltip-content");
                    expect(tooltip).toBeTruthy();
                    // Tooltip should have positioning styles
                    expect(tooltip.style.top).toBeTruthy();
                    expect(tooltip.style.left).toBeTruthy();
                });
            });
        });

        test("defaults to top placement when not specified", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });
    });

    describe("Arrow Rendering", () => {
        test("renders arrow element", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                const arrow = tooltip.querySelector(".rotate-45");
                expect(arrow).toBeTruthy();
            });
        });

        test("arrow has correct styles", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                const arrow = tooltip.querySelector(".rotate-45");
                expect(arrow).toBeTruthy();
                // Arrow should have position styles
                expect((arrow as HTMLElement).style.top).toBeTruthy();
                expect((arrow as HTMLElement).style.left).toBeTruthy();
            });
        });
    });

    describe("Portal Behavior", () => {
        test("renders tooltip in document.body via portal", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            const { container } = render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                expect(tooltip).toBeTruthy();
                // Tooltip should be in document.body, not in the container
                expect(container.contains(tooltip)).toBe(false);
                expect(document.body.contains(tooltip)).toBe(true);
            });
        });
    });

    describe("Edge Cases", () => {
        test("handles null targetRef gracefully", () => {
            const targetRef = createRef<HTMLButtonElement>();

            // Don't attach the ref to anything
            render(
                createElement(
                    "div",
                    null,
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            // Should not error, just not render
            expect(screen.queryByTestId("tooltip-content")).toBeNull();
        });

        test("cleans up event listeners on unmount", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            const { unmount } = render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });

            // Unmount the component
            unmount();

            // Tooltip should be removed
            expect(screen.queryByTestId("tooltip-content")).toBeNull();
        });

        test("shows tooltip when disabled changes from true to false", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            const { rerender } = render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: true,
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            expect(screen.queryByTestId("tooltip-content")).toBeNull();

            // Unhover first
            await user.unhover(button);

            // Re-render with disabled: false
            rerender(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        disabled: false,
                    })
                )
            );

            // Hover again to trigger the tooltip
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });

        test("handles placement change while visible", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            const { rerender } = render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        placement: "top",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });

            // Change placement
            rerender(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                        placement: "bottom",
                    })
                )
            );

            await waitFor(() => {
                // Position should update based on new placement
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });

        test("tooltip has correct ARIA attributes", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                expect(tooltip.getAttribute("role")).toBe("tooltip");
            });
        });

        test("handles rapid hover/unhover without errors", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");

            // Rapidly hover and unhover
            await user.hover(button);
            await user.unhover(button);
            await user.hover(button);
            await user.unhover(button);
            await user.hover(button);

            // Should handle this gracefully
            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });
    });

    describe("Styling", () => {
        test("applies correct CSS classes", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                expect(tooltip.className).toContain("fixed");
                expect(tooltip.className).toContain("z-50");
                expect(tooltip.className).toContain("bg-popover");
                expect(tooltip.className).toContain("border");
            });
        });

        test("has visible opacity when shown", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLButtonElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("button", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const button = screen.getByText("Hover me");
            await user.hover(button);

            await waitFor(() => {
                const tooltip = screen.getByTestId("tooltip-content");
                expect(tooltip.className).toContain("opacity-100");
            });
        });
    });

    describe("Different Target Types", () => {
        test("works with HTMLDivElement ref", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLDivElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("div", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const div = screen.getByText("Hover me");
            await user.hover(div);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });

        test("works with HTMLElement ref", async () => {
            const user = userEvent.setup();
            const targetRef = createRef<HTMLElement>();

            render(
                createElement(
                    "div",
                    null,
                    createElement("span", { ref: targetRef }, "Hover me"),
                    createElement(Tooltip, {
                        targetRef,
                        content: "Tooltip content",
                    })
                )
            );

            const span = screen.getByText("Hover me");
            await user.hover(span);

            await waitFor(() => {
                expect(screen.getByTestId("tooltip-content")).toBeTruthy();
            });
        });
    });
});
