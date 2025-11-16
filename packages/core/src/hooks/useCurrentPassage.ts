import { useProxy } from "valtio/utils";

import { Game } from "#game";
import { Passage } from "#passages/passage";

/**
 * Retrieves the current passage and render identifier from the game state.
 *
 * This function accesses the reactive game state, retrieves the current passage
 * based on its identifier, and returns it along with the render ID. If no current
 * passage ID is present, the function returns `null` for the passage and the
 * render ID only.
 *
 * @returns {[Passage | null, string | null]} An array where the first element is the current passage
 *                                           or `null` if no passage ID exists, and the second element
 *                                           is the render ID or `null`.
 */
export const useCurrentPassage = (): [Passage | null, string | null] => {
    const reactiveGameState = useProxy(Game.selfState);

    if (reactiveGameState.currentPassageId === null) {
        return [null, reactiveGameState.renderId];
    }

    return [
        Game.getPassageById(reactiveGameState.currentPassageId),
        reactiveGameState.renderId,
    ];
};
