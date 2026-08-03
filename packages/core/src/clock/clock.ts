import { proxy, snapshot, subscribe } from "valtio";

import { logger } from "#logger";
import { Storage } from "#storage";

import { CLOCK_STORAGE_PATH, DEFAULT_CLOCK_OPTIONS } from "./constants";
import type {
    ClockMode,
    ClockOptions,
    ClockSaveState,
    ClockState,
} from "./types";

/**
 * Source of wall-clock time. Replaceable in tests so `"realtime"` mode stays
 * deterministic.
 */
let nowProvider: () => number = () => Date.now();

const state = proxy<ClockState>({
    anchorGame: DEFAULT_CLOCK_OPTIONS.startAt,
    anchorReal: nowProvider(),
    mode: DEFAULT_CLOCK_OPTIONS.mode,
    scale: DEFAULT_CLOCK_OPTIONS.scale,
    paused: false,
});

const assertFinite = (value: number, label: string): void => {
    if (!Number.isFinite(value)) {
        throw new Error(`Clock ${label} must be a finite number.`);
    }
};

/**
 * Derives the current game time from a clock state.
 *
 * Exported so React hooks can compute the same value from a Valtio snapshot
 * without duplicating the anchor arithmetic.
 *
 * @internal
 */
export const resolveClockNow = (clockState: Readonly<ClockState>): number => {
    if (clockState.mode === "manual" || clockState.paused) {
        return clockState.anchorGame;
    }

    const elapsed = (nowProvider() - clockState.anchorReal) * clockState.scale;

    return Math.floor(clockState.anchorGame + elapsed);
};

