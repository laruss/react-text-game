# Type Alias: AnyHotspot

> **AnyHotspot** = [`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`MapImageHotspot`](../interfaces/MapImageHotspot.md) \| [`MapImage`](../interfaces/MapImage.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md) \| [`SideImageHotspot`](../interfaces/SideImageHotspot.md) \| [`MapMenu`](../interfaces/MapMenu.md)

Defined in: [packages/core/src/passages/interactiveMap/types.ts:685](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/passages/interactiveMap/types.ts#L685)

Union type of all possible hotspot types.
Used for type-safe hotspot arrays in interactive maps.

## Remarks

This discriminated union allows TypeScript to narrow hotspot types
based on the `type` property when rendering or processing hotspots.
