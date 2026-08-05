# Type Alias: MenuLabelOptions

> **MenuLabelOptions** = [`HelperOptions`](HelperOptions.md)\<`Omit`\<[`LabelHotspot`](../interfaces/LabelHotspot.md), `"type"` \| `"content"`\>\>

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:70](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/core/src/passages/interactiveMap/helpers.ts#L70)

Options accepted by [MapHelpers.label](MapHelpers.md) when the label is a
[MapMenu](../interfaces/MapMenu.md) item.

Menu items are positioned by their menu, so `position` is not accepted here.
