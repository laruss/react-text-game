# Interface: LabelHotspot

Defined in: [packages/core/src/passages/interactiveMap/types.ts:158](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L158)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:75](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L75)

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

> **content**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:178](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L178)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:56](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L56)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:100](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L100)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:183](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L183)

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

Defined in: [packages/core/src/passages/interactiveMap/types.ts:106](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L106)

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

`BaseHotspot.tooltip`

***

### type

> **type**: `"label"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:162](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L162)

Discriminator property identifying this as a label hotspot.
