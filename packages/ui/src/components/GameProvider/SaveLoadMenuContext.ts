import { createContext } from "react";

import { SaveLoadMode } from "#components/GameProvider/SaveLoadMenuProvider";

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
