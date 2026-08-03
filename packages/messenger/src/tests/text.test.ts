import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { defineContact } from "#contacts";
import { previewText, resolveSystemText, resolveText } from "#resolve";
import { defineScript, m } from "#scripts";
import {
    isI18nText,
    isStaticText,
    resolvePlainRichText,
    t,
    toPlainRichText,
    toRichText,
} from "#text";

import { initGame, resetMessenger } from "./helpers";

const ref = { scriptId: "s", beatId: "s:0", slot: "text" };

describe("text", () => {
    beforeEach(() => {
        resetMessenger();
    });

    afterEach(() => {
        resetMessenger();
    });

    describe("t", () => {
        test("marks a key without params", () => {
            expect(t("a.key")).toEqual({ kind: "i18n", key: "a.key" });
        });

        test("captures params", () => {
            expect(t("a.key", { name: "Anna" })).toEqual({
                kind: "i18n",
                key: "a.key",
                params: { name: "Anna" },
            });
        });
    });

    describe("isI18nText", () => {
        test("recognizes marked keys", () => {
            expect(isI18nText(t("x"))).toBe(true);
        });

        test("rejects strings, null and plain objects", () => {
            expect(isI18nText("x")).toBe(false);
            expect(isI18nText(null)).toBe(false);
            expect(isI18nText({ kind: "raw" })).toBe(false);
        });
    });

    describe("isStaticText", () => {
        test("accepts strings, numbers and marked keys", () => {
            expect(isStaticText("x")).toBe(true);
            expect(isStaticText(7)).toBe(true);
            expect(isStaticText(t("x"))).toBe(true);
        });

        test("rejects React nodes", () => {
            expect(isStaticText(createElement("b", null, "x"))).toBe(false);
        });
    });

    describe("toPlainRichText", () => {
        test("freezes a string", () => {
            expect(toPlainRichText("hey")).toEqual({
                kind: "raw",
                text: "hey",
            });
        });

        test("stringifies a number", () => {
            expect(toPlainRichText(7)).toEqual({ kind: "raw", text: "7" });
        });

        test("keeps a marked key", () => {
            expect(toPlainRichText(t("x"))).toEqual({ kind: "i18n", key: "x" });
        });
    });

    describe("toRichText", () => {
        test("stores a string as raw", () => {
            expect(toRichText("hey", ref)).toEqual({
                kind: "raw",
                text: "hey",
            });
        });

        test("stores a number as raw", () => {
            expect(toRichText(42, ref)).toEqual({ kind: "raw", text: "42" });
        });

        test("stores a marked key as i18n", () => {
            expect(toRichText(t("x", { a: 1 }), ref)).toEqual({
                kind: "i18n",
                key: "x",
                params: { a: 1 },
            });
        });

        test("stores anything richer as a script reference", () => {
            expect(toRichText(createElement("b", null, "x"), ref)).toEqual({
                kind: "ref",
                scriptId: "s",
                beatId: "s:0",
                slot: "text",
            });
        });
    });

    describe("resolveText", () => {
        beforeEach(async () => {
            await initGame();
        });

        test("returns a frozen string as-is", () => {
            expect(resolveText({ kind: "raw", text: "hey" })).toBe("hey");
        });

        test("translates a key", () => {
            expect(resolveText(t("messengerTest.missing"))).toBe(
                "messengerTest.missing"
            );
        });

        test("reads live content behind a reference", () => {
            const node = createElement("b", null, "bold");
            defineScript("refs", (helpers) => [
                helpers.from("anna").text(node),
            ]);

            expect(
                resolveText({
                    kind: "ref",
                    scriptId: "refs",
                    beatId: "refs:0",
                    slot: "text",
                })
            ).toBe(node);
        });

        test("returns an empty string when a reference no longer resolves", () => {
            expect(
                resolveText({
                    kind: "ref",
                    scriptId: "gone",
                    beatId: "gone:0",
                    slot: "text",
                })
            ).toBe("");
        });
    });

    describe("previewText", () => {
        beforeEach(async () => {
            await initGame();
        });

        test("returns a frozen string", () => {
            expect(previewText({ kind: "raw", text: "hey" })).toBe("hey");
        });

        test("returns a translated string", () => {
            expect(previewText(t("plain.key"))).toBe("plain.key");
        });

        test("returns an empty string for rich content", () => {
            defineScript("preview", (helpers) => [
                helpers.from("anna").text(createElement("b", null, "x")),
            ]);

            expect(
                previewText({
                    kind: "ref",
                    scriptId: "preview",
                    beatId: "preview:0",
                    slot: "text",
                })
            ).toBe("");
        });

        test("stringifies a numeric reference", () => {
            defineScript("numeric", () => [
                {
                    type: "message",
                    from: "anna",
                    body: { kind: "text", text: [7] as never },
                },
            ]);

            expect(
                previewText({
                    kind: "ref",
                    scriptId: "numeric",
                    beatId: "numeric:0",
                    slot: "text",
                })
            ).toBe("");
        });
    });

    describe("resolveSystemText", () => {
        beforeEach(async () => {
            await initGame();
        });

        test("resolves this package's own defaults", () => {
            expect(resolveSystemText("member.joined", { who: "anna" })).toBe(
                "anna joined the chat"
            );
        });

        test("resolves a default without params", () => {
            expect(resolveSystemText("typing")).toBe("typing...");
        });
    });

    describe("resolvePlainRichText", () => {
        test("returns a frozen string without i18n", () => {
            expect(resolvePlainRichText({ kind: "raw", text: "x" })).toBe("x");
        });
    });

    describe("contact names", () => {
        beforeEach(async () => {
            await initGame();
        });

        test("resolve through i18n", () => {
            defineContact("anna", { name: t("messenger:typing") });

            expect(m.from("anna")).toBeDefined();
        });
    });
});
