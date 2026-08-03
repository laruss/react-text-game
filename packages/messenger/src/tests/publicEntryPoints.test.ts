import { describe, expect, test } from "bun:test";

import * as messenger from "#index";

describe("public entry point", () => {
    test("exports the authoring API", () => {
        expect(typeof messenger.defineContact).toBe("function");
        expect(typeof messenger.defineChat).toBe("function");
        expect(typeof messenger.defineScript).toBe("function");
        expect(typeof messenger.defineMessenger).toBe("function");
        expect(typeof messenger.m).toBe("object");
        expect(typeof messenger.t).toBe("function");
    });

    test("exports the read API", () => {
        expect(typeof messenger.resolveText).toBe("function");
        expect(typeof messenger.previewText).toBe("function");
        expect(typeof messenger.resolveSystemText).toBe("function");
        expect(typeof messenger.resolveSenderName).toBe("function");
        expect(typeof messenger.resolveSenderAvatar).toBe("function");
        expect(typeof messenger.selectFirstUnreadKey).toBe("function");
        expect(typeof messenger.selectLastEntry).toBe("function");
        expect(typeof messenger.selectTypingContacts).toBe("function");
        expect(typeof messenger.selectUnread).toBe("function");
        expect(typeof messenger.selectUnseenEntries).toBe("function");
        expect(typeof messenger.resolvePlainRichText).toBe("function");
        expect(typeof messenger.isI18nText).toBe("function");
        expect(typeof messenger.isStaticText).toBe("function");
    });

    test("exports the hooks", () => {
        expect(typeof messenger.useChat).toBe("function");
        expect(typeof messenger.useChatList).toBe("function");
        expect(typeof messenger.useUnreadTotal).toBe("function");
    });

    test("exports the registries and seen stores", () => {
        expect(typeof messenger.getChat).toBe("function");
        expect(typeof messenger.getAllChats).toBe("function");
        expect(typeof messenger.getContact).toBe("function");
        expect(typeof messenger.getScript).toBe("function");
        expect(typeof messenger.createSeenStore).toBe("function");
        expect(typeof messenger.createMemorySeenStore).toBe("function");
        expect(typeof messenger.settingsSeenTransport).toBe("object");
    });

    test("exports the Chat class and the constants", () => {
        expect(typeof messenger.Chat).toBe("function");
        expect(messenger.MESSENGER_STORE_ID).toBe("messenger");
        expect(messenger.PLAYER_SENDER).toBe("player");
        expect(messenger.SYSTEM_SENDER).toBe("system");
        expect(messenger.MESSENGER_I18N_NAMESPACE).toBe("messenger");
        expect(messenger.AUTHOR_I18N_NAMESPACE).toBe("passages");
        expect(messenger.SEEN_SETTING_KEY).toBe("messenger:seen");
        expect(messenger.ENTRY_WARN_THRESHOLD).toBe(1000);
        expect(messenger.playerSenderId).toBe("player");
    });

    test("registers its own translations on import", () => {
        expect(messenger.messengerTranslations.en.messenger).toMatchObject({
            "member.joined": "{{who}} joined the chat",
            typing: "typing...",
        });
    });

    test("does not leak internal helpers", () => {
        expect(messenger).not.toHaveProperty("getStore");
        expect(messenger).not.toHaveProperty("getChatVars");
        expect(messenger).not.toHaveProperty("safeCallback");
        expect(messenger).not.toHaveProperty("resolveBeats");
        expect(messenger).not.toHaveProperty("_resetStore");
        expect(messenger).not.toHaveProperty("_clearChats");
    });
});
