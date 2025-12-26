import { Game } from "@react-text-game/core";
import { useEffect, useState } from "react";

import { CopyButton } from "./CopyButton";
import { RefreshButton } from "./RefreshButton";

export const GameData = ({ isOpen }: { isOpen: boolean }) => {
    const [gameState, setGameState] = useState("");
    const [showRefreshed, setShowRefreshed] = useState(false);

    const onReloadGameState = () => {
        const state = JSON.stringify(Game.getState(), null, 2);
        setGameState(state);
        setShowRefreshed(true);
        setTimeout(() => setShowRefreshed(false), 500);
    };

    useEffect(() => {
        if (isOpen) {
            onReloadGameState();
        }
    }, [isOpen]);

    return (
        <div className="w-full">
            <div>
                <label
                    htmlFor="current-state"
                    className="text-sm text-card-foreground"
                >
                    Current state
                </label>
                <RefreshButton onClick={onReloadGameState} />
                <CopyButton textToCopy={gameState} />
                {showRefreshed && (
                    <span className="ml-2 text-xs text-success-600">
                        refreshed
                    </span>
                )}
            </div>
            <textarea
                id="current-state"
                disabled
                className="w-full h-30 bg-muted/20 border border-input rounded px-2 text-sm text-muted-foreground cursor-default resize-none"
                value={gameState}
            />
        </div>
    );
};
