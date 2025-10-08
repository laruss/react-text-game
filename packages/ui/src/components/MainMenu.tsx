import { Game, SYSTEM_PASSAGE_NAMES } from "@react-text-game/core";
import { useLastLoadGame } from "@react-text-game/core/saves";

import { useSaveLoadMenu } from "#hooks";

import { Button } from "./common";

export const MainMenu = () => {
    const { hasLastSave, loadLastGame } = useLastLoadGame();
    const { openLoadMenu } = useSaveLoadMenu();

    const continueCallback = async () => {
        const result = await loadLastGame();

        console.log(result);
    };

    return (
        <div className="mt-10 flex flex-col items-center justify-center h-full gap-8">
            <div className="fixed top-10 left-10 flex flex-col items-start">
                <h2 className="text-2xl flex gap-2">
                    <span className="text-primary-500 font-semibold">
                        {Game.options.gameName.toUpperCase()}
                    </span>
                    <span className="font-mono font-light text-secondary-500">
                        v{Game.options.gameVersion}
                    </span>
                </h2>
                {Game.options.author && (
                    <h3 className="text-md font-light text-secondary-400">
                        by {Game.options.author}
                    </h3>
                )}
            </div>
            <h1 className="text-4xl font-bold text-primary-900">Main Menu</h1>
            <div className="flex flex-col w-40 gap-4">
                <Button onClick={() => Game.jumpTo(Game.options.startPassage || SYSTEM_PASSAGE_NAMES.START)}>
                    New Game
                </Button>
                <Button disabled={!hasLastSave} onClick={continueCallback}>
                    Continue
                </Button>
                <Button onClick={openLoadMenu}>
                    Load Game
                </Button>
            </div>
        </div>
    );
};
