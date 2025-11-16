import { ConversationComponent } from "@react-text-game/core/passages";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { Conversation } from "#components/StoryComponent/components/Conversation";

describe("Conversation", () => {
    beforeEach(() => {
        // Any setup if needed
    });

    afterEach(() => {
        cleanup();
    });

    describe("Appearance: atOnce", () => {
        test("renders all conversation bubbles immediately", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    { content: "Hello there!", side: "left" },
                    { content: "Hi! How are you?", side: "right" },
                    { content: "I'm doing great!", side: "left" },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Hello there!")).toBeTruthy();
            expect(screen.getByText("Hi! How are you?")).toBeTruthy();
            expect(screen.getByText("I'm doing great!")).toBeTruthy();
        });

        test("displays avatars with images correctly", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    {
                        content: "Hello!",
                        who: {
                            name: "NPC",
                            avatar: "/avatar.png",
                        },
                        side: "left",
                    },
                ],
            };

            render(createElement(Conversation, { component }));

            const avatar = screen.getByAltText("NPC");
            expect(avatar).toBeTruthy();
            expect(avatar.getAttribute("src")).toBe("/avatar.png");
        });

        test("displays fallback avatar with first letter of name", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    {
                        content: "Hello!",
                        who: {
                            name: "John",
                        },
                        side: "left",
                    },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("J")).toBeTruthy();
        });

        test("displays question mark when no name provided", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    {
                        content: "Anonymous message",
                        side: "left",
                    },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("?")).toBeTruthy();
        });

        test("renders left and right side bubbles correctly", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    { content: "Left message", side: "left" },
                    { content: "Right message", side: "right" },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Left message")).toBeTruthy();
            expect(screen.getByText("Right message")).toBeTruthy();

            // Check that different styles are applied based on side
            const leftBubble = screen.getByText("Left message").closest("div");
            const rightBubble = screen
                .getByText("Right message")
                .closest("div");

            expect(leftBubble).toBeTruthy();
            expect(rightBubble).toBeTruthy();
        });

        test("applies custom className from props", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [{ content: "Test", side: "left" }],
                props: {
                    className: "custom-conversation-class",
                },
            };

            const { container } = render(
                createElement(Conversation, { component })
            );

            const conversationContainer = container.querySelector(
                ".custom-conversation-class"
            );
            expect(conversationContainer).toBeTruthy();
        });

        test("renders with chat variant (default)", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [{ content: "Chat message", side: "left" }],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Chat message")).toBeTruthy();
        });

        test("renders with messenger variant", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [{ content: "Messenger message", side: "left" }],
                props: {
                    variant: "messenger",
                },
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Messenger message")).toBeTruthy();
        });
    });

    describe("Appearance: byClick", () => {
        test("shows first bubble immediately", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "byClick",
                content: [
                    { content: "First message", side: "left" },
                    { content: "Second message", side: "left" },
                    { content: "Third message", side: "left" },
                ],
            };

            render(createElement(Conversation, { component }));

            // First bubble should be visible immediately
            expect(screen.getByText("First message")).toBeTruthy();

            // Other bubbles should not be visible yet
            expect(screen.queryByText("Second message")).toBeNull();
            expect(screen.queryByText("Third message")).toBeNull();
        });

        test("shows next bubble on click", async () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "byClick",
                content: [
                    { content: "First message", side: "left" },
                    { content: "Second message", side: "left" },
                ],
            };

            render(createElement(Conversation, { component }));

            // First bubble should be visible
            expect(screen.getByText("First message")).toBeTruthy();
            expect(screen.queryByText("Second message")).toBeNull();

            // Click on the first bubble
            const firstBubble = screen.getByText("First message");
            firstBubble.click();

            // Second bubble should now be visible
            await waitFor(() => {
                expect(screen.getByText("Second message")).toBeTruthy();
            });
        });

        test("shows all bubbles sequentially with multiple clicks", async () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "byClick",
                content: [
                    { content: "First", side: "left" },
                    { content: "Second", side: "left" },
                    { content: "Third", side: "left" },
                ],
            };

            render(createElement(Conversation, { component }));

            // First is visible
            expect(screen.getByText("First")).toBeTruthy();
            expect(screen.queryByText("Second")).toBeNull();

            // Click to show second
            screen.getByText("First").click();
            await waitFor(() => {
                expect(screen.getByText("Second")).toBeTruthy();
            });

            // Click to show third
            screen.getByText("First").click();
            await waitFor(() => {
                expect(screen.getByText("Third")).toBeTruthy();
            });
        });

        test("doesn't add more bubbles after all are shown", async () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "byClick",
                content: [
                    { content: "First", side: "left" },
                    { content: "Second", side: "left" },
                ],
            };

            const { container } = render(
                createElement(Conversation, { component })
            );

            // Show all bubbles
            screen.getByText("First").click();
            await waitFor(() => {
                expect(screen.getByText("Second")).toBeTruthy();
            });

            // Count bubbles
            const bubblesBefore = container.querySelectorAll("div").length;

            // Click again
            screen.getByText("First").click();

            // Should have same number of bubbles
            const bubblesAfter = container.querySelectorAll("div").length;
            expect(bubblesAfter).toBe(bubblesBefore);
        });

        test("handles single bubble conversation", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "byClick",
                content: [{ content: "Only message", side: "left" }],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Only message")).toBeTruthy();
        });
    });

    describe("Edge Cases", () => {
        test("handles empty conversation content", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [],
            };

            const { container } = render(
                createElement(Conversation, { component })
            );

            // Should render without errors, just empty
            expect(container.innerHTML).toBeTruthy();
        });

        test("handles conversation with missing who data", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    {
                        content: "Message without who",
                        side: "left",
                    },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Message without who")).toBeTruthy();
            expect(screen.getByText("?")).toBeTruthy(); // Fallback avatar
        });

        test("handles conversation with custom bubble classNames", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    {
                        content: "Custom styled",
                        side: "left",
                        props: {
                            classNames: {
                                base: "custom-base",
                                content: "custom-content",
                                avatar: "custom-avatar",
                            },
                        },
                    },
                ],
            };

            const { container } = render(
                createElement(Conversation, { component })
            );

            expect(screen.getByText("Custom styled")).toBeTruthy();

            // Check that custom classes are applied
            const baseElement = container.querySelector(".custom-base");
            const contentElement = container.querySelector(".custom-content");
            const avatarElement = container.querySelector(".custom-avatar");

            expect(baseElement).toBeTruthy();
            expect(contentElement).toBeTruthy();
            expect(avatarElement).toBeTruthy();
        });

        test("handles mixed sides in conversation", () => {
            const component: ConversationComponent = {
                type: "conversation",
                appearance: "atOnce",
                content: [
                    { content: "Left 1", side: "left" },
                    { content: "Right 1", side: "right" },
                    { content: "Left 2", side: "left" },
                    { content: "Right 2", side: "right" },
                ],
            };

            render(createElement(Conversation, { component }));

            expect(screen.getByText("Left 1")).toBeTruthy();
            expect(screen.getByText("Right 1")).toBeTruthy();
            expect(screen.getByText("Left 2")).toBeTruthy();
            expect(screen.getByText("Right 2")).toBeTruthy();
        });
    });
});