/**
 * The in-fiction clock of the game.
 *
 * Game time is independent of wall-clock time: it starts at a fixed fictional
 * timestamp, persists with the save, and by default only moves when the game
 * says so. That makes it usable for schedules, cooldowns, day/night cycles, and
 * message timestamps without making saves or tests depend on when they ran.
 *
 * State is stored as an anchor pair rather than a running counter, so
 * `"realtime"` mode needs no interval to stay correct across saves, page
 * reloads, and suspended tabs.
 *
 * @remarks
 * `advance()`, `set()`, `pause()`, `resume()`, `setMode()`, and `setScale()`
 * mutate game state, so call them from event handlers - never while a passage
 * renders.
 *
 * @example
 * ```typescript
 * import { Clock, HOUR, MINUTE } from '@react-text-game/core/clock';
 *
 * // Manual mode (default): time moves only when the game moves it.
 * Clock.advance(30 * MINUTE);
 * console.log(new Date(Clock.now()).toISOString());
 *
 * // Realtime mode: one real second becomes one game minute.
 * Clock.setMode('realtime');
 * Clock.setScale(60);
 * ```
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Clock mirrors the static facade of Game and Storage.
export class Clock {
    /**
     * Reactive clock state, for hooks that need to re-render on clock changes.
     *
     * @remarks
     * Read game time through {@link Clock.now} instead; this getter exists for
     * subscription, not for arithmetic.
     */
    static get selfState(): ClockState {
        return state;
    }

    /**
     * Current game time in milliseconds.
     *
     * @returns Game time, suitable for `new Date(...)`
     */
    static now(): number {
        return resolveClockNow(state);
    }

    /**
     * How game time currently advances.
     */
    static get mode(): ClockMode {
        return state.mode;
    }

    /**
     * Multiplier applied to elapsed wall-clock time in `"realtime"` mode.
     */
    static get scale(): number {
        return state.scale;
    }

    /**
     * Whether `"realtime"` accrual is frozen.
     */
    static get isPaused(): boolean {
        return state.paused;
    }

    /**
     * Moves game time forward by `ms`.
     *
     * Works in both modes and regardless of {@link Clock.isPaused}: an explicit
     * advance is always honoured. A negative value moves time backwards.
     *
     * @param ms - Milliseconds to add to the current game time
     * @throws Error if `ms` is not finite
     *
     * @example
     * ```typescript
     * h.actions([
     *   { content: 'Sleep until morning', action: () => Clock.advance(8 * HOUR) },
     * ]);
     * ```
     */
    static advance(ms: number): void {
        assertFinite(ms, "advance amount");

        state.anchorGame = Clock.now() + ms;
        state.anchorReal = nowProvider();

        logger.debug(`Clock advanced by ${ms}ms to ${state.anchorGame}`);
    }

    /**
     * Sets game time to an absolute timestamp.
     *
     * @param timestamp - Game time in milliseconds
     * @throws Error if `timestamp` is not finite
     */
    static set(timestamp: number): void {
        assertFinite(timestamp, "timestamp");

        state.anchorGame = timestamp;
        state.anchorReal = nowProvider();

        logger.debug(`Clock set to ${timestamp}`);
    }

    /**
     * Switches how game time advances, preserving the current game time.
     *
     * @param mode - The new clock mode
     */
    static setMode(mode: ClockMode): void {
        state.anchorGame = Clock.now();
        state.anchorReal = nowProvider();
        state.mode = mode;

        logger.debug(`Clock mode set to ${mode}`);
    }

    /**
     * Changes the `"realtime"` multiplier, preserving the current game time.
     *
     * @param scale - Multiplier applied to elapsed wall-clock time
     * @throws Error if `scale` is not a finite positive number
     */
    static setScale(scale: number): void {
        assertFinite(scale, "scale");

        if (scale <= 0) {
            throw new Error("Clock scale must be greater than zero.");
        }

        state.anchorGame = Clock.now();
        state.anchorReal = nowProvider();
        state.scale = scale;

        logger.debug(`Clock scale set to ${scale}`);
    }

    /**
     * Freezes `"realtime"` accrual, preserving the current game time.
     *
     * @remarks
     * A no-op in `"manual"` mode beyond setting the flag, since manual time does
     * not flow on its own.
     */
    static pause(): void {
        if (state.paused) {
            return;
        }

        state.anchorGame = Clock.now();
        state.anchorReal = nowProvider();
        state.paused = true;

        logger.debug("Clock paused");
    }

    /**
     * Resumes `"realtime"` accrual from the current game time.
     */
    static resume(): void {
        if (!state.paused) {
            return;
        }

        state.anchorReal = nowProvider();
        state.paused = false;

        logger.debug("Clock resumed");
    }

    /**
     * Subscribes to clock state changes.
     *
     * @remarks
     * Fires when the clock is advanced, set, paused, resumed, or reconfigured -
     * not continuously as `"realtime"` time flows, because flowing time mutates
     * nothing. For a ticking display use `useGameTime(tickMs)`.
     *
     * @param callback - Invoked after every clock state change
     * @returns Unsubscribe function
     */
    static subscribe(callback: () => void): () => void {
        return subscribe(state, callback);
    }

    /**
     * Applies clock options during `Game.init()`.
     *
     * @internal
     */
    static init(options?: ClockOptions): void {
        const startAt = options?.startAt ?? DEFAULT_CLOCK_OPTIONS.startAt;
        const scale = options?.scale ?? DEFAULT_CLOCK_OPTIONS.scale;

        assertFinite(startAt, "startAt");
        assertFinite(scale, "scale");

        if (scale <= 0) {
            throw new Error("Clock scale must be greater than zero.");
        }

        state.anchorGame = startAt;
        state.anchorReal = nowProvider();
        state.mode = options?.mode ?? DEFAULT_CLOCK_OPTIONS.mode;
        state.scale = scale;
        state.paused = false;

        logger.log(
            `Clock initialized at ${startAt} (mode: ${state.mode}, scale: ${scale})`
        );
    }

    /**
     * Writes the resolved game time to storage.
     *
     * @internal
     */
    static save(): void {
        const saveState = {
            ...snapshot(state),
            anchorGame: Clock.now(),
            anchorReal: nowProvider(),
        } satisfies ClockSaveState;

        Storage.setValue(CLOCK_STORAGE_PATH, saveState, true);
    }

    /**
     * Restores game time from storage, re-anchoring wall-clock time to now.
     *
     * @remarks
     * Re-anchoring is what keeps real time that passed while the save sat on
     * disk out of game time. A save without clock data leaves the clock alone.
     *
     * @internal
     */
    static load(): void {
        const [saved] = Storage.getValue<ClockSaveState>(CLOCK_STORAGE_PATH);

        if (!saved) {
            return;
        }

        state.anchorGame = saved.anchorGame;
        state.anchorReal = nowProvider();
        state.mode = saved.mode;
        state.scale = saved.scale;
        state.paused = saved.paused;

        logger.debug(`Clock loaded at ${state.anchorGame}`);
    }

    /**
     * Replaces the wall-clock source. Tests only.
     *
     * @internal
     */
    static _setNowProvider(provider: () => number): void {
        nowProvider = provider;
    }

    /**
     * Restores defaults and the real wall-clock source.
     *
     * @internal
     */
    static _resetForTesting(): void {
        nowProvider = () => Date.now();
        state.anchorGame = DEFAULT_CLOCK_OPTIONS.startAt;
        state.anchorReal = nowProvider();
        state.mode = DEFAULT_CLOCK_OPTIONS.mode;
        state.scale = DEFAULT_CLOCK_OPTIONS.scale;
        state.paused = false;
    }
}
