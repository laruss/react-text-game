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
