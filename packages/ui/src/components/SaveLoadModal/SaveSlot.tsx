"use client";

import { useSaveSlots } from "@react-text-game/core/saves";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Button } from "#components/common/Button";
import { SaveLoadMode } from "#context/SaveLoadMenuContext";

type SaveSlotType = ReturnType<typeof useSaveSlots>[number];

interface SaveSlotProps {
    slot: SaveSlotType;
    index: number;
    mode: SaveLoadMode;
    loading: number | null;
    onAction: (
        slotIndex: number,
        action: () => Promise<
            void | { success: boolean; message: string } | undefined
        >
    ) => void;
}

export const SaveSlot = ({
    slot,
    index,
    mode,
    loading,
    onAction,
}: SaveSlotProps) => {
    const { t } = useTranslation("ui");

    const hasActions = mode === "save" || (mode === "load" && slot.data) || mode === "saveLoad";

    return (
        <div
            className={twMerge(
                "bg-card rounded-lg border border-border transition-all overflow-hidden",
                hasActions ? "hover:border-muted-400 hover:shadow-lg" : "cursor-default"
            )}
        >
            {/* Card Header */}
            <div className="p-3 border-b border-border">
                <h3 className="text-lg font-semibold text-card-foreground">
                    {t("saves.slot.label", {
                        number: index + 1,
                    })}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {slot.data ? new Date(slot.data.timestamp).toLocaleString() : 'no data'}
                </p>
            </div>

            {/* Card Body */}
            <div className="p-3">
                {slot.data ? (
                    <div className="space-y-2">
                        {slot.data.description &&
                            slot.data.description !== "undefined" && (
                                <p className="text-sm text-card-foreground line-clamp-2">
                                    {slot.data.description}
                                </p>
                            )}
                        {slot.data.screenshot &&
                            slot.data.screenshot !== "undefined" && (
                                <img
                                    src={slot.data.screenshot}
                                    alt="Save screenshot"
                                    className="w-full h-32 object-cover rounded"
                                />
                            )}
                        <div className="flex gap-2">
                            {(mode === "load" || mode === "saveLoad") && (
                                <Button
                                    onClick={() => onAction(index, slot.load)}
                                    disabled={loading !== null}
                                    color="primary"
                                    className="flex-1 rounded-lg font-medium"
                                >
                                    {loading === index
                                        ? t("saves.actions.loading")
                                        : t("saves.actions.load")}
                                </Button>
                            )}
                            {(mode === "save" || mode === "saveLoad") && (
                                <Button
                                    onClick={() => onAction(index, slot.save)}
                                    disabled={loading !== null}
                                    color="success"
                                    className="flex-1 rounded-lg font-medium"
                                >
                                    {loading === index
                                        ? t("saves.actions.saving")
                                        : t("saves.slot.overwrite")}
                                </Button>
                            )}
                            <Button
                                onClick={() => onAction(index, slot.delete)}
                                disabled={loading !== null}
                                color="danger"
                                className="rounded-lg"
                                aria-label="Delete save"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-muted-foreground mb-4">
                            {t("saves.slot.empty")}
                        </p>
                        {(mode === "save" || mode === "saveLoad") && (
                            <Button
                                onClick={() => onAction(index, slot.save)}
                                disabled={loading !== null}
                                color="success"
                                className="rounded-lg font-medium"
                            >
                                {loading === index
                                    ? t("saves.actions.saving")
                                    : t("saves.slot.saveHere")}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
