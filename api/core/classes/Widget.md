# Class: Widget

Defined in: [packages/core/src/passages/widget.ts:68](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/widget.ts#L68)

Custom React component passage for fully customized UI.

Widget passages allow you to use any React component as a game passage,
providing complete control over the UI when the built-in passage types
(Story, InteractiveMap) don't meet your needs.

**Important:** When passing a function, it is always treated as a React
component and rendered via `createElement`. This ensures hooks work correctly
even in minified production builds.

## Example

```typescript
import { newWidget } from '@react-text-game/core';

// With ReactNode (static content)
const inventoryUI = newWidget('inventory', (
  <div className="inventory">
    <h2>Your Inventory</h2>
    <InventoryGrid items={player.inventory} />
    <button onClick={() => Game.jumpTo('game')}>Close</button>
  </div>
));

// With React component (supports hooks)
const MyMenu = () => {
  const [selected, setSelected] = useState(null);
  return <MenuUI selected={selected} onSelect={setSelected} />;
};
const menuWidget = newWidget('menu', MyMenu);

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

Defined in: [packages/core/src/passages/widget.ts:80](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/widget.ts#L80)

Creates a new Widget passage.

#### Parameters

##### id

`string`

Unique identifier for this widget

##### content

[`WidgetContent`](../type-aliases/WidgetContent.md)

React node or function returning React node to display

#### Returns

`Widget`

#### Overrides

[`Passage`](Passage.md).[`constructor`](Passage.md#constructor)

## Properties

### \_lastDisplayResult

> `protected` **\_lastDisplayResult**: `unknown` = `null`

Defined in: [packages/core/src/passages/passage.ts:47](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L47)

**`Internal`**

Cached result from the last display() call.
Used to access display data without re-executing content functions.

#### Inherited from

[`Passage`](Passage.md).[`_lastDisplayResult`](Passage.md#_lastdisplayresult)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/core/src/passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [packages/core/src/passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**(): `ReactNode`

Defined in: [packages/core/src/passages/widget.ts:96](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/widget.ts#L96)

Returns the React node for rendering.
If content is a function, it is treated as a React component and
rendered via createElement to properly support hooks.

**Note:** Functions are always rendered via `createElement`, never called
directly. This ensures hooks work correctly in minified builds where
function names are mangled to lowercase identifiers.

#### Returns

`ReactNode`

The React content to be rendered

#### Overrides

[`Passage`](Passage.md).[`display`](Passage.md#display)

***

### getLastDisplayResult()

> **getLastDisplayResult**\<`T`\>(): `T` \| `null`

Defined in: [packages/core/src/passages/passage.ts:96](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L96)

Returns the cached result from the last display() call.
Use this method to access passage data without re-executing content functions,
which prevents unwanted side effects.

#### Type Parameters

##### T

`T` = `unknown`

Expected return type

#### Returns

`T` \| `null`

The cached display result, or null if display() has never been called

#### Example

```typescript
const story = newStory('test', () => [{ type: 'text', content: 'Hello' }]);

// First call to display() - executes content function
const result = story.display();

// Get cached result - does NOT execute content function again
const cached = story.getLastDisplayResult();
```

#### Inherited from

[`Passage`](Passage.md).[`getLastDisplayResult`](Passage.md#getlastdisplayresult)

***

### hasDisplayCache()

> **hasDisplayCache**(): `boolean`

Defined in: [packages/core/src/passages/passage.ts:105](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L105)

Checks if a cached display result exists.

#### Returns

`boolean`

true if display() has been called at least once, false otherwise

#### Inherited from

[`Passage`](Passage.md).[`hasDisplayCache`](Passage.md#hasdisplaycache)
