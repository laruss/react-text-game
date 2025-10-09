"use client";

import { Game, Story } from "@react-text-game/core";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { useComponents } from "#context/ComponentsContext/useComponents";

type StoryComponentProps = {
    story: Story;
};

export const StoryComponent = ({ story }: StoryComponentProps) => {
    const displayable = useMemo(() => story.display(), [story]);
    const { story: { Heading, Conversation, Actions, Video, Image, Text } } = useComponents();

    return (
        <div
            className={twMerge(
                "w-full h-full flex flex-col content-center items-center",
                displayable.options?.classNames?.base
            )}
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
                                    <Heading key={index} component={component} />
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
