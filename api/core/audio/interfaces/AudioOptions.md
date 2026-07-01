# Interface: AudioOptions

Defined in: [types.ts:14](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L14)

Configuration options for creating an audio track.

## Example

```typescript
const audio = createAudio('music.mp3', {
  id: 'bg-music',
  volume: 0.7,
  loop: true,
  autoPlay: false,
});
```

## Properties

### autoPlay?

> `optional` **autoPlay**: `boolean`

Defined in: [types.ts:51](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L51)

Auto-play on creation.
Note: May be blocked by browser autoplay policies.

#### Default

```ts
false
```

***

### id?

> `optional` **id**: `string`

Defined in: [types.ts:20](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L20)

Unique identifier for the audio track.
Required for save/load functionality.
If not provided, a random ID will be generated.

***

### loop?

> `optional` **loop**: `boolean`

Defined in: [types.ts:32](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L32)

Whether to loop the audio automatically.

#### Default

```ts
false
```

***

### muted?

> `optional` **muted**: `boolean`

Defined in: [types.ts:44](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L44)

Whether to start muted.

#### Default

```ts
false
```

***

### playbackRate?

> `optional` **playbackRate**: `number`

Defined in: [types.ts:38](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L38)

Playback rate multiplier (0.5 = half speed, 2.0 = double speed).

#### Default

```ts
1.0
```

***

### preload?

> `optional` **preload**: `"metadata"` \| `"none"` \| `"auto"`

Defined in: [types.ts:60](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L60)

Preload strategy for the audio file.
- 'none': Don't preload
- 'metadata': Preload only metadata
- 'auto': Let browser decide

#### Default

```ts
'metadata'
```

***

### volume?

> `optional` **volume**: `number`

Defined in: [types.ts:26](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/types.ts#L26)

Initial volume level (0.0 to 1.0).

#### Default

```ts
1.0
```
