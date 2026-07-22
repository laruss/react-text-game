# Function: newWidget()

> **newWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: [packages/core/src/passages/widget.ts:141](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/widget.ts#L141)

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
