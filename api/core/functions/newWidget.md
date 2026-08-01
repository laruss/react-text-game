# Function: newWidget()

> **newWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: [packages/core/src/passages/widget.ts:146](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/widget.ts#L146)

Factory function for creating Widget passages.

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

Fully supported and not scheduled for removal. New code is encouraged to use
[defineWidget](defineWidget.md), which is identical but keeps every passage factory
under the same `define*` name.

## Example

```typescript
// With ReactNode (static content)
const customMenu = newWidget('menu', (
  <CustomMenuComponent />
));

// With React component (supports hooks)
const MyComponent = () => {
  const [count, setCount] = useState(0);
  return <Counter count={count} onChange={setCount} />;
};
const counterWidget = newWidget('counter', MyComponent);

// For dynamic content without hooks, pre-evaluate:
const timestampWidget = newWidget('time', (() => <div>{Date.now()}</div>)());
```
