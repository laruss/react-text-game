import type { Passage, Widget } from "@react-text-game/core";
import type { ReactNode } from "react";

import type { InteractiveMapComponentProps } from "#components/InteractiveMapComponent";
import type { LoadingScreenProps } from "#components/LoadingScreen";
import type { StoryComponentProps } from "#components/StoryComponent";

import type {
    ActionsProps,
    ConversationProps,
    HeadingProps,
    ImageProps,
    TextProps,
    VideoProps,
} from "#components/StoryComponent/components";

export type StoryComponents = Readonly<{
    Heading?: (props: HeadingProps) => ReactNode;
    Text?: (props: TextProps) => ReactNode;
    Image?: (props: ImageProps) => ReactNode;
    Video?: (props: VideoProps) => ReactNode;
    Actions?: (props: ActionsProps) => ReactNode;
    Conversation?: (props: ConversationProps) => ReactNode;
}>;

export type PassageComponents = Readonly<{
    Story?: (props: StoryComponentProps) => ReactNode;
    InteractiveMap?: (props: InteractiveMapComponentProps) => ReactNode;
    Widget?: (props: { widget: Widget }) => ReactNode;
    Empty?: () => ReactNode;
    Unknown?: (props: { passage: Passage }) => ReactNode;
}>;

export type Components = Readonly<{
    LoadingScreen?: (props: LoadingScreenProps) => ReactNode;
    MainMenu?: () => ReactNode;
    RTGSplashScreen?: () => ReactNode;
    story?: StoryComponents;
    passages?: PassageComponents;
}>;

export type RequiredComponents = Omit<
    Required<Components>,
    "passages" | "story"
> &
    Readonly<{
        story: Required<StoryComponents>;
        passages: Required<PassageComponents>;
    }>;
