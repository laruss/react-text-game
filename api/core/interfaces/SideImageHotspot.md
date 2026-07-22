# Interface: SideImageHotspot

Defined in: [packages/core/src/passages/interactiveMap/types.ts:564](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L564)

Image hotspot positioned on the edge of the map.
Appears outside the main map area, on one of the four sides.

## Example

```typescript
{
  type: 'image',
  content: { idle: '/icons/compass.png' },
  position: 'bottom',
  action: () => toggleCompass()
}
```

## Extends

- [`ImageHotspot`](ImageHotspot.md).`SideHotspot`

## Properties

### action()

> **action**: () => `void`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:66](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L66)

Callback function executed when the hotspot is clicked.
Called only when the hotspot is not disabled.

#### Returns

`void`

#### Example

```typescript
// Navigate to another passage
action: () => Game.jumpTo('village')

// Perform complex game logic
action: () => {
  player.gold -= 50;
  player.inventory.add('sword');
  Game.jumpTo('shop-exit');
}
```

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`action`](ImageHotspot.md#action)

***

### content

> **content**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`string`\> \| [`ImageHotspotContentObject`](../type-aliases/ImageHotspotContentObject.md)

Defined in: [packages/core/src/passages/interactiveMap/types.ts:357](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L357)

Image URL/path or object with URLs for different hotspot states.

Can be one of three options:
1. **String** - Single static image URL (simplest)
2. **Function** - Returns dynamic image URL based on game state
3. **Object** - Different images for idle, hover, active, and disabled states

#### Example

```typescript
// Option 1: Simple string
content: '/icons/button.png'

// Option 2: Dynamic function
content: () => `/icons/button-${theme}.png`

// Option 3: State-dependent object
content: {
  idle: '/icons/button.png',
  hover: '/icons/button-hover.png',
  active: '/icons/button-pressed.png',
  disabled: '/icons/button-disabled.png'
}
```

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`content`](ImageHotspot.md#content)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:47](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L47)

Optional unique identifier for this hotspot.
Can be used for debugging, analytics, or programmatic hotspot manipulation.

#### Example

```typescript
id: 'village-entrance'
id: 'shop-button'
```

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`id`](ImageHotspot.md#id)

***

### isDisabled?

> `optional` **isDisabled**: `boolean` \| () => `boolean`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:91](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L91)

Controls whether the hotspot is interactive.
Can be a static boolean or a function for dynamic state.

#### Default Value

```ts
false
```

#### Example

```typescript
// Static disabled state
isDisabled: true

// Dynamic based on game state
isDisabled: () => player.gold < 50
isDisabled: () => !player.hasKey
```

#### Remarks

When disabled:
- Hotspot cannot be clicked
- Visual appearance changes (usually dimmed/grayed out)
- For image hotspots, the "disabled" image variant is shown if provided
- Tooltip still displays to explain why it's disabled

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`isDisabled`](ImageHotspot.md#isdisabled)

***

### position

> **position**: `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:531](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L531)

Which edge of the map to place this hotspot.

#### Remarks

Side hotspots are useful for:
- Persistent UI elements that shouldn't overlap the map
- Navigation controls
- Status displays
- Menu buttons

Multiple hotspots on the same side are stacked in order.

#### Inherited from

`SideHotspot.position`

***

### props?

> `optional` **props**: `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:362](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L362)

Optional configuration for sizing and styling.

#### classNames?

> `optional` **classNames**: `object`

CSS class name overrides for different states.

##### classNames.active?

> `optional` **active**: `string`

CSS class for the active/clicked state image.

##### classNames.container?

> `optional` **container**: `string`

CSS class for the hotspot container element.

###### Example

```typescript
container: 'shadow-lg rounded-full'
```

##### classNames.disabled?

> `optional` **disabled**: `string`

CSS class for the disabled state image.

##### classNames.hover?

> `optional` **hover**: `string`

CSS class for the hover state image.

##### classNames.idle?

> `optional` **idle**: `string`

CSS class for the idle state image.

#### zoom?

> `optional` **zoom**: `` `${number}%` ``

CSS zoom level for the hotspot image.
Useful for making small images more visible without recreating assets.

##### Example

```typescript
zoom: '150%'  // Make image 1.5x larger
zoom: '200%'  // Double the size
zoom: '75%'   // Make smaller
```

##### Remarks

Zoom is applied via CSS and may affect image quality.
For best results, use appropriately-sized source images.

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`props`](ImageHotspot.md#props)

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:97](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L97)

Optional tooltip configuration.
Displays additional information when hovering over the hotspot.

#### content

> **content**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`string`\>

The text to display in the tooltip.
Can be static string or a function for dynamic content.

##### Example

```typescript
// Static tooltip
content: 'Click to enter the village'

// Dynamic tooltip based on state
content: () => player.hasKey
  ? 'Unlock the door'
  : 'You need a key to unlock this door'
```

#### position?

> `optional` **position**: `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Position of the tooltip relative to the hotspot.

##### Default Value

`"top"`

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`tooltip`](ImageHotspot.md#tooltip)

***

### type

> **type**: `"image"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:330](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L330)

Discriminator property identifying this as an image hotspot.

#### Inherited from

[`ImageHotspot`](ImageHotspot.md).[`type`](ImageHotspot.md#type)
