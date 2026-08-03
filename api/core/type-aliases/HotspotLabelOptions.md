# Type Alias: HotspotLabelOptions

> **HotspotLabelOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`MapLabelHotspot`](../interfaces/MapLabelHotspot.md), `"type"` \| `"content"`\>\> \| [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`SideLabelHotspot`](../interfaces/SideLabelHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:50](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/interactiveMap/helpers.ts#L50)

Options accepted by [MapHelpers.label](MapHelpers.md).

`position` decides whether the button is placed on the map (`{ x, y }`
percentages) or docked to one of its sides.
