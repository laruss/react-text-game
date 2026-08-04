# Type Alias: MapContentItems

> **MapContentItems** = [`Conditional`](Conditional.md)\<[`AnyHotspot`](AnyHotspot.md)\>[]

Defined in: [packages/core/src/passages/interactiveMap/types.ts:961](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/interactiveMap/types.ts#L961)

Array returned by a [MapContentFn](MapContentFn.md).

Accepts `false`, `null` and `undefined` entries, which are removed before
the map is rendered. That makes conditional hotspots expressible inline
instead of through a callback that returns `undefined`.

## Example

```typescript
const hotspots: MapContentItems = [
  { type: 'label', content: 'Home', position: { x: 50, y: 50 }, action: goHome },
  player.hasKey && {
    type: 'label',
    content: 'Secret Room',
    position: { x: 80, y: 30 },
    action: goSecret
  }
];
```
