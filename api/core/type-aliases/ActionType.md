# Type Alias: ActionType

> **ActionType** = `object`

Defined in: [packages/core/src/passages/story/types.ts:410](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L410)

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

Defined in: [packages/core/src/passages/story/types.ts:429](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L429)

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

Defined in: [packages/core/src/passages/story/types.ts:518](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L518)

CSS class name(s) to apply to the button element.

#### Example

```typescript
className: 'w-full text-lg font-bold'
```

***

### color?

> `optional` **color**: [`ButtonColor`](ButtonColor.md)

Defined in: [packages/core/src/passages/story/types.ts:446](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L446)

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

Defined in: [packages/core/src/passages/story/types.ts:475](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L475)

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

Defined in: [packages/core/src/passages/story/types.ts:415](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L415)

The text displayed on the button.
Should clearly describe the action the player will take.

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [packages/core/src/passages/story/types.ts:481](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L481)

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

Defined in: [packages/core/src/passages/story/types.ts:463](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/story/types.ts#L463)

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
