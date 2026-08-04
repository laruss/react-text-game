import { afterEach, describe, expect, test } from "bun:test";

import { Game } from "#game";
import { createEntity } from "#gameObjects";
import { newOptions } from "#options";
import { newStory } from "#passages/story/fabric";
import { getSaveSchemaSource } from "#saveSchema";
import { Storage } from "#storage";

describe("getSaveSchemaSource", () => {
    afterEach(() => {
        Game._resetForTesting();
        Storage.setState({});
    });

    test("captures the save shape without Game.init()", () => {
        newOptions({ gameName: "Schema Game", gameVersion: "0.4.0" });
        createEntity("player", { name: "Ada", level: 3 });
        createEntity("wallet", { gold: 0, items: [] as string[] });

        const source = getSaveSchemaSource();

        expect(source.gameVersion).toBe("0.4.0");
        expect(source.gameData.player).toEqual({ name: "Ada", level: 3 });
        expect(source.gameData.wallet).toEqual({ gold: 0, items: [] });
    });

    test("includes the engine-owned system paths", () => {
        newOptions({ gameName: "Schema Game", gameVersion: "0.4.0" });

        const system = getSaveSchemaSource().gameData._system as Record<
            string,
            Record<string, unknown>
        >;

        expect(system.game).toHaveProperty("currentPassageId");
        expect(Object.keys(system.clock ?? {}).sort()).toEqual([
            "anchorGame",
            "mode",
            "paused",
            "scale",
        ]);
    });

    test("reports registered passage ids in sorted order", () => {
        newOptions({ gameName: "Schema Game", gameVersion: "0.4.0" });
        newStory("village", () => []);
        newStory("attic", () => []);

        expect(getSaveSchemaSource().passageIds).toEqual(["attic", "village"]);
    });

    test("reflects live values once the game has progressed", () => {
        newOptions({ gameName: "Schema Game", gameVersion: "0.4.0" });
        const wallet = createEntity("wallet", { items: [] as string[] });

        wallet.items.push("axe");

        expect(getSaveSchemaSource().gameData.wallet).toEqual({
            items: ["axe"],
        });
    });
});
