import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { Game } from "#game";
import { newStory } from "#passages/story/fabric";
import { Story } from "#passages/story/story";
import type {
    ActionsComponent,
    AnotherStoryComponent,
    Component,
    ConversationComponent,
    HeaderComponent,
    HeaderLevel,
    ImageComponent,
    StoryOptions,
    TextComponent,
    VideoComponent,
} from "#passages/story/types";
import { Storage } from "#storage";

// Counter for unique IDs
let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("Story", () => {
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
        test("creates a story with id and content", () => {
            const id = uniqueId("story");
            const content = () => [
                { type: "text", content: "Hello" } as TextComponent,
            ];
            const story = new Story(id, content);

            expect(story.id).toBe(id);
            expect(story.type).toBe("story");
        });

        test("creates a story with options", () => {
            const id = uniqueId("story");
            const content = () => [
                { type: "text", content: "Hello" } as TextComponent,
            ];
            const options: StoryOptions = {
                background: { image: "/bg.jpg" },
                classNames: { container: "custom-class" },
            };
            const story = new Story(id, content, options);

            expect(story.id).toBe(id);
        });

        test("creates a story without options", () => {
            const id = uniqueId("story");
            const content = () => [
                { type: "text", content: "Hello" } as TextComponent,
            ];
            const story = new Story(id, content);

            expect(story.id).toBe(id);
        });
    });

    describe("Factory Function", () => {
        test("newStory creates a Story instance", () => {
            const id = uniqueId("story");
            const content = () => [
                { type: "text", content: "Test" } as TextComponent,
            ];
            const story = newStory(id, content);

            expect(story).toBeInstanceOf(Story);
            expect(story.id).toBe(id);
        });

        test("newStory with options", () => {
            const id = uniqueId("story");
            const content = () => [
                { type: "text", content: "Test" } as TextComponent,
            ];
            const options: StoryOptions = {
                background: { image: "/test.jpg" },
            };
            const story = newStory(id, content, options);

            expect(story).toBeInstanceOf(Story);
            expect(story.id).toBe(id);
        });
    });

    describe("Display Method", () => {
        test("displays story with simple text component", () => {
            const content = () => [
                { type: "text", content: "Hello World" } as TextComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.components).toHaveLength(1);
            expect(result.components[0]?.type).toBe("text");
            expect((result.components[0] as TextComponent)?.content).toBe(
                "Hello World"
            );
        });

        test("displays story with multiple components", () => {
            const content = () => [
                {
                    type: "header",
                    content: "Title",
                    props: { level: 1 },
                } as HeaderComponent,
                { type: "text", content: "Paragraph text" } as TextComponent,
                { type: "image", content: "/image.jpg" } as ImageComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.components).toHaveLength(3);
            expect(result.components[0]?.type).toBe("header");
            expect(result.components[1]?.type).toBe("text");
            expect(result.components[2]?.type).toBe("image");
        });

        test("displays story with header component", () => {
            const content = () => [
                {
                    type: "header",
                    content: "Chapter 1",
                    props: { level: 1, className: "custom" },
                } as HeaderComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.components[0]?.type).toBe("header");
            expect((result.components[0] as HeaderComponent)?.content).toBe(
                "Chapter 1"
            );
            expect(
                (result.components[0] as HeaderComponent)?.props?.level
            ).toBe(1);
            expect(
                (result.components[0] as HeaderComponent)?.props?.className
            ).toBe("custom");
        });

        test("displays story with image component", () => {
            const content = () => [
                {
                    type: "image",
                    content: "/path/to/image.jpg",
                    props: { alt: "Test Image", className: "rounded" },
                } as ImageComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            const imgComp = result.components[0] as ImageComponent;
            expect(imgComp.type).toBe("image");
            expect(imgComp.content).toBe("/path/to/image.jpg");
            expect(imgComp.props?.alt).toBe("Test Image");
            expect(imgComp.props?.className).toBe("rounded");
        });

        test("displays story with video component", () => {
            const content = () => [
                {
                    type: "video",
                    content: "/video.mp4",
                    props: {
                        controls: true,
                        autoPlay: false,
                        loop: true,
                        muted: false,
                    },
                } as VideoComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            const vidComp = result.components[0] as VideoComponent;
            expect(vidComp.type).toBe("video");
            expect(vidComp.content).toBe("/video.mp4");
            expect(vidComp.props?.controls).toBe(true);
            expect(vidComp.props?.loop).toBe(true);
        });

        test("displays story with actions component", () => {
            const mockAction = () => {};
            const content = () => [
                {
                    type: "actions",
                    content: [
                        {
                            label: "Continue",
                            action: mockAction,
                            color: "primary",
                        },
                        {
                            label: "Back",
                            action: mockAction,
                            color: "secondary",
                        },
                    ],
                    props: { direction: "horizontal" },
                } as ActionsComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            const actComp = result.components[0] as ActionsComponent;
            expect(actComp.type).toBe("actions");
            expect(actComp.content).toHaveLength(2);
            expect(actComp.content[0]?.label).toBe("Continue");
            expect(actComp.props?.direction).toBe("horizontal");
        });

        test("displays story with conversation component", () => {
            const content = () => [
                {
                    type: "conversation",
                    content: [
                        {
                            who: { name: "NPC" },
                            content: "Hello!",
                            side: "left",
                        },
                        {
                            who: { name: "Player" },
                            content: "Hi there!",
                            side: "right",
                        },
                    ],
                    appearance: "atOnce",
                    props: { variant: "chat" },
                } as ConversationComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            const convComp = result.components[0] as ConversationComponent;
            expect(convComp.type).toBe("conversation");
            expect(convComp.content).toHaveLength(2);
            expect(convComp.content[0]?.who?.name).toBe("NPC");
            expect(convComp.appearance).toBe("atOnce");
        });

        test("displays story with anotherStory component", () => {
            const content = () => [
                {
                    type: "anotherStory",
                    storyId: "embedded-story",
                } as AnotherStoryComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            const anotherComp = result.components[0] as AnotherStoryComponent;
            expect(anotherComp.type).toBe("anotherStory");
            expect(anotherComp.storyId).toBe("embedded-story");
        });

        test("passes props to content function", () => {
            const content = (props: { playerName: string; level: number }) => [
                {
                    type: "text",
                    content: `Hello ${props.playerName}!`,
                } as TextComponent,
                {
                    type: "text",
                    content: `Level: ${props.level}`,
                } as TextComponent,
            ];
            // @ts-expect-error TS2345
            const story = newStory(uniqueId("story"), content);

            const result = story.display({ playerName: "Hero", level: 5 });

            expect((result.components[0] as TextComponent)?.content).toBe(
                "Hello Hero!"
            );
            expect((result.components[1] as TextComponent)?.content).toBe(
                "Level: 5"
            );
        });

        test("returns story options", () => {
            const content = () => [
                { type: "text", content: "Test" } as TextComponent,
            ];
            const options: StoryOptions = {
                background: { image: "/bg.jpg" },
                classNames: {
                    base: "base-class",
                    container: "container-class",
                },
            };
            const story = newStory(uniqueId("story"), content, options);

            const result = story.display();

            expect(result.options).toEqual(options);
        });

        test("returns undefined options when not provided", () => {
            const content = () => [
                { type: "text", content: "Test" } as TextComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.options).toEqual({});
        });
    });

    describe("Component Types", () => {
        test("text component with all properties", () => {
            const content = () => [
                {
                    type: "text",
                    id: "text-1",
                    content: "Sample text",
                    initialVariant: "display",
                    props: { className: "custom-text" },
                } as TextComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const textComp = result.components[0];

            expect(textComp?.type).toBe("text");
            expect(textComp?.id).toBe("text-1");
            expect(textComp?.initialVariant).toBe("display");
            expect((textComp as TextComponent)?.props?.className).toBe(
                "custom-text"
            );
        });

        test("header component with all levels", () => {
            const content = () => [
                {
                    type: "header",
                    content: "H1",
                    props: { level: 1 },
                } as HeaderComponent,
                {
                    type: "header",
                    content: "H2",
                    props: { level: 2 },
                } as HeaderComponent,
                {
                    type: "header",
                    content: "H3",
                    props: { level: 3 },
                } as HeaderComponent,
                {
                    type: "header",
                    content: "H4",
                    props: { level: 4 },
                } as HeaderComponent,
                {
                    type: "header",
                    content: "H5",
                    props: { level: 5 },
                } as HeaderComponent,
                {
                    type: "header",
                    content: "H6",
                    props: { level: 6 },
                } as HeaderComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.components).toHaveLength(6);
            for (let i = 0; i < 6; i++) {
                expect(result.components[i]?.type).toBe("header");
                expect(
                    (result.components[i] as HeaderComponent)?.props?.level
                ).toBe((i + 1) as HeaderLevel);
            }
        });

        test("image component with all properties", () => {
            const mockClick = () => {};
            const content = () => [
                {
                    type: "image",
                    content: "/image.jpg",
                    props: {
                        alt: "Alt text",
                        className: "custom-image",
                        disableModal: true,
                        onClick: mockClick,
                    },
                } as ImageComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const imgComp = result.components[0];

            expect(imgComp?.type).toBe("image");
            expect((imgComp as ImageComponent).props?.alt).toBe("Alt text");
            expect((imgComp as ImageComponent).props?.disableModal).toBe(true);
            expect((imgComp as ImageComponent).props?.onClick).toBe(mockClick);
        });

        test("actions component with disabled action", () => {
            const content = () => [
                {
                    type: "actions",
                    content: [
                        {
                            label: "Disabled",
                            action: () => {},
                            isDisabled: true,
                            tooltip: {
                                content: "Not available yet",
                                position: "top",
                            },
                        },
                    ],
                } as ActionsComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const action = (result.components[0] as ActionsComponent)
                .content[0];

            expect(action?.isDisabled).toBe(true);
            expect(action?.tooltip?.content).toBe("Not available yet");
            expect(action?.tooltip?.position).toBe("top");
        });

        test("conversation component with avatars and colors", () => {
            const content = () => [
                {
                    type: "conversation",
                    content: [
                        {
                            who: { name: "Alice", avatar: "/alice.png" },
                            content: "Hello",
                            side: "left",
                            color: "#ff0000",
                        },
                        {
                            who: { name: "Bob", avatar: "/bob.png" },
                            content: "Hi",
                            side: "right",
                            color: "#00ff00",
                        },
                    ],
                    appearance: "byClick",
                    props: { variant: "messenger" },
                } as ConversationComponent,
            ];
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const conversation = result.components[0] as ConversationComponent;

            expect(conversation.appearance).toBe("byClick");
            expect(conversation.props?.variant).toBe("messenger");
            expect(conversation.content[0]?.color).toBe("#ff0000");
            expect(conversation.content[1]?.who?.avatar).toBe("/bob.png");
        });
    });

    describe("Dynamic Content", () => {
        test("content function receives empty object by default", () => {
            let receivedProps: unknown = null;
            const content = (props: unknown) => {
                receivedProps = props;
                return [{ type: "text", content: "Test" } as TextComponent];
            };
            const story = newStory(uniqueId("story"), content);

            story.display();

            expect(receivedProps).toEqual({});
        });

        test("content function receives provided props", () => {
            let receivedProps: unknown = null;
            const content = (props: unknown) => {
                receivedProps = props;
                return [{ type: "text", content: "Test" } as TextComponent];
            };
            const story = newStory(uniqueId("story"), content);

            const testProps = { test: "value", number: 42 };
            story.display(testProps);

            expect(receivedProps).toEqual(testProps);
        });

        test("conditional rendering based on props", () => {
            const content = (props: { hasKey: boolean }) => {
                const components: Array<Component> = [
                    {
                        type: "text",
                        content: "You approach the door.",
                    } as TextComponent,
                ];

                if (props.hasKey) {
                    components.push({
                        type: "actions",
                        content: [{ label: "Open door", action: () => {} }],
                    } as ActionsComponent);
                } else {
                    components.push({
                        type: "text",
                        content: "The door is locked.",
                    } as TextComponent);
                }

                return components;
            };
            // @ts-expect-error TS2345
            const story = newStory(uniqueId("story"), content);

            const resultWithKey = story.display({ hasKey: true });
            expect(resultWithKey.components).toHaveLength(2);
            expect(resultWithKey.components[1]?.type).toBe("actions");

            const resultWithoutKey = story.display({ hasKey: false });
            expect(resultWithoutKey.components).toHaveLength(2);
            expect(resultWithoutKey.components[1]?.type).toBe("text");
        });
    });

    describe("Story Options", () => {
        test("background with static image", () => {
            const content = () => [
                { type: "text", content: "Test" } as TextComponent,
            ];
            const options: StoryOptions = {
                background: { image: "/background.jpg" },
            };
            const story = newStory(uniqueId("story"), content, options);

            const result = story.display();

            expect(result.options?.background?.image).toBe("/background.jpg");
        });

        test("background with function returning image", () => {
            const content = () =>
                [{ type: "text", content: "Test" }] as Array<Component>;
            const options: StoryOptions = {
                background: { image: () => "/dynamic-bg.jpg" },
            };
            const story = newStory(uniqueId("story"), content, options);

            const result = story.display();

            expect(typeof result.options?.background?.image).toBe("function");
            if (typeof result.options?.background?.image === "function") {
                expect(result.options.background.image()).toBe(
                    "/dynamic-bg.jpg"
                );
            }
        });

        test("classNames for base and container", () => {
            const content = () =>
                [{ type: "text", content: "Test" }] as Array<Component>;
            const options: StoryOptions = {
                classNames: {
                    base: "base-custom",
                    container: "container-custom",
                },
            };
            const story = newStory(uniqueId("story"), content, options);

            const result = story.display();

            expect(result.options?.classNames?.base).toBe("base-custom");
            expect(result.options?.classNames?.container).toBe(
                "container-custom"
            );
        });
    });

    describe("Integration with Game", () => {
        test("story is registered with Game on creation", () => {
            const id = uniqueId("story");
            const content = () =>
                [{ type: "text", content: "Test" }] as Array<Component>;
            newStory(id, content);

            const retrieved = Game.getPassageById(id);
            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(id);
            expect(retrieved?.type).toBe("story");
        });

        test("can navigate to story using Game.jumpTo", () => {
            const id = uniqueId("story");
            const content = () =>
                [{ type: "text", content: "Test" }] as Array<Component>;
            newStory(id, content);

            Game.jumpTo(id);

            expect(Game.selfState.currentPassageId).toBe(id);
        });

        test("can retrieve and display current story", () => {
            const id = uniqueId("story");
            const content = () => [
                {
                    type: "text",
                    content: "Current story content",
                } as TextComponent,
            ];
            newStory(id, content);

            Game.jumpTo(id);
            const currentPassage = Game.currentPassage;

            expect(currentPassage).not.toBeNull();
            expect(currentPassage?.type).toBe("story");

            const result = (currentPassage as Story).display();
            expect((result.components[0] as TextComponent).content).toBe(
                "Current story content"
            );
        });
    });

    describe("Edge Cases", () => {
        test("empty content array", () => {
            const content = () => [] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect(result.components).toHaveLength(0);
        });

        test("content function returns different results on each call", () => {
            let callCount = 0;
            const content = () => {
                callCount++;
                return [
                    {
                        type: "text",
                        content: `Call ${callCount}`,
                    } as TextComponent,
                ];
            };
            const story = newStory(uniqueId("story"), content);

            const result1 = story.display();
            expect((result1.components[0] as TextComponent).content).toBe(
                "Call 1"
            );

            const result2 = story.display();
            expect((result2.components[0] as TextComponent).content).toBe(
                "Call 2"
            );
        });

        test("text component with JSX-like content", () => {
            const content = () =>
                [{ type: "text", content: "Bold text" }] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();

            expect((result.components[0] as TextComponent).content).toBe(
                "Bold text"
            );
        });

        test("actions with all color variants", () => {
            const content = () =>
                [
                    {
                        type: "actions",
                        content: [
                            {
                                label: "Default",
                                action: () => {},
                                color: "default",
                            },
                            {
                                label: "Primary",
                                action: () => {},
                                color: "primary",
                            },
                            {
                                label: "Secondary",
                                action: () => {},
                                color: "secondary",
                            },
                            {
                                label: "Success",
                                action: () => {},
                                color: "success",
                            },
                            {
                                label: "Warning",
                                action: () => {},
                                color: "warning",
                            },
                            {
                                label: "Danger",
                                action: () => {},
                                color: "danger",
                            },
                        ],
                    },
                ] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const actions = result.components[0] as ActionsComponent;

            expect(actions.content).toHaveLength(6);
            expect(actions.content[0]?.color).toBe("default");
            expect(actions.content[5]?.color).toBe("danger");
        });

        test("actions with all button variants", () => {
            const content = () =>
                [
                    {
                        type: "actions",
                        content: [
                            {
                                label: "Solid",
                                action: () => {},
                                variant: "solid",
                            },
                            {
                                label: "Bordered",
                                action: () => {},
                                variant: "bordered",
                            },
                            {
                                label: "Light",
                                action: () => {},
                                variant: "light",
                            },
                            {
                                label: "Flat",
                                action: () => {},
                                variant: "flat",
                            },
                            {
                                label: "Faded",
                                action: () => {},
                                variant: "faded",
                            },
                            {
                                label: "Shadow",
                                action: () => {},
                                variant: "shadow",
                            },
                            {
                                label: "Ghost",
                                action: () => {},
                                variant: "ghost",
                            },
                        ],
                    },
                ] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const actions = result.components[0] as ActionsComponent;

            expect(actions.content).toHaveLength(7);
            expect(actions.content[0]?.variant).toBe("solid");
            expect(actions.content[6]?.variant).toBe("ghost");
        });

        test("conversation bubble with custom classNames", () => {
            const content = () =>
                [
                    {
                        type: "conversation",
                        content: [
                            {
                                content: "Test",
                                props: {
                                    classNames: {
                                        base: "custom-base",
                                        content: "custom-content",
                                        avatar: "custom-avatar",
                                    },
                                },
                            },
                        ],
                    },
                ] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const conversation = result.components[0] as ConversationComponent;

            expect(conversation.content[0]?.props?.classNames?.base).toBe(
                "custom-base"
            );
            expect(conversation.content[0]?.props?.classNames?.content).toBe(
                "custom-content"
            );
            expect(conversation.content[0]?.props?.classNames?.avatar).toBe(
                "custom-avatar"
            );
        });

        test("multiple nested anotherStory components", () => {
            const content = () =>
                [
                    { type: "anotherStory", storyId: "story-1" },
                    { type: "text", content: "Middle content" },
                    { type: "anotherStory", storyId: "story-2" },
                ] as Array<Component>;
            const story = newStory(uniqueId("story"), content);

            const result = story.display();
            const story1 = result.components[0] as AnotherStoryComponent;
            const story2 = result.components[2] as AnotherStoryComponent;

            expect(result.components).toHaveLength(3);
            expect(story1.type).toBe("anotherStory");
            expect(story1.storyId).toBe("story-1");
            expect(story2.type).toBe("anotherStory");
            expect(story2.storyId).toBe("story-2");
        });
    });
});
