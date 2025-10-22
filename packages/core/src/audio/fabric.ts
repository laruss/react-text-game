import { AudioTrack } from "./audioTrack";
import type { AudioOptions } from "./types";

/**
 * Factory function to create a new audio track.
 *
 * Follows the project's factory-first pattern similar to createEntity() and newStory().
 * Creates an AudioTrack instance with reactive state management and automatic
 * registration with the AudioManager.
 *
 * @param src - Path to the audio file (relative or absolute URL)
 * @param options - Optional audio configuration
 * @returns A reactive AudioTrack instance
 *
 * @example
 * ```typescript
 * // Create background music with auto-save
 * const bgMusic = createAudio('assets/music/theme.mp3', {
 *   id: 'bg-music',
 *   loop: true,
 *   volume: 0.5,
 * });
 *
 * await bgMusic.play();
 * bgMusic.setVolume(0.7);
 *
 * // Create sound effect (no ID = no auto-save)
 * const clickSound = createAudio('assets/sfx/click.mp3', {
 *   volume: 0.8,
 * });
 *
 * clickSound.play();
 * ```
 */
export const createAudio = (
    src: string,
    options?: AudioOptions
): AudioTrack => {
    return new AudioTrack(src, options);
};
