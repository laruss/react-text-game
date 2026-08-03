import { STORAGE_SYSTEM_PATH } from "#constants";
import type { JsonPath } from "#types";

import type { ClockOptions } from "./types";

/**
 * JSONPath the clock persists its state at.
 *
 * @remarks
 * Lives under the protected system path, so it travels with every save
 * snapshot without colliding with entity ids.
 */
export const CLOCK_STORAGE_PATH =
    `${STORAGE_SYSTEM_PATH}.clock` as const satisfies JsonPath;

/** One second in milliseconds. */
export const SECOND = 1000;

/** One minute in milliseconds. */
export const MINUTE = 60 * SECOND;

/** One hour in milliseconds. */
export const HOUR = 60 * MINUTE;

/** One day in milliseconds. */
export const DAY = 24 * HOUR;

/**
 * Game time a fresh game starts at: 2000-01-01, 09:00 UTC.
 *
 * @remarks
 * Deliberately a fixed timestamp rather than `Date.now()`. A wall-clock default
 * would make every test, replay, and screenshot depend on when it ran.
 */
export const DEFAULT_CLOCK_START_AT = Date.UTC(2000, 0, 1, 9, 0, 0);

/**
 * Default clock configuration.
 */
export const DEFAULT_CLOCK_OPTIONS = {
    startAt: DEFAULT_CLOCK_START_AT,
    mode: "manual",
    scale: 1,
} as const satisfies Required<ClockOptions>;
