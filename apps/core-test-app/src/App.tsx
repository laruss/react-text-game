import {
    Game,
    Story,
    useCurrentPassage,
    useGameEntity,
    useGameIsStarted,
} from "@react-text-game/core";
import { useGameTranslation } from "@react-text-game/core/i18n";
import {
    useExportSaves,
    useImportSaves,
    useRestartGame,
    useSaveSlots,
} from "@react-text-game/core/saves";
import { useDeleteAllSaves } from "@react-text-game/core/saves";
import { Activity, useMemo, useState } from "react";

import { player } from "@/game/entities";
import { environment } from "@/game/entities/environment";

export const App = () => {
    const env = useGameEntity(environment);
    const plr = useGameEntity(player);
    const { changeLanguage, currentLanguage, languages } = useGameTranslation();
    const restart = useRestartGame();
    const [currentPassage] = useCurrentPassage();
    const isStarted = useGameIsStarted();
    const [isSavesOpen, setIsSavesOpen] = useState(false);
    const slots = useSaveSlots({ count: 5 });
    const importCallback = useImportSaves();
    const exportCallback = useExportSaves();
    const deleteAllCallback = useDeleteAllSaves();

    const state = useMemo(() => Game.getState(), [env]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
                Language:
                <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                >
                    {languages.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button
                    onClick={() => {
                        setIsSavesOpen((state) => !state);
                    }}
                >
                    Saves
                </button>
                <Activity mode={isSavesOpen ? "visible" : "hidden"}>
                    <div style={{ marginBottom: "10px" }}>
                        <div>Saves</div>
                        <div
                            style={{
                                display: "flex",
                                marginTop: "10px",
                                gap: 40,
                            }}
                        >
                            {slots.map((slot, index) => (
                                <div
                                    key={index}
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span>Slot {index + 1}: </span>
                                    {slot.data ? (
                                        <>
                                            <span>
                                                {new Date(
                                                    slot.data?.timestamp ||
                                                        Date.now()
                                                ).toLocaleString()}
                                            </span>
                                            <button
                                                style={{ marginLeft: "10px" }}
                                                onClick={async () => {
                                                    await slot.load();
                                                    setIsSavesOpen(false);
                                                }}
                                            >
                                                Load
                                            </button>
                                            <button
                                                style={{ marginLeft: "5px" }}
                                                onClick={async () => {
                                                    await slot.delete();
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <span>No data</span>
                                    )}
                                    {isStarted && (
                                        <button
                                            onClick={async () => {
                                                await slot.save();
                                            }}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div style={{ marginLeft: 10 }}>
                                <button onClick={deleteAllCallback}>
                                    Delete all saves
                                </button>
                            </div>
                        </div>
                        <div>
                            <button onClick={exportCallback}>
                                Export saves
                            </button>
                            <button onClick={importCallback}>
                                Import saves
                            </button>
                        </div>
                    </div>
                </Activity>
            </div>
            <div>{JSON.stringify(state, null, 2)}</div>
            <div>
                <span>Current passage:</span>
                <span>{currentPassage?.id || "null"}</span>
                <div style={{ margin: 30 }} key={currentLanguage}>
                    {currentPassage
                        ? JSON.stringify((currentPassage as Story).display())
                        : null}
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <span>Game is started:</span>
                <span>{String(isStarted)}</span>
                <Activity mode={isStarted ? "hidden" : "visible"}>
                    <button
                        onClick={() => {
                            Game.jumpTo("testMap");
                        }}
                    >
                        start (map)
                    </button>
                    <button
                        onClick={() => {
                            Game.jumpTo("testStory");
                        }}
                        style={{ marginLeft: "10px" }}
                    >
                        start (story)
                    </button>
                </Activity>
            </div>
            <Activity mode={isStarted ? "visible" : "hidden"}>
                <div>
                    <div>{env.temperature}*</div>
                    <div>
                        <div>Change temperature</div>
                        <div>
                            <button onClick={() => env.changeTemperature(10)}>
                                + 10 *
                            </button>
                            <button onClick={() => env.changeTemperature(-10)}>
                                - 10 *
                            </button>
                        </div>
                        <div>
                            <button onClick={restart}>restart</button>
                        </div>
                    </div>
                </div>
            </Activity>
            <Activity mode={isStarted ? "visible" : "hidden"}>
                <div>
                    <div>
                        Player {plr.name} {plr.surname}
                    </div>
                    <div>Inventary</div>
                    <div>
                        <div>Money: {plr.inventory.money}</div>
                        <div>
                            <button
                                onClick={() => {
                                    plr.inventory.money += 10;
                                }}
                            >
                                + 10 $
                            </button>
                            <button onClick={() => (plr.inventory.money -= 10)}>
                                - 10 $
                            </button>
                        </div>
                        <div>Items: {plr.inventory.items.length}</div>
                        <div>
                            <button
                                onClick={() =>
                                    plr.inventory.items.push(
                                        `item-${Date.now()}`
                                    )
                                }
                            >
                                Add item
                            </button>
                            <button onClick={() => plr.inventory.items.pop()}>
                                Remove item
                            </button>
                        </div>
                    </div>
                </div>
            </Activity>
        </div>
    );
};
