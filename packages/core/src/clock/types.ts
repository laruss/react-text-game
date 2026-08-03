/**
 * How the game clock advances.
 *
 * @remarks
 * - `"manual"` - game time only moves when {@link Clock.advance} or
 *   {@link Clock.set} is called. Fully deterministic, which makes saves,
 *   replays, and tests reproducible. This is the default.
 * - `"realtime"` - game time flows with wall-clock time, multiplied by
 *   {@link ClockState.scale}. The value is computed on read, so no timer has to
 *   run for the clock to stay correct across saves, reloads, and suspended
 *   tabs.
 */
export type ClockMode = "manual" | "realtime";

/**
 * Configuration accepted by the `clock` option of `Game.init()`.
 *
 * @example
 * ```typescript
 * await Game.init({
 *   gameName: 'My Game',
 *   clock: { startAt: Date.UTC(2031, 4, 12, 8, 30), mode: 'realtime', scale: 60 },
 * });
 * ```
 */
export type ClockOptions = {
    /**
     * Game time the clock starts at, in milliseconds.
     *
     * @remarks
     * Defaults to a fixed fictional timestamp rather than `Date.now()`, so a
     * fresh game always starts at the same in-fiction moment.
     */
    startAt?: number;

    /**
     * How game time advances.
     *
     * @defaultValue `"manual"`
     */
    mode?: ClockMode;

    /**
     * Multiplier applied to elapsed wall-clock time in `"realtime"` mode.
     * A scale of `60` turns one real second into one game minute.
     *
     * @defaultValue `1`
     */
    scale?: number;
};

/**
 * Reactive state backing the game clock.
 *
 * @remarks
 * Game time is stored as a pair of anchors rather than a running counter:
 * `anchorGame` is the game time at the moment `anchorReal` was captured. In
 * `"realtime"` mode the current value is derived from that pair on every read,
 * which is why the clock needs no interval to stay accurate.
 */
export type ClockState = {
    /** Game time, in milliseconds, at the last re-anchor. */
    anchorGame: number;

    /** Wall-clock time, in milliseconds, at the last re-anchor. */
    anchorReal: number;

    /** How game time advances. */
    mode: ClockMode;

    /** Multiplier applied to elapsed wall-clock time in `"realtime"` mode. */
    scale: number;

    /** Whether `"realtime"` accrual is currently frozen. */
    paused: boolean;
};

/**
 * Shape persisted at `$._system.clock`.
 *
 * @remarks
 * `anchorGame` holds the resolved game time at the moment of saving.
 * {@link ClockState.anchorReal} is deliberately not persisted: loading always
 * re-anchors it to the current wall clock, so real time that passed while a save
 * sat unused never leaks into game time. Storing it would keep a value nothing
 * reads and make consecutive snapshots differ even when nothing changed.
 *
 * Saves written before this field was dropped remain loadable - the extra key is
 * simply ignored - so no migration is required.
 */
export type ClockSaveState = Omit<ClockState, "anchorReal">;
