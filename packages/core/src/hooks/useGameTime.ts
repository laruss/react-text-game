import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { Clock, resolveClockNow } from "#clock";

/**
 * React hook returning the current game time in milliseconds.
 *
 * Re-renders whenever the clock is advanced, set, paused, resumed, or
 * reconfigured. In `"realtime"` mode flowing time mutates nothing, so pass
 * `tickMs` when the component has to update on its own - a ticking clock
 * display, a countdown, a "last seen" label.
 *
 * @param tickMs - Optional interval, in real milliseconds, forcing a re-render
 * @returns Game time in milliseconds, suitable for `new Date(...)`
 *
 * @example
 * ```tsx
 * import { useGameTime } from '@react-text-game/core';
 *
 * // Updates only when the game moves the clock.
 * function DayLabel() {
 *   const now = useGameTime();
 *   return <span>{new Date(now).toDateString()}</span>;
 * }
 *
 * // Updates every real second, for a live clock in realtime mode.
 * function LiveClock() {
 *   const now = useGameTime(1000);
 *   return <span>{new Date(now).toLocaleTimeString()}</span>;
 * }
 * ```
 */
export function useGameTime(tickMs?: number): number {
    const clockState = useSnapshot(Clock.selfState);
    const [, setTick] = useState(0);

    useEffect(() => {
        if (tickMs === undefined) {
            return;
        }

        const interval = setInterval(() => {
            setTick((tick) => tick + 1);
        }, tickMs);

        return () => {
            clearInterval(interval);
        };
    }, [tickMs]);

    return resolveClockNow(clockState);
}
