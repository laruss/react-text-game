import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { Game, type Story } from "@react-text-game/core";
import type {
    ActionsComponent,
    HeaderComponent,
    ImageComponent,
    VideoComponent,
} from "@react-text-game/core/passages";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { Actions } from "#components/StoryComponent/components/Actions";
import { Heading } from "#components/StoryComponent/components/Heading";
import { Image } from "#components/StoryComponent/components/Image";
import { Video } from "#components/StoryComponent/components/Video";
import { StoryComponent } from "#components/StoryComponent/StoryComponent";
import { ComponentsProvider } from "#context/ComponentsContext/ComponentsProvider";

afterEach(() => {
    cleanup();
    mock.restore();
});

describe("story leaf components", () => {
    test("renders headings with level and custom styling", () => {
        const component: HeaderComponent = {
            type: "header",
            content: "Chapter One",
            props: { level: 6, className: "chapter-heading" },
        };

        render(createElement(Heading, { component }));

        const heading = screen.getByText("Chapter One");
        expect(heading.className).toContain("text-base");
        expect(heading.className).toContain("chapter-heading");
    });

    test("renders video defaults and explicit media options", () => {
        const { rerender } = render(
            createElement(Video, {
                component: {
                    type: "video",
                    content: "/intro.mp4",
                } as VideoComponent,
            })
        );

        let video = document.querySelector("video") as HTMLVideoElement;
        expect(video.autoplay).toBe(true);
        expect(video.loop).toBe(true);
        expect(video.muted).toBe(true);
        expect(video.controls).toBe(false);
        expect(video.querySelector("source")?.getAttribute("src")).toBe(
            "/intro.mp4"
        );

        rerender(
            createElement(Video, {
                component: {
                    type: "video",
                    content: "/ending.mp4",
                    props: {
                        controls: true,
                        autoPlay: false,
                        loop: false,
                        muted: false,
                        className: "ending-video",
                    },
                } as VideoComponent,
            })
        );

        video = document.querySelector("video") as HTMLVideoElement;
        expect(video.controls).toBe(true);
        expect(video.autoplay).toBe(false);
        expect(video.loop).toBe(false);
        expect(video.muted).toBe(false);
        expect(video.className).toContain("ending-video");
    });

    test("renders a non-modal image and invokes its custom action", async () => {
        const user = userEvent.setup();
        const onClick = mock(() => {});
        const component: ImageComponent = {
            type: "image",
            content: "/portrait.png",
            props: {
                alt: "Character portrait",
                className: "portrait",
                disableModal: true,
                onClick,
            },
        };

        render(createElement(Image, { component }));
        const image = screen.getByAltText("Character portrait");

        expect(image.id).toBe("image-content");
        expect(image.className).toContain("portrait");
        await user.click(image);
        expect(onClick).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(image, { key: "Escape" });
        expect(onClick).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(image, { key: "Enter" });
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    test("renders the image modal, calls its action, and closes it on Escape", async () => {
        const user = userEvent.setup();
        const onClick = mock(() => {});
        const component: ImageComponent = {
            type: "image",
            content: "/map.png",
            props: { onClick },
        };

        render(createElement(Image, { component }));
        const thumbnail = screen.getAllByAltText("image").at(0);
        if (!thumbnail) throw new Error("Image thumbnail was not rendered");
        const checkbox = document.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        await user.click(thumbnail);
        expect(onClick).toHaveBeenCalledTimes(1);
        checkbox.checked = true;
        fireEvent.keyDown(document, { key: "Escape" });
        expect(checkbox.checked).toBe(false);
        expect(
            document.querySelectorAll('[aria-label="Close modal"]')
        ).toHaveLength(2);
    });

    test("renders horizontal and vertical actions and dispatches enabled actions", async () => {
        const user = userEvent.setup();
        const action = mock(() => {});
        const component: ActionsComponent = {
            type: "actions",
            content: [
                {
                    label: "Continue",
                    action,
                    tooltip: { content: "Move ahead", position: "bottom" },
                },
                {
                    label: "Locked",
                    action,
                    isDisabled: true,
                },
            ],
            props: { direction: "vertical", className: "story-actions" },
        };

        const { container } = render(createElement(Actions, { component }));
        expect(
            container.querySelector("#actions-content")?.className
        ).toContain("flex-col");
        expect(
            container.querySelector("#actions-content")?.className
        ).toContain("story-actions");

        await user.click(screen.getByRole("button", { name: "Continue" }));
        await user.click(screen.getByRole("button", { name: "Locked" }));
        expect(action).toHaveBeenCalledTimes(1);

        await user.hover(screen.getByRole("button", { name: "Continue" }));
        await waitFor(() =>
            expect(screen.getByText("Move ahead")).toBeTruthy()
        );
    });
});

describe("StoryComponent", () => {
    test("dispatches every supported component and nested stories", () => {
        const nestedStory = {
            display: mock(() => ({
                components: [{ type: "text", content: "Nested story" }],
            })),
        } as unknown as Story;
        const getPassage = spyOn(Game, "getPassageById").mockReturnValue(
            nestedStory
        );
        const story = {
            display: mock(() => ({
                options: {
                    classNames: {
                        base: "custom-base",
                        container: "custom-container",
                    },
                },
                components: [
                    { type: "header", content: "A heading" },
                    { type: "text", content: "A paragraph" },
                    {
                        type: "image",
                        content: "/story.png",
                        props: { disableModal: true },
                    },
                    { type: "video", content: "/story.mp4" },
                    { type: "actions", content: [] },
                    {
                        type: "conversation",
                        appearance: "atOnce",
                        content: [{ content: "Hello", side: "left" }],
                    },
                    { type: "anotherStory", storyId: "nested" },
                    { type: "unsupported" },
                ],
            })),
        } as unknown as Story;

        const { container } = render(
            createElement(
                ComponentsProvider,
                { components: {} },
                createElement(StoryComponent, { story })
            )
        );

        expect(screen.getByText("A heading")).toBeTruthy();
        expect(screen.getByText("A paragraph")).toBeTruthy();
        expect(screen.getByAltText("image")).toBeTruthy();
        expect(document.querySelector('source[src="/story.mp4"]')).toBeTruthy();
        expect(screen.getByText("Hello")).toBeTruthy();
        expect(screen.getByText("Nested story")).toBeTruthy();
        expect(container.querySelector("#story-content")?.className).toContain(
            "custom-base"
        );
        expect(
            container.querySelector("#story-content-container")?.className
        ).toContain("custom-container");
        expect(getPassage).toHaveBeenCalledWith("nested");
    });

    test("advances conversations from non-interactive story clicks only", async () => {
        const user = userEvent.setup();
        const action = mock(() => {});
        const story = {
            display: () => ({
                components: [
                    {
                        type: "conversation",
                        appearance: "byClick",
                        content: [
                            { content: "First bubble", side: "left" },
                            { content: "Second bubble", side: "left" },
                        ],
                    },
                    {
                        type: "actions",
                        content: [{ label: "Do action", action }],
                    },
                ],
            }),
        } as unknown as Story;

        const { container } = render(
            createElement(
                ComponentsProvider,
                { components: {} },
                createElement(StoryComponent, { story })
            )
        );

        await user.click(screen.getByRole("button", { name: "Do action" }));
        expect(action).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("Second bubble")).toBeNull();

        await user.click(
            container.querySelector("#story-content") as HTMLElement
        );
        await waitFor(() =>
            expect(screen.getByText("Second bubble")).toBeTruthy()
        );
    });

    test("advances a contextual conversation from the keyboard once per key", async () => {
        const user = userEvent.setup();
        const story = {
            display: () => ({
                components: [
                    {
                        type: "conversation",
                        appearance: "byClick",
                        content: [
                            { content: "Keyboard first", side: "left" },
                            { content: "Keyboard second", side: "left" },
                            { content: "Keyboard third", side: "left" },
                        ],
                    },
                ],
            }),
        } as unknown as Story;

        render(
            createElement(
                ComponentsProvider,
                { components: {} },
                createElement(StoryComponent, { story })
            )
        );

        await user.tab();
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: /Keyboard first/ })
        );
        await user.keyboard("{Enter}");
        await waitFor(() =>
            expect(screen.getByText("Keyboard second")).toBeTruthy()
        );
        expect(screen.queryByText("Keyboard third")).toBeNull();

        await user.keyboard(" ");
        await waitFor(() =>
            expect(screen.getByText("Keyboard third")).toBeTruthy()
        );
    });
});
