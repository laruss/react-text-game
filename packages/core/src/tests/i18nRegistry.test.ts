import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import i18next from "i18next";

import { Game } from "#game";
import { initI18n, registerTranslations } from "#i18n";
import {
    _clearRegisteredTranslations,
    _getRegisteredTranslations,
} from "#i18n/registry";
import { setSetting } from "#saves/db";
import { setupMockStorage, teardownMockStorage } from "#tests/helpers";

describe("registerTranslations", () => {
    beforeEach(async () => {
        setupMockStorage();
        _clearRegisteredTranslations();

        await Game.init({ gameName: "Registry Test Game", isDevMode: true });
        await setSetting("language", "en");

        if (i18next.isInitialized) {
            await i18next.changeLanguage("en");
        }
    });

    afterEach(() => {
        _clearRegisteredTranslations();
        Game._resetForTesting();
        teardownMockStorage();
    });

    describe("registry", () => {
        test("accumulates resources across calls", () => {
            registerTranslations({ en: { alpha: { one: "One" } } });
            registerTranslations({ en: { beta: { two: "Two" } } });

            expect(_getRegisteredTranslations()).toEqual({
                en: {
                    alpha: { one: "One" },
                    beta: { two: "Two" },
                },
            });
        });

        test("merges namespaces of the same package deeply", () => {
            registerTranslations({ en: { alpha: { one: "One" } } });
            registerTranslations({ en: { alpha: { two: "Two" } } });

            expect(_getRegisteredTranslations()).toEqual({
                en: { alpha: { one: "One", two: "Two" } },
            });
        });

        test("keeps languages separate", () => {
            registerTranslations({
                en: { alpha: { one: "One" } },
                ru: { alpha: { one: "Один" } },
            });

            expect(_getRegisteredTranslations().ru).toEqual({
                alpha: { one: "Один" },
            });
        });
    });

    describe("registered before initI18n", () => {
        test("package defaults reach i18next", async () => {
            registerTranslations({
                en: { messengerTest: { typing: "typing..." } },
            });

            await initI18n({ resources: { en: { common: {} } } });

            expect(i18next.getFixedT("en", "messengerTest")("typing")).toBe(
                "typing..."
            );
        });

        test("author resources win over package defaults", async () => {
            registerTranslations({
                en: { messengerTest: { typing: "typing..." } },
            });

            await initI18n({
                resources: {
                    en: { messengerTest: { typing: "is writing" } },
                },
            });

            expect(i18next.getFixedT("en", "messengerTest")("typing")).toBe(
                "is writing"
            );
        });

        test("overriding one key keeps the rest of the namespace", async () => {
            registerTranslations({
                en: {
                    messengerTest: {
                        typing: "typing...",
                        "member.joined": "{{who}} joined the chat",
                    },
                },
            });

            await initI18n({
                resources: {
                    en: { messengerTest: { typing: "is writing" } },
                },
            });

            const t = i18next.getFixedT("en", "messengerTest");

            expect(t("typing")).toBe("is writing");
            expect(t("member.joined")).toBe("{{who}} joined the chat");
        });

        test("adds languages the author did not provide", async () => {
            registerTranslations({
                de: { messengerTest: { typing: "schreibt..." } },
            });

            await initI18n({
                defaultLanguage: "en",
                resources: { en: { common: { ok: "OK" } } },
            });

            expect(i18next.options.supportedLngs).toContain("de");
            expect(i18next.getFixedT("de", "messengerTest")("typing")).toBe(
                "schreibt..."
            );
        });

        test("still merges UI translations", async () => {
            registerTranslations({
                en: { messengerTest: { typing: "typing..." } },
            });

            await initI18n({
                resources: { en: { passages: { intro: "Intro" } } },
            });

            expect(i18next.getFixedT("en", "passages")("intro")).toBe("Intro");
            expect(i18next.getFixedT("en", "messengerTest")("typing")).toBe(
                "typing..."
            );
        });
    });

    describe("registered after initI18n", () => {
        test("adds the bundle immediately", async () => {
            await initI18n({ resources: { en: { common: { ok: "OK" } } } });

            registerTranslations({
                en: { lateTest: { hello: "Hello" } },
            });

            expect(i18next.getFixedT("en", "lateTest")("hello")).toBe("Hello");
        });

        test("does not overwrite keys the author already provided", async () => {
            await initI18n({
                resources: { en: { lateTest: { hello: "Author" } } },
            });

            registerTranslations({
                en: { lateTest: { hello: "Package", extra: "Extra" } },
            });

            const t = i18next.getFixedT("en", "lateTest");
            expect(t("hello")).toBe("Author");
            expect(t("extra")).toBe("Extra");
        });
    });
});
