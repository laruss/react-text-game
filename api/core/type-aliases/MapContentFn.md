# Type Alias: MapContentFn\<TProps\>

> **MapContentFn**\<`TProps`\> = [`DefineFn`](DefineFn.md)\<[`MapHelpers`](MapHelpers.md), [`MapContentItems`](MapContentItems.md), `TProps`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:977](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/core/src/passages/interactiveMap/types.ts#L977)

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
