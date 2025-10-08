import { Game } from "@react-text-game/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { createElement } from "react";

import { ErrorBoundary } from "#components/ErrorBoundary";

// Component that doesn't throw
const SafeComponent = () => createElement("div", null, "Safe content");

// Polyfill PromiseRejectionEvent for happy-dom
class PromiseRejectionEvent extends Event {
    reason: unknown;
    promise: Promise<unknown>;

    constructor(
        type: string,
        init: { reason: unknown; promise: Promise<unknown> }
    ) {
        super(type);
        this.reason = init.reason;
        this.promise = init.promise;
    }
}

describe("ErrorBoundary", () => {
    let consoleErrorSpy: ReturnType<typeof mock>;
    const originalError = console.error;

    beforeEach(() => {
        // init game
        Game.init({ gameName: "test" });
        // Suppress console.error during tests
        consoleErrorSpy = mock(() => {});
        console.error = consoleErrorSpy;
    });

    afterEach(() => {
        console.error = originalError;
        cleanup();
    });

    test("renders children when there is no error", () => {
        render(
            createElement(
                ErrorBoundary,
                null,
                createElement("div", null, "Test content")
            )
        );

        expect(screen.getByText("Test content")).toBeTruthy();
    });

    test("catches global errors from window.addEventListener", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        // Simulate a global error
        const errorEvent = new ErrorEvent("error", {
            error: new Error("Global error test"),
            message: "Global error test",
            filename: "test.js",
            lineno: 42,
            colno: 10,
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        expect(screen.getByText("Global error test")).toBeTruthy();
    });

    test("catches unhandled promise rejections", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        // Create a promise that we'll reject and handle
        const errorReason = new Error("Promise rejection test");
        const promise = new Promise((_, reject) => {
            setTimeout(() => reject(errorReason), 0);
        });

        // Catch the rejection to prevent it from failing the test
        promise.catch(() => {});

        // Simulate an unhandled promise rejection event
        const rejectionEvent = new PromiseRejectionEvent("unhandledrejection", {
            promise,
            reason: errorReason,
        });

        window.dispatchEvent(rejectionEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        expect(screen.getByText("Promise rejection test")).toBeTruthy();
    });

    test("handles non-Error promise rejections", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        // Create a promise that we'll reject with a string
        const promise = new Promise((_, reject) => {
            setTimeout(() => reject("String rejection"), 0);
        });

        // Catch the rejection to prevent it from failing the test
        promise.catch(() => {});

        const rejectionEvent = new PromiseRejectionEvent("unhandledrejection", {
            promise,
            reason: "String rejection",
        });

        window.dispatchEvent(rejectionEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        expect(screen.getByText("String rejection")).toBeTruthy();
    });

    test("removes event listeners on unmount", () => {
        const removeEventListenerSpy = mock(
            window.removeEventListener.bind(window)
        );
        window.removeEventListener = removeEventListenerSpy;

        const { unmount } = render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "error",
            expect.any(Function)
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "unhandledrejection",
            expect.any(Function)
        );
    });

    test("handles error events without error object", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        // Simulate error event with only message
        const errorEvent = new ErrorEvent("error", {
            message: "Message only error",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        expect(screen.getByText("Message only error")).toBeTruthy();
    });

    test("handles resource load errors", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        // Create a mock image element
        const img = document.createElement("img");
        img.id = "test-image";
        img.className = "test-class";

        const errorEvent = new ErrorEvent("error", {
            message: "",
        });

        // Set the target on the event
        Object.defineProperty(errorEvent, "target", {
            value: img,
            writable: false,
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        const errorText = screen.getAllByText(
            /Resource error or unhandled error/
        )[0]?.textContent;
        expect(errorText?.includes("IMG")).toBe(true);
    });

    test("prevents default on global error events", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const preventDefaultMock = mock(() => {});
        const errorEvent = new ErrorEvent("error", {
            error: new Error("Test"),
            message: "Test",
        });
        errorEvent.preventDefault = preventDefaultMock;

        window.dispatchEvent(errorEvent);

        expect(preventDefaultMock).toHaveBeenCalled();
    });

    test("prevents default on promise rejection events", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const preventDefaultMock = mock(() => {});
        const rejectionEvent = new PromiseRejectionEvent("unhandledrejection", {
            promise: Promise.resolve(),
            reason: new Error("Test"),
        });
        rejectionEvent.preventDefault = preventDefaultMock;

        window.dispatchEvent(rejectionEvent);

        expect(preventDefaultMock).toHaveBeenCalled();
    });

    test("calls onError callback for global errors", async () => {
        const onErrorCallback = mock(() => {});

        render(
            createElement(
                ErrorBoundary,
                { onError: onErrorCallback },
                createElement(SafeComponent)
            )
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Callback test"),
            message: "Callback test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(onErrorCallback).toHaveBeenCalled();
        });
    });

    test("displays default fallback UI for global errors", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("UI test error"),
            message: "UI test error",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
            expect(
                screen.getByText(
                    "Something went wrong while running the game. This error has been logged."
                )
            ).toBeTruthy();
            expect(screen.getByText("Try Again")).toBeTruthy();
        });
    });

    test("uses custom fallback for global errors", async () => {
        const customFallback = mock(() =>
            createElement("div", null, "Custom error UI")
        );

        render(
            createElement(
                ErrorBoundary,
                { fallback: customFallback },
                createElement(SafeComponent)
            )
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Custom fallback test"),
            message: "Custom fallback test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Custom error UI")).toBeTruthy();
        });

        expect(customFallback).toHaveBeenCalled();
    });

    test("reset clears error state", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Reset test"),
            message: "Reset test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        const resetButton = screen.getByText("Try Again");
        resetButton.click();

        await waitFor(() => {
            expect(screen.queryByText("Game Error")).toBeNull();
        });
    });

    test("error details can be expanded", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Details test"),
            message: "Details test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        const summary = screen.getByText("Error Details");
        expect(summary).toBeTruthy();

        summary.click();

        await waitFor(() => {
            const copyButton = screen.getByTitle("Copy error to clipboard");
            expect(copyButton).toBeTruthy();
        });
    });

    test("displays error message and stack trace", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const error = new Error("Stack trace test");
        const errorEvent = new ErrorEvent("error", {
            error,
            message: error.message,
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        // Click to expand details
        const summary = screen.getByText("Error Details");
        summary.click();

        await waitFor(() => {
            expect(screen.getByText("Stack trace test")).toBeTruthy();
        });
    });

    test("can copy error to clipboard", async () => {
        const writeTextMock = mock(() => Promise.resolve());
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: writeTextMock },
            writable: true,
            configurable: true,
        });

        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const error = new Error("Clipboard copy test");
        error.stack = "Error: Clipboard copy test\n  at test.ts:1:1";
        const errorEvent = new ErrorEvent("error", {
            error,
            message: error.message,
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        // Expand details
        const summary = screen.getByText("Error Details");
        summary.click();

        await waitFor(() => {
            const copyButton = screen.getByTitle("Copy error to clipboard");
            expect(copyButton).toBeTruthy();
        });

        // Click copy button
        const copyButton = screen.getByTitle("Copy error to clipboard");
        copyButton.click();

        await waitFor(() => {
            expect(writeTextMock).toHaveBeenCalled();
        });

        const calls = writeTextMock.mock.calls as unknown as Array<[string]>;
        const copiedText = calls[0]?.[0] || '';
        expect(copiedText.includes("Error: Clipboard copy test")).toBe(true);
        expect(copiedText.includes("Stack Trace:")).toBe(true);
        expect(copiedText.includes("Component Stack:")).toBe(true);
    });

    test("can be closed with close button", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Close test"),
            message: "Close test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        // Find and click the close button (×)
        const closeButton = screen.getByLabelText("Close error");
        closeButton.click();

        await waitFor(() => {
            expect(screen.queryByText("Game Error")).toBeNull();
        });
    });

    test("try again button can be clicked", async () => {
        render(
            createElement(ErrorBoundary, null, createElement(SafeComponent))
        );

        const errorEvent = new ErrorEvent("error", {
            error: new Error("Try again test"),
            message: "Try again test",
        });

        window.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText("Game Error")).toBeTruthy();
        });

        const tryAgainButton = screen.getByText("Try Again");
        expect(tryAgainButton).toBeTruthy();

        // Click the try again button
        tryAgainButton.click();

        await waitFor(() => {
            expect(screen.queryByText("Game Error")).toBeNull();
            expect(screen.getByText("Safe content")).toBeTruthy();
        });
    });
});
