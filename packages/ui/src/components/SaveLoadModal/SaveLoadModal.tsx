"use client";

import { useSaveSlots } from "@react-text-game/core/saves";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SaveLoadMode } from "#context/SaveLoadMenuContext";

import { SaveSlot } from "./SaveSlot";

interface SaveLoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: SaveLoadMode;
}

export const SaveLoadModal = ({
    isOpen,
    onClose,
    mode = "saveLoad",
}: SaveLoadModalProps) => {
    const { t } = useTranslation("ui");
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

    const handleAction = async (
        slotIndex: number,
        action: () => Promise<
            void | { success: boolean; message: string } | undefined
        >
    ) => {
        setLoading(slotIndex);
        try {
            const result = await action();
            if (!result || result.success) {
                // Success - close modal
                onClose();
            }
        } catch (error) {
            console.error("Action failed:", error);
            alert(t("saves.errors.actionFailed"));
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
                        {mode === "save"
                            ? t("saves.title.save")
                            : mode === "load"
                              ? t("saves.title.load")
                              : t("saves.title.saveLoad")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {saveSlots.map((slot, index) => (
                            <SaveSlot
                                key={index}
                                slot={slot}
                                index={index}
                                mode={mode}
                                loading={loading}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-border bg-background">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2 bg-muted hover:bg-muted-300 text-foreground rounded-lg transition-colors font-medium"
                    >
                        {t("saves.actions.close")}
                    </button>
                </div>
            </div>
        </div>
    );
};
