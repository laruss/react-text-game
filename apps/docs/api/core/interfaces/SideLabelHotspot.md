# Interface: SideLabelHotspot

Defined in: [passages/interactiveMap/types.ts:462](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L462)

Label hotspot positioned on the edge of the map.
Appears outside the main map area, on one of the four sides.

## Example

```typescript
{
  type: 'label',
  content: 'Menu',
  position: 'top',
  action: () => openMenu()
}
```

## Extends

- [`LabelHotspot`](LabelHotspot.md).`SideHotspot`

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

> **position**: `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: [passages/interactiveMap/types.ts:445](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L445)

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
