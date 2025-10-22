import { useSnapshot } from "valtio";

import type { AudioTrack } from "#audio";

/**
 * React hook to access reactive audio state.
 *
 * This hook makes audio state observable in React components, automatically
 * triggering re-renders when the audio state changes (playback position,
 * volume, playing status, etc.).
 *
 * @param audio - The audio track to observe
 * @returns Reactive audio state snapshot
 *
 * @example
 * ```typescript
 * import { createAudio } from '@react-text-game/core/audio';
 * import { useAudio } from '@react-text-game/core';
 *
 * const bgMusic = createAudio('music.mp3', {
 *   id: 'bg-music',
 *   loop: true,
 * });
 *
 * function MusicPlayer() {
 *   const audioState = useAudio(bgMusic);
 *
 *   return (
 *     <div>
 *       <p>Playing: {audioState.isPlaying ? 'Yes' : 'No'}</p>
 *       <p>Time: {audioState.currentTime.toFixed(1)}s / {audioState.duration.toFixed(1)}s</p>
 *       <p>Volume: {(audioState.volume * 100).toFixed(0)}%</p>
 *
 *       <button onClick={() => bgMusic.play()}>Play</button>
 *       <button onClick={() => bgMusic.pause()}>Pause</button>
 *       <button onClick={() => bgMusic.stop()}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAudio = (audio: AudioTrack) => {
    return useSnapshot(audio.getState());
};
