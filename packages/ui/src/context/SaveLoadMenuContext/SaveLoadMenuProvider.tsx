"use client";

import { PropsWithChildren, useState } from "react";

import { SaveLoadMenuContext } from "./SaveLoadMenuContext";

export type SaveLoadMode = "save" | "load" | "saveLoad";

export const SaveLoadMenuProvider = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<SaveLoadMode>("saveLoad");

    const openSaveMenu = () => {
        setMode("save");
        setIsOpen(true);
    };

    const openLoadMenu = () => {
        setMode("load");
        setIsOpen(true);
    };

    const openSaveLoadMenu = () => {
        setMode("saveLoad");
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <SaveLoadMenuContext.Provider
            value={{
                isOpen,
                mode,
                openSaveMenu,
                openLoadMenu,
                openSaveLoadMenu,
                close,
            }}
        >
            {children}
        </SaveLoadMenuContext.Provider>
    );
};
