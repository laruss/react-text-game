import { useCallback } from "react";

import { SYSTEM_PASSAGE_NAMES } from "#constants";
import { Game } from "#game";
import { getSystemSave } from "#saves";

/**
 * React hook that provides a function to restart the game from the initial state.
 * Loads the system save (initial game state), clears auto-save, and navigates to start passage.
 *
 * @returns Callback function that restarts the game
 *
 * @example
 * ```tsx
 * const restartGame = useRestartGame();
 * <button onClick={restartGame}>Restart Game</button>
 * ```
 */
export const useRestartGame = () => {
    return useCallback(async () => {
        const systemSave = await getSystemSave();

        if (!systemSave) {
            return {
                success: false,
                error: "System save not found. Cannot restart game.",
            };
        }

        Game.clearAutoSave();
        Game.setState(systemSave.gameData);

        Game.jumpTo(SYSTEM_PASSAGE_NAMES.START_MENU);

        return { success: true, error: null };
    }, []);
};
