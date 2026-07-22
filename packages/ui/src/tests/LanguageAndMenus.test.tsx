import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from "bun:test";
import { Game } from "@react-text-game/core";
import { initI18n } from "@react-text-game/core/i18n";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18next from "i18next";
import { createElement } from "react";

import { AppIconMenu } from "#components/GameProvider/AppIconMenu";
import { LanguageToggle } from "#components/LanguageToggle";
import { MainMenu } from "#components/MainMenu";
import { SaveLoadMenuProvider } from "#context/SaveLoadMenuContext/SaveLoadMenuProvider";
import { useSaveLoadMenu } from "#context/SaveLoadMenuContext/useSaveLoadMenu";
import { uiTranslations } from "#i18n";

const resources = {
    ...uiTranslations,
    ru: {
        ui: {
            mainMenu: {
                title: "Главное меню",
                newGame: "Новая игра",
                continue: "Продолжить",
                loadGame: "Загрузить",
            },
        },
    },
};

const menuGameOptions = {
    gameName: "Example Adventure",
    gameId: "menu-tests",
    gameVersion: "2.5.0",
    author: "Test Author",
    startPassage: "custom-start",
    isDevMode: true,
} as const;

beforeAll(async () => {
    await initI18n({
        defaultLanguage: "en",
        resources,
    });
});

afterEach(() => {
    cleanup();
    mock.restore();
});

afterAll(() => {
    Game._resetForTesting();
});

describe("LanguageToggle", () => {
    test("stays hidden when only one language is available", async () => {
        await initI18n({ defaultLanguage: "en", resources: uiTranslations });
        await i18next.changeLanguage("en");

        const { container } = render(createElement(LanguageToggle));
        expect(container.innerHTML).toBe("");
    });

    test("shows custom names and codes, changes language, and closes the menu", async () => {
        const user = userEvent.setup();
        await initI18n({ defaultLanguage: "en", resources });
        await i18next.changeLanguage("en");

        const { container } = render(
            createElement(LanguageToggle, {
                namespace: "ui",
                className: "language-control",
                languageNames: { en: "English", ru: "Русский" },
                showCode: true,
            })
        );

        expect(container.firstElementChild?.className).toContain(
            "language-control"
        );
        const trigger = screen.getByRole("button", { name: "Select language" });
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        await user.hover(container.firstElementChild as HTMLElement);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("menu")).toBeTruthy();
        expect(screen.getAllByText("English (en)")).toHaveLength(2);
        const current = screen.getByRole("menuitem", { name: /English/ });
        expect(current.getAttribute("aria-current")).toBe("true");

        fireEvent.click(screen.getByRole("menuitem", { name: "Русский (ru)" }));
        await waitFor(() => {
            expect(i18next.language).toBe("ru");
            expect(screen.queryByRole("menu")).toBeNull();
        });
    });

    test("uses uppercase fallback names and closes on mouse leave", async () => {
        const user = userEvent.setup();
        await initI18n({ defaultLanguage: "en", resources });
        await i18next.changeLanguage("en");

        const { container } = render(createElement(LanguageToggle));
        await user.hover(container.firstElementChild as HTMLElement);
        expect(screen.getAllByText("EN").length).toBeGreaterThan(0);
        expect(screen.getByText("RU")).toBeTruthy();

        await user.unhover(container.firstElementChild as HTMLElement);
        expect(screen.queryByRole("menu")).toBeNull();
    });
});

describe("MainMenu", () => {
    beforeEach(async () => {
        Game._resetForTesting();
        await Game.init(menuGameOptions);
    });

    test("renders game metadata and performs new/load menu actions", async () => {
        const user = userEvent.setup();
        await initI18n({ defaultLanguage: "en", resources });
        await i18next.changeLanguage("en");
        const jumpTo = spyOn(Game, "jumpTo").mockImplementation(() => {});
        const MenuState = () => {
            const menu = useSaveLoadMenu();
            return createElement("output", null, `${menu.mode}:${menu.isOpen}`);
        };

        render(
            createElement(
                SaveLoadMenuProvider,
                null,
                createElement(MainMenu),
                createElement(MenuState)
            )
        );

        expect(screen.getByText("EXAMPLE ADVENTURE")).toBeTruthy();
        expect(screen.getByText("v2.5.0")).toBeTruthy();
        expect(screen.getByText("by Test Author")).toBeTruthy();

        await user.click(screen.getByRole("button", { name: "New Game" }));
        expect(jumpTo).toHaveBeenCalledWith("custom-start");

        const continueButton = screen.getByRole("button", { name: "Continue" });
        expect(continueButton.hasAttribute("disabled")).toBe(true);

        await user.click(screen.getByRole("button", { name: "Load Game" }));
        expect(screen.getByText("load:true")).toBeTruthy();
    });

    test("omits author metadata when no author is configured", () => {
        Game.updateOptions({ gameName: "No Author", author: "" });

        render(
            createElement(SaveLoadMenuProvider, null, createElement(MainMenu))
        );

        expect(screen.getByText("NO AUTHOR")).toBeTruthy();
        expect(screen.queryByText(/by Test Author/)).toBeNull();
    });
});

describe("AppIconMenu", () => {
    test("reveals its option on hover and toggles development mode", async () => {
        const user = userEvent.setup();
        const setOptions = mock(() => {});
        const options = { gameName: "Menu", isDevMode: false };
        const { container } = render(
            createElement(AppIconMenu, { options, setOptions })
        );

        const wrapper = container.firstElementChild as HTMLElement;
        const trigger = container.querySelector("button") as HTMLButtonElement;
        expect(screen.queryByText("Is dev mode")).toBeNull();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        await user.hover(trigger);
        expect(screen.getByText("Is dev mode")).toBeTruthy();
        expect(trigger.getAttribute("aria-expanded")).toBe("true");

        const checkbox = screen.getByRole("checkbox");
        fireEvent.mouseOut(trigger, { relatedTarget: checkbox });
        fireEvent.mouseOver(checkbox, { relatedTarget: trigger });
        expect(screen.getByText("Is dev mode")).toBeTruthy();
        fireEvent.click(checkbox);
        expect(setOptions).toHaveBeenCalledWith({
            gameName: "Menu",
            isDevMode: true,
        });

        await user.unhover(wrapper);
        expect(screen.queryByText("Is dev mode")).toBeNull();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("supports focus, keyboard navigation, blur, and click activation", async () => {
        const user = userEvent.setup();
        const setOptions = mock(() => {});
        render(
            createElement(
                "div",
                null,
                createElement(AppIconMenu, {
                    options: { gameName: "Menu", isDevMode: false },
                    setOptions,
                }),
                createElement("button", { type: "button" }, "Outside")
            )
        );

        const trigger = screen.getByRole("button", {
            name: "Open application settings",
        });
        await user.tab();
        expect(document.activeElement).toBe(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");

        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("checkbox"));
        expect(screen.getByText("Is dev mode")).toBeTruthy();

        await user.tab();
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: "Outside" })
        );
        expect(screen.queryByText("Is dev mode")).toBeNull();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByText("Is dev mode")).toBeTruthy();

        fireEvent.mouseLeave(trigger.parentElement as HTMLElement);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByText("Is dev mode")).toBeTruthy();
    });
});
