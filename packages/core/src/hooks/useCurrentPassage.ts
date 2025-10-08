import { useProxy } from "valtio/utils";

import { Game } from "#game";
import { Passage } from "#passages/passage";

/**
 * Retrieves the current passage in the game based on the reactive game state.
 * If there is no current passage ID, the function returns null.
 *
 * @function
 * @returns {Passage | null} The current passage object, or null if no passage is active.
 */
export const useCurrentPassage = (): Passage | null => {
    const reactiveGameState = useProxy(Game.selfState);

    if (reactiveGameState.currentPassageId === null) {
        return null;
    }

    return Game.getPassageById(reactiveGameState.currentPassageId);
};
