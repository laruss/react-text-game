# Variable: mapHelpers

> `const` **mapHelpers**: [`MapHelpers`](../type-aliases/MapHelpers.md)

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:228](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/interactiveMap/helpers.ts#L228)

Interactive map hotspot builders.

Normally received as the first argument of a [defineInteractiveMap](../functions/defineInteractiveMap.md)
content callback. Import it directly when a map is split across several files
and the helpers are needed outside of the callback body.

## Example

```typescript
import { defineInteractiveMap, mapHelpers } from '@react-text-game/core';

const townHotspots = () => [
  mapHelpers.label('Inn', {
    position: { x: 20, y: 30 },
    action: mapHelpers.jump('inn')
  })
];

defineInteractiveMap('world', () => townHotspots(), { image: '/world.jpg' });
```
