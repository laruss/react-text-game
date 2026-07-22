import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from "bun:test";
import { Game, Passage } from "@react-text-game/core";
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";

import { CopyButton } from "#components/DevModeDrawer/CopyButton";
import { CurrentPassageData } from "#components/DevModeDrawer/CurrentPassageData";
import { DevModeDrawer } from "#components/DevModeDrawer/DevModeDrawer";
import { GameData } from "#components/DevModeDrawer/GameData";
import { JumpToPassage } from "#components/DevModeDrawer/JumpToPassage";
import { RefreshButton } from "#components/DevModeDrawer/RefreshButton";

beforeAll(async () => {
    Game._resetForTesting();
    await Game.init({
        gameName: "Developer tools tests",
        gameId: "developer-tools-tests",
        isDevMode: true,
    });
    new Passage("developer-passage", "story");
    Game.jumpTo("developer-passage");
});

afterEach(() => {
    cleanup();
    localStorage.clear();
    mock.restore();
});

afterAll(() => {
    Game._resetForTesting();
});

describe("developer drawer controls", () => {
    test("refreshes and jumps to a requested passage", async () => {
        const user = userEvent.setup();
        const refresh = mock(() => {});
        const jumpTo = spyOn(Game, "jumpTo").mockImplementation(() => {});

        const { unmount } = render(
            createElement(RefreshButton, { onClick: refresh })
        );
        await user.click(screen.getByRole("button"));
        expect(refresh).toHaveBeenCalledTimes(1);
        unmount();

        render(createElement(JumpToPassage));
        const input = screen.getByLabelText("Jump to passage ID:");
        const go = screen.getByRole("button", { name: "Go" });
        expect(go.hasAttribute("disabled")).toBe(true);

        fireEvent.submit(go.closest("form") as HTMLFormElement);
        expect(jumpTo).not.toHaveBeenCalled();

        await user.type(input, "next-passage");
        expect(go.hasAttribute("disabled")).toBe(false);
        await user.click(go);
        expect(jumpTo).toHaveBeenCalledWith("next-passage");
        expect((input as HTMLInputElement).value).toBe("");
    });

    test("copies data, reports clipboard failures, and clears its status", async () => {
        const user = userEvent.setup();
        const writeText = spyOn(
            navigator.clipboard,
            "writeText"
        ).mockResolvedValue();

        const { unmount } = render(
            createElement(CopyButton, { textToCopy: "serialized state" })
        );
        await user.click(screen.getByRole("button"));
        expect(writeText).toHaveBeenCalledWith("serialized state");
        expect(screen.getByText("copied")).toBeTruthy();
        await act(() => new Promise((resolve) => setTimeout(resolve, 1050)));
        expect(screen.queryByText("copied")).toBeNull();
        unmount();

        const error = spyOn(console, "error").mockImplementation(() => {});
        writeText.mockRejectedValue(new Error("clipboard denied"));
        render(createElement(CopyButton, { textToCopy: "not copied" }));
        await user.click(screen.getByRole("button"));
        await waitFor(() =>
            expect(error).toHaveBeenCalledWith(
                "Failed to copy:",
                expect.any(Error)
            )
        );
    });

    test("shows and refreshes serialized game and current-passage data", async () => {
        const user = userEvent.setup();
        const getState = spyOn(Game, "getState").mockReturnValue({
            currentPassageId: "developer-passage",
            score: 3,
        } as ReturnType<typeof Game.getState>);

        const game = render(createElement(GameData, { isOpen: false }));
        expect(
            (screen.getByLabelText("Current state") as HTMLTextAreaElement)
                .value
        ).toBe("");
        game.rerender(createElement(GameData, { isOpen: true }));
        expect(screen.getByText("refreshed")).toBeTruthy();
        expect(
            (screen.getByLabelText("Current state") as HTMLTextAreaElement)
                .value
        ).toContain('"score": 3');
        const gameButtons = game.container.querySelectorAll("button");
        await user.click(gameButtons.item(0));
        expect(getState).toHaveBeenCalledTimes(2);
        await act(() => new Promise((resolve) => setTimeout(resolve, 550)));
        expect(screen.queryByText("refreshed")).toBeNull();
        game.unmount();

        const passage = render(
            createElement(CurrentPassageData, { isOpen: false })
        );
        expect(
            (
                screen.getByLabelText(
                    "Current Passage data"
                ) as HTMLTextAreaElement
            ).value
        ).toBe("");
        passage.rerender(createElement(CurrentPassageData, { isOpen: true }));
        expect(
            (
                screen.getByLabelText(
                    "Current Passage data"
                ) as HTMLTextAreaElement
            ).value
        ).toContain('"id": "developer-passage"');
        const passageButtons = passage.container.querySelectorAll("button");
        await user.click(passageButtons.item(0));
        await act(() => new Promise((resolve) => setTimeout(resolve, 550)));
        expect(screen.queryByText("refreshed")).toBeNull();
    });
});

describe("DevModeDrawer", () => {
    test("does not render outside development mode", () => {
        const { container } = render(
            createElement(DevModeDrawer, {
                options: { gameName: "Production", isDevMode: false },
            })
        );
        expect(container.innerHTML).toBe("");
    });

    test("opens, exposes the current passage, and disables persisted autosave", async () => {
        const user = userEvent.setup();
        localStorage.setItem("saveStateOnReload", "false");
        const disableAutoSave = spyOn(
            Game,
            "disableAutoSave"
        ).mockImplementation(() => {});
        const clearAutoSave = spyOn(Game, "clearAutoSave").mockImplementation(
            () => {}
        );

        const { container } = render(
            createElement(DevModeDrawer, {
                options: { gameName: "Development", isDevMode: true },
            })
        );
        await waitFor(() => {
            expect(disableAutoSave).toHaveBeenCalledTimes(1);
            expect(clearAutoSave).toHaveBeenCalledTimes(1);
        });

        await user.click(
            container.querySelector("button") as HTMLButtonElement
        );
        expect(screen.getByText("Dev Mode")).toBeTruthy();
        expect(
            (screen.getByLabelText("Current passage ID") as HTMLInputElement)
                .value
        ).toBe("developer-passage");

        const saveState = screen.getByLabelText("Save state on reload");
        expect((saveState as HTMLInputElement).checked).toBe(false);
        await user.click(saveState);
        expect(localStorage.getItem("saveStateOnReload")).toBe("true");

        await user.click(
            container.querySelector("button") as HTMLButtonElement
        );
        expect(screen.queryByText("Dev Mode")).toBeNull();
    });
});
