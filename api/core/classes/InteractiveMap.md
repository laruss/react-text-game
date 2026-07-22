# Class: InteractiveMap

Defined in: [packages/core/src/passages/interactiveMap/interactiveMap.ts:49](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/interactiveMap.ts#L49)

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

Defined in: [packages/core/src/passages/interactiveMap/interactiveMap.ts:61](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/interactiveMap.ts#L61)

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

### \_lastDisplayResult

> `protected` **\_lastDisplayResult**: `unknown` = `null`

Defined in: [packages/core/src/passages/passage.ts:47](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/passage.ts#L47)

**`Internal`**

Cached result from the last display() call.
Used to access display data without re-executing content functions.

#### Inherited from

[`Passage`](Passage.md).[`_lastDisplayResult`](Passage.md#_lastdisplayresult)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/core/src/passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [packages/core/src/passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**\<`T`\>(`props`): [`InteractiveMapType`](../type-aliases/InteractiveMapType.md)

Defined in: [packages/core/src/passages/interactiveMap/interactiveMap.ts:107](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/interactiveMap.ts#L107)

Renders the interactive map by resolving dynamic values and filtering hotspots.

Processes all hotspots by:
1. Resolving the hotspots array (if it's a function)
2. Calling individual hotspot functions with props (if they are functions)
3. Filtering out undefined hotspots (useful for conditional hotspots)
4. Resolving image URLs (if they are functions)

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
// With static hotspots array
const map1 = newInteractiveMap('map', {
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
const result1 = map1.display({ currentSeason: 'winter', isNight: false });

// With dynamic hotspots array function
const map2 = newInteractiveMap('map', {
  image: '/map.jpg',
  hotspots: (props) => props.isInCombat ? [
    { type: 'label', content: 'Attack', position: 'bottom', action: () => attack() }
  ] : [
    { type: 'label', content: 'Explore', position: { x: 50, y: 50 }, action: () => explore() }
  ]
});
const result2 = map2.display({ isInCombat: true });
```

#### Overrides

[`Passage`](Passage.md).[`display`](Passage.md#display)

***

### getLastDisplayResult()

> **getLastDisplayResult**\<`T`\>(): `T` \| `null`

Defined in: [packages/core/src/passages/passage.ts:96](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/passage.ts#L96)

Returns the cached result from the last display() call.
Use this method to access passage data without re-executing content functions,
which prevents unwanted side effects.

#### Type Parameters

##### T

`T` = `unknown`

Expected return type

#### Returns

`T` \| `null`

The cached display result, or null if display() has never been called

#### Example

```typescript
const story = newStory('test', () => [{ type: 'text', content: 'Hello' }]);

// First call to display() - executes content function
const result = story.display();

// Get cached result - does NOT execute content function again
const cached = story.getLastDisplayResult();
```

#### Inherited from

[`Passage`](Passage.md).[`getLastDisplayResult`](Passage.md#getlastdisplayresult)

***

### hasDisplayCache()

> **hasDisplayCache**(): `boolean`

Defined in: [packages/core/src/passages/passage.ts:105](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/passage.ts#L105)

Checks if a cached display result exists.

#### Returns

`boolean`

true if display() has been called at least once, false otherwise

#### Inherited from

[`Passage`](Passage.md).[`hasDisplayCache`](Passage.md#hasdisplaycache)
