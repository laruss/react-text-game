# Interface: MapLabelHotspot

Defined in: [packages/core/src/passages/interactiveMap/types.ts:446](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L446)

Label hotspot positioned on the map image.
Combines text button functionality with percentage-based map positioning.

## Example

```typescript
{
  type: 'label',
  content: 'Village',
  position: { x: 30, y: 40 },
  action: () => Game.jumpTo('village')
}
```

## Extends

- [`LabelHotspot`](LabelHotspot.md).`BaseMapHotspot`

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

[`LabelHotspot`](LabelHotspot.md).[`action`](LabelHotspot.md#action)

***

### content

> **content**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:169](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L169)

The text to display on the button.
Can be static string or a function for dynamic content.

#### Example

```typescript
// Static label
content: 'Enter Shop'

// Dynamic label
content: () => `Health: ${player.health}/100`
content: () => player.hasVisited ? 'Return to Town' : 'Discover Town'
```

#### Inherited from

[`LabelHotspot`](LabelHotspot.md).[`content`](LabelHotspot.md#content)

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

[`LabelHotspot`](LabelHotspot.md).[`id`](LabelHotspot.md#id)

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

[`LabelHotspot`](LabelHotspot.md).[`isDisabled`](LabelHotspot.md#isdisabled)

***

### position

> **position**: [`HotspotPosition`](../type-aliases/HotspotPosition.md)

Defined in: [packages/core/src/passages/interactiveMap/types.ts:429](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L429)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:174](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L174)

Optional configuration for button styling and appearance.

#### classNames?

> `optional` **classNames**: `object`

CSS class name overrides.

##### classNames.button?

> `optional` **button**: `string`

CSS class for the button element.

###### Example

```typescript
button: 'text-lg font-bold px-6 py-3'
```

#### color?

> `optional` **color**: [`ButtonColor`](../type-aliases/ButtonColor.md)

Color scheme for the button.
Maps to semantic color tokens in the UI theme.

##### Default Value

`"primary"`

##### See

[ButtonColor](../type-aliases/ButtonColor.md) for available options

#### variant?

> `optional` **variant**: [`ButtonVariant`](../type-aliases/ButtonVariant.md)

Visual style variant for the button.

##### Default Value

`"solid"`

##### See

[ButtonVariant](../type-aliases/ButtonVariant.md) for available options

#### Inherited from

[`LabelHotspot`](LabelHotspot.md).[`props`](LabelHotspot.md#props)

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

[`LabelHotspot`](LabelHotspot.md).[`tooltip`](LabelHotspot.md#tooltip)

***

### type

> **type**: `"label"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:153](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/interactiveMap/types.ts#L153)

Discriminator property identifying this as a label hotspot.

#### Inherited from

[`LabelHotspot`](LabelHotspot.md).[`type`](LabelHotspot.md#type)
