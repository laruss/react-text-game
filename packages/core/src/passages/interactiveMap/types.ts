import { ButtonColor, ButtonVariant, MaybeCallable } from "#types";

/**
 * Position coordinates for hotspots on the map.
 * Values are percentages (0-100) relative to the map's dimensions.
 * Can be a static object or a function that returns an object for dynamic positioning.
 *
 * @example
 * ```typescript
 * // Static positioning
 * position: { x: 50, y: 50 }  // Center of map
 * position: { x: 25, y: 75 }  // Lower left quadrant
 *
 * // Dynamic positioning
 * position: () => ({
 *   x: player.isAtNight ? 30 : 70,
 *   y: player.level * 10
 * })
 * ```
 *
 * @remarks
 * - x: 0 = left edge, 50 = horizontal center, 100 = right edge
 * - y: 0 = top edge, 50 = vertical center, 100 = bottom edge
 */
export type HotspotPosition = MaybeCallable<{
    /** Horizontal position on the map, as a percentage (0-100) */
    x: number;
    /** Vertical position on the map, as a percentage (0-100) */
    y: number;
}>;

/**
 * Base interface shared by all hotspot types.
 * Provides common properties for interaction, identification, and state management.
 */
interface BaseHotspot {
    /**
     * Optional unique identifier for this hotspot.
     * Can be used for debugging, analytics, or programmatic hotspot manipulation.
     *
     * @example
     * ```typescript
     * id: 'village-entrance'
     * id: 'shop-button'
     * ```
     */
    id?: string;

    /**
     * Callback function executed when the hotspot is clicked.
     * Called only when the hotspot is not disabled.
     *
     * @example
     * ```typescript
     * // Navigate to another passage
     * action: () => Game.jumpTo('village')
     *
     * // Perform complex game logic
     * action: () => {
     *   player.gold -= 50;
     *   player.inventory.add('sword');
     *   Game.jumpTo('shop-exit');
     * }
     * ```
     */
    action: () => void;

    /**
     * Controls whether the hotspot is interactive.
     * Can be a static boolean or a function for dynamic state.
     *
     * @defaultValue false
     *
     * @example
     * ```typescript
     * // Static disabled state
     * isDisabled: true
     *
     * // Dynamic based on game state
     * isDisabled: () => player.gold < 50
     * isDisabled: () => !player.hasKey
     * ```
     *
     * @remarks
     * When disabled:
     * - Hotspot cannot be clicked
     * - Visual appearance changes (usually dimmed/grayed out)
     * - For image hotspots, the "disabled" image variant is shown if provided
     * - Tooltip still displays to explain why it's disabled
     */
    isDisabled?: boolean | (() => boolean);

    /**
     * Optional tooltip configuration.
     * Displays additional information when hovering over the hotspot.
     */
    tooltip?: {
        /**
         * The text to display in the tooltip.
         * Can be static string or a function for dynamic content.
         *
         * @example
         * ```typescript
         * // Static tooltip
         * content: 'Click to enter the village'
         *
         * // Dynamic tooltip based on state
         * content: () => player.hasKey
         *   ? 'Unlock the door'
         *   : 'You need a key to unlock this door'
         * ```
         */
        content: MaybeCallable<string>;

        /**
         * Position of the tooltip relative to the hotspot.
         *
         * @defaultValue `"top"`
         */
        position?: "top" | "bottom" | "left" | "right";
    };
}

/**
 * Text-based button hotspot for interactive maps.
 * Displays as a styled button with customizable text and appearance.
 *
 * @example
 * ```typescript
 * // Simple label hotspot
 * {
 *   type: 'label',
 *   content: 'Village Entrance',
 *   action: () => Game.jumpTo('village')
 * }
 *
 * // Dynamic label with custom styling
 * {
 *   type: 'label',
 *   content: () => `Gold: ${player.gold}`,
 *   action: () => openInventory(),
 *   props: {
 *     variant: 'bordered',
 *     color: 'warning'
 *   }
 * }
 * ```
 */
export interface LabelHotspot extends BaseHotspot {
    /**
     * Discriminator property identifying this as a label hotspot.
     */
    type: "label";

