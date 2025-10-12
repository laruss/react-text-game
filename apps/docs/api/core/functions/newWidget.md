# Function: newWidget()

> **newWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: [passages/widget.ts:71](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/widget.ts#L71)

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
