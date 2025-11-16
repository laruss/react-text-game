import { useProxy } from "valtio/utils";

import { SYSTEM_PASSAGE_NAMES } from "#constants";
import { Game } from "#game";

/**
 * Determines whether the game has started.
 *
 * @function
 * @returns {boolean} True if the game has started; false otherwise.
 *
 * This function checks the current passage ID within the game's reactive state to infer
 * whether the game has progressed beyond the starting point. If the current passage ID
 * does not match the system-defined starting passage ID, the game is considered to have started.
 */
export const useGameIsStarted = (): boolean => {
    const reactiveGameState = useProxy(Game.selfState);

    return (
        reactiveGameState.currentPassageId !== SYSTEM_PASSAGE_NAMES.START_MENU
    );
};
