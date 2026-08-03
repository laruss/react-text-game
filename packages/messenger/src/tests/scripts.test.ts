import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { createElement } from "react";

import { defineContact } from "#contacts";
import { logger } from "#logger";
import {
    defineScript,
    getBeatText,
    getScript,
    m,
    resolveBeats,
    warnOnScriptDrift,
} from "#scripts";

import { resetMessenger } from "./helpers";

describe("scripts", () => {
    beforeEach(() => {
        resetMessenger();
    });

    afterEach(() => {
        resetMessenger();
    });

    describe("defineScript", () => {
        test("registers and returns the script", () => {
            const script = defineScript("s", () => []);

            expect(script.id).toBe("s");
            expect(getScript("s")).toBe(script);
        });

        test("rejects a duplicate id", () => {
            defineScript("s", () => []);

            expect(() => defineScript("s", () => [])).toThrow(
                'Script "s" is already defined.'
            );
        });

        test("returns undefined for an unknown id", () => {
            expect(getScript("nope")).toBeUndefined();
        });
    });

    describe("m", () => {
        test("builds a text message from a contact", () => {
            const anna = defineContact("anna");

            expect(m.from(anna).text("hey")).toEqual({
                type: "message",
                from: "anna",
                body: { kind: "text", text: "hey" },
            });
        });

        test("builds a text message from a bare sender id", () => {
            expect(m.from("anna").text("hey").from).toBe("anna");
        });

        test("builds a player message", () => {
            expect(m.player.text("ok").from).toBe("player");
        });

        test("carries forwarding, receipt and an explicit id", () => {
            const beat = m.from("anna").text("hey", {
                id: "explicit",
                forwardedFrom: "boris",
                receipt: "read",
            });

            expect(beat.id).toBe("explicit");
            expect(beat.forwardedFrom).toBe("boris");
            expect(beat.receipt).toBe("read");
        });

        test("builds media items with every option", () => {
            expect(m.image("/a.webp", { alt: "alt", spoiler: true })).toEqual({
                kind: "image",
                src: "/a.webp",
                alt: "alt",
                spoiler: true,
            });

            expect(
                m.video("/a.mp4", { poster: "/a.jpg", durationMs: 8000 })
            ).toEqual({
                kind: "video",
                src: "/a.mp4",
                poster: "/a.jpg",
                durationMs: 8000,
            });
        });

        test("builds media items with no options", () => {
            expect(m.image("/a.webp")).toEqual({
                kind: "image",
                src: "/a.webp",
            });
        });

        test("builds a captioned album", () => {
            const beat = m
                .from("anna")
                .media([m.image("/1.webp"), m.video("/2.mp4")], {
                    caption: "look",
                });

            expect(beat.body).toEqual({
                kind: "media",
                items: [
                    { kind: "image", src: "/1.webp" },
                    { kind: "video", src: "/2.mp4" },
                ],
                caption: "look",
            });
        });

        test("builds a media message with no options", () => {
            const beat = m.from("anna").media([m.image("/1.webp")]);

            expect(beat.body).toEqual({
                kind: "media",
                items: [{ kind: "image", src: "/1.webp" }],
            });
        });

        test("offers single-item shorthands", () => {
            const image = m.from("anna").image("/a.webp", { caption: "c" });
            const video = m.from("anna").video("/a.mp4");

            expect(image.body).toEqual({
                kind: "media",
                items: [{ kind: "image", src: "/a.webp" }],
                caption: "c",
            });
            expect(video.body).toEqual({
                kind: "media",
                items: [{ kind: "video", src: "/a.mp4" }],
            });
        });

        test("builds a custom payload beat", () => {
            expect(
                m.from("anna").custom("poll", { question: "?" }, { id: "p" })
            ).toEqual({
                type: "custom",
                from: "anna",
                name: "poll",
                data: { question: "?" },
                id: "p",
            });
        });

        test("builds a custom payload beat with no options", () => {
            expect(m.from("anna").custom("poll", null)).toEqual({
                type: "custom",
                from: "anna",
                name: "poll",
                data: null,
            });
        });

        test("builds control beats", () => {
            expect(m.system("member.joined", { who: "anna" })).toEqual({
                type: "system",
                key: "member.joined",
                params: { who: "anna" },
            });
            expect(m.system("plain")).toEqual({
                type: "system",
                key: "plain",
            });
            expect(m.system("keyed", undefined, { id: "sys" }).id).toBe("sys");
            expect(m.typing("anna", 500)).toEqual({
                type: "typing",
                from: "anna",
                ms: 500,
            });
            expect(m.typing("anna", 500, { id: "typ" }).id).toBe("typ");
            expect(m.wait(700)).toEqual({ type: "wait", ms: 700 });
            expect(m.wait(700, { id: "w" }).id).toBe("w");
            expect(m.choice("c", [{ content: "yes" }])).toEqual({
                type: "choice",
                id: "c",
                options: [{ content: "yes" }],
            });
        });

        test("when returns the value or undefined, evaluating lazily", () => {
            expect(m.when(true, "yes")).toBe("yes");
            expect(m.when(false, "yes")).toBeUndefined();
            expect(m.when(true, () => "lazy")).toBe("lazy");
            expect(m.when(0, () => "lazy")).toBeUndefined();
        });
    });

    describe("resolveBeats", () => {
        test("derives ids from the position the beat is written at", () => {
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                helpers.from("anna").text("two"),
            ]);

            expect(resolveBeats(script).map((beat) => beat?.id)).toEqual([
                "s:0",
                "s:1",
            ]);
        });

        test("keeps ids stable when a conditional beat is off", () => {
            let hasKey = true;
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one"),
                hasKey && helpers.from("anna").text("secret"),
                helpers.from("anna").text("three"),
            ]);

            expect(resolveBeats(script).map((beat) => beat?.id)).toEqual([
                "s:0",
                "s:1",
                "s:2",
            ]);

            hasKey = false;

            expect(
                resolveBeats(script).map((beat) => beat?.id ?? null)
            ).toEqual(["s:0", null, "s:2"]);
        });

        test("honours an explicit id", () => {
            const script = defineScript("s", (helpers) => [
                helpers.from("anna").text("one", { id: "opener" }),
            ]);

            expect(resolveBeats(script)[0]?.id).toBe("opener");
        });

        test("skips null and undefined entries", () => {
            const script = defineScript("s", () => [null, undefined, false]);

            expect(resolveBeats(script)).toEqual([null, null, null]);
        });
    });

    describe("getBeatText", () => {
        test("reads a text body", () => {
            defineScript("s", (helpers) => [helpers.from("anna").text("hey")]);

            expect(getBeatText("s", "s:0", "text")).toBe("hey");
        });

        test("reads a caption and an alt by index", () => {
            defineScript("s", (helpers) => [
                helpers
                    .from("anna")
                    .media(
                        [
                            helpers.image("/1.webp", { alt: "first" }),
                            helpers.image("/2.webp", { alt: "second" }),
                        ],
                        { caption: "album" }
                    ),
            ]);

            expect(getBeatText("s", "s:0", "caption")).toBe("album");
            expect(getBeatText("s", "s:0", "alt:0")).toBe("first");
            expect(getBeatText("s", "s:0", "alt:1")).toBe("second");
        });

        test("reads a choice option label", () => {
            defineScript("s", (helpers) => [
                helpers.choice("c", [
                    { content: "yes" },
                    { content: createElement("b", null, "no") },
                ]),
            ]);

            expect(getBeatText("s", "c", "option:0")).toBe("yes");
            expect(getBeatText("s", "c", "option:1")).toBeDefined();
        });

        test("returns undefined for an unknown script, beat or slot", () => {
            defineScript("s", (helpers) => [helpers.from("anna").text("hey")]);

            expect(getBeatText("gone", "s:0", "text")).toBeUndefined();
            expect(getBeatText("s", "s:99", "text")).toBeUndefined();
            expect(getBeatText("s", "s:0", "caption")).toBeUndefined();
        });

        test("returns undefined for a slot of a control beat", () => {
            defineScript("s", (helpers) => [helpers.wait(10, { id: "w" })]);

            expect(getBeatText("s", "w", "text")).toBeUndefined();
        });

        test("returns undefined for a malformed alt slot", () => {
            defineScript("s", (helpers) => [
                helpers.from("anna").media([helpers.image("/1.webp")]),
            ]);

            expect(getBeatText("s", "s:0", "alt:nope")).toBeUndefined();
        });
    });

    describe("warnOnScriptDrift", () => {
        test("stays quiet when the beat count is unchanged", () => {
            const warn = spyOn(logger, "warn");

            warnOnScriptDrift("chat", "s", 3, 3);

            expect(warn).not.toHaveBeenCalled();
            warn.mockRestore();
        });

        test("warns when the beat count changed", () => {
            const warn = spyOn(logger, "warn");

            warnOnScriptDrift("chat", "s", 3, 5);

            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0]?.[0]).toContain("changed length");
            warn.mockRestore();
        });
    });
});
