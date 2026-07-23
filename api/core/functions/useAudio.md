# Function: useAudio()

> **useAudio**(`audio`): `object`

Defined in: [packages/core/src/hooks/useAudio.ts:42](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/hooks/useAudio.ts#L42)

React hook to access reactive audio state.

This hook makes audio state observable in React components, automatically
triggering re-renders when the audio state changes (playback position,
volume, playing status, etc.).

## Parameters

### audio

`AudioTrack`

The audio track to observe

## Returns

Reactive audio state snapshot

### currentTime

> `readonly` **currentTime**: `number`

Current playback position in seconds

### duration

> `readonly` **duration**: `number`

Total duration in seconds

### isPaused

> `readonly` **isPaused**: `boolean`

Whether audio is paused

### isPlaying

> `readonly` **isPlaying**: `boolean`

Whether audio is currently playing

### isStopped

> `readonly` **isStopped**: `boolean`

Whether audio is stopped

### loop

> `readonly` **loop**: `boolean`

Whether audio is looping

### muted

> `readonly` **muted**: `boolean`

Whether audio is muted

### playbackRate

> `readonly` **playbackRate**: `number`

Current playback rate multiplier

### volume

> `readonly` **volume**: `number`

Current volume (0.0 to 1.0)

## Example

```typescript
import { createAudio } from '@react-text-game/core/audio';
import { useAudio } from '@react-text-game/core';

const bgMusic = createAudio('music.mp3', {
  id: 'bg-music',
  loop: true,
});

function MusicPlayer() {
  const audioState = useAudio(bgMusic);

  return (
    <div>
      <p>Playing: {audioState.isPlaying ? 'Yes' : 'No'}</p>
      <p>Time: {audioState.currentTime.toFixed(1)}s / {audioState.duration.toFixed(1)}s</p>
      <p>Volume: {(audioState.volume * 100).toFixed(0)}%</p>

      <button onClick={() => bgMusic.play()}>Play</button>
      <button onClick={() => bgMusic.pause()}>Pause</button>
      <button onClick={() => bgMusic.stop()}>Stop</button>
    </div>
  );
}
```
