import {
    buildFromFlatOptions,
    type CommonHelpers,
    type Conditional,
    commonHelpers,
    compact,
    type HelperOptions,
} from "#passages/definition";
import type { MaybeCallable } from "#types";

import type {
    ImageHotspot,
    LabelHotspot,
    MapImage,
    MapImageHotspot,
    MapLabelHotspot,
    MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "./types";

/**
 * Keys that stay at the top level of an interactive hotspot. Everything else in
 * a helper's options bag is nested under `props`.
 */
const HOTSPOT_ROOT_KEYS = [
    "id",
    "position",
    "action",
    "isDisabled",
    "tooltip",
] as const;

/**
 * Decorative map images have no interactive fields.
 */
const MAP_IMAGE_ROOT_KEYS = ["id", "position"] as const;

/**
 * Menus carry their layout direction outside of `props`.
 */
const MENU_ROOT_KEYS = ["position", "direction"] as const;

/**
 * Options accepted by {@link MapHelpers.label}.
 *
 * `position` decides whether the button is placed on the map (`{ x, y }`
 * percentages) or docked to one of its sides.
 */
export type HotspotLabelOptions =
    | HelperOptions<Omit<MapLabelHotspot, "type" | "content">>
    | HelperOptions<Omit<SideLabelHotspot, "type" | "content">>;

/**
 * Options accepted by {@link MapHelpers.image}.
 *
 * `position` decides whether the hotspot is placed on the map (`{ x, y }`
 * percentages) or docked to one of its sides.
 */
export type HotspotImageOptions =
    | HelperOptions<Omit<MapImageHotspot, "type" | "content">>
    | HelperOptions<Omit<SideImageHotspot, "type" | "content">>;

/**
 * Options accepted by {@link MapHelpers.label} when the label is a
 * {@link MapMenu} item.
 *
 * Menu items are positioned by their menu, so `position` is not accepted here.
 */
export type MenuLabelOptions = HelperOptions<
    Omit<LabelHotspot, "type" | "content">
>;

/** Options accepted by {@link MapHelpers.mapImage}. */
export type MapImageOptions = HelperOptions<Omit<MapImage, "type" | "content">>;

/** Options accepted by {@link MapHelpers.menu}. */
export type MapMenuOptions = HelperOptions<Omit<MapMenu, "type" | "items">>;

/**
 * Builder for label hotspots.
 *
 * Supplying a `position` produces a standalone hotspot; omitting it produces a
 * {@link LabelHotspot} suitable for a {@link MapHelpers.menu} item.
 */
export type MapLabelBuilder = {
    /**
     * Creates a standalone label hotspot placed on the map or docked to a side.
     *
     * @example
     * ```typescript
     * h.label('Village', {
     *   position: { x: 30, y: 40 },
     *   action: h.jump('village')
     * })
     *
     * h.label('Menu', { position: 'top', action: openMenu, color: 'secondary' })
     * ```
     */
    (
        content: MaybeCallable<string>,
        options: HotspotLabelOptions
    ): MapLabelHotspot | SideLabelHotspot;

    /**
     * Creates a label for a menu, which supplies the position itself.
     *
     * @example
     * ```typescript
     * h.menu([h.label('Examine', { action: examine })], {
     *   position: { x: 50, y: 50 }
     * })
     * ```
     */
    (content: MaybeCallable<string>, options: MenuLabelOptions): LabelHotspot;
};

/**
 * Toolbox handed to the content callback of {@link defineInteractiveMap}.
 *
 * Every helper builds a plain hotspot object, so helper calls and hand-written
 * hotspot literals can be mixed freely in the same array.
 *
 * @remarks
 * Each helper takes the hotspot's content first and a single flat options bag
 * second. Fields that live under `props` in the raw hotspot type are hoisted
 * into that bag, so there is only ever one level to fill in.
 */
export type MapHelpers = CommonHelpers & {
    /**
     * Creates a text button hotspot, either standalone (with a `position`) or
     * as a menu item (without one).
     *
     * @see MapLabelBuilder
     */
    label: MapLabelBuilder;

    /**
     * Creates an image button hotspot.
     *
     * @example
     * ```typescript
     * h.image({ idle: '/chest.png', hover: '/chest-glow.png' }, {
     *   position: { x: 60, y: 70 },
     *   action: openChest,
     *   zoom: '150%'
     * })
     * ```
     */
    image: (
        content: ImageHotspot["content"],
        options: HotspotImageOptions
    ) => MapImageHotspot | SideImageHotspot;

    /**
     * Creates a decorative, non-interactive image placed on the map.
     *
     * @example
     * ```typescript
     * h.mapImage('/characters/guard.png', {
     *   position: { x: 42, y: 68 },
     *   alt: 'Castle guard'
     * })
     * ```
     */
    mapImage: (
        content: MaybeCallable<string>,
        options: MapImageOptions
    ) => MapImage;

    /**
     * Creates a grouped menu of label hotspots. Falsy items are dropped.
     *
     * @example
     * ```typescript
     * h.menu([
     *   h.label('Examine', { action: examine }),
     *   player.hasMagic && h.label('Cast spell', { action: castSpell })
     * ], { position: { x: 50, y: 50 }, direction: 'horizontal' })
     * ```
     */
    menu: (
        items: ReadonlyArray<Conditional<LabelHotspot>>,
        options: MapMenuOptions
    ) => MapMenu;
};

function label(
    content: MaybeCallable<string>,
    options: HotspotLabelOptions
): MapLabelHotspot | SideLabelHotspot;
function label(
    content: MaybeCallable<string>,
    options: MenuLabelOptions
): LabelHotspot;
function label(
    content: MaybeCallable<string>,
    options: HotspotLabelOptions | MenuLabelOptions
): MapLabelHotspot | SideLabelHotspot | LabelHotspot {
    return buildFromFlatOptions(
        { type: "label", content },
        options,
        HOTSPOT_ROOT_KEYS
    );
}

/**
 * Interactive map hotspot builders.
 *
 * Normally received as the first argument of a {@link defineInteractiveMap}
 * content callback. Import it directly when a map is split across several files
 * and the helpers are needed outside of the callback body.
 *
 * @example
 * ```typescript
 * import { defineInteractiveMap, mapHelpers } from '@react-text-game/core';
 *
 * const townHotspots = () => [
 *   mapHelpers.label('Inn', {
 *     position: { x: 20, y: 30 },
 *     action: mapHelpers.jump('inn')
 *   })
 * ];
 *
 * defineInteractiveMap('world', () => townHotspots(), { image: '/world.jpg' });
 * ```
 */
export const mapHelpers: MapHelpers = {
    ...commonHelpers,

    label,

    image: (content, options) =>
        buildFromFlatOptions(
            { type: "image", content },
            options,
            HOTSPOT_ROOT_KEYS
        ),

    mapImage: (content, options) =>
        buildFromFlatOptions(
            { type: "mapImage", content },
            options,
            MAP_IMAGE_ROOT_KEYS
        ),

    menu: (items, options) =>
        buildFromFlatOptions(
            { type: "menu", items: compact(items) },
            options,
            MENU_ROOT_KEYS
        ),
};
