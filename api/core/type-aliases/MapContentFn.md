# Type Alias: MapContentFn\<TProps\>

> **MapContentFn**\<`TProps`\> = [`DefineFn`](DefineFn.md)\<[`MapHelpers`](MapHelpers.md), [`MapContentItems`](MapContentItems.md), `TProps`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:977](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/interactiveMap/types.ts#L977)

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
