# Type Alias: HotspotLabelOptions

> **HotspotLabelOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`MapLabelHotspot`](../interfaces/MapLabelHotspot.md), `"type"` \| `"content"`\>\> \| [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`SideLabelHotspot`](../interfaces/SideLabelHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:50](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/passages/interactiveMap/helpers.ts#L50)

Options accepted by [MapHelpers.label](MapHelpers.md).

`position` decides whether the button is placed on the map (`{ x, y }`
percentages) or docked to one of its sides.
