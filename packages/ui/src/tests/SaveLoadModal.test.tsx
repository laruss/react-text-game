import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    mock,
    test,
} from "bun:test";
import { Game } from "@react-text-game/core";
import { initI18n } from "@react-text-game/core/i18n";
import type { GameSave } from "@react-text-game/core/saves";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";

import { SaveLoadModal } from "#components/SaveLoadModal/SaveLoadModal";
import { SaveSlot } from "#components/SaveLoadModal/SaveSlot";
import { uiTranslations } from "#i18n";

type Slot = Parameters<typeof SaveSlot>[0]["slot"];

const createSlot = (data: GameSave | null = null): Slot => ({
    data,
    save: mock(async () => undefined),
    load: mock(async () => undefined),
    delete: mock(async () => undefined),
});

beforeAll(async () => {
    Game._resetForTesting();
    await Game.init({
        gameName: "Save tests",
        gameId: "save-tests",
        gameVersion: "1.0.0",
        isDevMode: true,
    });
    await initI18n({
        defaultLanguage: "en",
        resources: uiTranslations,
    });
});

afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
});

afterAll(() => {
    Game._resetForTesting();
});

describe("SaveSlot", () => {
    test("renders save metadata and dispatches load, overwrite, and delete actions", async () => {
        const user = userEvent.setup();
        const onAction = mock(() => {});
        const slot = createSlot({
            id: 1,
            name: "2",
            gameData: { score: 42 },
            timestamp: new Date("2026-01-02T03:04:00Z"),
            version: "1.0.0",
            description: "At the castle gate",
            screenshot: "data:image/png;base64,save",
        });

        render(
            createElement(SaveSlot, {
                slot,
                index: 2,
                mode: "saveLoad",
                loading: null,
                onAction,
            })
        );

        expect(screen.getByText("Slot 3")).toBeTruthy();
        expect(screen.getByText("At the castle gate")).toBeTruthy();
        expect(screen.getByAltText("Save screenshot").getAttribute("src")).toBe(
            "data:image/png;base64,save"
        );

        await user.click(screen.getByRole("button", { name: "Load" }));
        await user.click(screen.getByRole("button", { name: "Overwrite" }));
        await user.click(screen.getByRole("button", { name: "Delete save" }));

        expect(onAction).toHaveBeenNthCalledWith(1, 2, slot.load);
        expect(onAction).toHaveBeenNthCalledWith(2, 2, slot.save);
        expect(onAction).toHaveBeenNthCalledWith(3, 2, slot.delete);
    });

    test("shows loading labels and disables every available action", () => {
        const slot = createSlot({
            name: "0",
            gameData: {},
            timestamp: new Date("2026-01-01T00:00:00Z"),
            version: "1.0.0",
            description: "undefined",
            screenshot: "undefined",
        });

        const { rerender } = render(
            createElement(SaveSlot, {
                slot,
                index: 0,
                mode: "load",
                loading: 0,
                onAction: mock(() => {}),
            })
        );

        expect(screen.getByText("Loading...")).toBeTruthy();
        expect(screen.queryByText("undefined")).toBeNull();
        expect(
            screen
                .getAllByRole("button")
                .every((button) => button.hasAttribute("disabled"))
        ).toBe(true);

        rerender(
            createElement(SaveSlot, {
                slot,
                index: 0,
                mode: "save",
                loading: 0,
                onAction: mock(() => {}),
            })
        );
        expect(screen.getByText("Saving...")).toBeTruthy();
    });

    test("renders empty slots according to the active mode", async () => {
        const user = userEvent.setup();
        const slot = createSlot();
        const onAction = mock(() => {});
        const { container, rerender } = render(
            createElement(SaveSlot, {
                slot,
                index: 0,
                mode: "save",
                loading: null,
                onAction,
            })
        );

        expect(screen.getByText("Empty Slot")).toBeTruthy();
        expect(screen.getByText("no data")).toBeTruthy();
        await user.click(screen.getByRole("button", { name: "Save Here" }));
        expect(onAction).toHaveBeenCalledWith(0, slot.save);

        rerender(
            createElement(SaveSlot, {
                slot,
                index: 0,
                mode: "load",
                loading: null,
                onAction,
            })
        );
        expect(screen.queryAllByRole("button")).toHaveLength(0);
        expect(container.firstElementChild?.className).toContain(
            "cursor-default"
        );
    });
});

