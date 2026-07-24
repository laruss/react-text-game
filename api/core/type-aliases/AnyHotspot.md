# Type Alias: AnyHotspot

> **AnyHotspot** = [`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`MapImageHotspot`](../interfaces/MapImageHotspot.md) \| [`MapImage`](../interfaces/MapImage.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md) \| [`SideImageHotspot`](../interfaces/SideImageHotspot.md) \| [`MapMenu`](../interfaces/MapMenu.md)

Defined in: [packages/core/src/passages/interactiveMap/types.ts:676](https://github.com/laruss/react-text-game/blob/a568b67a5a70142c4d99c081d8fed675aca313c3/packages/core/src/passages/interactiveMap/types.ts#L676)

Union type of all possible hotspot types.
Used for type-safe hotspot arrays in interactive maps.

## Remarks

This discriminated union allows TypeScript to narrow hotspot types
based on the `type` property when rendering or processing hotspots.
