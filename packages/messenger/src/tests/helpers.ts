import { Game } from "@react-text-game/core";

// The package entry point registers this package's default strings on import.
// Tests import individual modules, so mirror that side effect here.
import "#i18n";

import { _clearChats } from "#chat";
import { _clearContacts } from "#contacts";
import { _clearScripts } from "#scripts";
import { _resetStore } from "#store";

/**
 * Returns the package and the engine to a clean slate.
 *
 * Resets the store (including its slot in storage), every registry, and the
 * engine, so nothing leaks between tests.
 */
export const resetMessenger = (): void => {
    _resetStore();
    _clearChats();
    _clearContacts();
    _clearScripts();
    Game._resetForTesting();
};

/**
 * Initializes the engine for tests that need translations, options, or
 * `Game.getState()`.
 */
export const initGame = async (): Promise<void> => {
    await Game.init({
        gameName: "Messenger Test Game",
        isDevMode: true,
        clock: { startAt: 0 },
    });
};
