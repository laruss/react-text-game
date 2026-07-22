# Function: useAudioManager()

> **useAudioManager**(): `object`

Defined in: [packages/core/src/hooks/useAudioManager.ts:56](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/hooks/useAudioManager.ts#L56)

React hook to access global audio manager state and controls.

This hook provides access to the AudioManager's reactive state
(master volume, mute status) and bound control methods.

## Returns

Reactive audio manager state and control methods

### disposeAll()

> **disposeAll**: () => `void`

Disposes all audio tracks.

Useful for cleanup when shutting down the game.

#### Returns

`void`

#### Example

```typescript
AudioManager.disposeAll();
```

### getAllTracks()

> **getAllTracks**: () => `AudioTrack`[]

Gets all registered audio tracks.

#### Returns

`AudioTrack`[]

Array of all audio tracks

#### Example

```typescript
const tracks = AudioManager.getAllTracks();
console.log(`Total tracks: ${tracks.length}`);
```

### getMasterVolume()

> **getMasterVolume**: () => `number`

Gets the current master volume.

#### Returns

`number`

The master volume level (0.0 to 1.0)

#### Example

```typescript
const volume = AudioManager.getMasterVolume();
```

### getTrackById()

> **getTrackById**: (`id`) => `AudioTrack` \| `undefined`

Gets an audio track by its ID.

#### Parameters

##### id

`string`

The unique identifier of the audio track

#### Returns

`AudioTrack` \| `undefined`

The audio track, or undefined if not found

#### Example

```typescript
const music = AudioManager.getTrackById('bg-music');
if (music) {
  music.play();
}
```

### isMuted

> **isMuted**: `boolean` = `false`

### masterVolume

> **masterVolume**: `number` = `1`

### muteAll()

> **muteAll**: () => `void`

Mutes all audio tracks.

#### Returns

`void`

#### Example

```typescript
AudioManager.muteAll();
```

### pauseAll()

> **pauseAll**: () => `void`

Pauses all currently playing audio tracks.

#### Returns

`void`

#### Example

```typescript
AudioManager.pauseAll();
```

### resumeAll()

> **resumeAll**: () => `void`

Resumes all paused audio tracks.

#### Returns

`void`

#### Example

```typescript
AudioManager.resumeAll();
```

### setMasterVolume()

> **setMasterVolume**: (`volume`) => `void`

Sets the master volume for all audio tracks.

The master volume is multiplied with each track's individual volume.
This does not modify individual track volumes - it applies a global multiplier.

#### Parameters

##### volume

`number`

Master volume level (0.0 to 1.0), clamped to valid range

#### Returns

`void`

#### Example

```typescript
AudioManager.setMasterVolume(0.5); // 50% master volume
```

### stopAll()

> **stopAll**: () => `void`

Stops all audio tracks.

#### Returns

`void`

#### Example

```typescript
AudioManager.stopAll();
```

### unmuteAll()

> **unmuteAll**: () => `void`

Unmutes all audio tracks.

#### Returns

`void`

#### Example

```typescript
AudioManager.unmuteAll();
```

## Example

```typescript
import { useAudioManager } from '@react-text-game/core';

function AudioSettingsMenu() {
  const audioManager = useAudioManager();

  return (
    <div>
      <h2>Audio Settings</h2>

      <label>
        Master Volume: {(audioManager.masterVolume * 100).toFixed(0)}%
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audioManager.masterVolume}
          onChange={(e) => audioManager.setMasterVolume(parseFloat(e.target.value))}
        />
      </label>

      <button onClick={audioManager.muteAll}>
        Mute All
      </button>
      <button onClick={audioManager.unmuteAll}>
        Unmute All
      </button>
      <button onClick={audioManager.pauseAll}>
        Pause All
      </button>
      <button onClick={audioManager.resumeAll}>
        Resume All
      </button>

      <p>Muted: {audioManager.isMuted ? 'Yes' : 'No'}</p>
      <p>Total Tracks: {audioManager.getAllTracks().length}</p>
    </div>
  );
}
```
