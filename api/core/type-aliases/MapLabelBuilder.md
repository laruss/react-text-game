# Type Alias: MapLabelBuilder()

> **MapLabelBuilder** = \{(`content`, `options`): [`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md); (`content`, `options`): [`LabelHotspot`](../interfaces/LabelHotspot.md); \}

Defined in: [packages/core/src/passages/interactiveMap/helpers.ts:86](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/passages/interactiveMap/helpers.ts#L86)

Builder for label hotspots.

Supplying a `position` produces a standalone hotspot; omitting it produces a
[LabelHotspot](../interfaces/LabelHotspot.md) suitable for a [MapHelpers.menu](MapHelpers.md) item.

## Call Signature

> (`content`, `options`): [`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md)

Creates a standalone label hotspot placed on the map or docked to a side.

### Parameters

#### content

[`MaybeCallable`](MaybeCallable.md)\<`string`\>

#### options

[`HotspotLabelOptions`](HotspotLabelOptions.md)

### Returns

[`MapLabelHotspot`](../interfaces/MapLabelHotspot.md) \| [`SideLabelHotspot`](../interfaces/SideLabelHotspot.md)

### Example

```typescript
h.label('Village', {
  position: { x: 30, y: 40 },
  action: h.jump('village')
})

h.label('Menu', { position: 'top', action: openMenu, color: 'secondary' })
```

## Call Signature

> (`content`, `options`): [`LabelHotspot`](../interfaces/LabelHotspot.md)

Creates a label for a menu, which supplies the position itself.

### Parameters

#### content

[`MaybeCallable`](MaybeCallable.md)\<`string`\>

#### options

[`MenuLabelOptions`](MenuLabelOptions.md)

### Returns

[`LabelHotspot`](../interfaces/LabelHotspot.md)

### Example

```typescript
h.menu([h.label('Examine', { action: examine })], {
  position: { x: 50, y: 50 }
})
```
