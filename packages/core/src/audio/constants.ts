import { STORAGE_SYSTEM_PATH } from "#constants";
import { JsonPath } from "#types";

/**
 * Base JSONPath for audio storage within the system path.
 *
 * All audio tracks with IDs will be stored under this path.
 * Individual tracks are stored at: $._system.audio.{id}
 */
export const AUDIO_STORAGE_PATH =
    `${STORAGE_SYSTEM_PATH}.audio` as const satisfies JsonPath;

/**
 * Default audio configuration values.
 */
export const DEFAULT_AUDIO_OPTIONS = {
    volume: 1.0,
    loop: false,
    playbackRate: 1.0,
    muted: false,
    autoPlay: false,
    preload: "metadata" as const,
} as const;
