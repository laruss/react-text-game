import { Game, newWidget } from "@react-text-game/core";
import { useSaveSlots } from "@react-text-game/core/saves";
import { Button } from "@react-text-game/ui";

/**
 * Save/Load Widget Component
 * Demonstrates: Save system integration with useSaveSlots hook
 */
const SaveLoadComponent = () => {
    const slots = useSaveSlots({ count: 6 });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-400">
                        Save / Load Game
                    </h1>
                    <Button
                        color="default"
                        variant="bordered"
                        onClick={() => Game.jumpTo("worldMap")}
                    >
                        Close
                    </Button>
                </div>

                {/* Save Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            className="bg-card/80 rounded-lg p-4 border border-border"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-foreground">
                                    Slot {index + 1}
                                </h3>
                                {slot.data && (
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            slot.data.timestamp
                                        ).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {slot.data ? (
                                <div className="mb-3">
                                    <p className="text-sm text-muted-foreground">
                                        {slot.data.name || "Unnamed Save"}
                                    </p>
                                    {slot.data.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {slot.data.description}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-3 italic">
                                    Empty slot
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    color="success"
                                    variant="solid"
                                    className="flex-1"
                                    onClick={() => slot.save()}
                                >
                                    Save
                                </Button>
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    className="flex-1"
                                    onClick={() => slot.load()}
                                    disabled={!slot.data}
                                >
                                    Load
                                </Button>
                                <Button
                                    color="danger"
                                    variant="ghost"
                                    onClick={() => slot.delete()}
                                    disabled={!slot.data}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info text */}
                <p className="text-center text-muted-foreground text-sm mt-6">
                    Saves are stored locally in your browser using IndexedDB.
                </p>
            </div>
        </div>
    );
};

/**
 * Save/Load Widget Passage
 */
export const saveLoadWidget = newWidget(
    "saveLoadWidget",
    <SaveLoadComponent />
);
