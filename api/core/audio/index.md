# Audio

Audio module for the react-text-game engine.

Provides comprehensive audio support with reactive state management,
automatic persistence, and global controls.

## Example

```typescript
import { createAudio, AudioManager } from '@react-text-game/core/audio';

// Create and control audio tracks
const music = createAudio('music.mp3', {
  id: 'bg-music',
  loop: true,
  volume: 0.7,
});

await music.play();
music.pause();
music.setVolume(0.5);

// Global controls
AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
```

## Classes

- [AudioTrack](classes/AudioTrack.md)

## Interfaces

- [AudioOptions](interfaces/AudioOptions.md)
- [AudioSaveState](interfaces/AudioSaveState.md)
- [AudioState](interfaces/AudioState.md)

## Variables

- [AUDIO\_STORAGE\_PATH](variables/AUDIO_STORAGE_PATH.md)
- [AudioManager](variables/AudioManager.md)
- [DEFAULT\_AUDIO\_OPTIONS](variables/DEFAULT_AUDIO_OPTIONS.md)

## Functions

- [createAudio](functions/createAudio.md)
