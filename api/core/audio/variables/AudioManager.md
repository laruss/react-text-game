# Variable: AudioManager

> `const` **AudioManager**: `AudioManagerClass`

Defined in: [audioTrack.ts:775](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/audio/audioTrack.ts#L775)

Singleton instance of the AudioManager.

Use this to control all audio tracks globally.

## Example

```typescript
import { AudioManager } from '@react-text-game/core/audio';

AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
```
