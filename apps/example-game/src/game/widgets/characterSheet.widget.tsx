import { newWidget } from "@react-text-game/core";

import { CharacterSheetComponent } from "./characterSheet";

/**
 * Character Sheet Widget Passage
 * Demonstrates: Widget passage with reactive state display
 */
export const characterSheetWidget = newWidget(
    "characterSheet",
    <CharacterSheetComponent />
);
