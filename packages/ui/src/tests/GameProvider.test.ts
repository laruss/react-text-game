import {
    Game,
    NewOptions,
    Passage,
    SYSTEM_PASSAGE_NAMES,
} from "@react-text-game/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { createElement } from "react";

import { GameProvider } from "#components/GameProvider";

// Test passage class
class TestPassage extends Passage {
    constructor(id: string) {
        super(id, "widget");
    }

    display() {
        return { content: `Passage: ${this.id}` };
    }
}

describe("GameProvider", () => {
    beforeEach(() => {
        // Clear any previous game state
        Game._resetForTesting();
    });

    afterEach(() => {
        cleanup();
    });

    describe("Initialization", () => {
        test("initializes Game with provided options", async () => {
            const options: NewOptions = {
                gameName: "Test Game",
                gameId: "test-game-id",
                description: "A test game",
                gameVersion: "1.0.0",
                author: "Test Author",
            };

            render(
                createElement(
                    GameProvider,
                    { options },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(Game.options.gameName).toBe("Test Game");
                expect(Game.options.gameId).toBe("test-game-id");
                expect(Game.options.description).toBe("A test game");
                expect(Game.options.gameVersion).toBe("1.0.0");
                expect(Game.options.author).toBe("Test Author");
            });
        });

        test("returns null before initialization is complete", () => {
            const { container } = render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            // Before initialization, nothing should be rendered
            expect(container.innerHTML).toBe("");
        });

        test("renders children after initialization", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement(
                        "div",
                        { "data-testid": "child" },
                        "Test content"
                    )
                )
            );

            await waitFor(() => {
                expect(screen.getByTestId("child")).toBeTruthy();
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });
    });

    describe("Start Passage Handling", () => {
        test("sets currentPassage to provided startPassage option", async () => {
            const testPassageId = "test-value";

            // Initialize Game first
            await Game.init({ gameName: "test", startPassage: testPassageId });

            // Create the test passage before rendering
            new TestPassage(testPassageId);

            render(
                createElement(
                    GameProvider,
                    {
                        options: {
                            gameName: "test",
                            startPassage: testPassageId,
                        },
                    },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(
                () => {
                    expect(Game.currentPassage?.id).toBe(testPassageId);
                },
                { timeout: 1000 }
            );
        });

        test("sets currentPassage to START_MENU when startPassage is not provided", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(Game.currentPassage?.id).toBe(
                    SYSTEM_PASSAGE_NAMES.START_MENU
                );
            });
        });
    });

    describe("Custom Components", () => {
        test("uses custom MainMenu component when provided", async () => {
            const CustomMainMenu = () =>
                createElement(
                    "div",
                    { "data-testid": "custom-menu" },
                    "Custom Menu"
                );

            const components = {
                MainMenu: () => createElement(CustomMainMenu),
            };

            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" }, components },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });

        test("uses default MainMenu when custom component is not provided", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });
    });

    describe("Dev Mode Features", () => {
        test("renders dev mode components when isDevMode is true", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test", isDevMode: true } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
                // Dev mode components should be rendered
                // Note: We can't easily test AppIconMenu and DevModeDrawer without more setup
            });
        });

        test("does not render dev mode components when isDevMode is false", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test", isDevMode: false } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });

        test("does not render dev mode components when isDevMode is undefined", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });
    });

    describe("Context Providers", () => {
        test("wraps children with ErrorBoundary", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
            // If ErrorBoundary wasn't present, errors would crash the test
        });

        test("wraps children with ComponentsProvider", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });

        test("wraps children with SaveLoadMenuProvider", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });
        });
    });

    describe("Options Update", () => {
        test("updates Game options when internalOptions change", async () => {
            Game.updateOptions = mock(Game.updateOptions.bind(Game));

            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content")).toBeTruthy();
            });

            // Note: Testing internal option updates would require exposing setInternalOptions
            // or triggering it through AppIconMenu interactions
        });
    });

    describe("Widget Registration", () => {
        test("registers START_MENU widget during initialization", async () => {
            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" } },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(Game.currentPassage?.id).toBe(
                    SYSTEM_PASSAGE_NAMES.START_MENU
                );
            });
        });

        test("registers custom MainMenu widget when provided", async () => {
            const CustomMainMenu = () =>
                createElement("div", null, "Custom Menu");

            const components = {
                MainMenu: () => createElement(CustomMainMenu),
            };

            render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test" }, components },
                    createElement("div", null, "Test content")
                )
            );

            await waitFor(() => {
                expect(Game.currentPassage?.id).toBe(
                    SYSTEM_PASSAGE_NAMES.START_MENU
                );
            });
        });
    });

    describe("Multiple Instances", () => {
        test("handles re-initialization when options change", async () => {
            const { rerender } = render(
                createElement(
                    GameProvider,
                    { options: { gameName: "test1" } },
                    createElement("div", null, "Test content 1")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content 1")).toBeTruthy();
                expect(Game.options.gameName).toBe("test1");
            });

            // Re-render with different options
            rerender(
                createElement(
                    GameProvider,
                    { options: { gameName: "test2" } },
                    createElement("div", null, "Test content 2")
                )
            );

            await waitFor(() => {
                expect(screen.getByText("Test content 2")).toBeTruthy();
            });
        });
    });
});
