# Type Alias: HotspotImageOptions

> **HotspotImageOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`MapImageHotspot`](../interfaces/MapImageHotspot.md), `"type"` \| `"content"`\>\> \| [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`SideImageHotspot`](../interfaces/SideImageHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:60](https://github.com/laruss/react-text-game/blob/5e52bf22ebaede422c00449cdff1947a516a3506/packages/core/src/passages/interactiveMap/helpers.ts#L60)

Options accepted by [MapHelpers.image](MapHelpers.md).

`position` decides whether the hotspot is placed on the map (`{ x, y }`
percentages) or docked to one of its sides.
