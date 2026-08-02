# Type Alias: MapContentFn\<TProps\>

> **MapContentFn**\<`TProps`\> = [`DefineFn`](DefineFn.md)\<[`MapHelpers`](MapHelpers.md), [`MapContentItems`](MapContentItems.md), `TProps`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:977](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/passages/interactiveMap/types.ts#L977)

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