    /**
     * The text to display on the button.
     * Can be static string or a function for dynamic content.
     *
     * @example
     * ```typescript
     * // Static label
     * content: 'Enter Shop'
     *
     * // Dynamic label
     * content: () => `Health: ${player.health}/100`
     * content: () => player.hasVisited ? 'Return to Town' : 'Discover Town'
     * ```
     */
    content: MaybeCallable<string>;

    /**
     * Optional configuration for button styling and appearance.
     */
    props?: {
        /**
         * CSS class name overrides.
         */
        classNames?: {
            /**
             * CSS class for the button element.
             *
             * @example
             * ```typescript
             * button: 'text-lg font-bold px-6 py-3'
             * ```
             */
            button?: string;
        };

        /**
         * Visual style variant for the button.
         *
         * @defaultValue `"solid"`
         *
         * @see {@link ButtonVariant} for available options
         */
        variant?: ButtonVariant;

        /**
         * Color scheme for the button.
         * Maps to semantic color tokens in the UI theme.
         *
         * @defaultValue `"primary"`
         *
         * @see {@link ButtonColor} for available options
         */
        color?: ButtonColor;
    };
}

export type ImageHotspotContentObject = {
    /**
     * Image displayed in the default/resting state.
     * Always shown when no other state is active.
     *
     * @example
     * ```typescript
     * idle: '/icons/button-default.png'
     * idle: () => `/icons/${currentTheme}/button.png`
     * ```
     */
    idle: MaybeCallable<string>;

    /**
     * Optional image displayed when the hotspot is hovered.
     * If not provided, the idle image is shown on hover.
     *
     * @example
     * ```typescript
     * hover: '/icons/button-hover.png'
     * hover: () => `/icons/button-${hoverColor}.png`
     * ```
     */
    hover?: MaybeCallable<string>;

    /**
     * Optional image displayed briefly when the hotspot is clicked.
     * Creates visual feedback for the click action.
     * If not provided, the hover or idle image is shown on click.
     *
     * @example
     * ```typescript
     * active: '/icons/button-pressed.png'
     * active: '/icons/button-flash.png'
     * ```
     *
     * @remarks
     * The active state is shown for ~100ms when clicked, then returns to idle/hover.
     */
    active?: MaybeCallable<string>;

    /**
     * Optional image displayed when the hotspot is disabled.
     * If not provided, the idle image is shown with reduced opacity when disabled.
     *
     * @example
     * ```typescript
     * disabled: '/icons/button-grayed.png'
     * disabled: '/icons/button-locked.png'
     * ```
     */
    disabled?: MaybeCallable<string>;
};

/**
 * Image-based hotspot with optional state-dependent visuals.
 * Content can be a simple string/function for basic usage, or an object with
 * different images for idle, hover, active, and disabled states.
 *
 * @example
 * ```typescript
 * // Simple image hotspot (string)
 * {
 *   type: 'image',
 *   content: '/icons/chest.png',
 *   position: { x: 60, y: 70 },
 *   action: () => openChest()
 * }
 *
 * // Dynamic image hotspot (function)
 * {
 *   type: 'image',
 *   content: () => `/icons/chest-${player.level}.png`,
 *   position: { x: 60, y: 70 },
 *   action: () => openChest()
 * }
 *
 * // Image hotspot with hover effect (object)
 * {
 *   type: 'image',
 *   content: {
 *     idle: '/icons/chest.png',
 *     hover: '/icons/chest-glow.png',
 *     active: '/icons/chest-open.png'
 *   },
 *   position: { x: 60, y: 70 },
 *   action: () => openChest()
 * }
 *
 * // Dynamic image with disabled state
 * {
 *   type: 'image',
 *   content: {
 *     idle: '/icons/door.png',
 *     hover: '/icons/door-highlight.png',
 *     disabled: '/icons/door-locked.png'
 *   },
 *   position: { x: 50, y: 50 },
 *   isDisabled: () => !player.hasKey,
 *   action: () => Game.jumpTo('next-room'),
 *   tooltip: {
 *     content: () => player.hasKey ? 'Enter' : 'Locked - Find the key'
 *   }
 * }
 *
 * // Scaled image hotspot
 * {
 *   type: 'image',
 *   content: '/icons/small-item.png',
 *   position: { x: 75, y: 80 },
 *   props: { zoom: '150%' },
 *   action: () => pickupItem()
 * }
 * ```
 */
