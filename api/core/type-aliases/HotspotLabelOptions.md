# Type Alias: HotspotLabelOptions

> **HotspotLabelOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`MapLabelHotspot`](../interfaces/MapLabelHotspot.md), `"type"` \| `"content"`\>\> \| [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`SideLabelHotspot`](../interfaces/SideLabelHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:50](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/passages/interactiveMap/helpers.ts#L50)

Options accepted by [MapHelpers.label](MapHelpers.md).

`position` decides whether the button is placed on the map (`{ x, y }`
percentages) or docked to one of its sides.
