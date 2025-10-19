"use client";

import { Game, SYSTEM_PASSAGE_NAMES } from "@react-text-game/core";
import { useLastLoadGame } from "@react-text-game/core/saves";
import { useTranslation } from "react-i18next";

import { useSaveLoadMenu } from "#context/SaveLoadMenuContext";

import { Button } from "./common";
import { LanguageToggle } from "./LanguageToggle";

export const MainMenu = () => {
    const { t } = useTranslation("ui");

    const { hasLastSave, loadLastGame } = useLastLoadGame();
    const { openLoadMenu } = useSaveLoadMenu();

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
            <div className="fixed top-10 right-20">
                <LanguageToggle />
            </div>
            <h1 className="text-4xl font-bold text-primary-900">
                {t("mainMenu.title")}
            </h1>
            <div className="flex flex-col w-40 gap-4">
                <Button
                    onClick={() =>
                        Game.jumpTo(
                            Game.options.startPassage ||
                                SYSTEM_PASSAGE_NAMES.START
                        )
                    }
                >
                    {t("mainMenu.newGame")}
                </Button>
                <Button disabled={!hasLastSave} onClick={loadLastGame}>
                    {t("mainMenu.continue")}
                </Button>
                <Button onClick={openLoadMenu}>{t("mainMenu.loadGame")}</Button>
            </div>
        </div>
    );
};
