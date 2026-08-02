import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { Game } from "#game";
import {
    buildFromFlatOptions,
    commonHelpers,
    compact,
} from "#passages/definition";
import {
    defineInteractiveMap,
    newInteractiveMap,
} from "#passages/interactiveMap/fabric";
import { mapHelpers } from "#passages/interactiveMap/helpers";
import { InteractiveMap } from "#passages/interactiveMap/interactiveMap";
import type {
    LabelHotspot,
    MapImage,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideLabelHotspot,
} from "#passages/interactiveMap/types";
import { defineStory } from "#passages/story/fabric";
import { storyHelpers } from "#passages/story/helpers";
import { Story } from "#passages/story/story";
import type {
    ActionsComponent,
    AnotherStoryComponent,
    ConversationComponent,
    HeaderComponent,
    ImageComponent,
    TextComponent,
    VideoComponent,
} from "#passages/story/types";
import { defineWidget, newWidget, Widget } from "#passages/widget";
import { Storage } from "#storage";

let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("Passage definition helpers", () => {
    beforeEach(async () => {
        Storage.setState({});
        await Game.init({ gameName: "Define Test Game", isDevMode: true });
    });

    afterEach(() => {
        Game._resetForTesting();
    });

    describe("commonHelpers.jump", () => {
        test("returns a callback that navigates by passage id", () => {
            const id = uniqueId("jump-target");
            defineStory(id, (h) => [h.text("Arrived")]);

            const jump = commonHelpers.jump(id);
            expect(Game.currentPassage?.id).not.toBe(id);

            jump();

            expect(Game.currentPassage?.id).toBe(id);
        });

        test("returns a callback that navigates by passage instance", () => {
            const target = defineStory(uniqueId("jump-instance"), (h) => [
                h.text("Arrived"),
            ]);

            commonHelpers.jump(target)();

            expect(Game.currentPassage).toBe(target);
        });

        test("does not navigate until the callback is invoked", () => {
            const target = defineStory(uniqueId("jump-lazy"), (h) => [
                h.text("Arrived"),
            ]);
            const before = Game.currentPassage;

            commonHelpers.jump(target);

            expect(Game.currentPassage).toBe(before);
        });
    });

    describe("commonHelpers.when", () => {
        test("returns the value when the condition is truthy", () => {
            expect(commonHelpers.when(true, "value")).toBe("value");
            expect(commonHelpers.when(1, "value")).toBe("value");
        });

        test("returns undefined when the condition is falsy", () => {
            expect(commonHelpers.when(false, "value")).toBeUndefined();
            expect(commonHelpers.when(0, "value")).toBeUndefined();
            expect(commonHelpers.when(undefined, "value")).toBeUndefined();
        });

        test("calls a function value only when the condition passes", () => {
            let calls = 0;
            const produce = () => {
                calls += 1;
                return "built";
            };

            expect(commonHelpers.when(false, produce)).toBeUndefined();
            expect(calls).toBe(0);

            expect(commonHelpers.when(true, produce)).toBe("built");
            expect(calls).toBe(1);
        });
    });

    describe("buildFromFlatOptions", () => {
        test("keeps root keys at the top level and nests the rest", () => {
            const result = buildFromFlatOptions(
                { type: "text", content: "Hello" },
                { id: "intro", className: "text-lg", isHTML: true },
                ["id"]
            );

            expect(result).toEqual({
                type: "text",
                content: "Hello",
                id: "intro",
                props: { className: "text-lg", isHTML: true },
            });
        });

        test("omits props entirely when no nested keys are supplied", () => {
            const result = buildFromFlatOptions(
                { type: "text", content: "Hello" },
                { id: "intro" },
                ["id"]
            );

            expect(result).toEqual({
                type: "text",
                content: "Hello",
                id: "intro",
            });
            expect(result).not.toHaveProperty("props");
        });

        test("drops keys explicitly set to undefined", () => {
            const result = buildFromFlatOptions(
                { type: "text", content: "Hello" },
                { id: undefined, className: undefined },
                ["id"]
            );

            expect(result).toEqual({ type: "text", content: "Hello" });
        });
    });

    describe("compact", () => {
        test("removes false, null and undefined entries", () => {
            expect(compact([1, false, 2, null, 3, undefined])).toEqual([
                1, 2, 3,
            ]);
        });

        test("keeps other falsy values", () => {
            expect(compact([0, ""])).toEqual([0, ""]);
        });

        test("returns an empty array when everything is filtered out", () => {
            expect(compact([false, null, undefined])).toEqual([]);
        });
    });

    describe("storyHelpers", () => {
        test("text builds a text component", () => {
            expect(storyHelpers.text("Hello")).toEqual({
                type: "text",
                content: "Hello",
            } as TextComponent);

            expect(
                storyHelpers.text("Hello", {
                    className: "text-lg",
                    isHTML: true,
                    id: "greeting",
                })
            ).toEqual({
                type: "text",
                content: "Hello",
                id: "greeting",
                props: { className: "text-lg", isHTML: true },
            } as TextComponent);
        });

        test("header builds a header component", () => {
            expect(
                storyHelpers.header("Chapter 1", {
                    level: 2,
                    className: "text-center",
                })
            ).toEqual({
                type: "header",
                content: "Chapter 1",
                props: { level: 2, className: "text-center" },
            } as HeaderComponent);

            expect(storyHelpers.header("Chapter 1")).toEqual({
                type: "header",
                content: "Chapter 1",
            } as HeaderComponent);
        });

        test("image builds an image component", () => {
            const onClick = () => {};

            expect(
                storyHelpers.image("/scene.jpg", {
                    alt: "A scene",
                    disableModal: true,
                    onClick,
                })
            ).toEqual({
                type: "image",
                content: "/scene.jpg",
                props: { alt: "A scene", disableModal: true, onClick },
            } as ImageComponent);

            expect(storyHelpers.image("/scene.jpg")).toEqual({
                type: "image",
                content: "/scene.jpg",
            } as ImageComponent);
        });

        test("video builds a video component", () => {
            expect(
                storyHelpers.video("/clip.mp4", { controls: true, loop: false })
            ).toEqual({
                type: "video",
                content: "/clip.mp4",
                props: { controls: true, loop: false },
            } as VideoComponent);

            expect(storyHelpers.video("/clip.mp4")).toEqual({
                type: "video",
                content: "/clip.mp4",
            } as VideoComponent);
        });

        test("actions builds an actions component and drops falsy items", () => {
            const go = () => {};

            expect(
                storyHelpers.actions(
                    [
                        { label: "Go", action: go },
                        false,
                        null,
                        undefined,
                        { label: "Stay", action: go },
                    ],
                    { direction: "vertical" }
                )
            ).toEqual({
                type: "actions",
                content: [
                    { label: "Go", action: go },
                    { label: "Stay", action: go },
                ],
                props: { direction: "vertical" },
            } as ActionsComponent);

            expect(storyHelpers.actions([{ label: "Go", action: go }])).toEqual(
                {
                    type: "actions",
                    content: [{ label: "Go", action: go }],
                } as ActionsComponent
            );
        });

        test("actions accept ReactNode content", () => {
            const go = () => {};
            const node = createElement("b", null, "Go");

            expect(
                storyHelpers.actions([
                    { content: node, action: go },
                    { content: "Stay", action: go },
                ])
            ).toEqual({
                type: "actions",
                content: [
                    { content: node, action: go },
                    { content: "Stay", action: go },
                ],
            } as ActionsComponent);
        });

        test("conversation keeps appearance at the top level", () => {
            expect(
                storyHelpers.conversation(
                    [{ content: "Hi" }, false, { content: "Hello" }],
                    { appearance: "byClick", variant: "messenger" }
                )
            ).toEqual({
                type: "conversation",
                content: [{ content: "Hi" }, { content: "Hello" }],
                appearance: "byClick",
                props: { variant: "messenger" },
            } as ConversationComponent);

            expect(storyHelpers.conversation([{ content: "Hi" }])).toEqual({
                type: "conversation",
                content: [{ content: "Hi" }],
            } as ConversationComponent);
        });

        test("include builds an embedded story component", () => {
            expect(storyHelpers.include("common-intro")).toEqual({
                type: "anotherStory",
                storyId: "common-intro",
            } as AnotherStoryComponent);

            expect(
                storyHelpers.include("common-intro", { id: "intro-slot" })
            ).toEqual({
                type: "anotherStory",
                storyId: "common-intro",
                id: "intro-slot",
            } as AnotherStoryComponent);
        });

        test("exposes the common helpers", () => {
            expect(storyHelpers.jump).toBeFunction();
            expect(storyHelpers.when).toBeFunction();
        });
    });

    describe("mapHelpers", () => {
        test("label builds a map-positioned label hotspot", () => {
            const action = () => {};

            expect(
                mapHelpers.label("Village", {
                    position: { x: 30, y: 40 },
                    action,
                    color: "secondary",
                })
            ).toEqual({
                type: "label",
                content: "Village",
                position: { x: 30, y: 40 },
                action,
                props: { color: "secondary" },
            } as MapLabelHotspot);
        });

        test("label builds a side-positioned label hotspot", () => {
            const action = () => {};
            const isDisabled = () => true;

            expect(
                mapHelpers.label("Menu", {
                    position: "top",
                    action,
                    isDisabled,
                    tooltip: { content: "Open the menu" },
                })
            ).toEqual({
                type: "label",
                content: "Menu",
                position: "top",
                action,
                isDisabled,
                tooltip: { content: "Open the menu" },
            } as SideLabelHotspot);
        });

        test("image builds an image hotspot", () => {
            const action = () => {};

            expect(
                mapHelpers.image(
                    { idle: "/chest.png", hover: "/chest-glow.png" },
                    { position: { x: 60, y: 70 }, action, zoom: "150%" }
                )
            ).toEqual({
                type: "image",
                content: { idle: "/chest.png", hover: "/chest-glow.png" },
                position: { x: 60, y: 70 },
                action,
                props: { zoom: "150%" },
            } as MapImageHotspot);
        });

        test("mapImage builds a decorative image", () => {
            expect(
                mapHelpers.mapImage("/guard.png", {
                    position: { x: 42, y: 68 },
                    alt: "Castle guard",
                })
            ).toEqual({
                type: "mapImage",
                content: "/guard.png",
                position: { x: 42, y: 68 },
                props: { alt: "Castle guard" },
            } as MapImage);
        });

        test("label builds a position-less menu item", () => {
            const action = () => {};

            expect(mapHelpers.label("Examine", { action })).toEqual({
                type: "label",
                content: "Examine",
                action,
            } as LabelHotspot);
        });

        test("menu builds a menu and drops falsy items", () => {
            const action = () => {};
            const examine = mapHelpers.label("Examine", { action });

            expect(
                mapHelpers.menu([examine, false, undefined], {
                    position: { x: 50, y: 50 },
                    direction: "horizontal",
                    className: "bg-card",
                })
            ).toEqual({
                type: "menu",
                items: [examine],
                position: { x: 50, y: 50 },
                direction: "horizontal",
                props: { className: "bg-card" },
            } as MapMenu);
        });

        test("exposes the common helpers", () => {
            expect(mapHelpers.jump).toBeFunction();
            expect(mapHelpers.when).toBeFunction();
        });
    });

    describe("defineStory", () => {
        test("registers a Story that renders helper-built components", () => {
            const id = uniqueId("define-story");
            const story = defineStory(id, (h) => [
                h.header("Chapter 1", { level: 1 }),
                h.text("Your journey begins..."),
            ]);

            expect(story).toBeInstanceOf(Story);
            expect(Game.getPassageById(id)).toBe(story);
            expect(story.display()).toEqual({
                options: {},
                components: [
                    {
                        type: "header",
                        content: "Chapter 1",
                        props: { level: 1 },
                    },
                    { type: "text", content: "Your journey begins..." },
                ],
            });
        });

        test("passes story options through unchanged", () => {
            const options = {
                background: { image: "/forest.webp" },
                classNames: { base: "min-h-screen" },
            };
            const story = defineStory(
                uniqueId("define-story-options"),
                (h) => [h.text("Hi")],
                options
            );

            expect(story.display().options).toEqual(options);
        });

        test("drops falsy entries from the content array", () => {
            const story = defineStory(uniqueId("define-story-falsy"), (h) => [
                h.text("Always"),
                false,
                null,
                undefined,
                h.when(true, () => h.text("Conditional")),
            ]);

            expect(story.display().components).toEqual([
                { type: "text", content: "Always" },
                { type: "text", content: "Conditional" },
            ]);
        });

        test("accepts hand-written component literals alongside helpers", () => {
            const story = defineStory(uniqueId("define-story-mixed"), (h) => [
                h.text("From helper"),
                { type: "text", content: "From literal" },
            ]);

            expect(story.display().components).toEqual([
                { type: "text", content: "From helper" },
                { type: "text", content: "From literal" },
            ]);
        });

        test("forwards display props to the content callback", () => {
            const story = defineStory<{ playerName: string }>(
                uniqueId("define-story-props"),
                (h, props) => [h.text(`Hello, ${props.playerName}!`)]
            );

            expect(story.display({ playerName: "Hero" }).components).toEqual([
                { type: "text", content: "Hello, Hero!" },
            ]);
        });

        test("receives an empty object when display is called without props", () => {
            let received: unknown;
            const story = defineStory(
                uniqueId("define-story-noprops"),
                (h, props) => {
                    received = props;
                    return [h.text("Hi")];
                }
            );

            story.display();

            expect(received).toEqual({});
        });

        test("re-evaluates the content callback on every display", () => {
            let counter = 0;
            const story = defineStory(uniqueId("define-story-reeval"), (h) => {
                counter += 1;
                return [h.text(`Render ${counter}`)];
            });

            expect(story.display().components).toEqual([
                { type: "text", content: "Render 1" },
            ]);
            expect(story.display().components).toEqual([
                { type: "text", content: "Render 2" },
            ]);
        });
    });

    describe("defineInteractiveMap", () => {
        test("registers an InteractiveMap that renders helper-built hotspots", () => {
            const id = uniqueId("define-map");
            const action = () => {};
            const map = defineInteractiveMap(
                id,
                (h) => [
                    h.label("Village", {
                        position: { x: 30, y: 40 },
                        action,
                    }),
                ],
                { image: "/maps/world.jpg", caption: "World" }
            );

            expect(map).toBeInstanceOf(InteractiveMap);
            expect(Game.getPassageById(id)).toBe(map);
            expect(map.display()).toEqual({
                caption: "World",
                image: "/maps/world.jpg",
                hotspots: [
                    {
                        type: "label",
                        content: "Village",
                        position: { x: 30, y: 40 },
                        action,
                    },
                ],
            });
        });

        test("drops falsy entries from the hotspot array", () => {
            const action = () => {};
            const map = defineInteractiveMap(
                uniqueId("define-map-falsy"),
                (h) => [
                    h.label("Always", { position: "top", action }),
                    false,
                    null,
                    undefined,
                ],
                { image: "/maps/world.jpg" }
            );

            expect(map.display().hotspots).toHaveLength(1);
        });

        test("accepts hand-written hotspot literals alongside helpers", () => {
            const action = () => {};
            const map = defineInteractiveMap(
                uniqueId("define-map-mixed"),
                (h) => [
                    h.label("From helper", { position: "top", action }),
                    {
                        type: "label",
                        content: "From literal",
                        position: "bottom",
                        action,
                    },
                ],
                { image: "/maps/world.jpg" }
            );

            expect(map.display().hotspots).toHaveLength(2);
        });

        test("forwards display props to the content callback", () => {
            const action = () => {};
            const map = defineInteractiveMap<{ isInCombat: boolean }>(
                uniqueId("define-map-props"),
                (h, props) =>
                    props.isInCombat
                        ? [h.label("Attack", { position: "bottom", action })]
                        : [h.label("Explore", { position: "bottom", action })],
                { image: "/maps/world.jpg" }
            );

            expect(
                (
                    map.display({ isInCombat: true })
                        .hotspots[0] as SideLabelHotspot
                ).content
            ).toBe("Attack");
            expect(
                (
                    map.display({ isInCombat: false })
                        .hotspots[0] as SideLabelHotspot
                ).content
            ).toBe("Explore");
        });

        test("resolves dynamic images from the options object", () => {
            const map = defineInteractiveMap(
                uniqueId("define-map-dynamic"),
                () => [],
                {
                    image: () => "/maps/winter.jpg",
                    bgImage: () => "/maps/frame.jpg",
                }
            );

            const result = map.display();

            expect(result.image).toBe("/maps/winter.jpg");
            expect(result.bgImage).toBe("/maps/frame.jpg");
        });
    });

    describe("defineWidget", () => {
        test("registers a Widget with the same behaviour as newWidget", () => {
            const id = uniqueId("define-widget");
            const widget = defineWidget(id, "content");

            expect(widget).toBeInstanceOf(Widget);
            expect(Game.getPassageById(id)).toBe(widget);
            expect(widget.display()).toBe("content");
        });

        test("renders functions as React components", () => {
            const Component = () => null;
            const widget = defineWidget(
                uniqueId("define-widget-fc"),
                Component
            );

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(Component);
        });

        test("matches newWidget for the same input", () => {
            const defined = defineWidget(uniqueId("parity-define"), "same");
            const created = newWidget(uniqueId("parity-new"), "same");

            expect(defined.display()).toBe(created.display());
            expect(defined.type).toBe(created.type);
        });
    });

    describe("interoperability with the previous factories", () => {
        test("helper-built components can be embedded from a newStory passage", () => {
            const includedId = uniqueId("legacy-included");
            defineStory(includedId, (h) => [h.text("Shared intro")]);

            const host = newInteractiveMap(uniqueId("legacy-map"), {
                image: "/maps/world.jpg",
                hotspots: [
                    mapHelpers.label("Enter", {
                        position: "top",
                        action: mapHelpers.jump(includedId),
                    }),
                ],
            });

            expect(host.display().hotspots).toHaveLength(1);
        });

        test("storyHelpers can build content outside of a callback", () => {
            const shared = [storyHelpers.header("Shared")];
            const story = defineStory(uniqueId("shared-helpers"), (h) => [
                ...shared,
                h.text("Local"),
            ]);

            expect(story.display().components).toEqual([
                { type: "header", content: "Shared" },
                { type: "text", content: "Local" },
            ]);
        });
    });
});
