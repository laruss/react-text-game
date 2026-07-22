import { afterEach, describe, expect, test } from "bun:test";

import { cleanupDevTools, exposeDevTools } from "#devTools";
import { Game } from "#game";
import { logger } from "#logger";
import { newOptions } from "#options";
import { clearMigrations, registerMigration } from "#saves/migrations";
import { Storage } from "#storage";

describe("Runtime edge behavior", () => {
    afterEach(() => {
        clearMigrations();
        Game._resetForTesting();
        Storage.setState({});
        sessionStorage.clear();
    });

    test("enables debug logging in development mode", () => {
        newOptions({ gameName: "Coverage Edges", isDevMode: true });

        expect(logger.level).toBe(0);
        expect(logger.debug("debug coverage")).toBeUndefined();
    });

    test("skips developer globals in a non-browser runtime", () => {
        const windowDescriptor = Object.getOwnPropertyDescriptor(
            globalThis,
            "window"
        );
        expect(windowDescriptor?.configurable).toBe(true);
        if (!windowDescriptor) {
            throw new Error("Expected happy-dom to install window");
        }
        Reflect.deleteProperty(globalThis, "window");

        try {
            expect(exposeDevTools()).toBeUndefined();
            expect(cleanupDevTools()).toBeUndefined();
            expect("ReactTextGame" in globalThis).toBe(false);
        } finally {
            Object.defineProperty(globalThis, "window", windowDescriptor);
        }
    });

    test("reports invalid migration chains during development initialization", async () => {
        registerMigration({
            from: "1.0.0",
            to: "1.5.0",
            description: "An intentionally incomplete chain",
            migrate: (state) => state,
        });

        await Game.init({
            gameName: "Migration Validation",
            gameId: "migration-validation",
            gameVersion: "2.0.0",
            isDevMode: true,
        });

        expect(Game.options.gameVersion).toBe("2.0.0");
        expect(Game.selfState.currentPassageId).not.toBeNull();
    });

    test("auto-saves changes to the game state itself", async () => {
        await Game.init({
            gameName: "Game State Auto-save",
            gameId: "game-state-auto-save",
            isDevMode: true,
        });
        Game.enableAutoSave();
        sessionStorage.clear();

        Game.setCurrent("coverage-passage");
        await new Promise((resolve) => setTimeout(resolve, 550));

        const saved = sessionStorage.getItem("gameAutoSave");
        expect(saved).not.toBeNull();
        if (saved === null) {
            throw new Error("Expected game auto-save data");
        }
        expect(JSON.parse(saved)).toHaveProperty(
            "_system.game.currentPassageId",
            "coverage-passage"
        );
    });
});
