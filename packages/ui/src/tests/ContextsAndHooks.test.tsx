import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from "bun:test";
import { Game, SYSTEM_PASSAGE_NAMES } from "@react-text-game/core";
import { createOrUpdateSystemSave, db } from "@react-text-game/core/saves";
import {
    act,
    cleanup,
    render,
    renderHook,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type PropsWithChildren } from "react";

import { ReloadButton } from "#components/ReloadButton";
import { SaveButton } from "#components/SaveButton";
import { ComponentsProvider } from "#context/ComponentsContext/ComponentsProvider";
import { useComponents } from "#context/ComponentsContext/useComponents";
import { ConversationClickProvider } from "#context/ConversationClickContext/ConversationClickProvider";
import { useConversationClickContext } from "#context/ConversationClickContext/useConversationClickContext";
import { SaveLoadMenuProvider } from "#context/SaveLoadMenuContext/SaveLoadMenuProvider";
import { useSaveLoadMenu } from "#context/SaveLoadMenuContext/useSaveLoadMenu";
import { useLocalStorage } from "#hooks/useLocalStorage";

beforeEach(() => {
    window.localStorage.clear();
});

afterEach(() => {
    cleanup();
    mock.restore();
});

describe("SaveLoadMenu context and buttons", () => {
    const wrapper = ({ children }: PropsWithChildren) =>
        createElement(SaveLoadMenuProvider, null, children);

    test("opens every menu mode and closes it", () => {
        const { result } = renderHook(() => useSaveLoadMenu(), { wrapper });

        expect(result.current.isOpen).toBe(false);
        expect(result.current.mode).toBe("saveLoad");

        act(() => result.current.openSaveMenu());
        expect(result.current.isOpen).toBe(true);
        expect(result.current.mode).toBe("save");

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);

        act(() => result.current.openLoadMenu());
        expect(result.current.mode).toBe("load");
        expect(result.current.isOpen).toBe(true);

        act(() => result.current.openSaveLoadMenu());
        expect(result.current.mode).toBe("saveLoad");
    });

    test("throws when the menu hook is used without its provider", () => {
        expect(() => renderHook(() => useSaveLoadMenu())).toThrow(
            "useSaveLoadMenu must be used within SaveLoadMenuProvider"
        );
    });

    test("SaveButton opens save and combined menus and supports icon-only mode", async () => {
        const user = userEvent.setup();
        const Probe = () => {
            const menu = useSaveLoadMenu();
            return createElement(
                "div",
                null,
                createElement(
                    "output",
                    { "data-testid": "menu-state" },
                    `${menu.mode}:${menu.isOpen}`
                ),
                createElement(SaveButton, { mode: "save" as never }),
                createElement(SaveButton, {
                    isIconOnly: true,
                    "aria-label": "Combined saves",
                })
            );
        };

        render(createElement(SaveLoadMenuProvider, null, createElement(Probe)));
        await user.click(screen.getByRole("button", { name: "Save Game" }));
        expect(screen.getByTestId("menu-state").textContent).toBe("save:true");

        await user.click(
            screen.getByRole("button", { name: "Combined saves" })
        );
        expect(screen.getByTestId("menu-state").textContent).toBe(
            "saveLoad:true"
        );
        expect(screen.getAllByText("Save Game")).toHaveLength(1);
    });

    test("ReloadButton renders both labels and dispatches its restart callback", async () => {
        const user = userEvent.setup();
        await db.saves.clear();
        const initialState = { currentPassageId: "initial-passage" };
        await createOrUpdateSystemSave(initialState);
        const clearAutoSave = spyOn(Game, "clearAutoSave").mockImplementation(
            () => {}
        );
        const setState = spyOn(Game, "setState").mockImplementation(() => {});
        const jumpTo = spyOn(Game, "jumpTo").mockImplementation(() => {});
        const { rerender } = render(createElement(ReloadButton));

        const restart = screen.getByRole("button", { name: "Restart Game" });
        await user.click(restart);
        await waitFor(() => {
            expect(clearAutoSave).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledWith(initialState);
            expect(jumpTo).toHaveBeenCalledWith(
                SYSTEM_PASSAGE_NAMES.START_MENU
            );
        });
        expect(restart.querySelector("svg")).toBeTruthy();

        rerender(
            createElement(ReloadButton, {
                isIconOnly: true,
                "aria-label": "Restart",
            })
        );
        expect(screen.getByRole("button", { name: "Restart" })).toBeTruthy();
        expect(screen.queryByText("Restart Game")).toBeNull();
    });
});

