# Interface: MapImage

Defined in: [packages/core/src/passages/interactiveMap/types.ts:488](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L488)

Decorative image positioned on the map without interactive behavior.

Unlike an image hotspot, a map image has no action, disabled state,
tooltip, hover image, or active image. Use it for markers, characters,
overlays, and other visual elements that must share the hotspot coordinate
system without becoming controls.

## Example

```typescript
{
  type: 'mapImage',
  content: '/characters/guard.png',
  position: { x: 42, y: 68 },
  props: {
    alt: 'Castle guard',
    zoom: '75%'
  }
}
```

## Extends

- `BaseMapHotspot`

## Properties

### content

> **content**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:496](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L496)

Static or dynamically resolved image URL/path.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:493](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L493)

Optional identifier used as the rendered element id and default alt text.

***

### position

> **position**: [`HotspotPosition`](../type-aliases/HotspotPosition.md)

Defined in: [packages/core/src/passages/interactiveMap/types.ts:429](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L429)

Position coordinates on the map.
Values are percentages (0-100) of the map's width and height.
Can be static or dynamic (function-based) for reactive positioning.

#### See

[HotspotPosition](../type-aliases/HotspotPosition.md) for examples and coordinate system details

#### Inherited from

`BaseMapHotspot.position`

***

### props?

> `optional` **props**: `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:499](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L499)

Optional presentation settings.

#### alt?

> `optional` **alt**: `string`

Accessible image description. Falls back to `id`, then an empty string.

#### classNames?

> `optional` **classNames**: `object`

CSS classes for the visual wrapper and image.

##### classNames.container?

> `optional` **container**: `string`

##### classNames.image?

> `optional` **image**: `string`

#### zoom?

> `optional` **zoom**: `` `${number}%` ``

Visual scale relative to the source image size.

***

### type

> **type**: `"mapImage"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:490](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/interactiveMap/types.ts#L490)

Discriminator identifying a non-interactive map image.
