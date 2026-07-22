import { afterEach, describe, expect, test } from "bun:test";

import { SYSTEM_PASSAGE_NAMES } from "#constants";
import { Game } from "#game";
import { Storage } from "#storage";

describe("Public package entry points", () => {
    afterEach(() => {
        Game._resetForTesting();
        Storage.setState({});
    });

    test("root entry exports the engine and registers the system story", async () => {
        Game._resetForTesting();
        const core = await import("../index");

        expect(core.Game).toBe(Game);
        expect(core.createEntity).toBeFunction();
        expect(core.newStory).toBeFunction();
        expect(core.newInteractiveMap).toBeFunction();
        expect(core.newWidget).toBeFunction();

        await Game.init({
            gameName: "Public API",
            gameId: "public-api",
            isDevMode: true,
        });
        const start = Game.getPassageById(SYSTEM_PASSAGE_NAMES.START_MENU);
        expect(start?.type).toBe("story");
        if (!start) {
            throw new Error("Expected the system start passage");
        }
        const debug = window.ReactTextGame;
        expect(debug).toBeDefined();
        expect(debug?.currentPassage).toBe(start);
        expect(debug?.state).toHaveProperty(
            "_system.game.currentPassageId",
            SYSTEM_PASSAGE_NAMES.START_MENU
        );
        expect(debug?.passages).toContain(start);
        const renderedStart: unknown = start.display();
        expect(renderedStart).toEqual({
            components: [
                { type: "header", content: "Start Story" },
                {
                    type: "text",
                    content: expect.stringContaining("start-menu-passage"),
                },
            ],
            options: {},
        });
    });

    test("saves, i18n and audio subpath entries expose behavior", async () => {
        const saves = await import("../saves");
        const i18n = await import("../i18n");
        const audio = await import("../audio");

        expect(saves.saveGame).toBeFunction();
        expect(saves.useSaveSlots).toBeFunction();
        expect(saves.runMigrations).toBeFunction();
        expect(i18n.initI18n).toBeFunction();
        expect(i18n.getGameTranslation).toBeFunction();
        expect(audio.createAudio).toBeFunction();
        expect(audio.AudioManager.getAllTracks()).toEqual([]);
    });
});
