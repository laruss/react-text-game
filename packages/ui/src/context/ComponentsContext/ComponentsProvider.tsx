"use client";

import { PropsWithChildren, useMemo } from "react";

import { MainMenu } from "#components/MainMenu";
import {
    Actions,
    Conversation,
    Heading,
    Image,
    Text,
    Video,
} from "#components/StoryComponent/components";

import { ComponentsContext } from "./ComponentsContext";
import { Components, RequiredComponents } from "./types";

type ComponentsProviderProps = PropsWithChildren<{ components: Components }>;

export const ComponentsProvider = ({
    children,
    components,
}: ComponentsProviderProps) => {
    const required: RequiredComponents = useMemo(
        () => ({
            MainMenu: components?.MainMenu || MainMenu,
            story: {
                Heading: components?.story?.Heading || Heading,
                Text: components?.story?.Text || Text,
                Image: components?.story?.Image || Image,
                Video: components?.story?.Video || Video,
                Actions: components?.story?.Actions || Actions,
                Conversation: components?.story?.Conversation || Conversation,
            },
        }),
        [components]
    );

    return (
        <ComponentsContext.Provider value={required}>
            {children}
        </ComponentsContext.Provider>
    );
};
