import { Game } from "#game";
import { BaseGameObject, createEntity } from "#gameObjects";
import type { NewOptions, Options } from "#options";
import { InteractiveMap, newInteractiveMap } from "#passages/interactiveMap";
import { Passage } from "#passages/passage";
import { newStory, Story } from "#passages/story";
import { newWidget, Widget } from "#passages/widget";

// Export SimpleObject explicitly for documentation
export type { SimpleObject } from "#gameObjects/simpleObject";
// Export passage types
export type {
    AnyHotspot,
    HotspotPosition,
    ImageHotspot,
    ImageHotspotContentObject,
    InteractiveMapOptions,
    InteractiveMapType,
    LabelHotspot,
    MapImage,
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
    Game,
    InteractiveMap,
    type NewOptions,
    newInteractiveMap,
    newStory,
    newWidget,
    type Options,
    Passage,
    Story,
    Widget,
};