export interface ImageHotspot extends BaseHotspot {
    /**
     * Discriminator property identifying this as an image hotspot.
     */
    type: "image";

    /**
     * Image URL/path or object with URLs for different hotspot states.
     *
     * Can be one of three options:
     * 1. **String** - Single static image URL (simplest)
     * 2. **Function** - Returns dynamic image URL based on game state
     * 3. **Object** - Different images for idle, hover, active, and disabled states
     *
     * @example
     * ```typescript
     * // Option 1: Simple string
     * content: '/icons/button.png'
     *
     * // Option 2: Dynamic function
     * content: () => `/icons/button-${theme}.png`
     *
     * // Option 3: State-dependent object
     * content: {
     *   idle: '/icons/button.png',
     *   hover: '/icons/button-hover.png',
     *   active: '/icons/button-pressed.png',
     *   disabled: '/icons/button-disabled.png'
     * }
     * ```
     */
    content: MaybeCallable<string> | ImageHotspotContentObject;

    /**
     * Optional configuration for sizing and styling.
     */
    props?: {
        /**
         * CSS zoom level for the hotspot image.
         * Useful for making small images more visible without recreating assets.
         *
         * @example
         * ```typescript
         * zoom: '150%'  // Make image 1.5x larger
         * zoom: '200%'  // Double the size
         * zoom: '75%'   // Make smaller
         * ```
         *
         * @remarks
         * Zoom is applied via CSS and may affect image quality.
         * For best results, use appropriately-sized source images.
         */
        zoom?: `${number}%`;

        /**
         * CSS class name overrides for different states.
         */
        classNames?: {
            /**
             * CSS class for the hotspot container element.
             *
             * @example
             * ```typescript
             * container: 'shadow-lg rounded-full'
             * ```
             */
            container?: string;

            /**
             * CSS class for the idle state image.
             */
            idle?: string;

            /**
             * CSS class for the hover state image.
             */
            hover?: string;

            /**
             * CSS class for the active/clicked state image.
             */
            active?: string;

            /**
             * CSS class for the disabled state image.
             */
            disabled?: string;
        };
    };
}

/**
 * Position mixin for hotspots placed on the map image itself.
 * Positions are percentage-based (0-100) relative to the map dimensions.
 */
interface BaseMapHotspot {
    /**
     * Position coordinates on the map.
     * Values are percentages (0-100) of the map's width and height.
     * Can be static or dynamic (function-based) for reactive positioning.
     *
     * @see {@link HotspotPosition} for examples and coordinate system details
     */
    position: HotspotPosition;
}

/**
 * Label hotspot positioned on the map image.
 * Combines text button functionality with percentage-based map positioning.
 *
 * @example
 * ```typescript
 * {
 *   type: 'label',
 *   content: 'Village',
 *   position: { x: 30, y: 40 },
 *   action: () => Game.jumpTo('village')
 * }
 * ```
 */
export interface MapLabelHotspot extends LabelHotspot, BaseMapHotspot {}

/**
 * Image hotspot positioned on the map image.
 * Combines image-based interaction with percentage-based map positioning.
 *
 * @example
 * ```typescript
 * {
 *   type: 'image',
 *   content: {
 *     idle: '/icons/treasure.png',
 *     hover: '/icons/treasure-glow.png'
 *   },
 *   position: { x: 60, y: 70 },
 *   action: () => openTreasure()
 * }
 * ```
 */
export interface MapImageHotspot extends ImageHotspot, BaseMapHotspot {}

/**
 * Position mixin for hotspots placed on the edges/sides of the map.
 * Side hotspots appear outside the main map area in fixed positions.
 */
interface SideHotspot {
    /**
     * Which edge of the map to place this hotspot.
     *
     * @remarks
     * Side hotspots are useful for:
     * - Persistent UI elements that shouldn't overlap the map
     * - Navigation controls
     * - Status displays
     * - Menu buttons
     *
     * Multiple hotspots on the same side are stacked in order.
     */
    position: "left" | "right" | "top" | "bottom";
}

