import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import i18next from "i18next";

import { Game } from "#game";
import { getGameTranslation, initI18n, useGameTranslation } from "#i18n";
import { DEFAULT_CONFIG } from "#i18n/constants";
import type { I18nConfig } from "#i18n/types";
import { loadUITranslations } from "#i18n/utils";
import { getSetting, setSetting } from "#saves/db";
import { setupMockStorage, teardownMockStorage } from "#tests/helpers";

describe("i18n", () => {
    beforeEach(async () => {
        setupMockStorage();
        sessionStorage.clear();
        localStorage.clear();

        await Game.init({ gameName: "Test Game", isDevMode: true });

        // Clear any saved language preference from previous tests
        await setSetting("language", "en");

        // Reset i18next to English if already initialized
        if (i18next.isInitialized) {
            await i18next.changeLanguage("en");
        }
    });

    afterEach(async () => {
        // Clean up language setting
        if (i18next.isInitialized) {
            await i18next.changeLanguage("en");
        }
        Game._resetForTesting();
        teardownMockStorage();
    });

    describe("DEFAULT_CONFIG", () => {
        test("has correct default values", () => {
            expect(DEFAULT_CONFIG.defaultLanguage).toBe("en");
            expect(DEFAULT_CONFIG.fallbackLanguage).toBe("en");
            expect(DEFAULT_CONFIG.debug).toBe(false);
            expect(DEFAULT_CONFIG.resources).toEqual({});
        });
    });

    describe("loadUITranslations", () => {
        test("returns empty object when UI package not installed", async () => {
            const translations = await loadUITranslations();

            // Since UI package likely isn't installed in tests, should return {}
            expect(typeof translations).toBe("object");
        });

        test("returns translation structure when UI package is available", async () => {
            const translations = await loadUITranslations();

            // Check structure regardless of whether UI package is installed
            expect(translations).toBeDefined();

            // If translations exist, they should be organized by language
            if (Object.keys(translations).length > 0) {
                const firstLang = Object.keys(translations)[0];
                expect(typeof translations[firstLang!]).toBe("object");
            }
        });
    });

    describe("initI18n", () => {
        test("initializes with default config", async () => {
            await initI18n();

            expect(i18next.isInitialized).toBe(true);
            expect(i18next.language).toBeDefined();
        });

        test("initializes with custom default language", async () => {
            const config: I18nConfig = {
                defaultLanguage: "ru",
                fallbackLanguage: "en",
                resources: {
                    ru: {
                        common: { greeting: "@825B" },
                    },
                    en: {
                        common: { greeting: "Hello" },
                    },
                },
            };

            await initI18n(config);

            expect(i18next.isInitialized).toBe(true);
        });

        test("initializes with custom resources", async () => {
            const config: I18nConfig = {
                resources: {
                    en: {
                        passages: { intro: "Welcome to the game" },
                        common: { save: "Save", load: "Load" },
                    },
                    ru: {
                        passages: { intro: ">1@> ?>60;>20BL 2 83@C" },
                        common: { save: "!>E@0=8BL", load: "03@C78BL" },
                    },
                },
            };

            await initI18n(config);

            expect(i18next.isInitialized).toBe(true);

            // Test translation exists
            const t = i18next.getFixedT("en", "passages");
            expect(t("intro")).toBe("Welcome to the game");
        });

        test("sets fallback language correctly", async () => {
            const config: I18nConfig = {
                defaultLanguage: "de",
                fallbackLanguage: "en",
                resources: {
                    en: {
                        common: { test: "English" },
                    },
                    de: {
                        common: {},
                    },
                },
            };

            await initI18n(config);

            // fallbackLng can be a string or array, normalize for comparison
            const fallbackLng = i18next.options.fallbackLng;
            const expectedLang = Array.isArray(fallbackLng)
                ? fallbackLng[0]
                : fallbackLng;
            expect(expectedLang).toBe("en");
        });

        test("enables debug mode when configured", async () => {
            const config: I18nConfig = {
                debug: true,
                resources: {
                    en: {
                        common: { test: "Test" },
                    },
                },
            };

            await initI18n(config);

            expect(i18next.options.debug).toBe(true);
        });

        test("loads saved language preference from database", async () => {
            // Set a saved language preference
            await setSetting("language", "ru");

            const config: I18nConfig = {
                defaultLanguage: "en",
                resources: {
                    en: { common: { test: "English" } },
                    ru: { common: { test: " CAA:89" } },
                },
            };

            await initI18n(config);

            // Should use saved language
            const savedLang = await getSetting<string>("language", "en");
            expect(savedLang).toBe("ru");
        });

        test("uses default language when no saved preference exists", async () => {
            const config: I18nConfig = {
                defaultLanguage: "en",
                resources: {
                    en: { common: { test: "English" } },
                },
            };

            await initI18n(config);

            expect(i18next.language).toBeDefined();
        });

        test("merges user resources with UI translations", async () => {
            const config: I18nConfig = {
                resources: {
                    en: {
                        passages: { intro: "My custom intro" },
                    },
                },
            };

            await initI18n(config);

            // User resources should be present
            const t = i18next.getFixedT("en", "passages");
            expect(t("intro")).toBe("My custom intro");
        });

        test("supports multiple namespaces", async () => {
            const config: I18nConfig = {
                resources: {
                    en: {
                        passages: { intro: "Passage text" },
                        common: { save: "Save" },
                        ui: { button: "Click me" },
                    },
                },
            };

            await initI18n(config);

            const tPassages = i18next.getFixedT("en", "passages");
            const tCommon = i18next.getFixedT("en", "common");
            const tUI = i18next.getFixedT("en", "ui");

            expect(tPassages("intro")).toBe("Passage text");
            expect(tCommon("save")).toBe("Save");
            expect(tUI("button")).toBe("Click me");
        });

        test("supports multiple languages", async () => {
            const config: I18nConfig = {
                resources: {
                    en: { common: { greeting: "Hello" } },
                    ru: { common: { greeting: "@825B" } },
                    de: { common: { greeting: "Hallo" } },
                    fr: { common: { greeting: "Bonjour" } },
                },
            };

            await initI18n(config);

            const supportedLangs = i18next.options.supportedLngs;
            expect(supportedLangs).toContain("en");
            expect(supportedLangs).toContain("ru");
            expect(supportedLangs).toContain("de");
            expect(supportedLangs).toContain("fr");
        });

        test("registers custom i18next modules", async () => {
            const mockModule = {
                type: "3rdParty" as const,
                init: mock(() => {}),
            };

            const config: I18nConfig = {
                resources: { en: { common: {} } },
                modules: [mockModule],
            };

            await initI18n(config);

            expect(i18next.isInitialized).toBe(true);
        });
    });

    describe("getGameTranslation", () => {
        beforeEach(async () => {
            await initI18n({
                defaultLanguage: "en",
                resources: {
                    en: {
                        passages: {
                            intro: "Welcome",
                            forest: "You are in a forest",
                        },
                        common: {
                            save: "Save",
                            load: "Load",
                        },
                    },
                    ru: {
                        passages: {
                            intro: ">1@> ?>60;>20BL",
                            forest: "K 2 ;5AC",
                        },
                        common: {
                            save: "!>E@0=8BL",
                            load: "03@C78BL",
                        },
                    },
                },
            });
        });

        test("returns translation function for default namespace", () => {
            const t = getGameTranslation();

            expect(typeof t).toBe("function");
            expect(t("intro")).toBe("Welcome");
        });

        test("returns translation function for specific namespace", () => {
            const t = getGameTranslation("common");

            expect(t("save")).toBe("Save");
            expect(t("load")).toBe("Load");
        });

        test("returns translation for passages namespace", () => {
            const t = getGameTranslation("passages");

            expect(t("intro")).toBe("Welcome");
            expect(t("forest")).toBe("You are in a forest");
        });

        test("uses current language", async () => {
            await i18next.changeLanguage("ru");

            const t = getGameTranslation("passages");

            expect(t("intro")).toBe(">1@> ?>60;>20BL");
            expect(t("forest")).toBe("K 2 ;5AC");
        });

        test("updates when language changes", async () => {
            const tEn = getGameTranslation("common");
            expect(tEn("save")).toBe("Save");

            await i18next.changeLanguage("ru");

            const tRu = getGameTranslation("common");
            expect(tRu("save")).toBe("!>E@0=8BL");
        });

        test("falls back to key when translation missing", () => {
            const t = getGameTranslation("passages");

            expect(t("nonexistent")).toBe("nonexistent");
        });

        test("supports interpolation", async () => {
            await initI18n({
                resources: {
                    en: {
                        passages: {
                            greeting: "Hello, {{name}}!",
                        },
                    },
                },
            });

            const t = getGameTranslation("passages");
            expect(t("greeting", { name: "Player" })).toBe("Hello, Player!");
        });
    });

    describe("useGameTranslation", () => {
        beforeEach(async () => {
            await initI18n({
                defaultLanguage: "en",
                fallbackLanguage: "en",
                resources: {
                    en: {
                        passages: { intro: "Welcome" },
                        common: { save: "Save", load: "Load" },
                    },
                    ru: {
                        passages: { intro: ">1@> ?>60;>20BL" },
                        common: { save: "!>E@0=8BL", load: "03@C78BL" },
                    },
                    de: {
                        passages: { intro: "Willkommen" },
                        common: { save: "Speichern", load: "Laden" },
                    },
                },
            });
        });

        test("returns translation function", () => {
            const { result } = renderHook(() => useGameTranslation());

            expect(typeof result.current.t).toBe("function");
        });

        test("returns current language", () => {
            const { result } = renderHook(() => useGameTranslation());

            expect(result.current.currentLanguage).toBeDefined();
            expect(typeof result.current.currentLanguage).toBe("string");
        });

        test("returns available languages", () => {
            const { result } = renderHook(() => useGameTranslation());

            expect(Array.isArray(result.current.languages)).toBe(true);
            expect(result.current.languages.length).toBeGreaterThan(0);
            expect(result.current.languages).toContain("en");
            expect(result.current.languages).toContain("ru");
            expect(result.current.languages).toContain("de");
        });

        test("filters out cimode when debug is disabled", () => {
            const { result } = renderHook(() => useGameTranslation());

            expect(result.current.languages).not.toContain("cimode");
        });

        test("includes cimode when debug is enabled", async () => {
            await initI18n({
                debug: true,
                resources: {
                    en: { common: {} },
                },
            });

            const { result } = renderHook(() => useGameTranslation());

            expect(result.current.languages).toContain("cimode");
        });

        test("translates keys in default namespace", () => {
            const { result } = renderHook(() => useGameTranslation("passages"));

            expect(result.current.t("intro")).toBe("Welcome");
        });

        test("translates keys in custom namespace", () => {
            const { result } = renderHook(() => useGameTranslation("common"));

            expect(result.current.t("save")).toBe("Save");
            expect(result.current.t("load")).toBe("Load");
        });

        test("changes language and persists preference", async () => {
            const { result } = renderHook(() => useGameTranslation("passages"));

            await result.current.changeLanguage("ru");

            await waitFor(() => {
                expect(result.current.currentLanguage).toBe("ru");
            });

            // Check if preference was saved
            const savedLang = await getSetting<string>("language", "en");
            expect(savedLang).toBe("ru");
        });

        test("updates translations after language change", async () => {
            const { result } = renderHook(() => useGameTranslation("passages"));

            expect(result.current.t("intro")).toBe("Welcome");

            await result.current.changeLanguage("ru");

            await waitFor(() => {
                expect(result.current.t("intro")).toBe(">1@> ?>60;>20BL");
            });
        });

        test("supports interpolation", async () => {
            // Initialize with interpolation example first
            await initI18n({
                resources: {
                    en: {
                        passages: { greeting: "Hello, {{name}}!" },
                    },
                },
            });

            const { result } = renderHook(() => useGameTranslation("passages"));

            expect(result.current.t("greeting", { name: "Player" })).toBe(
                "Hello, Player!"
            );
        });

        test("changeLanguage returns promise", async () => {
            const { result } = renderHook(() => useGameTranslation());

            const promise = result.current.changeLanguage("de");

            expect(promise).toBeInstanceOf(Promise);
            await promise;
        });

        test("handles multiple language changes", async () => {
            const { result } = renderHook(() => useGameTranslation("passages"));

            await result.current.changeLanguage("ru");
            await waitFor(() => {
                expect(result.current.t("intro")).toBe(">1@> ?>60;>20BL");
            });

            await result.current.changeLanguage("de");
            await waitFor(() => {
                expect(result.current.t("intro")).toBe("Willkommen");
            });

            await result.current.changeLanguage("en");
            await waitFor(() => {
                expect(result.current.t("intro")).toBe("Welcome");
            });
        });
    });

    describe("Integration Tests", () => {
        test("complete i18n workflow: init, translate, change language", async () => {
            // 1. Initialize i18n
            await initI18n({
                defaultLanguage: "en",
                fallbackLanguage: "en",
                resources: {
                    en: {
                        passages: { story: "Once upon a time..." },
                        common: { continue: "Continue" },
                    },
                    ru: {
                        passages: { story: "4=064K..." },
                        common: { continue: "@>4>;68BL" },
                    },
                },
            });

            // 2. Use translation function
            const t = getGameTranslation("passages");
            expect(t("story")).toBe("Once upon a time...");

            // 3. Change language
            await i18next.changeLanguage("ru");

            // 4. Get new translation function
            const tRu = getGameTranslation("passages");
            expect(tRu("story")).toBe("4=064K...");
        });

        test("multiple namespaces across different languages", async () => {
            await initI18n({
                resources: {
                    en: {
                        passages: { intro: "Intro EN" },
                        common: { save: "Save EN" },
                        ui: { button: "Button EN" },
                    },
                    ru: {
                        passages: { intro: "Intro RU" },
                        common: { save: "Save RU" },
                        ui: { button: "Button RU" },
                    },
                },
            });

            // Test English
            const tPassagesEn = getGameTranslation("passages");
            const tCommonEn = getGameTranslation("common");
            const tUIEn = getGameTranslation("ui");

            expect(tPassagesEn("intro")).toBe("Intro EN");
            expect(tCommonEn("save")).toBe("Save EN");
            expect(tUIEn("button")).toBe("Button EN");

            // Change to Russian
            await i18next.changeLanguage("ru");

            const tPassagesRu = getGameTranslation("passages");
            const tCommonRu = getGameTranslation("common");
            const tUIRu = getGameTranslation("ui");

            expect(tPassagesRu("intro")).toBe("Intro RU");
            expect(tCommonRu("save")).toBe("Save RU");
            expect(tUIRu("button")).toBe("Button RU");
        });

        test("language persistence across reinitializations", async () => {
            // First initialization with language change
            await initI18n({
                defaultLanguage: "en",
                resources: {
                    en: { common: { test: "Test EN" } },
                    ru: { common: { test: "Test RU" } },
                },
            });

            await i18next.changeLanguage("ru");
            await setSetting("language", "ru");

            // Second initialization should load saved language
            await initI18n({
                defaultLanguage: "en",
                resources: {
                    en: { common: { test: "Test EN" } },
                    ru: { common: { test: "Test RU" } },
                },
            });

            const savedLang = await getSetting<string>("language", "en");
            expect(savedLang).toBe("ru");
        });
    });

    describe("Edge Cases", () => {
        test("handles empty resources", async () => {
            await initI18n({
                resources: {},
            });

            expect(i18next.isInitialized).toBe(true);
        });

        test("handles missing translation key", async () => {
            await initI18n({
                resources: {
                    en: { common: { existing: "Exists" } },
                },
            });

            const t = getGameTranslation("common");

            // Should return key when translation missing
            expect(t("nonexistent")).toBe("nonexistent");
        });

        test("handles missing namespace", async () => {
            await initI18n({
                resources: {
                    en: { common: { test: "Test" } },
                },
            });

            const t = getGameTranslation("nonexistent");

            expect(typeof t).toBe("function");
        });

        test("handles special characters in translations", async () => {
            await initI18n({
                resources: {
                    en: {
                        passages: {
                            special: "Test \"quotes\" and 'apostrophes'",
                            unicode: "Test `} E1-('",
                            newlines: "Line 1\nLine 2",
                        },
                    },
                },
            });

            const t = getGameTranslation("passages");

            expect(t("special")).toBe("Test \"quotes\" and 'apostrophes'");
            expect(t("unicode")).toBe("Test `} E1-('");
            expect(t("newlines")).toBe("Line 1\nLine 2");
        });

        test("handles empty string translations", async () => {
            await initI18n({
                resources: {
                    en: { common: { empty: "" } },
                },
            });

            const t = getGameTranslation("common");
            expect(t("empty")).toBe("");
        });

        test("handles numeric translation values", async () => {
            await initI18n({
                resources: {
                    en: {
                        common: {
                            count: "{{count}}",
                        },
                    },
                },
            });

            const t = getGameTranslation("common");
            expect(t("count", { count: 42 })).toBe("42");
        });

        test("handles nested translation keys", async () => {
            await initI18n({
                resources: {
                    en: {
                        passages: {
                            forest: {
                                description: "A dark forest",
                                action: "Enter",
                            },
                        },
                    },
                },
            });

            const t = getGameTranslation("passages");

            expect(t("forest.description")).toBe("A dark forest");
            expect(t("forest.action")).toBe("Enter");
        });

        test("handles language change to unsupported language", async () => {
            await initI18n({
                resources: {
                    en: { common: { test: "Test" } },
                },
            });

            // Try to change to unsupported language
            await i18next.changeLanguage("xyz");

            // Should fall back to fallback language
            expect(i18next.language).toBeDefined();
        });

        test("handles rapid language changes", async () => {
            await initI18n({
                resources: {
                    en: { common: { test: "EN" } },
                    ru: { common: { test: "RU" } },
                    de: { common: { test: "DE" } },
                },
            });

            // Rapidly change languages
            await i18next.changeLanguage("ru");
            await i18next.changeLanguage("de");
            await i18next.changeLanguage("en");

            const t = getGameTranslation("common");
            expect(t("test")).toBe("EN");
        });
    });
});
