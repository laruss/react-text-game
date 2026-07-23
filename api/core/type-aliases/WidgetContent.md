# Type Alias: WidgetContent

> **WidgetContent** = `ReactNode` \| `React.FC`

Defined in: [packages/core/src/passages/widget.ts:29](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/passages/widget.ts#L29)

Content type for Widget passages.
Can be a ReactNode directly, or a React functional component.

**Important:** When passing a function, it is always treated as a React
component and rendered via `createElement`. This ensures hooks work correctly
even in minified production builds where function names are mangled.

## Example

```typescript
// As ReactNode (static content)
const content: WidgetContent = <div>Hello</div>;

// As React component (supports hooks)
const MyComponent = () => {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
};
const content: WidgetContent = MyComponent;

// For dynamic content without hooks, pre-evaluate the function:
const content: WidgetContent = (() => <div>{Date.now()}</div>)();
```
