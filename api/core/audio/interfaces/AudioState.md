# Interface: AudioState

Defined in: [types.ts:76](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L76)

Reactive state of an audio track.

This interface represents the observable state that can be used
with React hooks for reactive updates.

## Example

```typescript
const state = audio.getState();
console.log(state.isPlaying); // true/false
console.log(state.currentTime); // 45.2
```

## Properties

### currentTime

> **currentTime**: `number`

Defined in: [types.ts:87](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L87)

Current playback position in seconds

***

### duration

> **duration**: `number`

Defined in: [types.ts:90](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L90)

Total duration in seconds

***

### isPaused

> **isPaused**: `boolean`

Defined in: [types.ts:81](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L81)

Whether audio is paused

***

### isPlaying

> **isPlaying**: `boolean`

Defined in: [types.ts:78](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L78)

Whether audio is currently playing

***

### isStopped

> **isStopped**: `boolean`

Defined in: [types.ts:84](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L84)

Whether audio is stopped

***

### loop

> **loop**: `boolean`

Defined in: [types.ts:96](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L96)

Whether audio is looping

***

### muted

> **muted**: `boolean`

Defined in: [types.ts:102](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L102)

Whether audio is muted

***

### playbackRate

> **playbackRate**: `number`

Defined in: [types.ts:99](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L99)

Current playback rate multiplier

***

### volume

> **volume**: `number`

Defined in: [types.ts:93](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/types.ts#L93)

Current volume (0.0 to 1.0)
