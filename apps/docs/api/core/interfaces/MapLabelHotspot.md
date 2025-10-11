# Interface: MapLabelHotspot

Defined in: [passages/interactiveMap/types.ts:407](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L407)

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

Defined in: [passages/interactiveMap/types.ts:37](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L37)

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

> **content**: `string` \| () => `string`

Defined in: [passages/interactiveMap/types.ts:140](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L140)

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

Defined in: [passages/interactiveMap/types.ts:18](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L18)

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

Defined in: [passages/interactiveMap/types.ts:62](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L62)

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

> **position**: `object`

Defined in: [passages/interactiveMap/types.ts:354](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L354)

Position coordinates on the map.
Values are percentages (0-100) of the map's width and height.

#### x

> **x**: `number` \| () => `number`

Horizontal position as a percentage (0-100) from the left edge.
Can be static number or a function for dynamic positioning.

##### Example

```typescript
x: 50      // Center horizontally
x: 25      // 25% from the left
x: () => player.isAtNight ? 30 : 70  // Dynamic based on state
```

##### Remarks

- 0 = left edge of the map
- 50 = horizontal center
- 100 = right edge of the map

#### y

> **y**: `number` \| () => `number`

Vertical position as a percentage (0-100) from the top edge.
Can be static number or a function for dynamic positioning.

##### Example

```typescript
y: 50      // Center vertically
y: 75      // 75% from the top
y: () => player.level * 10  // Dynamic positioning
```

##### Remarks

- 0 = top edge of the map
- 50 = vertical center
- 100 = bottom edge of the map

#### Inherited from

`BaseMapHotspot.position`

***

### props?

> `optional` **props**: `object`

Defined in: [passages/interactiveMap/types.ts:145](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L145)

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

Defined in: [passages/interactiveMap/types.ts:68](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L68)

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

[`LabelHotspot`](LabelHotspot.md).[`tooltip`](LabelHotspot.md#tooltip)

***

### type

> **type**: `"label"`

Defined in: [passages/interactiveMap/types.ts:124](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L124)

Discriminator property identifying this as a label hotspot.

#### Inherited from

[`LabelHotspot`](LabelHotspot.md).[`type`](LabelHotspot.md#type)
