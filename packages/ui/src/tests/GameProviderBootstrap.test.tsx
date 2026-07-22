import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { Game, type PreloadResult } from "@react-text-game/core";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, StrictMode } from "react";

import { GameProvider } from "#components/GameProvider";
import type { LoadingScreenProps } from "#components/LoadingScreen";

beforeEach(() => Game._resetForTesting());
afterEach(() => {
    cleanup();
    mock.restore();
});

describe("GameProvider bootstrap", () => {
    test("shows loading, then splash, then the game", async () => {
        let release = () => {};
        const preloadTask = {
            id: "world",
            load: () =>
                new Promise<void>((resolve) => {
                    release = resolve;
                }),
        };
        const onPreloadComplete = mock((_result: PreloadResult) => {});
        render(
            createElement(
                GameProvider,
                {
                    onPreloadComplete,
                    options: { gameName: "bootstrap" },
                    preload: [preloadTask],
                },
                createElement("div", null, "Game ready")
            )
        );

        expect(
            document.querySelector("[data-rtg-loading-screen]")
        ).toBeTruthy();
        expect(screen.queryByText("Game ready")).toBeNull();
        release();
        await waitFor(() =>
            expect(
                document.querySelector(
                    '[data-rtg-splash-screen="react-text-game"]'
                )
            ).toBeTruthy()
        );
        expect(onPreloadComplete).toHaveBeenCalledWith({
            completed: 1,
            failed: 0,
            failures: [],
            succeeded: 1,
            total: 1,
        });
        fireEvent.click(
            screen.getByRole("button", { name: "Skip splash screen" })
        );
        await waitFor(() =>
            expect(screen.getByText("Game ready")).toBeTruthy()
        );
    });

    test("allows a complete loading-screen replacement", async () => {
        let release = () => {};
        const CustomLoading = mock(({ progress }: LoadingScreenProps) =>
            createElement(
                "div",
                { "data-testid": "custom-loading" },
                `Assets: ${progress.total}`
            )
        );
        render(
            createElement(
                GameProvider,
                {
                    components: { LoadingScreen: CustomLoading },
                    loadingScreen: { text: "Custom options" },
                    options: { gameName: "custom-loader" },
                    preload: [
                        {
                            id: "custom",
                            load: () =>
                                new Promise<void>((resolve) => {
                                    release = resolve;
                                }),
                        },
                    ],
                    showSplashScreen: false,
                },
                createElement("div", null, "Loaded")
            )
        );

        expect(screen.getByTestId("custom-loading").textContent).toBe(
            "Assets: 1"
        );
        expect(CustomLoading.mock.calls[0]?.[0].options).toEqual({
            text: "Custom options",
        });
        release();
        await waitFor(() => expect(screen.getByText("Loaded")).toBeTruthy());
    });

    test("continues after preload failures and reports them", async () => {
        const warning = mock(() => {});
        const originalWarn = console.warn;
        console.warn = warning;
        const onPreloadComplete = mock((_result: PreloadResult) => {});

        render(
            createElement(
                GameProvider,
                {
                    onPreloadComplete,
                    options: { gameName: "failed-preload" },
                    preload: [
                        {
                            id: "broken",
                            load: async () => {
                                throw new Error("broken asset");
                            },
                        },
                    ],
                    showSplashScreen: false,
                },
                createElement("div", null, "Failure tolerated")
            )
        );

        await waitFor(() =>
            expect(screen.getByText("Failure tolerated")).toBeTruthy()
        );
        expect(onPreloadComplete.mock.calls[0]?.[0]).toMatchObject({
            completed: 1,
            failed: 1,
            succeeded: 0,
        });
        expect(warning).toHaveBeenCalledWith(
            "[react-text-game] 1 preload asset(s) failed",
            expect.any(Array)
        );
        console.warn = originalWarn;
    });

    test("skips splash screens in dev by default", async () => {
        render(
            createElement(
                GameProvider,
                { options: { gameName: "dev", isDevMode: true } },
                createElement("div", null, "Dev ready")
            )
        );

        await waitFor(() => expect(screen.getByText("Dev ready")).toBeTruthy());
        expect(document.querySelector("[data-rtg-splash-screen]")).toBeNull();
    });

    test("can enable dev splash and replace the RTG splash component", async () => {
        const CustomRTG = () => createElement("div", null, "Custom RTG brand");
        render(
            createElement(
                GameProvider,
                {
                    components: { RTGSplashScreen: CustomRTG },
                    options: { gameName: "dev-splash", isDevMode: true },
                    showSplashScreenOnDev: true,
                },
                createElement("div", null, "After brand")
            )
        );

        await waitFor(() =>
            expect(screen.getByText("Custom RTG brand")).toBeTruthy()
        );
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() =>
            expect(screen.getByText("After brand")).toBeTruthy()
        );
    });

    test("supports custom-only ordered splash screens and interruptibility", async () => {
        const user = userEvent.setup();
        render(
            createElement(
                GameProvider,
                {
                    options: { gameName: "custom-splashes" },
                    showRTGSplashScreen: false,
                    splashScreens: [
                        {
                            content: createElement("div", null, "Publisher"),
                            duration: 10,
                            isInterruptible: false,
                        },
                        {
                            content: createElement("div", null, "Studio"),
                            duration: 10_000,
                        },
                    ],
                },
                createElement("div", null, "Custom sequence complete")
            )
        );

        await waitFor(() => expect(screen.getByText("Publisher")).toBeTruthy());
        await waitFor(() => expect(screen.getByText("Studio")).toBeTruthy());
        await user.click(screen.getByRole("button"));
        await waitFor(() =>
            expect(screen.getByText("Custom sequence complete")).toBeTruthy()
        );
    });

    test("skips the phase when splash is disabled or the sequence is empty", async () => {
        render(
            createElement(
                GameProvider,
                {
                    options: { gameName: "disabled" },
                    showSplashScreen: false,
                },
                createElement("div", null, "Disabled ready")
            )
        );
        await waitFor(() =>
            expect(screen.getByText("Disabled ready")).toBeTruthy()
        );

        cleanup();
        Game._resetForTesting();
        render(
            createElement(
                GameProvider,
                {
                    options: { gameName: "empty" },
                    showRTGSplashScreen: false,
                },
                createElement("div", null, "Empty ready")
            )
        );
        await waitFor(() =>
            expect(screen.getByText("Empty ready")).toBeTruthy()
        );
    });

    test("does not duplicate initialization or preloading in Strict Mode", async () => {
        const originalInit = Game.init.bind(Game);
        const init = mock(originalInit);
        Game.init = init;
        const load = mock(async () => {});

        render(
            createElement(
                StrictMode,
                null,
                createElement(
                    GameProvider,
                    {
                        options: { gameName: "strict" },
                        preload: [{ id: "strict-asset", load }],
                        showSplashScreen: false,
                    },
                    createElement("div", null, "Strict ready")
                )
            )
        );

        await waitFor(() =>
            expect(screen.getByText("Strict ready")).toBeTruthy()
        );
        expect(init).toHaveBeenCalledTimes(1);
        expect(load).toHaveBeenCalledTimes(1);
        Game.init = originalInit;
    });

    test("aborts preloading when the provider unmounts", async () => {
        let receivedSignal: AbortSignal | undefined;
        const { unmount } = render(
            createElement(GameProvider, {
                options: { gameName: "abort" },
                preload: [
                    {
                        id: "slow",
                        load: (signal) => {
                            receivedSignal = signal;
                            return new Promise(() => {});
                        },
                    },
                ],
            })
        );

        unmount();
        await waitFor(() => expect(receivedSignal?.aborted).toBe(true));
    });
});
