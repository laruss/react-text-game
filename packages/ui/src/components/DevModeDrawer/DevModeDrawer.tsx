'use client';

import { Game, NewOptions, useCurrentPassage } from "@react-text-game/core";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useLocalStorage } from "#hooks";

import { CurrentPassageData } from "./CurrentPassageData";
import { GameData } from "./GameData";
import { JumpToPassage } from "./JumpToPassage";

type DevModeDrawerProps = Readonly<{
    options: NewOptions;
}>;

export const DevModeDrawer = ({ options }: DevModeDrawerProps) => {
    const { isDevMode } = options;
    const [isOpen, setIsOpen] = useState(false);
    const passage = useCurrentPassage();
    const [saveStateOnReload, setSaveStateOnReload] = useLocalStorage(
        "saveStateOnReload",
        true
    );

    useEffect(() => {
        if (!saveStateOnReload) {
            console.log("Disabling autosave for this session");
            Game.disableAutoSave();
            Game.clearAutoSave();
        }
    }, [saveStateOnReload]);

    if (!isDevMode) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-100000000">
            <div
                className={twMerge(
                    "bg-card border border-border rounded-t-lg shadow-lg transition-all duration-300",
                    isOpen
                        ? "translate-y-0 w-screen md:w-[60vw]"
                        : "translate-y-[calc(100%-1rem)] w-auto"
                )}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-2 px-6 flex justify-center items-center cursor-pointer bg-primary-500 hover:bg-primary-600 rounded-t-lg"
                >
                    <div className="w-12 h-1 bg-muted-400 rounded-full" />
                </button>

                {isOpen && (
                    <div className="p-4 border-t border-border">
                        <h3 className="text-lg font-semibold mb-3 text-card-foreground">Dev Mode</h3>
                        <div className="space-y-2">
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="save-state-on-reload"
                                        checked={saveStateOnReload}
                                        onChange={(e) =>
                                            setSaveStateOnReload(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label htmlFor="save-state-on-reload" className="text-card-foreground">
                                        Save state on reload
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="current-passage-id" className="text-card-foreground">
                                        Current passage ID
                                    </label>
                                    <input
                                        id="current-passage-id"
                                        type="text"
                                        value={passage?.id || "none"}
                                        readOnly
                                        className="max-w-40 bg-muted/20 border border-input rounded px-2 text-sm text-muted-foreground cursor-default"
                                    />
                                </div>
                                <JumpToPassage />
                                <GameData isOpen={isOpen} />
                                <CurrentPassageData isOpen={isOpen} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
