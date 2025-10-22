import { proxy, subscribe } from "valtio";

import { logger } from "#logger";
import { Storage } from "#storage";
import { JsonPath } from "#types";

import { AUDIO_STORAGE_PATH, DEFAULT_AUDIO_OPTIONS } from "./constants";
import type { AudioOptions, AudioSaveState, AudioState } from "./types";

/**
 * Individual audio track with reactive state management.
 *
 * AudioTrack wraps the HTMLAudioElement API with Valtio reactive state,
 * making it easy to integrate with React components and the game's save system.
 *
 * Features:
 * - Reactive state updates via Valtio
 * - Automatic persistence with save/load
 * - Volume, loop, and playback rate controls
 * - Fade in/out effects
 * - Event-driven state synchronization
 *
 * @example
 * ```typescript
 * const music = new AudioTrack('assets/music.mp3', {
 *   id: 'bg-music',
 *   loop: true,
 *   volume: 0.7,
 * });
 *
 * await music.play();
 * music.setVolume(0.5);
 * ```
 */
export class AudioTrack {
    readonly id: string;
    readonly src: string;

    private readonly audioElement: HTMLAudioElement;
    private readonly state: AudioState;
    private readonly jsonPath: JsonPath;
    private readonly unsubscribe?: () => void;

    constructor(src: string, options: AudioOptions = {}) {
        this.id = options.id || `audio-${Date.now()}-${Math.random()}`;
        this.src = src;
        this.jsonPath = `${AUDIO_STORAGE_PATH}.${this.id}` as JsonPath;

        // Create reactive state with Valtio
        this.state = proxy<AudioState>({
            isPlaying: false,
            isPaused: false,
            isStopped: true,
            currentTime: 0,
            duration: 0,
            volume: options.volume ?? DEFAULT_AUDIO_OPTIONS.volume,
            loop: options.loop ?? DEFAULT_AUDIO_OPTIONS.loop,
            playbackRate:
                options.playbackRate ?? DEFAULT_AUDIO_OPTIONS.playbackRate,
            muted: options.muted ?? DEFAULT_AUDIO_OPTIONS.muted,
        });

        // Create audio element
        this.audioElement = new Audio(src);
        this.audioElement.loop = this.state.loop;
        this.audioElement.playbackRate = this.state.playbackRate;
        this.audioElement.muted = this.state.muted;
        this.audioElement.preload =
            options.preload ?? DEFAULT_AUDIO_OPTIONS.preload;

        // Attach event listeners
        this.attachEventListeners();

        // Register with AudioManager
        AudioManager._registerTrack(this);

        // Apply effective volume (considering master volume)
        // Must be called after registration since it needs AudioManager
        this._applyEffectiveVolume();

        // Setup auto-save subscription if ID provided
        if (options.id) {
            // Subscribe to state changes for auto-save
            // Audio will be saved whenever state changes, matching the pattern
            // of other game objects that persist their state
            //
            // Note: Initial state is not auto-saved here to avoid overwriting
            // existing saved states during load operations. Call save() manually
            // or trigger a state change to persist the initial state.
            this.unsubscribe = subscribe(this.state, () => {
                this.save();
            });
        }

        // Auto-play if requested (may be blocked by browser)
        if (options.autoPlay) {
            this.play().catch((error) => {
                logger.warn(
                    `Auto-play blocked for "${this.id}". User interaction required.`,
                    error
                );
            });
        }

        logger.log(`Audio track created: ${this.id} (${src})`);
    }

    /**
     * Attaches event listeners to sync HTMLAudioElement state with reactive state.
     * @private
     */
    private attachEventListeners(): void {
        this.audioElement.addEventListener("loadedmetadata", () => {
            this.state.duration = this.audioElement.duration;
        });

        this.audioElement.addEventListener("timeupdate", () => {
            this.state.currentTime = this.audioElement.currentTime;
        });

        this.audioElement.addEventListener("play", () => {
            this.state.isPlaying = true;
            this.state.isPaused = false;
            this.state.isStopped = false;
        });

        this.audioElement.addEventListener("pause", () => {
            this.state.isPlaying = false;
            this.state.isPaused = true;
        });

        this.audioElement.addEventListener("ended", () => {
            if (!this.state.loop) {
                this.state.isPlaying = false;
                this.state.isStopped = true;
                this.state.isPaused = false;
                this.state.currentTime = 0;
            }
        });

        this.audioElement.addEventListener("volumechange", () => {
            // Only sync muted state, not volume
            // Volume state is managed separately to support master volume
            this.state.muted = this.audioElement.muted;
        });

        this.audioElement.addEventListener("ratechange", () => {
            this.state.playbackRate = this.audioElement.playbackRate;
        });
    }

