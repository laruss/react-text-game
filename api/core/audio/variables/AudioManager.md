# Variable: AudioManager

> `const` **AudioManager**: `AudioManagerClass`

Defined in: [audioTrack.ts:775](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/audio/audioTrack.ts#L775)

Singleton instance of the AudioManager.

Use this to control all audio tracks globally.

## Example

```typescript
import { AudioManager } from '@react-text-game/core/audio';

AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
```
