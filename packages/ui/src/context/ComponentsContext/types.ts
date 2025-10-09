import { ReactNode } from "react";

import {
    ActionsProps,
    Conversation, ConversationProps,
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

export type Components = Readonly<{
    MainMenu?: () => ReactNode;
    story?: StoryComponents;
}>;

export type RequiredComponents = Omit<Required<Components>, "story"> &
    Readonly<{ story: Required<StoryComponents> }>;
