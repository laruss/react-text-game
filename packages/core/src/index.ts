import { Game } from "#game";
import { BaseGameObject, createEntity } from "#gameObjects";
import type { NewOptions, Options } from "#options";
import {
    defineInteractiveMap,
    InteractiveMap,
    mapHelpers,
    newInteractiveMap,
} from "#passages/interactiveMap";
import { Passage } from "#passages/passage";
import { defineStory, newStory, Story, storyHelpers } from "#passages/story";
import { defineWidget, newWidget, Widget } from "#passages/widget";

// Export SimpleObject explicitly for documentation
export type { SimpleObject } from "#gameObjects/simpleObject";
// Export shared passage-definition types
export type {
    CommonHelpers,
    Conditional,
    DefineFn,
    HelperOptions,
} from "#passages/definition";
// Export passage types
export type {
    AnyHotspot,
    HotspotImageOptions,
    HotspotLabelOptions,
    HotspotPosition,
    ImageHotspot,
    ImageHotspotContentObject,
    InteractiveMapOptions,
    InteractiveMapType,
    LabelHotspot,
    MapContentFn,
    MapContentItems,
    MapDefineOptions,
    MapHelpers,
    MapImage,
    MapImageHotspot,
    MapImageOptions,
    MapLabelBuilder,
    MapLabelHotspot,
    MapMenu,
    MapMenuOptions,
    MenuLabelOptions,
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
    StoryActionsOptions,
    StoryComponents,
    StoryContent,
    StoryContentFn,
    StoryContentItems,
    StoryConversationOptions,
    StoryHeaderOptions,
    StoryHelpers,
    StoryImageOptions,
    StoryIncludeOptions,
    StoryOptions,
    StoryTextOptions,
    StoryVideoOptions,
    TextComponent,
    VideoComponent,
} from "#passages/story";
export type { WidgetContent } from "#passages/widget";
export type {
    PreloadAsset,
    PreloadAssetType,
    PreloadFailure,
    PreloadOptions,
    PreloadProgress,
    PreloadResult,
    PreloadSource,
    PreloadTask,
} from "#preload";
export type * from "#types";
export * from "./constants";
// Export dev tools types
export type { ReactTextGameDebug } from "./global";
export * from "./hooks";
export { preloadContent } from "./preload";

export {
    BaseGameObject,
    createEntity,
    defineInteractiveMap,
    defineStory,
    defineWidget,
    Game,
    InteractiveMap,
    mapHelpers,
    type NewOptions,
    newInteractiveMap,
    newStory,
    newWidget,
    type Options,
    Passage,
    Story,
    storyHelpers,
    Widget,
};
