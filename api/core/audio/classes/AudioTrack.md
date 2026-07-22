# Class: AudioTrack

Defined in: [audioTrack.ts:35](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L35)

Individual audio track with reactive state management.

AudioTrack wraps the HTMLAudioElement API with Valtio reactive state,
making it easy to integrate with React components and the game's save system.

Features:
- Reactive state updates via Valtio
- Automatic persistence with save/load
- Volume, loop, and playback rate controls
- Fade in/out effects
- Event-driven state synchronization

## Example

```typescript
const music = new AudioTrack('assets/music.mp3', {
  id: 'bg-music',
  loop: true,
  volume: 0.7,
});

await music.play();
music.setVolume(0.5);
```

## Constructors

### Constructor

> **new AudioTrack**(`src`, `options`): `AudioTrack`

Defined in: [audioTrack.ts:48](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L48)

#### Parameters

##### src

`string`

##### options

[`AudioOptions`](../interfaces/AudioOptions.md) = `{}`

#### Returns

`AudioTrack`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [audioTrack.ts:36](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L36)

***

### src

> `readonly` **src**: `string`

Defined in: [audioTrack.ts:37](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L37)

## Methods

### \_applyEffectiveVolume()

> **\_applyEffectiveVolume**(): `void`

Defined in: [audioTrack.ts:247](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L247)

**`Internal`**

Applies the effective volume (track volume * master volume) to the audio element.
Internal method used by AudioManager to apply master volume changes.

#### Returns

`void`

***

### cancelFade()

> **cancelFade**(): `void`

Defined in: [audioTrack.ts:372](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L372)

Cancels any ongoing fade animation.

#### Returns

`void`

#### Example

```typescript
audio.cancelFade();
```

***

### dispose()

> **dispose**(): `void`

Defined in: [audioTrack.ts:509](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L509)

Cleans up the audio track and removes all listeners.

Should be called when the audio track is no longer needed.

#### Returns

`void`

#### Example

```typescript
audio.dispose();
```

***

### fadeIn()

> **fadeIn**(`duration`): `Promise`\<`void`\>

Defined in: [audioTrack.ts:328](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L328)

Fades in the audio over a specified duration.

Starts at volume 0 and gradually increases to the target volume.
Uses the original configured volume as the target, falling back to
current state volume if it's non-zero.

#### Parameters

##### duration

`number` = `1000`

Fade duration in milliseconds

#### Returns

`Promise`\<`void`\>

Promise that resolves when fade completes

#### Example

```typescript
await audio.fadeIn(2000); // Fade in over 2 seconds
```

***

### fadeOut()

> **fadeOut**(`duration`): `Promise`\<`void`\>

Defined in: [audioTrack.ts:356](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L356)

Fades out the audio over a specified duration and stops.

#### Parameters

##### duration

`number` = `1000`

Fade duration in milliseconds

#### Returns

`Promise`\<`void`\>

Promise that resolves when fade completes

#### Example

```typescript
await audio.fadeOut(1500); // Fade out over 1.5 seconds
```

***

### getState()

> **getState**(): [`AudioState`](../interfaces/AudioState.md)

Defined in: [audioTrack.ts:429](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L429)

Gets the reactive audio state.

This state is a Valtio proxy and can be used with useSnapshot() in React.

#### Returns

[`AudioState`](../interfaces/AudioState.md)

The reactive audio state

#### Example

```typescript
const state = audio.getState();
console.log(state.isPlaying); // true/false
```

***

### load()

> **load**(): `void`

Defined in: [audioTrack.ts:470](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L470)

Loads the audio state from storage.

Restores volume, loop, playback rate, muted status, and playback position.
Optionally resumes playback if the audio was playing when saved.

#### Returns

`void`

#### Example

```typescript
audio.load();
```

***

### pause()

> **pause**(): `void`

Defined in: [audioTrack.ts:189](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L189)

Pauses the audio track.

#### Returns

`void`

#### Example

```typescript
audio.pause();
```

***

### play()

> **play**(): `Promise`\<`void`\>

Defined in: [audioTrack.ts:172](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L172)

Plays the audio track.

#### Returns

`Promise`\<`void`\>

Promise that resolves when playback starts

#### Throws

Error if playback fails

#### Example

```typescript
try {
  await audio.play();
} catch (error) {
  console.error('Playback failed:', error);
}
```

***

### resume()

> **resume**(): `void`

Defined in: [audioTrack.ts:201](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L201)

Resumes playback if the audio is paused.

#### Returns

`void`

#### Example

```typescript
audio.resume();
```

***

### save()

> **save**(): `void`

Defined in: [audioTrack.ts:443](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L443)

Saves the current audio state to storage.

Called automatically when auto-save is enabled.

#### Returns

`void`

#### Example

```typescript
audio.save();
```

***

### seek()

> **seek**(`time`): `void`

Defined in: [audioTrack.ts:308](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L308)

Seeks to a specific time in the audio.

#### Parameters

##### time

`number`

Time in seconds, clamped to [0, duration]

#### Returns

`void`

#### Example

```typescript
audio.seek(30); // Seek to 30 seconds
```

***

### setLoop()

> **setLoop**(`loop`): `void`

Defined in: [audioTrack.ts:263](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L263)

Sets whether the audio should loop.

#### Parameters

##### loop

`boolean`

True to enable looping, false to disable

#### Returns

`void`

#### Example

```typescript
audio.setLoop(true);
```

***

### setMuted()

> **setMuted**(`muted`): `void`

Defined in: [audioTrack.ts:293](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L293)

Sets whether the audio is muted.

#### Parameters

##### muted

`boolean`

True to mute, false to unmute

#### Returns

`void`

#### Example

```typescript
audio.setMuted(true);
```

***

### setPlaybackRate()

> **setPlaybackRate**(`rate`): `void`

Defined in: [audioTrack.ts:278](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L278)

Sets the playback rate.

#### Parameters

##### rate

`number`

Playback rate multiplier (0.5 = half speed, 2.0 = double speed)

#### Returns

`void`

#### Example

```typescript
audio.setPlaybackRate(1.5); // 1.5x speed
```

***

### setVolume()

> **setVolume**(`volume`): `void`

Defined in: [audioTrack.ts:235](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L235)

Sets the volume level.

#### Parameters

##### volume

`number`

Volume level (0.0 to 1.0), clamped to valid range

#### Returns

`void`

#### Example

```typescript
audio.setVolume(0.5); // 50% volume
```

***

### stop()

> **stop**(): `void`

Defined in: [audioTrack.ts:217](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/audio/audioTrack.ts#L217)

Stops the audio track and resets to the beginning.

#### Returns

`void`

#### Example

```typescript
audio.stop();
```