/**
 * Label hotspot positioned on the edge of the map.
 * Appears outside the main map area, on one of the four sides.
 *
 * @example
 * ```typescript
 * {
 *   type: 'label',
 *   content: 'Menu',
 *   position: 'top',
 *   action: () => openMenu()
 * }
 * ```
 */
export interface SideLabelHotspot extends LabelHotspot, SideHotspot {}

/**
 * Image hotspot positioned on the edge of the map.
 * Appears outside the main map area, on one of the four sides.
 *
 * @example
 * ```typescript
 * {
 *   type: 'image',
 *   content: { idle: '/icons/compass.png' },
 *   position: 'bottom',
 *   action: () => toggleCompass()
 * }
 * ```
 */
export interface SideImageHotspot extends ImageHotspot, SideHotspot {}

/**
 * Contextual menu hotspot that displays multiple label buttons at a specific position.
 * Useful for creating radial menus, action lists, or grouped choices on the map.
 *
 * @example
 * ```typescript
 * // Context menu at a location
 * {
 *   type: 'menu',
 *   position: { x: 50, y: 50 },
 *   direction: 'vertical',
 *   items: [
 *     { type: 'label', content: 'Examine', action: () => examine() },
 *     { type: 'label', content: 'Take', action: () => take() },
 *     { type: 'label', content: 'Leave', action: () => leave() }
 *   ]
 * }
 *
 * // Dynamic menu with conditional items
 * {
 *   type: 'menu',
 *   position: { x: () => cursor.x, y: () => cursor.y },
 *   items: [
 *     { type: 'label', content: 'Attack', action: () => attack() },
 *     () => player.hasMagic ? {
 *       type: 'label',
 *       content: 'Cast Spell',
 *       action: () => castSpell()
 *     } : undefined,
 *     { type: 'label', content: 'Defend', action: () => defend() }
 *   ]
 * }
 * ```
 */
export interface MapMenu {
    /**
     * Discriminator property identifying this as a menu hotspot.
     */
    type: "menu";

    /**
     * Array of menu items to display.
     * Each item is a LabelHotspot or a function returning one.
     * Functions that return `undefined` are filtered out (useful for conditional menu items).
     *
     * @example
     * ```typescript
     * // Static menu items
     * items: [
     *   { type: 'label', content: 'Option 1', action: () => {} },
     *   { type: 'label', content: 'Option 2', action: () => {} }
     * ]
     *
     * // Conditional menu items
     * items: [
     *   { type: 'label', content: 'Always visible', action: () => {} },
     *   () => player.hasItem ? {
     *     type: 'label',
     *     content: 'Use Item',
     *     action: () => useItem()
     *   } : undefined
     * ]
     * ```
     */
    items: Array<MaybeCallable<LabelHotspot | undefined>>;

    /**
     * Position of the menu on the map.
     * Values are percentages (0-100) relative to the map dimensions.
     * Can be static or dynamic (function-based) for reactive positioning.
     *
     * @see {@link HotspotPosition} for examples and coordinate system details
     */
    position: HotspotPosition;

    /**
     * Layout direction for menu items.
     *
     * @defaultValue `"vertical"`
     *
     * @remarks
     * - `"vertical"` - Items stacked top to bottom (default)
     * - `"horizontal"` - Items arranged left to right
     */
    direction?: "horizontal" | "vertical";

    /**
     * Optional styling configuration.
     */
    props?: {
        /**
         * CSS class name for the menu container.
         *
         * @example
         * ```typescript
         * className: 'bg-card/90 backdrop-blur-sm rounded-lg shadow-xl p-2'
         * ```
         */
        className?: string;
    };
}

/**
 * Union type of all possible hotspot types.
 * Used for type-safe hotspot arrays in interactive maps.
 *
 * @remarks
 * This discriminated union allows TypeScript to narrow hotspot types
 * based on the `type` property when rendering or processing hotspots.
 */
export type AnyHotspot =
    | MapLabelHotspot
    | MapImageHotspot
    | SideLabelHotspot
    | SideImageHotspot
    | MapMenu;

