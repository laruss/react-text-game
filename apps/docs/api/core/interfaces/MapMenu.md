# Interface: MapMenu

Defined in: [passages/interactiveMap/types.ts:514](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L514)

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

Defined in: [passages/interactiveMap/types.ts:585](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L585)

Layout direction for menu items.

#### Default Value

`"vertical"`

#### Remarks

- `"vertical"` - Items stacked top to bottom (default)
- `"horizontal"` - Items arranged left to right

***

### items

> **items**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`undefined` \| [`LabelHotspot`](LabelHotspot.md)\>[]

Defined in: [passages/interactiveMap/types.ts:544](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L544)

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

> **position**: `object`

Defined in: [passages/interactiveMap/types.ts:550](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L550)

Position of the menu on the map.
Values are percentages (0-100) relative to the map dimensions.

#### x

> **x**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`number`\>

Horizontal position as a percentage (0-100) from the left edge.
Can be static number or a function for dynamic positioning.

##### Example

```typescript
x: 50  // Center horizontally
x: () => player.cursorX  // Follow cursor
```

#### y

> **y**: [`MaybeCallable`](../type-aliases/MaybeCallable.md)\<`number`\>

Vertical position as a percentage (0-100) from the top edge.
Can be static number or a function for dynamic positioning.

##### Example

```typescript
y: 50  // Center vertically
y: () => player.cursorY  // Follow cursor
```

***

### props?

> `optional` **props**: `object`

Defined in: [passages/interactiveMap/types.ts:590](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L590)

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

Defined in: [passages/interactiveMap/types.ts:518](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/interactiveMap/types.ts#L518)

Discriminator property identifying this as a menu hotspot.
