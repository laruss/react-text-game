/**
 * Audio module for the react-text-game engine.
 *
 * Provides comprehensive audio support with reactive state management,
 * automatic persistence, and global controls.
 *
 * @example
 * ```typescript
 * import { createAudio, AudioManager } from '@react-text-game/core/audio';
 *
 * // Create and control audio tracks
 * const music = createAudio('music.mp3', {
 *   id: 'bg-music',
 *   loop: true,
 *   volume: 0.7,
 * });
 *
 * await music.play();
 * music.pause();
 * music.setVolume(0.5);
 *
 * // Global controls
 * AudioManager.setMasterVolume(0.8);
 * AudioManager.muteAll();
 * ```
 *
 * @module audio
 */

export { AudioManager, AudioTrack } from "./audioTrack";
export { AUDIO_STORAGE_PATH, DEFAULT_AUDIO_OPTIONS } from "./constants";
export { createAudio } from "./fabric";
export type { AudioOptions, AudioSaveState, AudioState } from "./types";
