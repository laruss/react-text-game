# Type Alias: InteractiveMapType

> **InteractiveMapType** = `Pick`\<[`InteractiveMapOptions`](InteractiveMapOptions.md), `"caption"` \| `"props"` \| `"classNames"`\> & `object`

Defined in: [passages/interactiveMap/types.ts:850](https://github.com/laruss/react-text-game/blob/3f24f1ae69cb46d4c796e3e7af2e5d08bb0359c7/packages/core/src/passages/interactiveMap/types.ts#L850)

Resolved/processed interactive map data returned by `InteractiveMap.display()`.
All dynamic values (functions) have been resolved to their concrete values.

## Type Declaration

### bgImage?

> `optional` **bgImage**: `string`

Resolved background image URL/path.
If the original was a function, it has been called and resolved to a string.
Undefined if no background image was specified.

### hotspots

> **hotspots**: [`AnyHotspot`](AnyHotspot.md)[]

Array of resolved, concrete hotspots.
All dynamic hotspots (functions) have been evaluated.
Hotspots that returned `undefined` have been filtered out.

### image

> **image**: `string`

Resolved map image URL/path.
If the original was a function, it has been called and resolved to a string.

## Remarks

This type represents the map after processing:
- All function-based images resolved to strings
- All conditional hotspots evaluated and filtered (undefined removed)
- All dynamic hotspot properties resolved

This is the data structure consumed by the UI rendering layer.

## Example

```typescript
const map = newInteractiveMap('world', {
  image: () => `/maps/${season}.jpg`,
  hotspots: [
    () => hasKey ? { type: 'label', content: 'Door', ... } : undefined
  ]
});

// After calling display(), all functions are resolved:
const displayData: InteractiveMapType = map.display();
// displayData.image is now a string like '/maps/winter.jpg'
// displayData.hotspots contains only concrete hotspots (undefined filtered out)
```
