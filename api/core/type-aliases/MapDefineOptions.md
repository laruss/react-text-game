# Type Alias: MapDefineOptions

> **MapDefineOptions** = `Omit`\<[`InteractiveMapOptions`](InteractiveMapOptions.md), `"hotspots"`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:939](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/passages/interactiveMap/types.ts#L939)

Map configuration accepted by `defineInteractiveMap`.

Identical to [InteractiveMapOptions](InteractiveMapOptions.md) minus `hotspots`, which the
content callback supplies instead.

## Example

```typescript
const options: MapDefineOptions = {
  image: '/maps/world.jpg',
  caption: 'Kingdom of Eldoria',
  classNames: { container: 'bg-slate-900' }
};
```
