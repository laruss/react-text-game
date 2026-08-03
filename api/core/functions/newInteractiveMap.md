# Function: newInteractiveMap()

> **newInteractiveMap**(`id`, `options`): [`InteractiveMap`](../classes/InteractiveMap.md)

Defined in: [packages/core/src/passages/interactiveMap/fabric.ts:39](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/core/src/passages/interactiveMap/fabric.ts#L39)

Creates an interactive map passage from a plain options object.

## Parameters

### id

`string`

Unique identifier for the map

### options

[`InteractiveMapOptions`](../type-aliases/InteractiveMapOptions.md)

Map image, hotspots and styling configuration

## Returns

[`InteractiveMap`](../classes/InteractiveMap.md)

New InteractiveMap instance, already registered with the Game

## Remarks

Fully supported and not scheduled for removal. New code is encouraged to use
[defineInteractiveMap](defineInteractiveMap.md) instead, which hands the hotspot callback a
toolbox of builders so hotspot objects never have to be written by hand.

## Example

```typescript
newInteractiveMap('world', {
  image: '/maps/world.jpg',
  hotspots: [
    {
      type: 'label',
      content: 'Village',
      position: { x: 30, y: 40 },
      action: () => Game.jumpTo('village')
    }
  ]
});
```
