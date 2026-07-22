import { afterEach, describe, expect, mock, test } from "bun:test";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";

import {
    DEFAULT_SPLASH_SCREEN_DURATION,
    RTGSplashScreen,
    SplashScreenSequence,
} from "#components/SplashScreen";

afterEach(cleanup);

describe("splash screens", () => {
    test("renders the default React Text Game splash", () => {
        render(createElement(RTGSplashScreen));

        expect(screen.getByTitle("React Text Game")).toBeTruthy();
        expect(screen.getByText("Powered by React Text Game")).toBeTruthy();
    });

    test("shows screens in order and includes fade time in duration", async () => {
        const onComplete = mock(() => {});
        render(
            createElement(SplashScreenSequence, {
                onComplete,
                screens: [
                    {
                        id: "one",
                        content: createElement("div", null, "First studio"),
                        duration: 10,
                    },
                    {
                        id: "two",
                        content: createElement("div", null, "Second studio"),
                        duration: 10,
                    },
                ],
            })
        );

        const first = screen.getByText("First studio").parentElement;
        expect(first?.className).toContain("rtg-splash-screen");
        expect(first?.style.animationDuration).toBe("10ms");
        await waitFor(() =>
            expect(screen.getByText("Second studio")).toBeTruthy()
        );
        await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    });

    test("skips an interruptible screen immediately by click or keyboard", async () => {
        const user = userEvent.setup();
        const onComplete = mock(() => {});
        render(
            createElement(SplashScreenSequence, {
                onComplete,
                screens: [
                    {
                        content: createElement("div", null, "Interruptible"),
                        duration: 10_000,
                    },
                    {
                        content: createElement("div", null, "Keyboard skip"),
                        duration: 10_000,
                    },
                ],
            })
        );

        await user.click(
            screen.getByRole("button", { name: "Skip splash screen" })
        );
        expect(screen.queryByText("Interruptible")).toBeNull();
        expect(screen.getByText("Keyboard skip")).toBeTruthy();
        const second = screen.getByRole("button", {
            name: "Skip splash screen",
        });
        second.focus();
        await user.keyboard(" ");
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    test("does not skip a non-interruptible screen", async () => {
        const onComplete = mock(() => {});
        render(
            createElement(SplashScreenSequence, {
                onComplete,
                screens: [
                    {
                        content: createElement("div", null, "Required legal"),
                        duration: 15,
                        isInterruptible: false,
                    },
                ],
            })
        );

        const splash = screen.getByText("Required legal").parentElement;
        expect(splash?.getAttribute("role")).toBeNull();
        fireEvent.click(splash as HTMLElement);
        expect(onComplete).not.toHaveBeenCalled();
        await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    });

    test("uses the 1.5-second default and supports custom styling", () => {
        render(
            createElement(SplashScreenSequence, {
                onComplete: () => {},
                screens: [
                    {
                        className: "studio-splash",
                        content: "Studio",
                        style: { backgroundColor: "rgb(1, 2, 3)" },
                    },
                ],
            })
        );

        const splash = screen.getByText("Studio");
        expect(DEFAULT_SPLASH_SCREEN_DURATION).toBe(1_500);
        expect(splash.className).toContain("studio-splash");
        expect(splash.style.animationDuration).toBe(
            `${DEFAULT_SPLASH_SCREEN_DURATION}ms`
        );
        expect(splash.style.backgroundColor).toBe("rgb(1, 2, 3)");
    });

    test("completes empty and zero-duration sequences", async () => {
        const emptyComplete = mock(() => {});
        render(
            createElement(SplashScreenSequence, {
                onComplete: emptyComplete,
                screens: [],
            })
        );
        await waitFor(() => expect(emptyComplete).toHaveBeenCalledTimes(1));

        const zeroComplete = mock(() => {});
        cleanup();
        render(
            createElement(SplashScreenSequence, {
                onComplete: zeroComplete,
                screens: [{ content: "Instant", duration: -1 }],
            })
        );
        await waitFor(() => expect(zeroComplete).toHaveBeenCalledTimes(1));
    });
});
