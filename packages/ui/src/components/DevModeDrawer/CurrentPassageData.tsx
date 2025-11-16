import { Game } from "@react-text-game/core";
import { useEffect, useState } from "react";

import { CopyButton } from "./CopyButton";
import { RefreshButton } from "./RefreshButton";

export const CurrentPassageData = ({ isOpen }: { isOpen: boolean }) => {
    const [currentPassageData, setCurrentPassageData] = useState("");
    const [showPassageDataRefreshed, setShowPassageDataRefreshed] =
        useState(false);

    const onReloadPassageData = () => {
        const psg = Game.currentPassage;
        const data = JSON.stringify(
            { passage: psg, data: psg?.display() },
            null,
            2
        );
        setCurrentPassageData(data);
        setShowPassageDataRefreshed(true);
        setTimeout(() => setShowPassageDataRefreshed(false), 500);
    };

    useEffect(() => {
        if (isOpen) {
            onReloadPassageData();
        }
    }, [isOpen]);

    return (
        <div className="w-full">
            <div>
                <label
                    htmlFor="current-passage"
                    className="text-sm text-card-foreground"
                >
                    Current Passage data
                </label>
                <RefreshButton onClick={onReloadPassageData} />
                <CopyButton textToCopy={currentPassageData} />
                {showPassageDataRefreshed && (
                    <span className="ml-2 text-xs text-success-600">
                        refreshed
                    </span>
                )}
            </div>
            <textarea
                id="current-passage"
                disabled
                className="w-full h-30 bg-muted/20 border border-input rounded px-2 text-sm text-muted-foreground cursor-default resize-none"
                value={currentPassageData}
            />
        </div>
    );
};