    /**
     * Plays the audio track.
     *
     * @returns Promise that resolves when playback starts
     * @throws Error if playback fails
     *
     * @example
     * ```typescript
     * try {
     *   await audio.play();
     * } catch (error) {
     *   console.error('Playback failed:', error);
     * }
     * ```
     */
    async play(): Promise<void> {
        try {
            await this.audioElement.play();
        } catch (error) {
            logger.error(`Failed to play audio: ${this.src}`, error);
            throw error;
        }
    }

    /**
     * Pauses the audio track.
     *
     * @example
     * ```typescript
     * audio.pause();
     * ```
     */
    pause(): void {
        this.audioElement.pause();
    }

    /**
     * Resumes playback if the audio is paused.
     *
     * @example
     * ```typescript
     * audio.resume();
     * ```
     */
    resume(): void {
        if (this.state.isPaused) {
            this.play().catch((error) => {
                logger.error(`Failed to resume audio: ${this.src}`, error);
            });
        }
    }

    /**
     * Stops the audio track and resets to the beginning.
     *
     * @example
     * ```typescript
     * audio.stop();
     * ```
     */
    stop(): void {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.isStopped = true;
    }

    /**
     * Sets the volume level.
     *
     * @param volume - Volume level (0.0 to 1.0), clamped to valid range
     *
     * @example
     * ```typescript
     * audio.setVolume(0.5); // 50% volume
     * ```
     */
    setVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.state.volume = clampedVolume;
        this._applyEffectiveVolume();
    }

    /**
     * Applies the effective volume (track volume * master volume) to the audio element.
     * Internal method used by AudioManager to apply master volume changes.
     *
     * @internal
     */
    _applyEffectiveVolume(): void {
        const masterVolume = AudioManager.getMasterVolume();
        const effectiveVolume = this.state.volume * masterVolume;
        this.audioElement.volume = effectiveVolume;
    }

    /**
     * Sets whether the audio should loop.
     *
     * @param loop - True to enable looping, false to disable
     *
     * @example
     * ```typescript
     * audio.setLoop(true);
     * ```
     */
    setLoop(loop: boolean): void {
        this.audioElement.loop = loop;
        this.state.loop = loop;
    }

    /**
     * Sets the playback rate.
     *
     * @param rate - Playback rate multiplier (0.5 = half speed, 2.0 = double speed)
     *
     * @example
     * ```typescript
     * audio.setPlaybackRate(1.5); // 1.5x speed
     * ```
     */
    setPlaybackRate(rate: number): void {
        this.audioElement.playbackRate = rate;
        this.state.playbackRate = rate;
    }

    /**
     * Sets whether the audio is muted.
     *
     * @param muted - True to mute, false to unmute
     *
     * @example
     * ```typescript
     * audio.setMuted(true);
     * ```
     */
    setMuted(muted: boolean): void {
        this.audioElement.muted = muted;
        this.state.muted = muted;
    }

    /**
     * Seeks to a specific time in the audio.
     *
     * @param time - Time in seconds, clamped to [0, duration]
     *
     * @example
     * ```typescript
     * audio.seek(30); // Seek to 30 seconds
     * ```
     */
    seek(time: number): void {
        const clampedTime = Math.max(0, Math.min(this.state.duration, time));
        this.audioElement.currentTime = clampedTime;
    }

    /**
     * Fades in the audio over a specified duration.
     *
     * Starts at volume 0 and gradually increases to the target volume.
     *
     * @param duration - Fade duration in milliseconds
     * @returns Promise that resolves when fade completes
     *
     * @example
     * ```typescript
     * await audio.fadeIn(2000); // Fade in over 2 seconds
     * ```
     */
    async fadeIn(duration: number = 1000): Promise<void> {
        const targetVolume = this.state.volume;
        this.state.volume = 0;
        this.audioElement.volume = 0;

        await this.play();

        return this.fadeTo(targetVolume, duration);
    }

    /**
     * Fades out the audio over a specified duration and stops.
     *
     * @param duration - Fade duration in milliseconds
     * @returns Promise that resolves when fade completes
     *
     * @example
     * ```typescript
     * await audio.fadeOut(1500); // Fade out over 1.5 seconds
     * ```
     */
    async fadeOut(duration: number = 1000): Promise<void> {
        await this.fadeTo(0, duration);
        this.stop();
    }

    /**
     * Fades to a target volume over a specified duration.
     *
     * @private
     * @param targetVolume - Target volume level (0.0 to 1.0)
     * @param duration - Fade duration in milliseconds
     * @returns Promise that resolves when fade completes
     */
    private async fadeTo(
        targetVolume: number,
        duration: number
    ): Promise<void> {
        const startVolume = this.audioElement.volume;
        const startTime = Date.now();

        return new Promise((resolve) => {
            const fade = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentVolume =
                    startVolume + (targetVolume - startVolume) * progress;
                this.audioElement.volume = currentVolume;
                this.state.volume = currentVolume;

                if (progress < 1) {
                    requestAnimationFrame(fade);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(fade);
        });
    }

    /**
     * Gets the reactive audio state.
     *
     * This state is a Valtio proxy and can be used with useSnapshot() in React.
     *
     * @returns The reactive audio state
     *
     * @example
     * ```typescript
     * const state = audio.getState();
     * console.log(state.isPlaying); // true/false
     * ```
     */
    getState(): AudioState {
        return this.state;
    }

    /**
     * Saves the current audio state to storage.
     *
     * Called automatically when auto-save is enabled.
     *
     * @example
     * ```typescript
     * audio.save();
     * ```
     */
    save(): void {
        const saveState: AudioSaveState = {
            id: this.id,
            src: this.src,
            volume: this.state.volume,
            loop: this.state.loop,
            playbackRate: this.state.playbackRate,
            muted: this.state.muted,
            currentTime: this.state.currentTime,
            isPlaying: this.state.isPlaying,
            isPaused: this.state.isPaused,
        };

        Storage.setValue(this.jsonPath, saveState, true);
    }

    /**
     * Loads the audio state from storage.
     *
     * Restores volume, loop, playback rate, muted status, and playback position.
     * Optionally resumes playback if the audio was playing when saved.
     *
     * @example
     * ```typescript
     * audio.load();
     * ```
     */
    load(): void {
        const savedState = Storage.getValue<AudioSaveState>(this.jsonPath);

        if (savedState.length > 0) {
            const state = savedState[0]!;

            this.state.volume = state.volume;
            this.state.loop = state.loop;
            this.state.playbackRate = state.playbackRate;
            this.state.muted = state.muted;

            // Apply effective volume (considering master volume)
            this._applyEffectiveVolume();
            this.audioElement.loop = state.loop;
            this.audioElement.playbackRate = state.playbackRate;
            this.audioElement.muted = state.muted;
            this.audioElement.currentTime = state.currentTime;

            // Restore playback state
            if (state.isPlaying && !state.isPaused) {
                this.play().catch((error) => {
                    logger.warn(
                        `Could not auto-resume audio "${this.id}" on load. User interaction may be required.`,
                        error
                    );
                });
            }
        }
    }

    /**
     * Cleans up the audio track and removes all listeners.
     *
     * Should be called when the audio track is no longer needed.
     *
     * @example
     * ```typescript
     * audio.dispose();
     * ```
     */
    dispose(): void {
        this.stop();
        this.unsubscribe?.();
        AudioManager._unregisterTrack(this);

        // Remove all event listeners by cloning the element
        const clone = this.audioElement.cloneNode() as HTMLAudioElement;
        this.audioElement.parentNode?.replaceChild(clone, this.audioElement);

        logger.log(`Audio track disposed: ${this.id}`);
    }
}

