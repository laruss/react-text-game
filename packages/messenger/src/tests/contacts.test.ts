import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import {
    defineContact,
    getContact,
    playerSenderId,
    resolveSenderAvatar,
    resolveSenderName,
    toSenderId,
} from "#contacts";
import { t } from "#text";

import { initGame, resetMessenger } from "./helpers";

describe("contacts", () => {
    beforeEach(async () => {
        resetMessenger();
        await initGame();
    });

    afterEach(() => {
        resetMessenger();
    });

    test("defines a contact with a name and avatar", () => {
        const anna = defineContact("anna", {
            name: "Anna",
            avatar: "/anna.webp",
        });

        expect(anna.id).toBe("anna");
        expect(anna.name).toEqual({ kind: "raw", text: "Anna" });
        expect(anna.avatar).toBe("/anna.webp");
    });

    test("defines a contact with no options at all", () => {
        const ghost = defineContact("ghost");

        expect(ghost.name).toBeUndefined();
        expect(ghost.avatar).toBeUndefined();
        expect(ghost.meta).toBeUndefined();
    });

    test("keeps author metadata", () => {
        const anna = defineContact("anna", { meta: { phone: "+1" } });

        expect(anna.meta).toEqual({ phone: "+1" });
    });

    test("rejects a duplicate id", () => {
        defineContact("anna");

        expect(() => defineContact("anna")).toThrow(
            'Contact "anna" is already defined.'
        );
    });

    test("rejects the reserved system id", () => {
        expect(() => defineContact("system")).toThrow(
            'Contact id "system" is reserved'
        );
    });

    test("looks a contact up", () => {
        const anna = defineContact("anna");

        expect(getContact("anna")).toBe(anna);
        expect(getContact("nobody")).toBeUndefined();
    });

    test("resolves a translated name", () => {
        defineContact("anna", { name: t("messenger:typing") });

        expect(resolveSenderName("anna")).toBe("typing...");
    });

    test("falls back to the sender id when there is no name", () => {
        defineContact("anna");

        expect(resolveSenderName("anna")).toBe("anna");
        expect(resolveSenderName("unknown-sender")).toBe("unknown-sender");
    });

    test("resolves an avatar, or nothing", () => {
        defineContact("anna", { avatar: "/anna.webp" });
        defineContact("boris");

        expect(resolveSenderAvatar("anna")).toBe("/anna.webp");
        expect(resolveSenderAvatar("boris")).toBeUndefined();
        expect(resolveSenderAvatar("nobody")).toBeUndefined();
    });

    test("normalizes a contact or an id to an id", () => {
        const anna = defineContact("anna");

        expect(toSenderId(anna)).toBe("anna");
        expect(toSenderId("boris")).toBe("boris");
    });

    test("exposes the reserved player sender id", () => {
        expect(playerSenderId).toBe("player");
    });
});
