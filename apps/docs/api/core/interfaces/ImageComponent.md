# Interface: ImageComponent

Defined in: [passages/story/types.ts:174](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L174)

Component for displaying images with built-in modal viewer support.
By default, images can be clicked to open in a full-screen modal for better viewing.

## Example

```typescript
// Basic image
{ type: 'image', content: '/images/scene.jpg' }

// Image with alt text
{ type: 'image', content: '/avatar.png', props: { alt: 'Player avatar' } }

// Image without modal
{ type: 'image', content: '/icon.png', props: { disableModal: true } }

// Image with custom click handler
{
  type: 'image',
  content: '/button.png',
  props: {
    disableModal: true,
    onClick: () => Game.jumpTo('next-scene')
  }
}
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: `string`

Defined in: [passages/story/types.ts:191](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L191)

URL or path to the image file.
Can be absolute URL, relative path, or path to public assets.

#### Example

```typescript
content: 'https://example.com/image.jpg'  // Absolute URL
content: '/images/scene.png'              // Relative path
content: 'scene.png'                      // Public folder asset
```

***

### id?

> `optional` **id**: `string`

Defined in: [passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L24)

Optional unique identifier for this component.
Can be used to reference or manipulate specific components programmatically.

#### Example

```typescript
{ type: 'text', id: 'intro-text', content: 'Welcome!' }
```

#### Inherited from

`BaseComponent.id`

***

### initialVariant?

> `optional` **initialVariant**: `"hidden"` \| `"display"` \| `"disclosure"`

Defined in: [passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L39)

Controls the initial visibility state of the component.

#### Remarks

This property is designed for future UI implementation to support dynamic component visibility.
Currently defined but not yet implemented in the UI layer.

- `"display"` - Component is visible and rendered immediately (default behavior)
- `"hidden"` - Component exists but is not visible initially
- `"disclosure"` - Component is initially collapsed/hidden but can be expanded by user interaction

#### Default Value

`"display"`

#### Inherited from

`BaseComponent.initialVariant`

***

### props?

> `optional` **props**: `object`

Defined in: [passages/story/types.ts:196](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L196)

Optional configuration for image behavior and styling.

#### alt?

> `optional` **alt**: `string`

Alternative text description for accessibility and SEO.
Displayed when the image fails to load or for screen readers.

##### Default Value

`"image"`

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the image element.

##### Example

```typescript
props: { className: 'rounded-lg shadow-xl' }
```

#### disableModal?

> `optional` **disableModal**: `boolean`

When `true`, disables the modal viewer functionality.
The image becomes a static element without click-to-enlarge behavior.

##### Default Value

```ts
false
```

##### Remarks

Set to `true` when using custom `onClick` handlers or for decorative images
that shouldn't open in full-screen mode.

#### onClick()?

> `optional` **onClick**: () => `void`

Optional click event handler.
Called when the image is clicked (in addition to or instead of modal behavior).

##### Returns

`void`

##### Remarks

When both `onClick` and modal are enabled, `onClick` fires before the modal opens.
To use only `onClick`, set `disableModal: true`.

##### Example

```typescript
props: {
  onClick: () => {
    console.log('Image clicked');
    Game.jumpTo('next-passage');
  },
  disableModal: true
}
```

***

### type

> **type**: `"image"`

Defined in: [passages/story/types.ts:178](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/core/src/passages/story/types.ts#L178)

Discriminator property identifying this as an image component.
