# Type Alias: ImageHotspotContentObject

> **ImageHotspotContentObject** = `object`

Defined in: [packages/core/src/passages/interactiveMap/types.ts:211](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/types.ts#L211)

## Properties

### active?

> `optional` **active**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:250](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/types.ts#L250)

Optional image displayed briefly when the hotspot is clicked.
Creates visual feedback for the click action.
If not provided, the hover or idle image is shown on click.

#### Example

```typescript
active: '/icons/button-pressed.png'
active: '/icons/button-flash.png'
```

#### Remarks

The active state is shown for ~100ms when clicked, then returns to idle/hover.

***

### disabled?

> `optional` **disabled**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:262](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/types.ts#L262)

Optional image displayed when the hotspot is disabled.
If not provided, the idle image is shown with reduced opacity when disabled.

#### Example

```typescript
disabled: '/icons/button-grayed.png'
disabled: '/icons/button-locked.png'
```

***

### hover?

> `optional` **hover**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:234](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/types.ts#L234)

Optional image displayed when the hotspot is hovered.
If not provided, the idle image is shown on hover.

#### Example

```typescript
hover: '/icons/button-hover.png'
hover: () => `/icons/button-${hoverColor}.png`
```

***

### idle

> **idle**: [`MaybeCallable`](MaybeCallable.md)\<`string`\>

Defined in: [packages/core/src/passages/interactiveMap/types.ts:222](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/passages/interactiveMap/types.ts#L222)

Image displayed in the default/resting state.
Always shown when no other state is active.

#### Example

```typescript
idle: '/icons/button-default.png'
idle: () => `/icons/${currentTheme}/button.png`
```
