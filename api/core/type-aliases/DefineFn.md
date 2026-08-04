# Type Alias: DefineFn()\<THelpers, TContent, TProps\>

> **DefineFn**\<`THelpers`, `TContent`, `TProps`\> = (`helpers`, `props`) => `TContent`

Defined in: [packages/core/src/passages/definition.ts:24](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/definition.ts#L24)

Signature shared by every `define*` passage factory.

The content callback always receives the passage-specific helper toolbox as
its first argument and the display props as its second, so learning one
factory teaches all of them.

## Type Parameters

### THelpers

`THelpers`

Helper toolbox for the passage type

### TContent

`TContent`

Value the callback must return

### TProps

`TProps` *extends* [`InitVarsType`](InitVarsType.md) = [`EmptyObject`](EmptyObject.md)

Props passed to `display()`

## Parameters

### helpers

`THelpers`

### props

`TProps`

## Returns

`TContent`

## Example

```typescript
const content: DefineFn<StoryHelpers, StoryContentItems> = (h) => [
  h.header('Chapter 1'),
  h.text('Your journey begins...')
];
```
