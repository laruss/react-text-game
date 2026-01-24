import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { Game } from "#game";
import { newInteractiveMap } from "#passages/interactiveMap/fabric";
import type { InteractiveMapType } from "#passages/interactiveMap/types";
import { newStory } from "#passages/story/fabric";
import type {
    Component,
    StoryOptions,
    TextComponent,
} from "#passages/story/types";
import { newWidget } from "#passages/widget";
import { Storage } from "#storage";

type StoryDisplayResult = {
    options?: StoryOptions;
    components: Array<Component>;
};

// Counter for unique IDs
let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("Passage Display Cache - No Double Side Effects", () => {
    beforeEach(async () => {
        Storage.setState({});
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        Game._resetForTesting();
    });

    describe("Story Cache", () => {
        test("getLastDisplayResult returns null before first display", () => {
            const story = newStory(uniqueId("story"), () => [
                { type: "text", content: "Hello" },
            ]);

            expect(story.getLastDisplayResult()).toBeNull();
            expect(story.hasDisplayCache()).toBe(false);
        });

        test("getLastDisplayResult returns cached result after display", () => {
            const story = newStory(uniqueId("story"), () => [
                { type: "text", content: "Hello" },
            ]);

            const displayResult = story.display();
            const cachedResult = story.getLastDisplayResult();

            expect(cachedResult).toEqual(displayResult);
            expect(story.hasDisplayCache()).toBe(true);
        });

        test("getLastDisplayResult does NOT trigger content function (no side effects)", () => {
            let callCount = 0;
            const story = newStory(uniqueId("story"), () => {
                callCount++;
                return [{ type: "text", content: `Call ${callCount}` }];
            });

            // First display() call - triggers content function
            story.display();
            expect(callCount).toBe(1);

            // Multiple getLastDisplayResult() calls - should NOT trigger content function
            story.getLastDisplayResult();
            story.getLastDisplayResult();
            story.getLastDisplayResult();
            expect(callCount).toBe(1); // Still 1, no additional calls

            // Another display() call - SHOULD trigger content function
            story.display();
            expect(callCount).toBe(2);
        });

        test("cache updates correctly after each display call", () => {
            let callCount = 0;
            const story = newStory(uniqueId("story"), () => {
                callCount++;
                return [
                    {
                        type: "text",
                        content: `Call ${callCount}`,
                    } as TextComponent,
                ];
            });

            story.display();
            const cache1 = story.getLastDisplayResult<StoryDisplayResult>();
            expect((cache1?.components[0] as TextComponent).content).toBe(
                "Call 1"
            );

            story.display();
            const cache2 = story.getLastDisplayResult<StoryDisplayResult>();
            expect((cache2?.components[0] as TextComponent).content).toBe(
                "Call 2"
            );
        });

        test("simulates DevModeDrawer scenario - no side effects when reading passage data", () => {
            let sideEffectCounter = 0;
            const story = newStory(uniqueId("story"), () => {
                sideEffectCounter++; // Simulates a side effect like incrementing a game counter
                return [
                    {
                        type: "text",
                        content: `Viewed ${sideEffectCounter} times`,
                    },
                ];
            });

            // User navigates to passage (display is called by UI)
            Game.jumpTo(story.id);
            story.display();
            expect(sideEffectCounter).toBe(1);

            // User opens DevModeDrawer - should NOT cause side effect
            const cachedData = story.getLastDisplayResult();
            expect(sideEffectCounter).toBe(1); // Still 1
            expect(cachedData).not.toBeNull();

            // User refreshes DevModeDrawer multiple times - still no side effects
            story.getLastDisplayResult();
            story.getLastDisplayResult();
            expect(sideEffectCounter).toBe(1);
        });

        test("cached result has correct structure with options and components", () => {
            const story = newStory(
                uniqueId("story"),
                () => [
                    { type: "text", content: "Test" },
                    { type: "header", content: "Header", props: { level: 1 } },
                ],
                { background: { image: "/bg.jpg" } }
            );

            story.display();
            const cached = story.getLastDisplayResult<StoryDisplayResult>();

            expect(cached).not.toBeNull();
            expect(cached?.options?.background?.image).toBe("/bg.jpg");
            expect(cached?.components).toHaveLength(2);
            expect(cached?.components[0]?.type).toBe("text");
            expect(cached?.components[1]?.type).toBe("header");
        });
    });

    describe("InteractiveMap Cache", () => {
        test("getLastDisplayResult returns null before first display", () => {
            const map = newInteractiveMap(uniqueId("map"), {
                image: "/map.jpg",
                bgImage: "/bg.jpg",
                hotspots: [],
            });

            expect(map.getLastDisplayResult()).toBeNull();
            expect(map.hasDisplayCache()).toBe(false);
        });

        test("getLastDisplayResult returns cached result after display", () => {
            const map = newInteractiveMap(uniqueId("map"), {
                image: "/map.jpg",
                bgImage: "/bg.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Test",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    },
                ],
            });

            const displayResult = map.display();
            const cachedResult = map.getLastDisplayResult<InteractiveMapType>();

            expect(cachedResult?.image).toBe(displayResult.image);
            expect(cachedResult?.bgImage).toBe(displayResult.bgImage);
            expect(cachedResult?.hotspots.length).toBe(
                displayResult.hotspots.length
            );
            expect(map.hasDisplayCache()).toBe(true);
        });

        test("getLastDisplayResult does NOT trigger hotspot functions (no side effects)", () => {
            let imageCallCount = 0;
            let hotspotCallCount = 0;

            const map = newInteractiveMap(uniqueId("map"), {
                image: () => {
                    imageCallCount++;
                    return `/map-${imageCallCount}.jpg`;
                },
                bgImage: "/bg.jpg",
                hotspots: [
                    () => {
                        hotspotCallCount++;
                        return {
                            type: "label" as const,
                            content: `Hotspot ${hotspotCallCount}`,
                            position: { x: 50, y: 50 },
                            action: () => {},
                        };
                    },
                ],
            });

            // First display() - triggers all functions
            map.display();
            expect(imageCallCount).toBe(1);
            expect(hotspotCallCount).toBe(1);

            // getLastDisplayResult() should NOT trigger functions
            map.getLastDisplayResult();
            map.getLastDisplayResult();
            expect(imageCallCount).toBe(1);
            expect(hotspotCallCount).toBe(1);
        });

        test("cached result has resolved images and hotspots", () => {
            const map = newInteractiveMap(uniqueId("map"), {
                image: () => "/dynamic-map.jpg",
                bgImage: () => "/dynamic-bg.jpg",
                hotspots: [
                    () => ({
                        type: "label" as const,
                        content: "Dynamic Hotspot",
                        position: { x: 25, y: 75 },
                        action: () => {},
                    }),
                ],
            });

            map.display();
            const cached = map.getLastDisplayResult<InteractiveMapType>();

            expect(cached).not.toBeNull();
            expect(cached?.image).toBe("/dynamic-map.jpg");
            expect(cached?.bgImage).toBe("/dynamic-bg.jpg");
            expect(cached?.hotspots).toHaveLength(1);
            const hotspot = cached?.hotspots[0];
            if (hotspot && hotspot.type === "label") {
                expect(hotspot.content).toBe("Dynamic Hotspot");
            }
        });

        test("cache updates on each display call", () => {
            let displayCount = 0;

            const map = newInteractiveMap(uniqueId("map"), {
                image: () => {
                    displayCount++;
                    return `/map-${displayCount}.jpg`;
                },
                bgImage: "/bg.jpg",
                hotspots: [
                    {
                        type: "label" as const,
                        content: "Test",
                        position: { x: 50, y: 50 },
                        action: () => {},
                    },
                ],
            });

            map.display();
            expect(displayCount).toBe(1);
            expect(map.getLastDisplayResult<InteractiveMapType>()?.image).toBe(
                "/map-1.jpg"
            );

            map.display();
            expect(displayCount).toBe(2);
            expect(map.getLastDisplayResult<InteractiveMapType>()?.image).toBe(
                "/map-2.jpg"
            );
        });
    });

    describe("Widget Cache", () => {
        test("getLastDisplayResult returns null before first display", () => {
            const widget = newWidget(uniqueId("widget"), "Static Content");

            expect(widget.getLastDisplayResult()).toBeNull();
            expect(widget.hasDisplayCache()).toBe(false);
        });

        test("getLastDisplayResult returns cached result after display for static content", () => {
            const staticContent = "Static Widget Content";
            const widget = newWidget(uniqueId("widget"), staticContent);

            const displayResult = widget.display();
            const cachedResult = widget.getLastDisplayResult();

            expect(cachedResult).toBe(staticContent);
            expect(cachedResult).toBe(displayResult);
            expect(widget.hasDisplayCache()).toBe(true);
        });

        test("function content is treated as React component (createElement)", () => {
            // With the new behavior, functions are always treated as React components
            // and wrapped in createElement, not called directly.
            // This ensures hooks work correctly in minified production builds.
            const widget = newWidget(uniqueId("widget"), () => "Content");

            const displayResult = widget.display();

            // The result is a React element, not the string "Content"
            expect(displayResult).toBeDefined();
            expect(typeof displayResult).toBe("object");
            expect(widget.hasDisplayCache()).toBe(true);
        });
    });

    describe("Base Passage Methods", () => {
        test("hasDisplayCache returns false before display", () => {
            const story = newStory(uniqueId("story"), () => [
                { type: "text", content: "Test" },
            ]);

            expect(story.hasDisplayCache()).toBe(false);
        });

        test("hasDisplayCache returns true after display", () => {
            const story = newStory(uniqueId("story"), () => [
                { type: "text", content: "Test" },
            ]);

            story.display();
            expect(story.hasDisplayCache()).toBe(true);
        });

        test("getLastDisplayResult returns properly typed result", () => {
            const story = newStory(uniqueId("story"), () => [
                { type: "text", content: "Test" },
            ]);

            story.display();

            // Using the Story's typed getLastDisplayResult method
            const result = story.getLastDisplayResult<StoryDisplayResult>();

            expect(result?.components[0]?.type).toBe("text");
        });
    });

    describe("Practical Scenarios", () => {
        test("simulates load game scenario - cache populated by first render", () => {
            let stateChangeCount = 0;

            const story = newStory(uniqueId("story"), () => {
                stateChangeCount++; // Simulates state change during render
                return [
                    {
                        type: "text",
                        content: `State changed ${stateChangeCount} times`,
                    },
                ];
            });

            // Simulate initial render after loading game
            story.display();
            expect(stateChangeCount).toBe(1);

            // Simulate DevModeDrawer opening (should use cache)
            const cachedData = story.getLastDisplayResult();
            expect(stateChangeCount).toBe(1); // No additional state change
            expect(cachedData).not.toBeNull();

            // Simulate re-render (intentional)
            story.display();
            expect(stateChangeCount).toBe(2);
        });

        test("multiple passages maintain independent caches", () => {
            let story1CallCount = 0;
            let story2CallCount = 0;

            const story1 = newStory(uniqueId("story1"), () => {
                story1CallCount++;
                return [
                    {
                        type: "text",
                        content: `Story 1 call ${story1CallCount}`,
                    },
                ];
            });

            const story2 = newStory(uniqueId("story2"), () => {
                story2CallCount++;
                return [
                    {
                        type: "text",
                        content: `Story 2 call ${story2CallCount}`,
                    },
                ];
            });

            story1.display();
            expect(story1CallCount).toBe(1);
            expect(story2CallCount).toBe(0);

            story2.display();
            expect(story1CallCount).toBe(1);
            expect(story2CallCount).toBe(1);

            // Getting cached results doesn't affect call counts
            story1.getLastDisplayResult();
            story2.getLastDisplayResult();
            expect(story1CallCount).toBe(1);
            expect(story2CallCount).toBe(1);
        });
    });
});
