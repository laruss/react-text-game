# Type Alias: HotspotImageOptions

> **HotspotImageOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`MapImageHotspot`](../interfaces/MapImageHotspot.md), `"type"` \| `"content"`\>\> \| [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`SideImageHotspot`](../interfaces/SideImageHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:60](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/interactiveMap/helpers.ts#L60)

Options accepted by [MapHelpers.image](MapHelpers.md).

`position` decides whether the hotspot is placed on the map (`{ x, y }`
percentages) or docked to one of its sides.
