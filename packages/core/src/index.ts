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
    AnyHotspot,
    InteractiveMapOptions,
    InteractiveMapType,
    LabelHotspot,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "#passages/interactiveMap";
export type {
    ActionsComponent,
    ActionType,
    AnotherStoryComponent,
    Component,
    ConversationAppearance,
    ConversationBubble,
    ConversationBubbleSide,
    ConversationComponent,
    ConversationVariant,
    HeaderComponent,
    HeaderLevel,
    ImageComponent,
    StoryComponents,
    StoryContent,
    StoryOptions,
    TextComponent,
    VideoComponent,
} from "#passages/story";
export type { WidgetContent } from "#passages/widget";

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
