# Function: createAudio()

> **createAudio**(`src`, `options?`): [`AudioTrack`](../classes/AudioTrack.md)

Defined in: [fabric.ts:35](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/audio/fabric.ts#L35)

Factory function to create a new audio track.

Follows the project's factory-first pattern similar to createEntity() and newStory().
Creates an AudioTrack instance with reactive state management and automatic
registration with the AudioManager.

## Parameters

### src

`string`

Path to the audio file (relative or absolute URL)

### options?

[`AudioOptions`](../interfaces/AudioOptions.md)

Optional audio configuration

## Returns

[`AudioTrack`](../classes/AudioTrack.md)

A reactive AudioTrack instance

## Example

```typescript
// Create background music with auto-save
const bgMusic = createAudio('assets/music/theme.mp3', {
  id: 'bg-music',
  loop: true,
  volume: 0.5,
});

await bgMusic.play();
bgMusic.setVolume(0.7);

// Create sound effect (no ID = no auto-save)
const clickSound = createAudio('assets/sfx/click.mp3', {
  volume: 0.8,
});

clickSound.play();
```
