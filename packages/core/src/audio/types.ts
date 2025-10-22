/**
 * Configuration options for creating an audio track.
 *
 * @example
 * ```typescript
 * const audio = createAudio('music.mp3', {
 *   id: 'bg-music',
 *   volume: 0.7,
 *   loop: true,
 *   autoPlay: false,
 * });
 * ```
 */
export interface AudioOptions {
    /**
     * Unique identifier for the audio track.
     * Required for save/load functionality.
     * If not provided, a random ID will be generated.
     */
    id?: string;

    /**
     * Initial volume level (0.0 to 1.0).
     * @default 1.0
     */
    volume?: number;

    /**
     * Whether to loop the audio automatically.
     * @default false
     */
    loop?: boolean;

    /**
     * Playback rate multiplier (0.5 = half speed, 2.0 = double speed).
     * @default 1.0
     */
    playbackRate?: number;

    /**
     * Whether to start muted.
     * @default false
     */
    muted?: boolean;

    /**
     * Auto-play on creation.
     * Note: May be blocked by browser autoplay policies.
     * @default false
     */
    autoPlay?: boolean;

    /**
     * Preload strategy for the audio file.
     * - 'none': Don't preload
     * - 'metadata': Preload only metadata
     * - 'auto': Let browser decide
     * @default 'metadata'
     */
    preload?: "none" | "metadata" | "auto";
}

/**
 * Reactive state of an audio track.
 *
 * This interface represents the observable state that can be used
 * with React hooks for reactive updates.
 *
 * @example
 * ```typescript
 * const state = audio.getState();
 * console.log(state.isPlaying); // true/false
 * console.log(state.currentTime); // 45.2
 * ```
 */
export interface AudioState {
    /** Whether audio is currently playing */
    isPlaying: boolean;

    /** Whether audio is paused */
    isPaused: boolean;

    /** Whether audio is stopped */
    isStopped: boolean;

    /** Current playback position in seconds */
    currentTime: number;

    /** Total duration in seconds */
    duration: number;

    /** Current volume (0.0 to 1.0) */
    volume: number;

    /** Whether audio is looping */
    loop: boolean;

    /** Current playback rate multiplier */
    playbackRate: number;

    /** Whether audio is muted */
    muted: boolean;
}

/**
 * Saved state for audio track persistence.
 *
 * This is a subset of AudioState that gets persisted to storage.
 */
export interface AudioSaveState {
    id: string;
    src: string;
    volume: number;
    loop: boolean;
    playbackRate: number;
    muted: boolean;
    currentTime: number;
    isPlaying: boolean;
    isPaused: boolean;
}
