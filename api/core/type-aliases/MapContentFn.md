# Type Alias: MapContentFn\<TProps\>

> **MapContentFn**\<`TProps`\> = [`DefineFn`](DefineFn.md)\<[`MapHelpers`](MapHelpers.md), [`MapContentItems`](MapContentItems.md), `TProps`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:977](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/interactiveMap/types.ts#L977)

Content callback accepted by `defineInteractiveMap`.

Receives the [MapHelpers](MapHelpers.md) toolbox first and the display props second.

## Type Parameters

### TProps

`TProps` *extends* [`InitVarsType`](InitVarsType.md) = [`EmptyObject`](EmptyObject.md)

Type of props passed to `map.display()`

## Example

```typescript
const content: MapContentFn = (h) => [
  h.label('Village', { position: { x: 30, y: 40 }, action: h.jump('village') })
];
```
