import { compact } from "#passages/definition";
import type { EmptyObject, InitVarsType } from "#types";

import { mapHelpers } from "./helpers";
import { InteractiveMap } from "./interactiveMap";
import type {
    InteractiveMapOptions,
    MapContentFn,
    MapDefineOptions,
} from "./types";

/**
 * Creates an interactive map passage from a plain options object.
 *
 * @remarks
 * Fully supported and not scheduled for removal. New code is encouraged to use
 * {@link defineInteractiveMap} instead, which hands the hotspot callback a
 * toolbox of builders so hotspot objects never have to be written by hand.
 *
 * @param id - Unique identifier for the map
 * @param options - Map image, hotspots and styling configuration
 * @returns New InteractiveMap instance, already registered with the Game
 *
 * @example
 * ```typescript
 * newInteractiveMap('world', {
 *   image: '/maps/world.jpg',
 *   hotspots: [
 *     {
 *       type: 'label',
 *       content: 'Village',
 *       position: { x: 30, y: 40 },
 *       action: () => Game.jumpTo('village')
 *     }
 *   ]
 * });
 * ```
 */
export const newInteractiveMap = (
    id: string,
    options: InteractiveMapOptions
): InteractiveMap => new InteractiveMap(id, options);

/**
 * Creates an interactive map passage from a helpers-first hotspot callback.
 *
 * The callback receives the {@link MapHelpers} toolbox as its first argument
 * and the display props as its second. Helpers return plain hotspot objects,
 * so helper calls and hand-written hotspot literals can be mixed in the same
 * array, and falsy entries are dropped so conditional hotspots can be written
 * inline.
 *
 * @template TProps - Type of props passed to `map.display()`
 * @param id - Unique identifier for the map
 * @param content - Function returning the map's hotspots
 * @param options - Map image and styling configuration, without `hotspots`
 * @returns New InteractiveMap instance, already registered with the Game
 *
 * @example
 * ```typescript
 * import { defineInteractiveMap } from '@react-text-game/core';
 *
 * defineInteractiveMap('world', (h) => [
 *   h.label('Village', { position: { x: 30, y: 40 }, action: h.jump('village') }),
 *   h.mapImage('/characters/guard.png', { position: { x: 42, y: 68 } }),
 *   h.label('Menu', { position: 'top', action: h.jump('menu') }),
 *   player.hasKey && h.label('Secret Door', {
 *     position: { x: 80, y: 30 },
 *     action: h.jump('secret')
 *   })
 * ], {
 *   image: '/maps/world.jpg',
 *   caption: 'Kingdom of Eldoria'
 * });
 * ```
 *
 * @see newInteractiveMap - Previous options-object factory, still supported
 */
export const defineInteractiveMap = <TProps extends InitVarsType = EmptyObject>(
    id: string,
    content: MapContentFn<TProps>,
    options: MapDefineOptions
): InteractiveMap =>
    new InteractiveMap(id, {
        ...options,
        // `MaybeCallable` declares the callback as zero-arg, but `display()`
        // resolves it through `callIfFunction` and hands it the display props.
        hotspots: ((props: InitVarsType) =>
            compact(
                content(mapHelpers, props as unknown as TProps)
            )) as InteractiveMapOptions["hotspots"],
    });
