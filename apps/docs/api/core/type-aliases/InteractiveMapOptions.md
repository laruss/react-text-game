# Type Alias: InteractiveMapOptions

> **InteractiveMapOptions** = `object`

Defined in: [passages/interactiveMap/types.ts:669](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L669)

Configuration options for creating an interactive map passage.
Defines the map image, background, hotspots, and styling.

## Example

```typescript
const mapOptions: InteractiveMapOptions = {
  caption: 'World Map',
  image: '/maps/world.jpg',
  bgImage: '/maps/world-bg.jpg',
  props: { bgOpacity: 0.3 },
  hotspots: [
    {
      type: 'label',
      content: 'Village',
      position: { x: 30, y: 40 },
      action: () => Game.jumpTo('village')
    },
    () => player.hasDiscovered('forest') ? {
      type: 'image',
      content: { idle: '/icons/forest.png' },
      position: { x: 60, y: 70 },
      action: () => Game.jumpTo('forest')
    } : undefined
  ],
  classNames: {
    container: 'bg-gradient-to-b from-sky-900 to-indigo-900'
  }
};
```

## Properties

### bgImage?

> `optional` **bgImage**: `string` \| () => `string`

Defined in: [passages/interactiveMap/types.ts:756](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L756)

Optional background image URL or path.
Displayed behind the main map image with configurable opacity.
Can be static string or a function for dynamic backgrounds.

#### Example

```typescript
// Static background
bgImage: '/backgrounds/parchment.jpg'

// Dynamic background
bgImage: () => `/backgrounds/${currentSeason}.jpg`
```

#### Remarks

Use this for:
- Decorative borders or frames
- Atmospheric effects (clouds, fog, etc.)
- Contextual backgrounds that change with game state

***

### caption?

> `optional` **caption**: `string`

Defined in: [passages/interactiveMap/types.ts:680](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L680)

Optional caption or title for the map.
Displayed above the map area (implementation depends on UI).

#### Example

```typescript
caption: 'Kingdom of Eldoria'
caption: 'Floor 1 - Dungeon'
```

***

### classNames?

> `optional` **classNames**: `object`

Defined in: [passages/interactiveMap/types.ts:780](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L780)

CSS class name overrides for different map regions.

#### bottomHotspots?

> `optional` **bottomHotspots**: `string`

CSS class for the bottom hotspot area.
Applied to the container holding hotspots with `position: 'bottom'`.

#### container?

> `optional` **container**: `string`

CSS class for the main map container.
Controls overall layout and styling.

##### Example

```typescript
container: 'bg-gradient-to-b from-blue-900 to-black'
```

#### leftHotspots?

> `optional` **leftHotspots**: `string`

CSS class for the left hotspot area.
Applied to the container holding hotspots with `position: 'left'`.

#### rightHotspots?

> `optional` **rightHotspots**: `string`

CSS class for the right hotspot area.
Applied to the container holding hotspots with `position: 'right'`.

#### topHotspots?

> `optional` **topHotspots**: `string`

CSS class for the top hotspot area.
Applied to the container holding hotspots with `position: 'top'`.

##### Example

```typescript
topHotspots: 'bg-muted/50 backdrop-blur-sm p-2'
```

***

### hotspots

> **hotspots**: [`MaybeCallable`](MaybeCallable.md)\<[`AnyHotspot`](AnyHotspot.md) \| `undefined`\>[]

Defined in: [passages/interactiveMap/types.ts:734](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L734)

Array of hotspots to display on the map.
Can include static hotspots or functions that return hotspots dynamically.
Functions returning `undefined` are filtered out (useful for conditional hotspots).

#### Example

```typescript
hotspots: [
  // Static hotspot - always visible
  {
    type: 'label',
    content: 'Home',
    position: { x: 50, y: 50 },
    action: () => Game.jumpTo('home')
  },

  // Dynamic hotspot - conditional visibility
  () => player.hasKey ? {
    type: 'label',
    content: 'Secret Room',
    position: { x: 80, y: 30 },
    action: () => Game.jumpTo('secret')
  } : undefined,

  // Side hotspot
  {
    type: 'label',
    content: 'Menu',
    position: 'top',
    action: () => openMenu()
  }
]
```

***

### image

> **image**: `string` \| () => `string`

Defined in: [passages/interactiveMap/types.ts:698](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L698)

URL or path to the main map image.
Can be static string or a function for dynamic map selection.

#### Example

```typescript
// Static map
image: '/maps/world.jpg'

// Dynamic based on time of day
image: () => isNight ? '/maps/world-night.jpg' : '/maps/world-day.jpg'

// Based on player progress
image: () => `/maps/world-level-${player.level}.jpg`
```

***

### props?

> `optional` **props**: `object`

Defined in: [passages/interactiveMap/types.ts:761](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L761)

Optional configuration for map behavior.

#### bgOpacity?

> `optional` **bgOpacity**: `number`

Opacity of the background image (0-1).

##### Default Value

```ts
1
```

##### Example

```typescript
bgOpacity: 0.5  // 50% transparent
bgOpacity: 0.2  // Subtle background
bgOpacity: 1    // Fully opaque (default)
```
