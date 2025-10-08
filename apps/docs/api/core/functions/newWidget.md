# Function: newWidget()

> **newWidget**(`id`, `content`): [`Widget`](../classes/Widget.md)

Defined in: passages/widget.ts:71

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
