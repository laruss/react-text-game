# Interface: MapMenu

Defined in: [packages/core/src/passages/interactiveMap/types.ts:553](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L553)

Contextual menu hotspot that displays multiple label buttons at a specific position.
Useful for creating radial menus, action lists, or grouped choices on the map.

## Example

```typescript
// Context menu at a location
{
  type: 'menu',
  position: { x: 50, y: 50 },
  direction: 'vertical',
  items: [
    { type: 'label', content: 'Examine', action: () => examine() },
    { type: 'label', content: 'Take', action: () => take() },
    { type: 'label', content: 'Leave', action: () => leave() }
  ]
}

// Dynamic menu with conditional items
{
  type: 'menu',
  position: { x: () => cursor.x, y: () => cursor.y },
  items: [
    { type: 'label', content: 'Attack', action: () => attack() },
    () => player.hasMagic ? {
      type: 'label',
      content: 'Cast Spell',
      action: () => castSpell()
    } : undefined,
    { type: 'label', content: 'Defend', action: () => defend() }
  ]
}
```

## Properties

### direction?

> `optional` **direction**: `"horizontal"` \| `"vertical"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:603](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L603)

Layout direction for menu items.

#### Default Value

`"vertical"`

#### Remarks

- `"vertical"` - Items stacked top to bottom (default)
- `"horizontal"` - Items arranged left to right

***

### items

> **items**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<[`LabelHotspot`](LabelHotspot.md) \| `undefined`\>[]

Defined in: [packages/core/src/passages/interactiveMap/types.ts:583](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L583)

Array of menu items to display.
Each item is a LabelHotspot or a function returning one.
Functions that return `undefined` are filtered out (useful for conditional menu items).

#### Example

```typescript
// Static menu items
items: [
  { type: 'label', content: 'Option 1', action: () => {} },
  { type: 'label', content: 'Option 2', action: () => {} }
]

// Conditional menu items
items: [
  { type: 'label', content: 'Always visible', action: () => {} },
  () => player.hasItem ? {
    type: 'label',
    content: 'Use Item',
    action: () => useItem()
  } : undefined
]
```

***

### position

> **position**: `HotspotPosition`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:592](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L592)

Position of the menu on the map.
Values are percentages (0-100) relative to the map dimensions.
Can be static or dynamic (function-based) for reactive positioning.

#### See

HotspotPosition for examples and coordinate system details

***

### props?

> `optional` **props**: `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:608](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L608)

Optional styling configuration.

#### className?

> `optional` **className**: `string`

CSS class name for the menu container.

##### Example

```typescript
className: 'bg-card/90 backdrop-blur-sm rounded-lg shadow-xl p-2'
```

***

### type

> **type**: `"menu"`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:557](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/interactiveMap/types.ts#L557)

Discriminator property identifying this as a menu hotspot.
