# Type Alias: ActionType

> **ActionType** = `object`

Defined in: [passages/story/types.ts:385](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L385)

Represents an interactive button action within a story.
Used to create player choices, navigation buttons, and interactive elements.

## Example

```typescript
// Simple navigation action
{
  label: 'Continue',
  action: () => Game.jumpTo('next-scene')
}

// Action with styling
{
  label: 'Attack',
  action: () => combat.attack(),
  color: 'danger',
  variant: 'solid'
}

// Disabled action with tooltip
{
  label: 'Open Door',
  action: () => {},
  isDisabled: true,
  tooltip: {
    content: 'You need a key to open this door',
    position: 'top'
  }
}
```

## Properties

### action()

> **action**: () => `void`

Defined in: [passages/story/types.ts:404](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L404)

Callback function executed when the button is clicked.
Typically used for navigation, state changes, or triggering game events.

#### Returns

`void`

#### Example

```typescript
action: () => {
  player.inventory.add('key');
  Game.jumpTo('next-room');
}
```

***

### className?

> `optional` **className**: `string`

Defined in: [passages/story/types.ts:493](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L493)

CSS class name(s) to apply to the button element.

#### Example

```typescript
className: 'w-full text-lg font-bold'
```

***

### color?

> `optional` **color**: [`ButtonColor`](ButtonColor.md)

Defined in: [passages/story/types.ts:421](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L421)

Visual color scheme for the button.
Maps to semantic color tokens in the UI theme.

#### Default Value

`"primary"`

#### Remarks

Available colors:
- `"default"` - Neutral/muted appearance
- `"primary"` - Main action color
- `"secondary"` - Alternative action color
- `"success"` - Positive/confirmation actions
- `"warning"` - Caution/important actions
- `"danger"` - Destructive/negative actions

***

### isDisabled?

> `optional` **isDisabled**: `boolean`

Defined in: [passages/story/types.ts:450](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L450)

Whether the button should be disabled (non-interactive).
Disabled buttons are visually dimmed and cannot be clicked.

#### Default Value

```ts
false
```

#### Remarks

Useful for conditional actions based on game state.
Combine with `tooltip` to explain why the action is unavailable.

***

### label

> **label**: `string`

Defined in: [passages/story/types.ts:390](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L390)

The text displayed on the button.
Should clearly describe the action the player will take.

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [passages/story/types.ts:456](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L456)

Optional tooltip configuration.
Displays additional information when the user hovers over the button.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the tooltip.

##### Example

```typescript
className: 'bg-danger-500 text-white'
```

#### content

> **content**: `string`

The text or message to show in the tooltip.

##### Example

```typescript
content: 'Requires 50 gold coins'
```

#### position?

> `optional` **position**: `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Position of the tooltip relative to the button.

##### Default Value

`"top"`

***

### variant?

> `optional` **variant**: [`ButtonVariant`](ButtonVariant.md)

Defined in: [passages/story/types.ts:438](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/passages/story/types.ts#L438)

Visual style variant for the button.

#### Default Value

`"solid"`

#### Remarks

Available variants:
- `"solid"` - Filled background
- `"bordered"` - Outline style
- `"light"` - Subtle background
- `"flat"` - No background, minimal style
- `"faded"` - Translucent background
- `"shadow"` - With drop shadow
- `"ghost"` - Minimal, text-only style
