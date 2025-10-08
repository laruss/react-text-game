"use client";

import { useContext } from "react";

import { SaveLoadMenuContext } from "#components/GameProvider/SaveLoadMenuContext";

export const useSaveLoadMenu = () => {
    const context = useContext(SaveLoadMenuContext);
    if (!context) {
        throw new Error(
            "useSaveLoadMenu must be used within SaveLoadMenuProvider"
        );
    }
    return context;
};
