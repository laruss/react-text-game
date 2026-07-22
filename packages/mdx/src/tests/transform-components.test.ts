import { describe, expect, mock, test } from "bun:test";

import type { MdxStructItem, TemplateContent } from "#types";
import { transformComponents } from "#utils/transform-components";

const template = (...parts: TemplateContent["parts"]): TemplateContent => ({
    type: "template",
    parts,
});

const item = (
    component: string,
    children: MdxStructItem["children"] = "",
    props: Record<string, unknown> = {}
): MdxStructItem => ({ component, children, props });

describe("transformComponents", () => {
    test("transforms text, media, headings, and includes with validated props", () => {
        const result = transformComponents([
            item("h2", "Chapter", { className: "title" }),
            item(
                "h6",
                template(
                    { type: "text", value: "Gold: " },
                    {
                        type: "var",
                        expression: { type: "expression", value: "gold" },
                    },
                    { type: "text", value: " coins" }
                ),
                { className: 42 }
            ),
            item("p", "Plain text", { className: "copy" }),
            item("p", []),
            item("img", "", {
                src: "/hero.png",
                alt: "Hero",
                className: "portrait",
                disableModal: true,
            }),
            item("img", "", {
                src: 10,
                alt: "Fallback",
                disableModal: false,
            }),
            item("video", "", {
                src: "/intro.mp4",
                className: "movie",
                controls: true,
                autoPlay: false,
                loop: true,
                muted: false,
            }),
            item("video", "", { src: null, controls: "yes" }),
            item("Include", "", { storyId: "shared-story" }),
            item("Include", "", { storyId: 99 }),
        ]);

        expect(result.errors).toEqual([]);
        expect(result.components).toEqual([
            {
                type: "header",
                content: "Chapter",
                props: { level: 2, className: "title" },
            },
            {
                type: "header",
                content: "Gold:  coins",
                props: { level: 6 },
            },
            {
                type: "text",
                content: "Plain text",
                props: { className: "copy" },
            },
            { type: "text", content: "" },
            {
                type: "image",
                content: "/hero.png",
                props: {
                    alt: "Hero",
                    className: "portrait",
                    disableModal: true,
                },
            },
            {
                type: "image",
                content: "",
                props: { alt: "Fallback", disableModal: false },
            },
            {
                type: "video",
                content: "/intro.mp4",
                props: {
                    className: "movie",
                    controls: true,
                    autoPlay: false,
                    loop: true,
                    muted: false,
                },
            },
            { type: "video", content: "" },
            { type: "anotherStory", storyId: "shared-story" },
            { type: "anotherStory", storyId: "" },
        ]);
    });

    test("transforms only valid actions and preserves callable behavior", () => {
        const perform = mock(() => undefined);
        const result = transformComponents([
            item(
                "Actions",
                [
                    item("Action", "Continue", {
                        onPerform: perform,
                        color: "primary",
                        variant: "ghost",
                        isDisabled: false,
                        className: "continue",
                        tooltip: {
                            content: "Advance the story",
                            position: "bottom",
                            className: "hint",
                        },
                    }),
                    item(
                        "Action",
                        template(
                            { type: "text", value: "Spend " },
                            {
                                type: "var",
                                expression: {
                                    type: "expression",
                                    value: "cost",
                                },
                            },
                            { type: "text", value: " gold" }
                        ),
                        {
                            onPerform: perform,
                            color: "not-a-color",
                            variant: "not-a-variant",
                            isDisabled: "no",
                            className: 7,
                            tooltip: { position: "top" },
                        }
                    ),
                    item("Action", "Missing callback", { onPerform: "noop" }),
                    item("Other", "Ignored"),
                ],
                { direction: "vertical", className: "choices" }
            ),
            item("Actions", "not-an-array", {
                direction: "diagonal",
                className: 123,
            }),
        ]);

        expect(result.errors).toEqual([]);
        expect(result.components).toHaveLength(2);
        expect(result.components[0]).toEqual({
            type: "actions",
            content: [
                {
                    label: "Continue",
                    action: perform,
                    color: "primary",
                    variant: "ghost",
                    isDisabled: false,
                    className: "continue",
                    tooltip: {
                        content: "Advance the story",
                        position: "bottom",
                        className: "hint",
                    },
                },
                { label: "Spend  gold", action: perform },
            ],
            props: { direction: "vertical", className: "choices" },
        });
        expect(result.components[1]).toEqual({ type: "actions", content: [] });

        const actions = result.components[0];
        if (actions?.type !== "actions") {
            throw new Error("Expected an actions component");
        }
        actions.content[0]?.action();
        expect(perform).toHaveBeenCalledTimes(1);
    });

    test("transforms conversations while dropping invalid presentation props", () => {
        const result = transformComponents([
            item(
                "Conversation",
                [
                    item("Say", "Welcome", {
                        who: { name: "Guide", avatar: "/guide.png" },
                        color: "#00ffaa",
                        side: "left",
                        classNames: {
                            base: "bubble",
                            content: "message",
                            avatar: "portrait",
                        },
                    }),
                    item(
                        "Say",
                        template(
                            { type: "text", value: "Hello " },
                            {
                                type: "var",
                                expression: {
                                    type: "expression",
                                    value: "player.name",
                                },
                            }
                        ),
                        {
                            who: {},
                            color: "red",
                            side: "center",
                            classNames: {},
                        }
                    ),
                    item("Say", [], {
                        who: { avatar: "/mystery.png" },
                        classNames: { content: "quiet" },
                    }),
                    item("Other", "Ignored"),
                ],
                {
                    appearance: "byClick",
                    variant: "messenger",
                    className: "dialogue",
                }
            ),
            item("Conversation", "not-an-array", {
                appearance: "later",
                variant: "forum",
                className: false,
            }),
        ]);

        expect(result.errors).toEqual([]);
        expect(result.components).toEqual([
            {
                type: "conversation",
                appearance: "byClick",
                content: [
                    {
                        content: "Welcome",
                        who: { name: "Guide", avatar: "/guide.png" },
                        color: "#00ffaa",
                        side: "left",
                        props: {
                            classNames: {
                                base: "bubble",
                                content: "message",
                                avatar: "portrait",
                            },
                        },
                    },
                    { content: "Hello " },
                    {
                        content: "",
                        who: { avatar: "/mystery.png" },
                        props: { classNames: { content: "quiet" } },
                    },
                ],
                props: { variant: "messenger", className: "dialogue" },
            },
            { type: "conversation", content: [] },
        ]);
    });

    test("skips unknown items and reports malformed items without aborting", () => {
        const malformed = null as unknown as MdxStructItem;
        const result = transformComponents([
            item("CustomComponent", "ignored"),
            malformed,
            item("p", "still transformed"),
        ]);

        expect(result.components).toEqual([
            { type: "text", content: "still transformed" },
        ]);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toStartWith("Failed to transform component:");
    });
});
