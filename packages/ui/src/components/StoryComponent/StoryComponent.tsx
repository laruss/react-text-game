"use client";

import { Game, Story } from "@react-text-game/core";
import { MouseEvent, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { useComponents } from "#context/ComponentsContext/useComponents";
import {
    ConversationClickProvider,
    useConversationClickContext,
} from "#context/ConversationClickContext";

type StoryComponentProps = {
    story: Story;
};

const StoryContent = ({ story }: StoryComponentProps) => {
    const displayable = useMemo(() => story.display(), [story]);
    const {
        story: { Heading, Conversation, Actions, Video, Image, Text },
    } = useComponents();
    const context = useConversationClickContext();

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        // Check if the clicked element is non-clickable (not a button, link, or interactive element)
        const isClickable =
            target.tagName === "BUTTON" ||
            target.tagName === "A" ||
            target.closest("button") ||
            target.closest("a") ||
            target.closest('[role="button"]') ||
            target.closest("input") ||
            target.closest("select") ||
            target.closest("textarea");

        if (!isClickable) {
            // Notify all byClick conversations to show next bubble
            context.notifyClick();
        }
    };

    return (
        <div
            className={twMerge(
                "w-full h-full flex flex-col content-center items-center",
                displayable.options?.classNames?.base
            )}
            onClick={handleClick}
        >
            <div className="px-4 w-full flex flex-col content-center items-center">
                <div
                    className={twMerge(
                        "w-full overflow-x-hidden max-w-[1200px] flex flex-col gap-4 my-4",
                        displayable.options?.classNames?.container
                    )}
                >
                    {displayable.components.map((component, index) => {
                        switch (component.type) {
                            case "header":
                                return (
                                    <Heading
                                        key={index}
                                        component={component}
                                    />
                                );

                            case "text":
                                return (
                                    <Text key={index} component={component} />
                                );

                            case "image":
                                return (
                                    <Image key={index} component={component} />
                                );

                            case "video":
                                return (
                                    <Video key={index} component={component} />
                                );

                            case "actions":
                                return (
                                    <Actions
                                        key={index}
                                        component={component}
                                    />
                                );

                            case "conversation":
                                return (
                                    <Conversation
                                        key={index}
                                        component={component}
                                    />
                                );

                            case "anotherStory":
                                return (
                                    <StoryComponent
                                        key={index}
                                        story={
                                            Game.getPassageById(
                                                component.storyId
                                            ) as Story
                                        }
                                    />
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export const StoryComponent = ({ story }: StoryComponentProps) => {
    return (
        <ConversationClickProvider>
            <StoryContent story={story} />
        </ConversationClickProvider>
    );
};
