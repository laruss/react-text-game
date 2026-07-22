# Interface: ActionsComponent

Defined in: [packages/core/src/passages/story/types.ts:548](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L548)

Component for displaying a group of interactive action buttons.
Used to present player choices, navigation options, or any interactive decisions.

## Example

```typescript
// Horizontal action buttons (default)
{
  type: 'actions',
  content: [
    { label: 'Go North', action: () => Game.jumpTo('north-room') },
    { label: 'Go South', action: () => Game.jumpTo('south-room') }
  ]
}

// Vertical layout for dialogue choices
{
  type: 'actions',
  props: { direction: 'vertical' },
  content: [
    { label: 'Tell the truth', action: () => increaseHonesty() },
    { label: 'Lie', action: () => decreaseHonesty() },
    { label: 'Say nothing', action: () => Game.jumpTo('silence') }
  ]
}
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: [`ActionType`](../type-aliases/ActionType.md)[]

Defined in: [packages/core/src/passages/story/types.ts:558](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L558)

Array of action buttons to display.
Each action represents a choice or interactive option for the player.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L24)

Optional unique identifier for this component.
Can be used to reference or manipulate specific components programmatically.

#### Example

```typescript
{ type: 'text', id: 'intro-text', content: 'Welcome!' }
```

#### Inherited from

`BaseComponent.id`

***

### initialVariant?

> `optional` **initialVariant**: `"display"` \| `"hidden"` \| `"disclosure"`

Defined in: [packages/core/src/passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L39)

Controls the initial visibility state of the component.

#### Remarks

This property is designed for future UI implementation to support dynamic component visibility.
Currently defined but not yet implemented in the UI layer.

- `"display"` - Component is visible and rendered immediately (default behavior)
- `"hidden"` - Component exists but is not visible initially
- `"disclosure"` - Component is initially collapsed/hidden but can be expanded by user interaction

#### Default Value

`"display"`

#### Inherited from

`BaseComponent.initialVariant`

***

### props?

> `optional` **props**: `object`

Defined in: [packages/core/src/passages/story/types.ts:563](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L563)

Optional configuration for layout and styling.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the actions container.

##### Example

```typescript
props: { className: 'gap-4 p-4' }
```

#### direction?

> `optional` **direction**: `"horizontal"` \| `"vertical"`

Layout direction for the action buttons.

##### Default Value

`"horizontal"`

##### Remarks

- `"horizontal"` - Buttons arranged in a row (wraps on small screens)
- `"vertical"` - Buttons stacked in a column (better for many options or long labels)

***

### type

> **type**: `"actions"`

Defined in: [packages/core/src/passages/story/types.ts:552](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L552)

Discriminator property identifying this as an actions component.
