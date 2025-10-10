# Interface: LabelHotspot

Defined in: [passages/interactiveMap/types.ts:120](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L120)

Text-based button hotspot for interactive maps.
Displays as a styled button with customizable text and appearance.

## Example

```typescript
// Simple label hotspot
{
  type: 'label',
  content: 'Village Entrance',
  action: () => Game.jumpTo('village')
}

// Dynamic label with custom styling
{
  type: 'label',
  content: () => `Gold: ${player.gold}`,
  action: () => openInventory(),
  props: {
    variant: 'bordered',
    color: 'warning'
  }
}
```

## Extends

- `BaseHotspot`

## Extended by

- [`MapLabelHotspot`](MapLabelHotspot.md)
- [`SideLabelHotspot`](SideLabelHotspot.md)

## Properties

### action()

> **action**: () => `void`

Defined in: [passages/interactiveMap/types.ts:37](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L37)

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

`BaseHotspot.action`

***

### content

> **content**: `string` \| () => `string`

Defined in: [passages/interactiveMap/types.ts:140](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L140)

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

***

### id?

> `optional` **id**: `string`

Defined in: [passages/interactiveMap/types.ts:18](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L18)

Optional unique identifier for this hotspot.
Can be used for debugging, analytics, or programmatic hotspot manipulation.

#### Example

```typescript
id: 'village-entrance'
id: 'shop-button'
```

#### Inherited from

`BaseHotspot.id`

***

### isDisabled?

> `optional` **isDisabled**: `boolean` \| () => `boolean`

Defined in: [passages/interactiveMap/types.ts:62](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L62)

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

`BaseHotspot.isDisabled`

***

### props?

> `optional` **props**: `object`

Defined in: [passages/interactiveMap/types.ts:145](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L145)

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

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [passages/interactiveMap/types.ts:68](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L68)

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

`BaseHotspot.tooltip`

***

### type

> **type**: `"label"`

Defined in: [passages/interactiveMap/types.ts:124](https://github.com/laruss/react-text-game/blob/76cea889a7a8b8f7da18a22748a455531ab7ac4b/packages/core/src/passages/interactiveMap/types.ts#L124)

Discriminator property identifying this as a label hotspot.
