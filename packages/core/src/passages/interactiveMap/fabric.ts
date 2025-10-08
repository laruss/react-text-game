import { InteractiveMap } from "./interactiveMap";
import { InteractiveMapOptions } from "./types";

export const newInteractiveMap = (
    id: string,
    options: InteractiveMapOptions
): InteractiveMap => new InteractiveMap(id, options);
