# Function: newWidget()

> **newWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: [passages/widget.ts:71](https://github.com/laruss/react-text-game/blob/6b9098a8e439fedc8e81574fd40f3e2840d770e8/packages/core/src/passages/widget.ts#L71)

Factory function for creating Widget passages.

## Parameters

### id

`string`

Unique identifier for the widget

### content

`ReactNode`

React node to display

## Returns

[`Widget`](../classes/Widget.md)

New Widget instance

## Example

```typescript
const customMenu = newWidget('menu', (
  <CustomMenuComponent />
));
```
