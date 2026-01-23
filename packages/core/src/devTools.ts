import { Game } from "#game";
import { logger } from "#logger";
import { Storage } from "#storage";

/**
 * Exposes dev tools to the global window object for browser console debugging.
 *
 * This function is automatically called when `Game.init()` is invoked with `isDevMode: true`.
 * It provides convenient access to game state and methods from the browser console.
 *
 * @example
 * ```javascript
 * // In browser console when isDevMode: true
 * window.Game.jumpTo('chapter-2');
 * window.ReactTextGame.currentPassage;
 * window.ReactTextGame.state;
 * window.ReactTextGame.passages;
 * ```
 *
 * @internal
 */
export function exposeDevTools(): void {
    if (typeof window === "undefined") {
        return;
    }

    window.ReactTextGame = {
        Game,
        Storage,
        get currentPassage() {
            return Game.currentPassage;
        },
        get state() {
            return Game.getState() as Record<string, unknown>;
        },
        get passages() {
            return Game.getAllPassages();
        },
        jumpTo: Game.jumpTo.bind(Game),
        getPassage: Game.getPassageById.bind(Game),
        getState: Game.getState.bind(Game),
        setState: Game.setState.bind(Game),
    };
    window.Game = Game;

    logger.log("Dev tools exposed to window object. Available commands:");
    logger.log("  window.Game - Direct Game class access");
    logger.log("  window.Game.jumpTo('passage-id') - Navigate to passage");
    logger.log("  window.ReactTextGame.currentPassage - Current passage");
    logger.log("  window.ReactTextGame.state - Full game state");
    logger.log("  window.ReactTextGame.passages - All registered passages");
}

/**
 * Removes dev tools from the global window object.
 *
 * Used for cleanup during testing to prevent state leaks between tests.
 *
 * @internal
 */
export function cleanupDevTools(): void {
    if (typeof window === "undefined") {
        return;
    }

    delete window.ReactTextGame;
    delete window.Game;
}
