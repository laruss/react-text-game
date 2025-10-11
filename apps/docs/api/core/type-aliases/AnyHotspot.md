# Type Alias: AnyHotspot

> **AnyHotspot** = [`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`MapImageHotspot`](../interfaces/MapImageHotspot.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md) \| [`SideImageHotspot`](../interfaces/SideImageHotspot.md) \| [`MapMenu`](../interfaces/MapMenu.md)

Defined in: [passages/interactiveMap/types.ts:611](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/interactiveMap/types.ts#L611)

Union type of all possible hotspot types.
Used for type-safe hotspot arrays in interactive maps.

## Remarks

This discriminated union allows TypeScript to narrow hotspot types
based on the `type` property when rendering or processing hotspots.
