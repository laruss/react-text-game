# Class: Widget

Defined in: passages/widget.ts:30

Custom React component passage for fully customized UI.

Widget passages allow you to use any React component as a game passage,
providing complete control over the UI when the built-in passage types
(Story, InteractiveMap) don't meet your needs.

## Example

```typescript
import { newWidget } from '@react-text-game/core';

const inventoryUI = newWidget('inventory', (
  <div className="inventory">
    <h2>Your Inventory</h2>
    <InventoryGrid items={player.inventory} />
    <button onClick={() => Game.jumpTo('game')}>Close</button>
  </div>
));

// Navigate to custom UI
Game.jumpTo(inventoryUI);
```

## See

newWidget - Factory function for creating Widget instances

## Extends

- [`Passage`](Passage.md)

## Constructors

### Constructor

> **new Widget**(`id`, `content`): `Widget`

Defined in: passages/widget.ts:42

Creates a new Widget passage.

#### Parameters

##### id

`string`

Unique identifier for this widget

##### content

`ReactNode`

React node (element, component, etc.) to display

#### Returns

`Widget`

#### Overrides

[`Passage`](Passage.md).[`constructor`](Passage.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: passages/passage.ts:34

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: passages/passage.ts:40

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**(): `ReactNode`

Defined in: passages/widget.ts:52

Returns the React node for rendering.

#### Returns

`ReactNode`

The React content to be rendered

#### Overrides

[`Passage`](Passage.md).[`display`](Passage.md#display)
