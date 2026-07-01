# Variable: AudioManager

> `const` **AudioManager**: `AudioManagerClass`

Defined in: [audioTrack.ts:768](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/audio/audioTrack.ts#L768)

Singleton instance of the AudioManager.

Use this to control all audio tracks globally.

## Example

```typescript
import { AudioManager } from '@react-text-game/core/audio';

AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
```
