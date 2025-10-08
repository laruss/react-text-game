import { callIfFunction } from "#helpers";
import { Passage } from "#passages/passage";
import { EmptyObject, InitVarsType } from "#types";

import { InteractiveMapOptions, InteractiveMapType } from "./types";

/**
 * Map-based interactive passage with clickable hotspots.
 *
 * Interactive maps display an image with interactive hotspots (buttons/images) that
 * can be positioned on the map or on its sides. Hotspots can be labels, images, or menus.
 * Both the map image and hotspots can be dynamic based on game state.
 *
 * @example
 * ```typescript
 * import { newInteractiveMap } from '@react-text-game/core';
 *
 * const worldMap = newInteractiveMap('world-map', {
 *   image: '/maps/world.jpg',
 *   bgImage: '/maps/world-bg.jpg',
 *   hotspots: [
 *     {
 *       type: 'label',
 *       content: 'Village',
 *       position: { x: 30, y: 40 },
 *       action: () => Game.jumpTo('village')
 *     },
 *     {
 *       type: 'image',
 *       content: {
 *         idle: '/icons/chest.png',
 *         hover: '/icons/chest-glow.png'
 *       },
 *       position: { x: 60, y: 70 },
 *       action: () => openChest()
 *     },
 *     () => player.hasKey ? {
 *       type: 'label',
 *       content: 'Secret Door',
 *       position: 'top',
 *       action: () => Game.jumpTo('secret')
 *     } : undefined
 *   ]
 * });
 * ```
 *
 * @see newInteractiveMap - Factory function for creating InteractiveMap instances
 */
export class InteractiveMap extends Passage {
    /**
     * Configuration for the interactive map including images and hotspots.
     */
    private readonly options: InteractiveMapOptions;

    /**
     * Creates a new InteractiveMap passage.
     *
     * @param id - Unique identifier for this map
     * @param options - Configuration including image, hotspots, and styling
     */
    constructor(id: string, options: InteractiveMapOptions) {
        super(id, "interactiveMap");
        this.options = options;
    }

    /**
     * Renders the interactive map by resolving dynamic values and filtering hotspots.
     *
     * Processes all hotspots by:
     * 1. Calling hotspot functions with props (if they are functions)
     * 2. Filtering out undefined hotspots (useful for conditional hotspots)
     * 3. Resolving image URLs (if they are functions)
     *
     * @template T - Type of props to pass when resolving dynamic content
     * @param props - Properties used when evaluating dynamic hotspots/images
     * @returns Processed map configuration ready for rendering
     *
     * @example
     * ```typescript
     * const map = newInteractiveMap('map', {
     *   image: () => `/maps/${currentSeason}.jpg`,
     *   hotspots: [
     *     () => isNight ? undefined : {
     *       type: 'label',
     *       content: 'Shop',
     *       position: { x: 50, y: 50 },
     *       action: () => openShop()
     *     }
     *   ]
     * });
     *
     * const { image, hotspots } = map.display({ currentSeason: 'winter', isNight: false });
     * ```
     */
    display<T extends InitVarsType = EmptyObject>(
        props: T = {} as T
    ): InteractiveMapType {
        const hotspots = this.options.hotspots
            .map((callback) => callIfFunction(callback, props))
            .filter((hotspot) => hotspot !== undefined);

        const image = callIfFunction(this.options.image);

        const bgImage = callIfFunction(this.options.bgImage)!;

        return {
            ...this.options,
            image,
            bgImage,
            hotspots,
        };
    }
}