describe("component registry context", () => {
    test("fills defaults while preserving custom components", () => {
        const CustomMenu = () => createElement("div", null, "Custom menu");
        const CustomText = () => createElement("div", null, "Custom text");
        const wrapper = ({ children }: PropsWithChildren) =>
            createElement(
                ComponentsProvider,
                {
                    components: {
                        MainMenu: CustomMenu,
                        story: { Text: CustomText },
                    },
                },
                children
            );

        const { result } = renderHook(() => useComponents(), { wrapper });

        expect(result.current.MainMenu).toBe(CustomMenu);
        expect(result.current.story.Text).toBe(CustomText);
        expect(result.current.story.Image).toBeFunction();
        expect(result.current.story.Video).toBeFunction();
        expect(result.current.story.Actions).toBeFunction();
        expect(result.current.story.Conversation).toBeFunction();
        expect(result.current.story.Heading).toBeFunction();
    });

    test("throws when component registry is missing", () => {
        expect(() => renderHook(() => useComponents())).toThrow(
            "useComponents must be used within ComponentsProvider"
        );
    });
});

describe("conversation click context", () => {
    const wrapper = ({ children }: PropsWithChildren) =>
        createElement(ConversationClickProvider, null, children);

    test("registers, notifies, replaces, and unregisters callbacks", () => {
        const first = mock(() => {});
        const replacement = mock(() => {});
        const second = mock(() => {});
        const { result } = renderHook(() => useConversationClickContext(), {
            wrapper,
        });

        act(() => {
            result.current.registerConversation("first", first);
            result.current.registerConversation("second", second);
            result.current.notifyClick();
        });
        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);

        act(() => {
            result.current.registerConversation("first", replacement);
            result.current.unregisterConversation("second");
            result.current.notifyClick();
        });
        expect(first).toHaveBeenCalledTimes(1);
        expect(replacement).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);
    });

    test("throws when conversation click context is missing", () => {
        expect(() => renderHook(() => useConversationClickContext())).toThrow(
            "useConversationClickContext must be used within ConversationClickProvider"
        );
    });
});

describe("useLocalStorage", () => {
    test("reads persisted data and supports values and updater functions", () => {
        window.localStorage.setItem("score", JSON.stringify(3));
        const { result } = renderHook(() => useLocalStorage("score", 0));

        expect(result.current[0]).toBe(3);
        act(() => result.current[1](7));
        expect(result.current[0]).toBe(7);
        expect(window.localStorage.getItem("score")).toBe("7");

        act(() => result.current[1]((previous) => previous + 2));
        expect(result.current[0]).toBe(9);
        expect(window.localStorage.getItem("score")).toBe("9");
    });

    test("synchronizes matching storage events and ignores unrelated events", () => {
        const { result } = renderHook(() => useLocalStorage("theme", "light"));

        act(() => {
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: "other",
                    newValue: JSON.stringify("ignored"),
                })
            );
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: "theme",
                    newValue: JSON.stringify("dark"),
                })
            );
        });

        expect(result.current[0]).toBe("dark");
    });

    test("falls back and logs malformed persisted and event values", () => {
        const error = spyOn(console, "error").mockImplementation(() => {});
        window.localStorage.setItem("broken", "not-json");
        const { result } = renderHook(() =>
            useLocalStorage("broken", "fallback")
        );
        expect(result.current[0]).toBe("fallback");

        act(() => {
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: "broken",
                    newValue: "still-not-json",
                })
            );
        });
        expect(error).toHaveBeenCalledTimes(2);
    });

    test("keeps state unchanged when a value cannot be serialized", () => {
        const error = spyOn(console, "error").mockImplementation(() => {});
        const { result } = renderHook(() =>
            useLocalStorage<object>("circular", {})
        );
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        act(() => result.current[1](circular));

        expect(result.current[0]).toBe(circular);
        expect(window.localStorage.getItem("circular")).toBeNull();
        expect(error).toHaveBeenCalledTimes(1);
    });
});