describe("SaveLoadModal", () => {
    test("does not render while closed", () => {
        const { container } = render(
            createElement(SaveLoadModal, {
                isOpen: false,
                onClose: mock(() => {}),
            })
        );

        expect(container.innerHTML).toBe("");
        expect(document.body.style.overflow).toBe("");
    });

    test("renders all slots, locks body scrolling, and supports every close control", async () => {
        const user = userEvent.setup();
        const onClose = mock(() => {});
        const { container, unmount } = render(
            createElement(SaveLoadModal, {
                isOpen: true,
                onClose,
                mode: "save",
            })
        );

        expect(screen.getByRole("heading", { name: "Save Game" })).toBeTruthy();
        expect(screen.getAllByText("Empty Slot")).toHaveLength(9);
        expect(document.body.style.overflow).toBe("hidden");

        const closeButtons = screen.getAllByRole("button", { name: "Close" });
        const headerClose = closeButtons.at(0);
        const footerClose = closeButtons.at(1);
        if (!headerClose || !footerClose) {
            throw new Error("Modal close buttons were not rendered");
        }
        await user.click(footerClose);
        await user.click(headerClose);
        await user.click(
            container.querySelector(".bg-overlay\\/40") as HTMLElement
        );
        fireEvent.keyDown(document, { key: "Escape" });
        fireEvent.keyDown(document, { key: "Enter" });
        expect(onClose).toHaveBeenCalledTimes(4);

        unmount();
        expect(document.body.style.overflow).toBe("");
    });

    test("renders load and combined titles", () => {
        const onClose = mock(() => {});
        const { rerender } = render(
            createElement(SaveLoadModal, {
                isOpen: true,
                onClose,
                mode: "load",
            })
        );
        expect(screen.getByRole("heading", { name: "Load Game" })).toBeTruthy();

        rerender(
            createElement(SaveLoadModal, {
                isOpen: true,
                onClose,
                mode: "saveLoad",
            })
        );
        expect(
            screen.getByRole("heading", { name: "Save / Load Game" })
        ).toBeTruthy();
    });

    test("executes an empty-slot save and closes after success", async () => {
        const user = userEvent.setup();
        const onClose = mock(() => {});
        render(
            createElement(SaveLoadModal, {
                isOpen: true,
                onClose,
                mode: "save",
            })
        );

        const saveButton = screen
            .getAllByRole("button", { name: "Save Here" })
            .at(0);
        if (!saveButton) throw new Error("Save button was not rendered");
        await user.click(saveButton);
        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    test("reports an action that throws and keeps the modal open", async () => {
        const user = userEvent.setup();
        const onClose = mock(() => {});
        const originalGetState = Game.getState.bind(Game);
        const originalError = console.error;
        const originalAlert = globalThis.alert;
        const failure = new Error("state unavailable");
        const error = mock(() => {});
        const alert = mock(() => {});
        Game.getState = mock(() => {
            throw failure;
        });
        console.error = error;
        globalThis.alert = alert;

        render(
            createElement(SaveLoadModal, {
                isOpen: true,
                onClose,
                mode: "save",
            })
        );
        const saveButton = screen
            .getAllByRole("button", { name: "Save Here" })
            .at(0);
        if (!saveButton) throw new Error("Save button was not rendered");
        await user.click(saveButton);

        await waitFor(() => {
            expect(error).toHaveBeenCalledWith("Action failed:", failure);
            expect(alert).toHaveBeenCalledTimes(1);
        });
        expect(onClose).not.toHaveBeenCalled();

        Game.getState = originalGetState;
        console.error = originalError;
        globalThis.alert = originalAlert;
    });
});
