# Type Alias: ActionType

> **ActionType** = `object`

Defined in: [packages/core/src/passages/story/types.ts:418](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L418)

Represents an interactive button action within a story.
Used to create player choices, navigation buttons, and interactive elements.

## Remarks

Give every action a `content`. The legacy [ActionType.label](#label) field is
still read when `content` is absent, but it is deprecated and accepts plain
strings only.

## Example

```typescript
// Simple navigation action
{
  content: 'Continue',
  action: () => Game.jumpTo('next-scene')
}

// Rich content
{
  content: <><Icon name="sword" /> Attack</>,
  action: () => combat.attack(),
  color: 'danger',
  variant: 'solid'
}

// Disabled action with tooltip
{
  content: 'Open Door',
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

Defined in: [packages/core/src/passages/story/types.ts:458](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L458)

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

Defined in: [packages/core/src/passages/story/types.ts:547](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L547)

CSS class name(s) to apply to the button element.

#### Example

```typescript
className: 'w-full text-lg font-bold'
```

***

### color?

> `optional` **color**: [`ButtonColor`](ButtonColor.md)

Defined in: [packages/core/src/passages/story/types.ts:475](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L475)

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

### content?

> `optional` **content**: `ReactNode`

Defined in: [packages/core/src/passages/story/types.ts:434](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L434)

The content displayed on the button.
Supports strings, numbers, JSX elements, and any valid React node.
Should clearly describe the action the player will take.

#### Remarks

Takes precedence over [ActionType.label](#label). Provide one of the two:
an action with neither renders an empty button.

#### Example

```typescript
content: 'Continue'
content: <><Icon name="key" /> Unlock the gate</>
```

***

### isDisabled?

> `optional` **isDisabled**: `boolean`

Defined in: [packages/core/src/passages/story/types.ts:504](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L504)

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

### ~~label?~~

> `optional` **label**: `string`

Defined in: [packages/core/src/passages/story/types.ts:444](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L444)

The text displayed on the button.
Should clearly describe the action the player will take.

#### Deprecated

Use [ActionType.content](#content) instead, which accepts any
React node. `label` is only used when `content` is not provided and will
be removed in a future major release.

***

### tooltip?

> `optional` **tooltip**: `object`

Defined in: [packages/core/src/passages/story/types.ts:510](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L510)

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

Defined in: [packages/core/src/passages/story/types.ts:492](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L492)

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
