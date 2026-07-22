import { newWidget } from "@react-text-game/core";

import { InventoryComponent } from "./inventory";

/**
 * Inventory Widget Passage
 * Demonstrates: Widget passage with custom React component
 */
export const inventoryWidget = newWidget("inventory", <InventoryComponent />);
