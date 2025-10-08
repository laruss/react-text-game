import { useSaveSlots } from "@react-text-game/core/saves";
import { useEffect, useState } from "react";

import { SaveLoadMode } from "#components/GameProvider/SaveLoadMenuProvider";

interface SaveLoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: SaveLoadMode;
}

export const SaveLoadModal = ({ isOpen, onClose, mode = "saveLoad" }: SaveLoadModalProps) => {
    const saveSlots = useSaveSlots({ count: 9 });
    const [loading, setLoading] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleAction = async (slotIndex: number, action: () => Promise<void | { success: boolean; message: string } | undefined>) => {
        setLoading(slotIndex);
        try {
            const result = await action();
            if (!result || result.success) {
                // Success - close modal
                onClose();
            }
        } catch (error) {
            console.error("Action failed:", error);
            alert("An error occurred. Please check the console for details.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:w-full md:max-w-4xl mx-0 md:mx-4 bg-background md:rounded-lg shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        {mode === "save" ? "Save Game" : mode === "load" ? "Load Game" : "Save / Load Game"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {saveSlots.map((slot, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-lg border border-border hover:border-muted-400 transition-all hover:shadow-lg overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="p-3 border-b border-border">
                                    <h3 className="text-lg font-semibold text-card-foreground">
                                        Slot {index + 1}
                                    </h3>
                                    {slot.data && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(slot.data.timestamp).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-3">
                                    {slot.data ? (
                                        <div className="space-y-2">
                                            {slot.data.description && (
                                                <p className="text-sm text-card-foreground line-clamp-2">
                                                    {slot.data.description}
                                                </p>
                                            )}
                                            {slot.data.screenshot && (
                                                <img
                                                    src={slot.data.screenshot}
                                                    alt="Save screenshot"
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex gap-2">
                                                {(mode === "load" || mode === "saveLoad") && (
                                                    <button
                                                        onClick={() => handleAction(index, slot.load)}
                                                        disabled={loading !== null}
                                                        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-muted-400 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg transition-colors font-medium"
                                                    >
                                                        {loading === index ? "Loading..." : "Load"}
                                                    </button>
                                                )}
                                                {(mode === "save" || mode === "saveLoad") && (
                                                    <button
                                                        onClick={() => handleAction(index, slot.save)}
                                                        disabled={loading !== null}
                                                        className="flex-1 bg-success-600 hover:bg-success-700 disabled:bg-muted-400 disabled:cursor-not-allowed text-success-foreground px-4 py-2 rounded-lg transition-colors font-medium"
                                                    >
                                                        {loading === index ? "Saving..." : "Overwrite"}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(index, slot.delete)}
                                                    disabled={loading !== null}
                                                    className="bg-danger-600 hover:bg-danger-700 disabled:bg-muted-400 disabled:cursor-not-allowed text-danger-foreground px-4 py-2 rounded-lg transition-colors"
                                                    aria-label="Delete save"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <p className="text-muted-foreground mb-4">Empty Slot</p>
                                            {(mode === "save" || mode === "saveLoad") && (
                                                <button
                                                    onClick={() => handleAction(index, slot.save)}
                                                    disabled={loading !== null}
                                                    className="bg-success-600 hover:bg-success-700 disabled:bg-muted-400 disabled:cursor-not-allowed text-success-foreground px-4 py-2 rounded-lg transition-colors font-medium"
                                                >
                                                    {loading === index ? "Saving..." : "Save Here"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-border bg-background">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2 bg-muted hover:bg-muted-300 text-foreground rounded-lg transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
