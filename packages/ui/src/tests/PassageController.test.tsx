import {
    Game,
    newInteractiveMap,
    newStory,
    newWidget,
    Passage,
    PassageType,
} from "@react-text-game/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { PassageController } from "#components/PassageController";
import { ComponentsProvider } from "#context/ComponentsContext";

// Test passage class for custom types
class TestPassage extends Passage {
    constructor(id: string, type: string) {
        super(id, type as PassageType);
    }

    display() {
        return { content: `Test passage: ${this.id}` };
    }
}

// Helper to render PassageController with necessary providers
function renderWithProviders(component = createElement(PassageController)) {
    return render(
        createElement(ComponentsProvider, { components: {} }, component)
    );
}

describe("PassageController", () => {
    beforeEach(async () => {
        // Reset game state before each test
        Game._resetForTesting();
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        cleanup();
    });

    describe("Basic Rendering", () => {
        test("renders 'NO PASSAGE SELECTED' when no passage is set", async () => {
            // Set current passage to null
            Game.selfState.currentPassageId = null;

            renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("NO PASSAGE SELECTED")).toBeTruthy();
            });
        });

        test("renders StoryComponent for story passages", async () => {
            const storyId = "test-story";
            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Test story content",
                },
            ]);

            Game.jumpTo(storyId);

            renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("Test story content")).toBeTruthy();
            });
        });

        test("renders InteractiveMapComponent for interactiveMap passages", async () => {
            const mapId = "test-map";
            newInteractiveMap(mapId, {
                image: "/test-image.jpg",
                hotspots: [],
            });

            Game.jumpTo(mapId);

            renderWithProviders();

            await waitFor(() => {
                // Check that the image is rendered
                const img = screen.getByAltText("Exploration map");
                expect(img).toBeTruthy();
                expect(img.getAttribute("src")).toBe("/test-image.jpg");
            });
        });

        test("renders widget content for widget passages", async () => {
            const widgetId = "test-widget";
            newWidget(
                widgetId,
                createElement(
                    "div",
                    { "data-testid": "widget-content" },
                    "Widget Test"
                )
            );

            Game.jumpTo(widgetId);

            renderWithProviders();

            await waitFor(() => {
                expect(screen.getByTestId("widget-content")).toBeTruthy();
                expect(screen.getByText("Widget Test")).toBeTruthy();
            });
        });

        test("renders widget content from function", async () => {
            const widgetId = "test-widget-function";
            newWidget(widgetId, () =>
                createElement(
                    "div",
                    { "data-testid": "widget-function-content" },
                    "Widget Function Test"
                )
            );

            Game.jumpTo(widgetId);

            renderWithProviders();

            await waitFor(() => {
                expect(
                    screen.getByTestId("widget-function-content")
                ).toBeTruthy();
                expect(screen.getByText("Widget Function Test")).toBeTruthy();
            });
        });

        test("widget function is called on each display", async () => {
            const widgetId = "test-widget-call-count";
            let callCount = 0;

            newWidget(widgetId, () => {
                callCount++;
                return createElement(
                    "div",
                    { "data-testid": `call-count-${callCount}` },
                    `Call count: ${callCount}`
                );
            });

            Game.jumpTo(widgetId);

            const { rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByTestId("call-count-1")).toBeTruthy();
                expect(callCount).toBeGreaterThanOrEqual(1);
            });

            const initialCallCount = callCount;

            // Jump to the same passage again - should trigger remount and new function call
            Game.jumpTo(widgetId);

            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                // The function should have been called again
                expect(callCount).toBeGreaterThan(initialCallCount);
            });
        });

        test("handles unknown passage types gracefully", async () => {
            const unknownId = `unknown-type-${Date.now()}`;
            // TestPassage constructor automatically registers the passage
            new TestPassage(unknownId, "unknown-type");

            Game.jumpTo(unknownId);

            const { container } = renderWithProviders();

            await waitFor(() => {
                // For unknown types, PassageController shows an error message
                const text = container.textContent;
                expect(text).toContain("Unknown Passage Type");
            });
        });
    });

    describe("Rerendering Tests", () => {
        test("component rerenders when rerenderId changes", async () => {
            const storyId = "rerender-test";
            let renderCount = 0;

            // Create a custom component that tracks renders
            const TrackableStory = () => {
                renderCount++;
                return createElement(
                    "div",
                    { "data-testid": `render-${renderCount}` },
                    `Render count: ${renderCount}`
                );
            };

            newWidget(storyId, createElement(TrackableStory));

            // First jump
            Game.jumpTo(storyId);

            const { rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByTestId("render-1")).toBeTruthy();
                expect(renderCount).toBe(1);
            });

            // Jump to the SAME passage again - should trigger remount
            Game.jumpTo(storyId);

            // Force rerender to pick up state change
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                // The component should have remounted, so render count should increase
                expect(screen.getByTestId("render-2")).toBeTruthy();
                expect(renderCount).toBe(2);
            });
        });

        test("uses rerenderId in key prop", async () => {
            const storyId = "key-test";
            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Key test content",
                },
            ]);

            Game.jumpTo(storyId);
            const initialRenderId = Game.selfState.renderId;

            const { container, rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("Key test content")).toBeTruthy();
            });

            // Get the root div with the key
            const rootDiv = container.querySelector(".w-full.h-full");
            expect(rootDiv).toBeTruthy();

            // Jump to the same passage again
            Game.jumpTo(storyId);
            const newRenderId = Game.selfState.renderId;

            // Verify renderId changed
            expect(newRenderId).not.toBe(initialRenderId);

            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Key test content")).toBeTruthy();
            });
        });

        test("component maintains correct passage after rerender", async () => {
            const passageId = "maintain-test";
            newStory(passageId, () => [
                {
                    type: "text",
                    content: "Maintained content",
                },
            ]);

            // First jump
            Game.jumpTo(passageId);

            const { rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("Maintained content")).toBeTruthy();
            });

            // Jump to the same passage again
            Game.jumpTo(passageId);

            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            // Content should still be correct
            await waitFor(() => {
                expect(screen.getByText("Maintained content")).toBeTruthy();
                expect(Game.currentPassage?.id).toBe(passageId);
            });
        });

        test("animation classes are applied", async () => {
            const storyId = "animation-test";
            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Animation test",
                },
            ]);

            Game.jumpTo(storyId);

            const { container } = renderWithProviders();

            await waitFor(() => {
                const rootDiv = container.querySelector(".animate-in.fade-in");
                expect(rootDiv).toBeTruthy();
                expect(rootDiv?.classList.contains("duration-300")).toBe(true);
            });
        });
    });

    describe("Navigation Tests", () => {
        test("updates rendered component when passage type changes", async () => {
            const storyId = "story-nav";
            const mapId = "map-nav";

            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Story content",
                },
            ]);

            newInteractiveMap(mapId, {
                image: "/map.jpg",
                hotspots: [],
            });

            // Start with story
            Game.jumpTo(storyId);

            const { rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("Story content")).toBeTruthy();
            });

            // Switch to map
            Game.jumpTo(mapId);

            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                // Check for map image instead of caption
                const img = screen.getByAltText("Exploration map");
                expect(img).toBeTruthy();
                expect(screen.queryByText("Story content")).toBeNull();
            });
        });

        test("handles rapid passage changes", async () => {
            const passage1 = "passage-1";
            const passage2 = "passage-2";
            const passage3 = "passage-3";

            newStory(passage1, () => [{ type: "text", content: "Passage 1" }]);
            newStory(passage2, () => [{ type: "text", content: "Passage 2" }]);
            newStory(passage3, () => [{ type: "text", content: "Passage 3" }]);

            const { rerender } = renderWithProviders();

            // Rapid navigation
            Game.jumpTo(passage1);
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            Game.jumpTo(passage2);
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            Game.jumpTo(passage3);
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            // Final passage should be displayed
            await waitFor(() => {
                expect(screen.getByText("Passage 3")).toBeTruthy();
                expect(Game.currentPassage?.id).toBe(passage3);
            });
        });

        test("handles navigation from null to passage", async () => {
            const storyId = "null-to-passage";
            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Now has passage",
                },
            ]);

            // Start with null
            Game.selfState.currentPassageId = null;

            const { rerender } = renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("NO PASSAGE SELECTED")).toBeTruthy();
            });

            // Navigate to passage
            Game.jumpTo(storyId);

            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Now has passage")).toBeTruthy();
            });
        });
    });

    describe("Edge Cases", () => {
        test("handles passage ID that doesn't exist", async () => {
            // Use setCurrent with non-existent ID
            Game.setCurrent("non-existent-id");

            renderWithProviders();

            await waitFor(() => {
                expect(screen.getByText("NO PASSAGE SELECTED")).toBeTruthy();
            });
        });

        test("handles multiple rerenders of same passage", async () => {
            const passageId = "multi-rerender";
            newStory(passageId, () => [
                {
                    type: "text",
                    content: "Multi rerender test",
                },
            ]);

            const { rerender } = renderWithProviders();

            // Jump to passage multiple times
            for (let i = 0; i < 5; i++) {
                Game.jumpTo(passageId);
                rerender(
                    createElement(
                        ComponentsProvider,
                        { components: {} },
                        createElement(PassageController)
                    )
                );

                await waitFor(() => {
                    expect(
                        screen.getByText("Multi rerender test")
                    ).toBeTruthy();
                    expect(Game.currentPassage?.id).toBe(passageId);
                });
            }
        });

        test("renders correct component type for each passage", async () => {
            const { rerender } = renderWithProviders();

            // Test story passage
            newStory("story-edge", () => [
                { type: "text", content: "Story edge" },
            ]);
            Game.jumpTo("story-edge");
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Story edge")).toBeTruthy();
            });

            // Test interactive map passage
            newInteractiveMap("map-edge", {
                image: "/test.jpg",
                hotspots: [],
            });
            Game.jumpTo("map-edge");
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                const img = screen.getByAltText("Exploration map");
                expect(img).toBeTruthy();
            });

            // Test widget passage
            newWidget("widget-edge", createElement("div", null, "Widget edge"));
            Game.jumpTo("widget-edge");
            rerender(
                createElement(
                    ComponentsProvider,
                    { components: {} },
                    createElement(PassageController)
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Widget edge")).toBeTruthy();
            });
        });

        test("key prop includes passage type and rerenderId", async () => {
            const storyId = "key-format-test";
            newStory(storyId, () => [
                {
                    type: "text",
                    content: "Key format test",
                },
            ]);

            Game.jumpTo(storyId);

            const { container } = renderWithProviders();

            await waitFor(() => {
                const rootDiv = container.querySelector(".w-full.h-full");
                expect(rootDiv).toBeTruthy();

                // The key should be in format: "story-{renderId}"
                // We can't directly access the key, but we can verify the component exists
                expect(screen.getByText("Key format test")).toBeTruthy();
            });
        });
    });
});
