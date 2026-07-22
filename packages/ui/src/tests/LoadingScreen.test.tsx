import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";

import { LoadingScreen } from "#components/LoadingScreen";

const progress = {
    completed: 1,
    failed: 0,
    progress: 0.25,
    succeeded: 1,
    total: 4,
} as const;

afterEach(cleanup);

describe("LoadingScreen", () => {
    test("renders the accessible branded default", () => {
        render(createElement(LoadingScreen, { progress }));

        expect(screen.getByTitle("React Text Game")).toBeTruthy();
        expect(screen.getByRole("status").textContent).toBe("loading...");
        const progressbar = screen.getByRole("progressbar", {
            name: "loading...",
        });
        expect(progressbar.getAttribute("aria-valuemin")).toBe("0");
        expect(progressbar.getAttribute("aria-valuemax")).toBe("100");
        expect(progressbar.getAttribute("aria-valuenow")).toBe("25");
        expect(
            document.querySelector<HTMLElement>("[data-rtg-loading-progress]")
                ?.style.width
        ).toBe("25%");
    });

    test("supports background, classes and progress styles", () => {
        render(
            createElement(LoadingScreen, {
                progress: { ...progress, progress: 2 },
                options: {
                    backgroundImage: "/background.jpg",
                    className: "custom-loading",
                    logoClassName: "custom-logo",
                    progressBarClassName: "custom-bar",
                    progressBarStyle: { backgroundColor: "rgb(255, 0, 0)" },
                    progressTrackClassName: "custom-track",
                    progressTrackStyle: { height: "12px" },
                    style: { color: "rgb(0, 255, 0)" },
                    text: "Preparing world",
                    textClassName: "custom-text",
                },
            })
        );

        const container = document.querySelector<HTMLElement>(
            "[data-rtg-loading-screen]"
        );
        expect(container?.className).toContain("custom-loading");
        expect(container?.style.backgroundImage).toContain("background.jpg");
        expect(container?.style.color).toBe("rgb(0, 255, 0)");
        expect(
            screen
                .getByRole("img", { name: "React Text Game" })
                .getAttribute("class")
        ).toContain("custom-logo");
        expect(screen.getByRole("status").className).toContain("custom-text");
        expect(screen.getByRole("progressbar").className).toContain(
            "custom-track"
        );
        expect(screen.getByRole("progressbar").style.height).toBe("12px");
        const bar = document.querySelector<HTMLElement>(
            "[data-rtg-loading-progress]"
        );
        expect(bar?.className).toContain("custom-bar");
        expect(bar?.style.backgroundColor).toBe("rgb(255, 0, 0)");
        expect(bar?.style.width).toBe("100%");
    });

    test("cycles text arrays and animates each replacement", async () => {
        render(
            createElement(LoadingScreen, {
                progress,
                options: {
                    text: ["Loading maps", "Loading characters"],
                    textInterval: 5,
                },
            })
        );

        const first = screen.getByRole("status");
        expect(first.textContent).toBe("Loading maps");
        expect(first.className).toContain("rtg-loading-text");
        await waitFor(() => {
            expect(screen.getByRole("status").textContent).toBe(
                "Loading characters"
            );
        });
    });

    test("falls back to default text and clamps negative progress", () => {
        render(
            createElement(LoadingScreen, {
                progress: { ...progress, progress: -1 },
                options: { text: [] },
            })
        );

        expect(screen.getByRole("status").textContent).toBe("loading...");
        expect(
            screen.getByRole("progressbar").getAttribute("aria-valuenow")
        ).toBe("0");
    });
});
