# Type Alias: HotspotPosition

> **HotspotPosition** = [`MaybeCallable`](MaybeCallable.md)\<\{ `x`: `number`; `y`: `number`; \}\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:34](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/interactiveMap/types.ts#L34)

Position coordinates for hotspots on the map.
Values are percentages (0-100) relative to the map's dimensions.
Can be a static object or a function that returns an object for dynamic positioning.

## Example

```typescript
// Static positioning
position: { x: 50, y: 50 }  // Center of map
position: { x: 25, y: 75 }  // Lower left quadrant

// Dynamic positioning
position: () => ({
  x: player.isAtNight ? 30 : 70,
  y: player.level * 10
})
```

## Remarks

- x: 0 = left edge, 50 = horizontal center, 100 = right edge
- y: 0 = top edge, 50 = vertical center, 100 = bottom edge
