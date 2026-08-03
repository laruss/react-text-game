# Function: defineWidget()

> **defineWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: [packages/core/src/passages/widget.ts:186](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/widget.ts#L186)

Factory function for creating Widget passages.

Identical in behaviour and signature to [newWidget](newWidget.md); it exists so that
every passage factory shares the `define*` prefix (`defineStory`,
`defineInteractiveMap`, `defineWidget`).

**Important:** When passing a function, it is always treated as a React
component and rendered via `createElement`. This ensures hooks work correctly
even in minified production builds where function names are mangled.

## Parameters

### id

`string`

Unique identifier for the widget

### content

[`WidgetContent`](../type-aliases/WidgetContent.md)

React node or React functional component to display

## Returns

[`Widget`](../classes/Widget.md)

New Widget instance

## Remarks

Widgets take no helper toolbox and no display props: they are ordinary React
trees, and `Widget.display()` accepts no arguments. Use `Game.jumpTo()`
directly for navigation inside a widget.

## Example

```typescript
import { defineWidget } from '@react-text-game/core';

// With ReactNode (static content)
const inventory = defineWidget('inventory', <InventoryComponent />);

// With React component (supports hooks)
const MyMenu = () => {
  const [selected, setSelected] = useState(null);
  return <MenuUI selected={selected} onSelect={setSelected} />;
};
const menu = defineWidget('menu', MyMenu);
```

## See

newWidget - Previous name for the same factory, still supported
