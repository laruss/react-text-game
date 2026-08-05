# Type Alias: MapHelpers

> **MapHelpers** = [`CommonHelpers`](CommonHelpers.md) & `object`

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:129](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/passages/interactiveMap/helpers.ts#L129)

Toolbox handed to the content callback of [defineInteractiveMap](../functions/defineInteractiveMap.md).

Every helper builds a plain hotspot object, so helper calls and hand-written
hotspot literals can be mixed freely in the same array.

## Type Declaration

### image()

> **image**: (`content`, `options`) => [`MapImageHotspot`](../interfaces/MapImageHotspot.md) \| [`SideImageHotspot`](../interfaces/SideImageHotspot.md)

Creates an image button hotspot.

#### Parameters

##### content

[`ImageHotspot`](../interfaces/ImageHotspot.md)\[`"content"`\]

##### options

[`HotspotImageOptions`](HotspotImageOptions.md)

#### Returns

[`MapImageHotspot`](../interfaces/MapImageHotspot.md) \| [`SideImageHotspot`](../interfaces/SideImageHotspot.md)

#### Example

```typescript
h.image({ idle: '/chest.png', hover: '/chest-glow.png' }, {
  position: { x: 60, y: 70 },
  action: openChest,
  zoom: '150%'
})
```

### label

> **label**: [`MapLabelBuilder`](MapLabelBuilder.md)

Creates a text button hotspot, either standalone (with a `position`) or
as a menu item (without one).

#### See

MapLabelBuilder

### mapImage()

> **mapImage**: (`content`, `options`) => [`MapImage`](../interfaces/MapImage.md)

Creates a decorative, non-interactive image placed on the map.

#### Parameters

##### content

[`MaybeCallable`](MaybeCallable.md)\<`string`\>

##### options

[`MapImageOptions`](MapImageOptions.md)

#### Returns

[`MapImage`](../interfaces/MapImage.md)

#### Example

```typescript
h.mapImage('/characters/guard.png', {
  position: { x: 42, y: 68 },
  alt: 'Castle guard'
})
```

### menu()

> **menu**: (`items`, `options`) => [`MapMenu`](../interfaces/MapMenu.md)

Creates a grouped menu of label hotspots. Falsy items are dropped.

#### Parameters

##### items

`ReadonlyArray`\<[`Conditional`](Conditional.md)\<[`LabelHotspot`](../interfaces/LabelHotspot.md)\>\>

##### options

[`MapMenuOptions`](MapMenuOptions.md)

#### Returns

[`MapMenu`](../interfaces/MapMenu.md)

#### Example

```typescript
h.menu([
  h.label('Examine', { action: examine }),
  player.hasMagic && h.label('Cast spell', { action: castSpell })
], { position: { x: 50, y: 50 }, direction: 'horizontal' })
```

## Remarks

Each helper takes the hotspot's content first and a single flat options bag
second. Fields that live under `props` in the raw hotspot type are hoisted
into that bag, so there is only ever one level to fill in.
