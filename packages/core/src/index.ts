import { BaseGameObject } from "#baseGameObject";
import { Game } from "#game";
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
