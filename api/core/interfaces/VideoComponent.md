# Interface: VideoComponent

Defined in: [packages/core/src/passages/story/types.ts:303](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L303)

Component for displaying video content with standard HTML5 video controls.
Supports local files and remote URLs with customizable playback behavior.

## Example

```typescript
// Basic video with controls
{
  type: 'video',
  content: '/videos/cutscene.mp4',
  props: { controls: true }
}

// Looping background video
{
  type: 'video',
  content: '/videos/ambient.mp4',
  props: {
    autoPlay: true,
    loop: true,
    muted: true,
    controls: false
  }
}
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: `string`

Defined in: [packages/core/src/passages/story/types.ts:320](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L320)

URL or path to the video file.
Supports common formats (MP4, WebM, OGG) depending on browser support.

#### Example

```typescript
content: 'https://example.com/video.mp4'  // Remote URL
content: '/videos/intro.mp4'              // Local path
content: 'cutscene.mp4'                   // Public folder asset
```

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:27](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L27)

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

> `optional` **initialVariant**: `"display"` \| `"hidden"` \| `"disclosure"`

Defined in: [packages/core/src/passages/story/types.ts:42](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L42)

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

Defined in: [packages/core/src/passages/story/types.ts:325](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L325)

Optional configuration for video playback and styling.

#### autoPlay?

> `optional` **autoPlay**: `boolean`

Whether the video should start playing automatically when rendered.

##### Default Value

```ts
true
```

##### Remarks

Many browsers restrict autoplay without user interaction, especially with audio.
Consider setting `muted: true` for reliable autoplay behavior.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the video element.

##### Example

```typescript
props: { className: 'rounded-lg shadow-xl' }
```

#### controls?

> `optional` **controls**: `boolean`

Whether to display native browser video controls (play, pause, volume, etc.).

##### Default Value

```ts
false
```

##### Remarks

Set to `true` to allow user control over playback.
Set to `false` for non-interactive videos or custom controls.

#### loop?

> `optional` **loop**: `boolean`

Whether the video should restart from the beginning when it reaches the end.

##### Default Value

```ts
true
```

##### Remarks

Useful for ambient/background videos that should play continuously.

#### muted?

> `optional` **muted**: `boolean`

Whether the video audio should be muted.

##### Default Value

```ts
true
```

##### Remarks

Setting to `true` helps bypass browser autoplay restrictions.
Users can still unmute via controls if `controls: true`.

***

### type

> **type**: `"video"`

Defined in: [packages/core/src/passages/story/types.ts:307](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/core/src/passages/story/types.ts#L307)

Discriminator property identifying this as a video component.
