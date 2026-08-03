import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";

import {
    CLOCK_STORAGE_PATH,
    Clock,
    DAY,
    DEFAULT_CLOCK_OPTIONS,
    DEFAULT_CLOCK_START_AT,
    HOUR,
    MINUTE,
    resolveClockNow,
    SECOND,
} from "#clock";
import { Game } from "#game";
import { useGameTime } from "#hooks";
import { Storage } from "#storage";
import { setupMockStorage, teardownMockStorage } from "#tests/helpers";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Clock", () => {
    beforeEach(() => {
        setupMockStorage();
        Clock._resetForTesting();
        // Freeze wall-clock time for the whole suite. Without this, any test that
        // touches "realtime" mode races the real clock - and `scale` multiplies a
        // single elapsed millisecond, so the failure is intermittent rather than
        // obvious. Tests that need time to move install their own provider.
        Clock._setNowProvider(() => 0);
    });

    afterEach(() => {
        Clock._resetForTesting();
        teardownMockStorage();
    });

    describe("constants", () => {
        test("exposes duration helpers", () => {
            expect(SECOND).toBe(1000);
            expect(MINUTE).toBe(60_000);
            expect(HOUR).toBe(3_600_000);
            expect(DAY).toBe(86_400_000);
        });

        test("stores state under the protected system path", () => {
            expect(CLOCK_STORAGE_PATH).toBe("$._system.clock");
        });

        test("defaults to a fixed fictional start, not wall-clock time", () => {
            expect(DEFAULT_CLOCK_START_AT).toBe(Date.UTC(2000, 0, 1, 9, 0, 0));
            expect(DEFAULT_CLOCK_OPTIONS.mode).toBe("manual");
            expect(DEFAULT_CLOCK_OPTIONS.scale).toBe(1);
        });
    });

    describe("defaults", () => {
        test("starts at the default fictional timestamp in manual mode", () => {
            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);
            expect(Clock.mode).toBe("manual");
            expect(Clock.scale).toBe(1);
            expect(Clock.isPaused).toBe(false);
        });

        test("does not move on its own in manual mode", async () => {
            const before = Clock.now();
            await flush();

            expect(Clock.now()).toBe(before);
        });

        test("exposes reactive state for subscribers", () => {
            expect(Clock.selfState.anchorGame).toBe(DEFAULT_CLOCK_START_AT);
        });
    });

    describe("init", () => {
        test("applies startAt, mode and scale", () => {
            Clock.init({ startAt: 5_000, mode: "realtime", scale: 60 });

            expect(Clock.now()).toBe(5_000);
            expect(Clock.mode).toBe("realtime");
            expect(Clock.scale).toBe(60);
        });

        test("falls back to defaults for omitted fields", () => {
            Clock.init({});

            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);
            expect(Clock.mode).toBe("manual");
            expect(Clock.scale).toBe(1);
        });

        test("falls back to defaults when called without options", () => {
            Clock.init();

            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);
        });

        test("clears a paused clock", () => {
            Clock.pause();
            expect(Clock.isPaused).toBe(true);

            Clock.init({ startAt: 1_000 });

            expect(Clock.isPaused).toBe(false);
        });

        test("rejects a non-finite startAt", () => {
            expect(() => Clock.init({ startAt: Number.NaN })).toThrow(
                "Clock startAt must be a finite number."
            );
        });

        test("rejects a non-finite scale", () => {
            expect(() =>
                Clock.init({ scale: Number.POSITIVE_INFINITY })
            ).toThrow("Clock scale must be a finite number.");
        });

        test("rejects a non-positive scale", () => {
            expect(() => Clock.init({ scale: 0 })).toThrow(
                "Clock scale must be greater than zero."
            );
        });
    });

    describe("advance", () => {
        test("moves game time forward", () => {
            Clock.init({ startAt: 0 });

            Clock.advance(30 * MINUTE);

            expect(Clock.now()).toBe(30 * MINUTE);
        });

        test("accumulates across calls", () => {
            Clock.init({ startAt: 0 });

            Clock.advance(HOUR);
            Clock.advance(HOUR);

            expect(Clock.now()).toBe(2 * HOUR);
        });

        test("moves game time backwards for a negative amount", () => {
            Clock.init({ startAt: HOUR });

            Clock.advance(-MINUTE);

            expect(Clock.now()).toBe(HOUR - MINUTE);
        });

        test("works while paused, because it is explicit", () => {
            Clock.init({ startAt: 0, mode: "realtime" });
            Clock.pause();

            Clock.advance(MINUTE);

            expect(Clock.now()).toBe(MINUTE);
        });

        test("rejects a non-finite amount", () => {
            expect(() => Clock.advance(Number.NaN)).toThrow(
                "Clock advance amount must be a finite number."
            );
        });
    });

    describe("set", () => {
        test("jumps to an absolute timestamp", () => {
            Clock.set(1_234_567);

            expect(Clock.now()).toBe(1_234_567);
        });

        test("rejects a non-finite timestamp", () => {
            expect(() => Clock.set(Number.NEGATIVE_INFINITY)).toThrow(
                "Clock timestamp must be a finite number."
            );
        });
    });

    describe("realtime mode", () => {
        test("derives game time from elapsed wall-clock time", () => {
            let realNow = 1_000;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += 5 * SECOND;

            expect(Clock.now()).toBe(5 * SECOND);
        });

        test("applies the scale multiplier", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime", scale: 60 });

            realNow += SECOND;

            expect(Clock.now()).toBe(MINUTE);
        });

        test("floors fractional results", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime", scale: 0.5 });

            realNow += 3;

            expect(Clock.now()).toBe(1);
        });

        test("re-anchors on advance so elapsed time is not double counted", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += SECOND;
            Clock.advance(HOUR);
            realNow += SECOND;

            expect(Clock.now()).toBe(HOUR + 2 * SECOND);
        });
    });

    describe("mode and scale changes", () => {
        test("setMode preserves the current game time", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += 10 * SECOND;
            Clock.setMode("manual");
            realNow += 10 * SECOND;

            expect(Clock.mode).toBe("manual");
            expect(Clock.now()).toBe(10 * SECOND);
        });

        test("setScale preserves the current game time", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += SECOND;
            Clock.setScale(60);
            realNow += SECOND;

            expect(Clock.scale).toBe(60);
            expect(Clock.now()).toBe(SECOND + MINUTE);
        });

        test("setScale rejects a non-finite value", () => {
            expect(() => Clock.setScale(Number.NaN)).toThrow(
                "Clock scale must be a finite number."
            );
        });

        test("setScale rejects a non-positive value", () => {
            expect(() => Clock.setScale(-1)).toThrow(
                "Clock scale must be greater than zero."
            );
        });
    });

    describe("pause and resume", () => {
        test("freezes realtime accrual", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += 5 * SECOND;
            Clock.pause();
            realNow += 60 * SECOND;

            expect(Clock.isPaused).toBe(true);
            expect(Clock.now()).toBe(5 * SECOND);
        });

        test("resumes from the frozen game time", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            realNow += 5 * SECOND;
            Clock.pause();
            realNow += 60 * SECOND;
            Clock.resume();
            realNow += 2 * SECOND;

            expect(Clock.isPaused).toBe(false);
            expect(Clock.now()).toBe(7 * SECOND);
        });

        test("pausing twice is a no-op", () => {
            Clock.init({ startAt: 0, mode: "realtime" });
            Clock.pause();
            const anchor = Clock.selfState.anchorGame;

            Clock.pause();

            expect(Clock.selfState.anchorGame).toBe(anchor);
        });

        test("resuming a running clock is a no-op", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });
            const anchor = Clock.selfState.anchorReal;

            realNow += SECOND;
            Clock.resume();

            expect(Clock.selfState.anchorReal).toBe(anchor);
        });
    });

    describe("subscribe", () => {
        test("notifies on clock changes and stops after unsubscribe", async () => {
            const listener = mock(() => {});
            const unsubscribe = Clock.subscribe(listener);

            Clock.advance(MINUTE);
            await flush();

            expect(listener).toHaveBeenCalled();

            unsubscribe();
            const callsAfterUnsubscribe = listener.mock.calls.length;

            Clock.advance(MINUTE);
            await flush();

            expect(listener.mock.calls.length).toBe(callsAfterUnsubscribe);
        });
    });

    describe("persistence", () => {
        test("saves the resolved game time", () => {
            Clock.init({ startAt: 0 });
            Clock.advance(2 * HOUR);

            Clock.save();

            const [saved] = Storage.getValue<{ anchorGame: number }>(
                CLOCK_STORAGE_PATH
            );
            expect(saved?.anchorGame).toBe(2 * HOUR);
        });

        test("does not persist the wall-clock anchor", () => {
            Clock.init({ startAt: HOUR, mode: "realtime", scale: 5 });

            Clock.save();

            const [saved] =
                Storage.getValue<Record<string, unknown>>(CLOCK_STORAGE_PATH);
            expect(saved).toEqual({
                anchorGame: HOUR,
                mode: "realtime",
                scale: 5,
                paused: false,
            });
            expect(saved).not.toHaveProperty("anchorReal");
        });

        test("produces an identical snapshot while nothing changes", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            Clock.save();
            const first = structuredClone(
                Storage.getValue<object>(CLOCK_STORAGE_PATH)[0]
            );

            // Wall-clock time moves, but nothing about the clock's configuration
            // has changed, so the saved shape must not churn.
            realNow += 5 * SECOND;
            Clock.set(0);
            Clock.save();

            expect(Storage.getValue<object>(CLOCK_STORAGE_PATH)[0]).toEqual(
                first
            );
        });

        test("still loads a save that predates dropping the anchor", () => {
            Storage.setValue(
                CLOCK_STORAGE_PATH,
                {
                    anchorGame: 3 * HOUR,
                    anchorReal: 1_700_000_000_000,
                    mode: "manual",
                    scale: 1,
                    paused: false,
                },
                true
            );

            Clock.load();

            expect(Clock.now()).toBe(3 * HOUR);
            expect(Clock.mode).toBe("manual");
        });

        test("restores game time and configuration", () => {
            Clock._setNowProvider(() => 0);
            Clock.init({ startAt: 0, mode: "realtime", scale: 30 });
            Clock.advance(DAY);
            Clock.save();

            Clock._resetForTesting();
            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);

            Clock._setNowProvider(() => 0);
            Clock.load();

            expect(Clock.now()).toBe(DAY);
            expect(Clock.mode).toBe("realtime");
            expect(Clock.scale).toBe(30);
        });

        test("keeps a paused clock paused across a round-trip", () => {
            Clock.init({ startAt: HOUR, mode: "realtime" });
            Clock.pause();
            Clock.save();
            Clock._resetForTesting();

            Clock.load();

            expect(Clock.isPaused).toBe(true);
            expect(Clock.now()).toBe(HOUR);
        });

        test("does not leak real time that passed while the save sat unused", () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });
            realNow += 10 * SECOND;
            Clock.save();

            // a week of wall-clock time passes before the save is loaded
            realNow += 7 * DAY;
            Clock.load();

            expect(Clock.now()).toBe(10 * SECOND);
        });

        test("leaves the clock alone when the save has no clock data", () => {
            Clock.init({ startAt: 42 });

            Clock.load();

            expect(Clock.now()).toBe(42);
        });
    });

    describe("Game integration", () => {
        afterEach(() => {
            Game._resetForTesting();
        });

        test("Game.init applies clock options", async () => {
            Clock._setNowProvider(() => 0);

            await Game.init({
                gameName: "Clock Game",
                isDevMode: true,
                clock: { startAt: 7_000, mode: "realtime", scale: 2 },
            });

            expect(Clock.now()).toBe(7_000);
            expect(Clock.mode).toBe("realtime");
            expect(Clock.scale).toBe(2);
        });

        test("Game.init defaults the clock when no options are given", async () => {
            await Game.init({ gameName: "Clock Game", isDevMode: true });

            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);
            expect(Clock.mode).toBe("manual");
            expect(Clock.scale).toBe(1);
        });

        test("survives a getState/setState round-trip", async () => {
            await Game.init({
                gameName: "Clock Game",
                isDevMode: true,
                clock: { startAt: 0 },
            });

            Clock.advance(3 * HOUR);
            const state = Game.getState();

            Clock.advance(10 * DAY);
            expect(Clock.now()).not.toBe(3 * HOUR);

            Game.setState(state);

            expect(Clock.now()).toBe(3 * HOUR);
        });

        test("Game._resetForTesting restores clock defaults", async () => {
            await Game.init({
                gameName: "Clock Game",
                isDevMode: true,
                clock: { startAt: 999 },
            });

            Game._resetForTesting();

            expect(Clock.now()).toBe(DEFAULT_CLOCK_START_AT);
        });
    });

    describe("resolveClockNow", () => {
        test("returns the anchor in manual mode", () => {
            expect(
                resolveClockNow({
                    anchorGame: 500,
                    anchorReal: 0,
                    mode: "manual",
                    scale: 10,
                    paused: false,
                })
            ).toBe(500);
        });

        test("returns the anchor when paused", () => {
            expect(
                resolveClockNow({
                    anchorGame: 500,
                    anchorReal: 0,
                    mode: "realtime",
                    scale: 10,
                    paused: true,
                })
            ).toBe(500);
        });
    });

    describe("useGameTime", () => {
        test("returns the current game time", () => {
            Clock.init({ startAt: 1_000 });

            const { result } = renderHook(() => useGameTime());

            expect(result.current).toBe(1_000);
        });

        test("re-renders when the clock advances", async () => {
            Clock.init({ startAt: 0 });

            const { result } = renderHook(() => useGameTime());

            act(() => {
                Clock.advance(MINUTE);
            });

            await waitFor(() => {
                expect(result.current).toBe(MINUTE);
            });
        });

        test("re-renders on an interval when tickMs is provided", async () => {
            let realNow = 0;
            Clock._setNowProvider(() => realNow);
            Clock.init({ startAt: 0, mode: "realtime" });

            const { result, unmount } = renderHook(() => useGameTime(5));

            expect(result.current).toBe(0);

            realNow += 10 * SECOND;

            await waitFor(() => {
                expect(result.current).toBe(10 * SECOND);
            });

            unmount();
        });
    });
});