/**
 * Function type for dynamic hotspot generation.
 * Returns a hotspot or undefined (for conditional hotspots).
 *
 * @returns Hotspot configuration or undefined if the hotspot should not be displayed
 *
 * @example
 * ```typescript
 * // Conditional hotspot based on game state
 * const dynamicHotspot: HotspotCallback = () =>
 *   player.hasKey ? {
 *     type: 'label',
 *     content: 'Unlock Door',
 *     position: { x: 50, y: 50 },
 *     action: () => unlockDoor()
 *   } : undefined;
 * ```
 */
export type HotspotCallback = () => AnyHotspot | undefined;

/**
 * Configuration options for creating an interactive map passage.
 * Defines the map image, background, hotspots, and styling.
 *
 * @example
 * ```typescript
 * const mapOptions: InteractiveMapOptions = {
 *   caption: 'World Map',
 *   image: '/maps/world.jpg',
 *   bgImage: '/maps/world-bg.jpg',
 *   props: { bgOpacity: 0.3 },
 *   hotspots: [
 *     {
 *       type: 'label',
 *       content: 'Village',
 *       position: { x: 30, y: 40 },
 *       action: () => Game.jumpTo('village')
 *     },
 *     () => player.hasDiscovered('forest') ? {
 *       type: 'image',
 *       content: { idle: '/icons/forest.png' },
 *       position: { x: 60, y: 70 },
 *       action: () => Game.jumpTo('forest')
 *     } : undefined
 *   ],
 *   classNames: {
 *     container: 'bg-gradient-to-b from-sky-900 to-indigo-900'
 *   }
 * };
 * ```
 */
