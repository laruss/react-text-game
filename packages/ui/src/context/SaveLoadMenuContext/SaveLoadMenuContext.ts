import { createContext } from "react";

import { SaveLoadMode } from "#context/SaveLoadMenuContext";

export interface SaveLoadMenuContextType {
    isOpen: boolean;
    mode: SaveLoadMode;
    openSaveMenu: () => void;
    openLoadMenu: () => void;
    openSaveLoadMenu: () => void;
    close: () => void;
}

export const SaveLoadMenuContext = createContext<
    SaveLoadMenuContextType | undefined
>(undefined);
