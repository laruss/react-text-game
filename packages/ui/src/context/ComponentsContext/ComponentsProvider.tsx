"use client";

import type { Passage, Widget } from "@react-text-game/core";
import { type PropsWithChildren, useMemo } from "react";

import { InteractiveMapComponent } from "#components/InteractiveMapComponent";
import { LoadingScreen } from "#components/LoadingScreen";
import { MainMenu } from "#components/MainMenu";
import { RTGSplashScreen } from "#components/SplashScreen";
import { StoryComponent } from "#components/StoryComponent";
import {
    Actions,
    Conversation,
    Heading,
    Image,
    Text,
    Video,
} from "#components/StoryComponent/components";

import { ComponentsContext } from "./ComponentsContext";
import type { Components, RequiredComponents } from "./types";

type ComponentsProviderProps = PropsWithChildren<{ components: Components }>;

const WidgetPassage = ({ widget }: { widget: Widget }) => widget.display();
const EmptyPassage = () => (
    <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">NO PASSAGE SELECTED</h1>
    </div>
);
const UnknownPassage = ({ passage }: { passage: Passage }) => (
    <div>Unknown Passage Type {passage.type}</div>
);

export const ComponentsProvider = ({
    children,
    components,
}: ComponentsProviderProps) => {
    const required: RequiredComponents = useMemo(
        () => ({
            LoadingScreen: components?.LoadingScreen || LoadingScreen,
            MainMenu: components?.MainMenu || MainMenu,
            RTGSplashScreen: components?.RTGSplashScreen || RTGSplashScreen,
            story: {
                Heading: components?.story?.Heading || Heading,
                Text: components?.story?.Text || Text,
                Image: components?.story?.Image || Image,
                Video: components?.story?.Video || Video,
                Actions: components?.story?.Actions || Actions,
                Conversation: components?.story?.Conversation || Conversation,
            },
            passages: {
                Story: components?.passages?.Story || StoryComponent,
                InteractiveMap:
                    components?.passages?.InteractiveMap ||
                    InteractiveMapComponent,
                Widget: components?.passages?.Widget || WidgetPassage,
                Empty: components?.passages?.Empty || EmptyPassage,
                Unknown: components?.passages?.Unknown || UnknownPassage,
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
