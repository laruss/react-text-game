import { Game } from "#game";
import { BaseGameObject, createEntity } from "#gameObjects";
import type { NewOptions, Options } from "#options";
import { InteractiveMap, newInteractiveMap } from "#passages/interactiveMap";
import { Passage } from "#passages/passage";
import { newStory, Story } from "#passages/story";
import { newWidget, Widget } from "#passages/widget";

export * from "./constants";
export * from "./hooks";
export type * from "#types";

// Export SimpleObject explicitly for documentation
export type { SimpleObject } from "#gameObjects/simpleObject";

// Export passage types
export type {
    InteractiveMapType,
    InteractiveMapOptions,
    AnyHotspot,
    MapLabelHotspot,
    MapImageHotspot,
    SideLabelHotspot,
    SideImageHotspot,
    MapMenu,
    LabelHotspot,
} from "#passages/interactiveMap";
export type {
    StoryContent,
    StoryOptions,
    Component,
    TextComponent,
    HeaderComponent,
    ImageComponent,
    VideoComponent,
    ActionsComponent,
    ConversationComponent,
    AnotherStoryComponent,
    ActionType,
    ConversationAppearance,
    ConversationBubble,
    ConversationBubbleSide,
    ConversationVariant,
    HeaderLevel,
} from "#passages/story";

export {
    BaseGameObject,
    createEntity,
    Game,
    InteractiveMap,
    newInteractiveMap,
    NewOptions,
    newStory,
    newWidget,
    Options,
    Passage,
    Story,
    Widget,
};
