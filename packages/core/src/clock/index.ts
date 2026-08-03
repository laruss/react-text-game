/**
 * Game clock module for the react-text-game engine.
 *
 * Provides in-fiction time that is independent of wall-clock time, persists
 * with the save, and by default only advances when the game advances it.
 *
 * @example
 * ```typescript
 * import { Clock, HOUR, MINUTE } from '@react-text-game/core/clock';
 * import { useGameTime } from '@react-text-game/core';
 *
 * // Advance time from an action handler.
 * Clock.advance(30 * MINUTE);
 *
 * // Read it anywhere.
 * const inGameDate = new Date(Clock.now());
 *
 * // Render it reactively.
 * function ClockDisplay() {
 *   const now = useGameTime();
 *   return <span>{new Date(now).toLocaleTimeString()}</span>;
 * }
 * ```
 *
 * @module clock
 */

export { Clock, resolveClockNow } from "./clock";
export {
    CLOCK_STORAGE_PATH,
    DAY,
    DEFAULT_CLOCK_OPTIONS,
    DEFAULT_CLOCK_START_AT,
    HOUR,
    MINUTE,
    SECOND,
} from "./constants";
export type {
    ClockMode,
    ClockOptions,
    ClockSaveState,
    ClockState,
} from "./types";
