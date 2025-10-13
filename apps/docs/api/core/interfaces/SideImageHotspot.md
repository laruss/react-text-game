# Interface: SideImageHotspot

Defined in: [passages/interactiveMap/types.ts:478](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L478)

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

- `ImageHotspot`.`SideHotspot`

## Properties

### action()

> **action**: () => `void`

Defined in: [passages/interactiveMap/types.ts:37](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L37)

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

`ImageHotspot.action`

***

### content

> **content**: `object`

Defined in: [passages/interactiveMap/types.ts:233](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L233)

Image URLs/paths for different hotspot states.
At minimum, the `idle` state is required.

#### active?

> `optional` **active**: `string` \| () => `string`

Optional image displayed briefly when the hotspot is clicked.
Creates visual feedback for the click action.
If not provided, the hover or idle image is shown on click.

##### Example

```typescript
active: '/icons/button-pressed.png'
active: '/icons/button-flash.png'
```

##### Remarks

The active state is shown for ~100ms when clicked, then returns to idle/hover.

#### disabled?

> `optional` **disabled**: `string` \| () => `string`

Optional image displayed when the hotspot is disabled.
If not provided, the idle image is shown with reduced opacity when disabled.

##### Example

```typescript
disabled: '/icons/button-grayed.png'
disabled: '/icons/button-locked.png'
```

#### hover?

> `optional` **hover**: `string` \| () => `string`

Optional image displayed when the hotspot is hovered.
If not provided, the idle image is shown on hover.

##### Example

```typescript
hover: '/icons/button-hover.png'
hover: () => `/icons/button-${hoverColor}.png`
```

#### idle

> **idle**: `string` \| () => `string`

Image displayed in the default/resting state.
Always shown when no other state is active.

##### Example

```typescript
idle: '/icons/button-default.png'
idle: () => `/icons/${currentTheme}/button.png`
```

#### Inherited from

`ImageHotspot.content`

***

### id?

> `optional` **id**: `string`

Defined in: [passages/interactiveMap/types.ts:18](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L18)

Optional unique identifier for this hotspot.
Can be used for debugging, analytics, or programmatic hotspot manipulation.

#### Example

```typescript
id: 'village-entrance'
id: 'shop-button'
```

#### Inherited from

`ImageHotspot.id`

***

### isDisabled?

> `optional` **isDisabled**: `boolean` \| () => `boolean`

Defined in: [passages/interactiveMap/types.ts:62](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L62)

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

`ImageHotspot.isDisabled`

***

### position

> **position**: `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: [passages/interactiveMap/types.ts:445](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L445)

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

Defined in: [passages/interactiveMap/types.ts:290](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L290)

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

`ImageHotspot.props`

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [passages/interactiveMap/types.ts:68](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L68)

Optional tooltip configuration.
Displays additional information when hovering over the hotspot.

#### content

> **content**: `string` \| () => `string`

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

`ImageHotspot.tooltip`

***

### type

> **type**: `"image"`

Defined in: [passages/interactiveMap/types.ts:227](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L227)

Discriminator property identifying this as an image hotspot.

#### Inherited from

`ImageHotspot.type`