/**
 * Global audio manager for controlling all audio tracks.
 *
 * AudioManager provides a singleton interface for game-wide audio operations
 * like master volume control, muting all tracks, or pausing all audio.
 *
 * @example
 * ```typescript
 * // Global volume control
 * AudioManager.setMasterVolume(0.5);
 *
 * // Mute all audio
 * AudioManager.muteAll();
 *
 * // Pause all playing tracks
 * AudioManager.pauseAll();
 * ```
 */
class AudioManagerClass {
    private tracks = new Map<string, AudioTrack>();

    private state = proxy({
        masterVolume: 1,
        isMuted: false,
    });

    /**
     * Internal method to register a track.
     * Called automatically by AudioTrack constructor.
     *
     * @internal
     * @param track - The audio track to register
     */
    _registerTrack(track: AudioTrack): void {
        this.tracks.set(track.id, track);
        logger.log(`AudioManager registered track: ${track.id}`);
    }

    /**
     * Internal method to unregister a track.
     * Called automatically by AudioTrack.dispose().
     *
     * @internal
     * @param track - The audio track to unregister
     */
    _unregisterTrack(track: AudioTrack): void {
        this.tracks.delete(track.id);
        logger.log(`AudioManager unregistered track: ${track.id}`);
    }

    /**
     * Sets the master volume for all audio tracks.
     *
     * The master volume is multiplied with each track's individual volume.
     * This does not modify individual track volumes - it applies a global multiplier.
     *
     * @param volume - Master volume level (0.0 to 1.0), clamped to valid range
     *
     * @example
     * ```typescript
     * AudioManager.setMasterVolume(0.5); // 50% master volume
     * ```
     */
    setMasterVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.state.masterVolume = clampedVolume;

