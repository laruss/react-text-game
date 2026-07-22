# Type Alias: InteractiveMapOptions

> **InteractiveMapOptions** = `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:735](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L735)

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

> `optional` **bgImage**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:848](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L848)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:746](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L746)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:872](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L872)

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

> **hotspots**: [`MaybeCallable`](MaybeCallable.md)\<[`MaybeCallable`](MaybeCallable.md)\<[`AnyHotspot`](AnyHotspot.md) \| `undefined`\>[]\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:826](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L826)

Array of hotspots to display on the map.
Can be a static array, or a function that returns an array.
Individual hotspots within the array can also be static or functions.
Functions returning `undefined` are filtered out (useful for conditional hotspots).

#### Remarks

**When to use a function for the entire array:**
- When the entire set of hotspots changes based on game state
- When you need access to display props to generate the array
- For completely different hotspot sets in different game modes

**When to use functions for individual hotspots:**
- For conditional visibility of specific hotspots
- When most hotspots remain constant but a few are dynamic

#### Example

```typescript
// Static array with mixed static and dynamic hotspots
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

// Dynamic array - entire hotspot set changes based on game state
hotspots: () => {
  if (player.isInCombat) {
    return [
      { type: 'label', content: 'Attack', position: 'bottom', action: () => attack() },
      { type: 'label', content: 'Defend', position: 'bottom', action: () => defend() }
    ];
  }
  return [
    { type: 'label', content: 'Explore', position: { x: 50, y: 50 }, action: () => explore() },
    { type: 'label', content: 'Rest', position: 'bottom', action: () => rest() }
  ];
}
```

***

### image

> **image**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:764](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L764)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:853](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/interactiveMap/types.ts#L853)

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
