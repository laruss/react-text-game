# Function: defineInteractiveMap()

> **defineInteractiveMap**\<`TProps`\>(`id`, `content`, `options`): [`InteractiveMap`](../classes/InteractiveMap.md)

Defined in: [packages/core/src/passages/interactiveMap/fabric.ts:79](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/passages/interactiveMap/fabric.ts#L79)

Creates an interactive map passage from a helpers-first hotspot callback.

The callback receives the [MapHelpers](../type-aliases/MapHelpers.md) toolbox as its first argument
and the display props as its second. Helpers return plain hotspot objects,
so helper calls and hand-written hotspot literals can be mixed in the same
array, and falsy entries are dropped so conditional hotspots can be written
inline.

## Type Parameters

### TProps

`TProps` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`EmptyObject`](../type-aliases/EmptyObject.md)

Type of props passed to `map.display()`

## Parameters

### id

`string`

Unique identifier for the map

### content

[`MapContentFn`](../type-aliases/MapContentFn.md)\<`TProps`\>

Function returning the map's hotspots

### options

[`MapDefineOptions`](../type-aliases/MapDefineOptions.md)

Map image and styling configuration, without `hotspots`

## Returns

[`InteractiveMap`](../classes/InteractiveMap.md)

New InteractiveMap instance, already registered with the Game

## Example

```typescript
import { defineInteractiveMap } from '@react-text-game/core';

defineInteractiveMap('world', (h) => [
  h.label('Village', { position: { x: 30, y: 40 }, action: h.jump('village') }),
  h.mapImage('/characters/guard.png', { position: { x: 42, y: 68 } }),
  h.label('Menu', { position: 'top', action: h.jump('menu') }),
  player.hasKey && h.label('Secret Door', {
    position: { x: 80, y: 30 },
    action: h.jump('secret')
  })
], {
  image: '/maps/world.jpg',
  caption: 'Kingdom of Eldoria'
});
```

## See

newInteractiveMap - Previous options-object factory, still supported
