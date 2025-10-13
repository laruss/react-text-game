# Class: InteractiveMap

Defined in: [passages/interactiveMap/interactiveMap.ts:49](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/interactiveMap/interactiveMap.ts#L49)

Map-based interactive passage with clickable hotspots.

Interactive maps display an image with interactive hotspots (buttons/images) that
can be positioned on the map or on its sides. Hotspots can be labels, images, or menus.
Both the map image and hotspots can be dynamic based on game state.

## Example

```typescript
import { newInteractiveMap } from '@react-text-game/core';

const worldMap = newInteractiveMap('world-map', {
  image: '/maps/world.jpg',
  bgImage: '/maps/world-bg.jpg',
  hotspots: [
    {
      type: 'label',
      content: 'Village',
      position: { x: 30, y: 40 },
      action: () => Game.jumpTo('village')
    },
    {
      type: 'image',
      content: {
        idle: '/icons/chest.png',
        hover: '/icons/chest-glow.png'
      },
      position: { x: 60, y: 70 },
      action: () => openChest()
    },
    () => player.hasKey ? {
      type: 'label',
      content: 'Secret Door',
      position: 'top',
      action: () => Game.jumpTo('secret')
    } : undefined
  ]
});
```

## See

newInteractiveMap - Factory function for creating InteractiveMap instances

## Extends

- [`Passage`](Passage.md)

## Constructors

### Constructor

> **new InteractiveMap**(`id`, `options`): `InteractiveMap`

Defined in: [passages/interactiveMap/interactiveMap.ts:61](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/interactiveMap/interactiveMap.ts#L61)

Creates a new InteractiveMap passage.

#### Parameters

##### id

`string`

Unique identifier for this map

##### options

[`InteractiveMapOptions`](../type-aliases/InteractiveMapOptions.md)

Configuration including image, hotspots, and styling

#### Returns

`InteractiveMap`

#### Overrides

[`Passage`](Passage.md).[`constructor`](Passage.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: [passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**\<`T`\>(`props`): [`InteractiveMapType`](../type-aliases/InteractiveMapType.md)

Defined in: [passages/interactiveMap/interactiveMap.ts:95](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/interactiveMap/interactiveMap.ts#L95)

Renders the interactive map by resolving dynamic values and filtering hotspots.

Processes all hotspots by:
1. Calling hotspot functions with props (if they are functions)
2. Filtering out undefined hotspots (useful for conditional hotspots)
3. Resolving image URLs (if they are functions)

#### Type Parameters

##### T

`T` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`EmptyObject`](../type-aliases/EmptyObject.md)

Type of props to pass when resolving dynamic content

#### Parameters

##### props

`T` = `...`

Properties used when evaluating dynamic hotspots/images

#### Returns

[`InteractiveMapType`](../type-aliases/InteractiveMapType.md)

Processed map configuration ready for rendering

#### Example

```typescript
const map = newInteractiveMap('map', {
  image: () => `/maps/${currentSeason}.jpg`,
  hotspots: [
    () => isNight ? undefined : {
      type: 'label',
      content: 'Shop',
      position: { x: 50, y: 50 },
      action: () => openShop()
    }
  ]
});

const { image, hotspots } = map.display({ currentSeason: 'winter', isNight: false });
```

#### Overrides

[`Passage`](Passage.md).[`display`](Passage.md#display)
