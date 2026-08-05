# Variable: AudioManager

> `const` **AudioManager**: `AudioManagerClass`

Defined in: [audioTrack.ts:775](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/core/src/audio/audioTrack.ts#L775)

Singleton instance of the AudioManager.

Use this to control all audio tracks globally.

## Example

```typescript
import { AudioManager } from '@react-text-game/core/audio';

AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
```