        // Apply to all tracks without modifying their base volume
        this.tracks.forEach((track) => {
            track._applyEffectiveVolume();
        });

        logger.log(`Master volume set to: ${clampedVolume}`);
    }

    /**
     * Gets the current master volume.
     *
     * @returns The master volume level (0.0 to 1.0)
     *
     * @example
     * ```typescript
     * const volume = AudioManager.getMasterVolume();
     * ```
     */
    getMasterVolume(): number {
        return this.state.masterVolume;
    }

    /**
     * Mutes all audio tracks.
     *
     * @example
     * ```typescript
     * AudioManager.muteAll();
     * ```
     */
    muteAll(): void {
        this.state.isMuted = true;
        this.tracks.forEach((track) => track.setMuted(true));
        logger.log("All audio tracks muted");
    }

    /**
     * Unmutes all audio tracks.
     *
     * @example
     * ```typescript
     * AudioManager.unmuteAll();
     * ```
     */
    unmuteAll(): void {
        this.state.isMuted = false;
        this.tracks.forEach((track) => track.setMuted(false));
        logger.log("All audio tracks unmuted");
    }

    /**
     * Pauses all currently playing audio tracks.
     *
     * @example
     * ```typescript
     * AudioManager.pauseAll();
     * ```
     */
    pauseAll(): void {
        this.tracks.forEach((track) => {
            if (track.getState().isPlaying) {
                track.pause();
            }
        });
        logger.log("All audio tracks paused");
    }

    /**
     * Resumes all paused audio tracks.
     *
     * @example
     * ```typescript
     * AudioManager.resumeAll();
     * ```
     */
    resumeAll(): void {
        this.tracks.forEach((track) => {
            if (track.getState().isPaused) {
                track.resume();
            }
        });
        logger.log("All audio tracks resumed");
    }

    /**
     * Stops all audio tracks.
     *
     * @example
     * ```typescript
     * AudioManager.stopAll();
     * ```
     */
    stopAll(): void {
        this.tracks.forEach((track) => track.stop());
        logger.log("All audio tracks stopped");
    }

    /**
     * Gets all registered audio tracks.
     *
     * @returns Array of all audio tracks
     *
     * @example
     * ```typescript
     * const tracks = AudioManager.getAllTracks();
     * console.log(`Total tracks: ${tracks.length}`);
     * ```
     */
    getAllTracks(): Array<AudioTrack> {
        return Array.from(this.tracks.values());
    }

    /**
     * Gets an audio track by its ID.
     *
     * @param id - The unique identifier of the audio track
     * @returns The audio track, or undefined if not found
     *
     * @example
     * ```typescript
     * const music = AudioManager.getTrackById('bg-music');
     * if (music) {
     *   music.play();
     * }
     * ```
     */
    getTrackById(id: string): AudioTrack | undefined {
        return this.tracks.get(id);
    }

    /**
     * Gets the reactive audio manager state.
     *
     * This state is a Valtio proxy and can be used with useSnapshot() in React.
     *
     * @returns The reactive audio manager state
     *
     * @example
     * ```typescript
     * const state = AudioManager.getState();
     * console.log(state.masterVolume); // 1.0
     * ```
     */
    getState() {
        return this.state;
    }

    /**
     * Disposes all audio tracks.
     *
     * Useful for cleanup when shutting down the game.
     *
     * @example
     * ```typescript
     * AudioManager.disposeAll();
     * ```
     */
    disposeAll(): void {
        this.tracks.forEach((track) => track.dispose());
        this.tracks.clear();
        logger.log("All audio tracks disposed");
    }
}

/**
 * Singleton instance of the AudioManager.
 *
 * Use this to control all audio tracks globally.
 *
 * @example
 * ```typescript
 * import { AudioManager } from '@react-text-game/core/audio';
 *
 * AudioManager.setMasterVolume(0.8);
 * AudioManager.muteAll();
 * ```
 */
export const AudioManager = new AudioManagerClass();
