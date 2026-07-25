import { defineWidget } from "@react-text-game/core";

import { SaveLoadComponent } from "./saveLoad";

/**
 * Save/Load Widget Passage
 */
export const saveLoadWidget = defineWidget(
    "saveLoadWidget",
    <SaveLoadComponent />
);
