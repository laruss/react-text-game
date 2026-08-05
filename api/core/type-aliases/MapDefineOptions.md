# Type Alias: MapDefineOptions

> **MapDefineOptions** = `Omit`\<[`InteractiveMapOptions`](InteractiveMapOptions.md), `"hotspots"`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:939](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/interactiveMap/types.ts#L939)

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