export type InteractiveMapOptions = {
    /**
     * Optional caption or title for the map.
     * Displayed above the map area (implementation depends on UI).
     *
     * @example
     * ```typescript
     * caption: 'Kingdom of Eldoria'
     * caption: 'Floor 1 - Dungeon'
     * ```
     */
    caption?: string;

    /**
     * URL or path to the main map image.
     * Can be static string or a function for dynamic map selection.
     *
     * @example
     * ```typescript
     * // Static map
     * image: '/maps/world.jpg'
     *
     * // Dynamic based on time of day
     * image: () => isNight ? '/maps/world-night.jpg' : '/maps/world-day.jpg'
     *
     * // Based on player progress
     * image: () => `/maps/world-level-${player.level}.jpg`
     * ```
     */
    image: MaybeCallable<string>;

    /**
     * Array of hotspots to display on the map.
     * Can be a static array, or a function that returns an array.
     * Individual hotspots within the array can also be static or functions.
     * Functions returning `undefined` are filtered out (useful for conditional hotspots).
     *
     * @remarks
     * **When to use a function for the entire array:**
     * - When the entire set of hotspots changes based on game state
     * - When you need access to display props to generate the array
     * - For completely different hotspot sets in different game modes
     *
     * **When to use functions for individual hotspots:**
     * - For conditional visibility of specific hotspots
     * - When most hotspots remain constant but a few are dynamic
     *
     * @example
     * ```typescript
     * // Static array with mixed static and dynamic hotspots
     * hotspots: [
     *   // Static hotspot - always visible
     *   {
     *     type: 'label',
     *     content: 'Home',
     *     position: { x: 50, y: 50 },
     *     action: () => Game.jumpTo('home')
     *   },
     *
     *   // Dynamic hotspot - conditional visibility
     *   () => player.hasKey ? {
     *     type: 'label',
     *     content: 'Secret Room',
     *     position: { x: 80, y: 30 },
     *     action: () => Game.jumpTo('secret')
     *   } : undefined,
     *
     *   // Side hotspot
     *   {
     *     type: 'label',
     *     content: 'Menu',
     *     position: 'top',
     *     action: () => openMenu()
     *   }
     * ]
     *
     * // Dynamic array - entire hotspot set changes based on game state
     * hotspots: () => {
     *   if (player.isInCombat) {
     *     return [
     *       { type: 'label', content: 'Attack', position: 'bottom', action: () => attack() },
     *       { type: 'label', content: 'Defend', position: 'bottom', action: () => defend() }
     *     ];
     *   }
     *   return [
     *     { type: 'label', content: 'Explore', position: { x: 50, y: 50 }, action: () => explore() },
     *     { type: 'label', content: 'Rest', position: 'bottom', action: () => rest() }
     *   ];
     * }
     * ```
     */
    hotspots: MaybeCallable<Array<MaybeCallable<AnyHotspot | undefined>>>;

    /**
     * Optional background image URL or path.
     * Displayed behind the main map image with configurable opacity.
     * Can be static string or a function for dynamic backgrounds.
     *
     * @example
     * ```typescript
     * // Static background
     * bgImage: '/backgrounds/parchment.jpg'
     *
     * // Dynamic background
     * bgImage: () => `/backgrounds/${currentSeason}.jpg`
     * ```
     *
     * @remarks
     * Use this for:
     * - Decorative borders or frames
     * - Atmospheric effects (clouds, fog, etc.)
     * - Contextual backgrounds that change with game state
     */
    bgImage?: MaybeCallable<string>;

    /**
     * Optional configuration for map behavior.
     */
    props?: {
        /**
         * Opacity of the background image (0-1).
         *
         * @defaultValue 1
         *
         * @example
         * ```typescript
         * bgOpacity: 0.5  // 50% transparent
         * bgOpacity: 0.2  // Subtle background
         * bgOpacity: 1    // Fully opaque (default)
         * ```
         */
        bgOpacity?: number;
    };

    /**
     * CSS class name overrides for different map regions.
     */
    classNames?: {
        /**
         * CSS class for the main map container.
         * Controls overall layout and styling.
         *
         * @example
         * ```typescript
         * container: 'bg-gradient-to-b from-blue-900 to-black'
         * ```
         */
        container?: string;

        /**
         * CSS class for the top hotspot area.
         * Applied to the container holding hotspots with `position: 'top'`.
         *
         * @example
         * ```typescript
         * topHotspots: 'bg-muted/50 backdrop-blur-sm p-2'
         * ```
         */
        topHotspots?: string;

        /**
         * CSS class for the bottom hotspot area.
         * Applied to the container holding hotspots with `position: 'bottom'`.
         */
        bottomHotspots?: string;

        /**
         * CSS class for the left hotspot area.
         * Applied to the container holding hotspots with `position: 'left'`.
         */
        leftHotspots?: string;

        /**
         * CSS class for the right hotspot area.
         * Applied to the container holding hotspots with `position: 'right'`.
         */
        rightHotspots?: string;
    };
};

/**
 * Resolved/processed interactive map data returned by `InteractiveMap.display()`.
 * All dynamic values (functions) have been resolved to their concrete values.
 *
 * @remarks
 * This type represents the map after processing:
 * - All function-based images resolved to strings
 * - All conditional hotspots evaluated and filtered (undefined removed)
 * - All dynamic hotspot properties resolved
 *
 * This is the data structure consumed by the UI rendering layer.
 *
 * @example
 * ```typescript
 * const map = newInteractiveMap('world', {
 *   image: () => `/maps/${season}.jpg`,
 *   hotspots: [
 *     () => hasKey ? { type: 'label', content: 'Door', ... } : undefined
 *   ]
 * });
 *
 * // After calling display(), all functions are resolved:
 * const displayData: InteractiveMapType = map.display();
 * // displayData.image is now a string like '/maps/winter.jpg'
 * // displayData.hotspots contains only concrete hotspots (undefined filtered out)
 * ```
 */
export type InteractiveMapType = Pick<
    InteractiveMapOptions,
    "caption" | "props" | "classNames"
> & {
    /**
     * Resolved map image URL/path.
     * If the original was a function, it has been called and resolved to a string.
     */
    image: string;

    /**
     * Resolved background image URL/path.
     * If the original was a function, it has been called and resolved to a string.
     * Undefined if no background image was specified.
     */
    bgImage?: string;

    /**
     * Array of resolved, concrete hotspots.
     * All dynamic hotspots (functions) have been evaluated.
     * Hotspots that returned `undefined` have been filtered out.
     */
    hotspots: Array<AnyHotspot>;
};
