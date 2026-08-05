import type { Game } from "#game";
import type { Passage } from "#passages/passage";
import type { Storage } from "#storage";

export interface ReactTextGameDebug {
    Game: typeof Game;
    Storage: typeof Storage;
    readonly currentPassage: Passage | null;
    readonly state: Record<string, unknown>;
    readonly passages: Passage[];
    jumpTo: typeof Game.jumpTo;
    getPassage: typeof Game.getPassageById;
    getState: typeof Game.getState;
    setState: typeof Game.setState;
}

declare global {
    interface Window {
        ReactTextGame?: ReactTextGameDebug;
        Game?: typeof Game;
    }
}
