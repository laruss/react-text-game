# Interface: ActionsComponent

Defined in: [packages/core/src/passages/story/types.ts:577](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L577)

Component for displaying a group of interactive action buttons.
Used to present player choices, navigation options, or any interactive decisions.

## Example

```typescript
// Horizontal action buttons (default)
{
  type: 'actions',
  content: [
    { content: 'Go North', action: () => Game.jumpTo('north-room') },
    { content: 'Go South', action: () => Game.jumpTo('south-room') }
  ]
}

// Vertical layout for dialogue choices
{
  type: 'actions',
  props: { direction: 'vertical' },
  content: [
    { content: 'Tell the truth', action: () => increaseHonesty() },
    { content: 'Lie', action: () => decreaseHonesty() },
    { content: 'Say nothing', action: () => Game.jumpTo('silence') }
  ]
}
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: [`ActionType`](../type-aliases/ActionType.md)[]

Defined in: [packages/core/src/passages/story/types.ts:587](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L587)

Array of action buttons to display.
Each action represents a choice or interactive option for the player.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:27](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L27)

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

Defined in: [packages/core/src/passages/story/types.ts:42](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L42)

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

Defined in: [packages/core/src/passages/story/types.ts:592](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L592)

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

Defined in: [packages/core/src/passages/story/types.ts:581](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L581)

Discriminator property identifying this as an actions component.
