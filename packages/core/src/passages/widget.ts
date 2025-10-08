import { ReactNode } from "react";

import { Passage } from "#passages/passage";

/**
 * Custom React component passage for fully customized UI.
 *
 * Widget passages allow you to use any React component as a game passage,
 * providing complete control over the UI when the built-in passage types
 * (Story, InteractiveMap) don't meet your needs.
 *
 * @example
 * ```typescript
 * import { newWidget } from '@react-text-game/core';
 *
 * const inventoryUI = newWidget('inventory', (
 *   <div className="inventory">
 *     <h2>Your Inventory</h2>
 *     <InventoryGrid items={player.inventory} />
 *     <button onClick={() => Game.jumpTo('game')}>Close</button>
 *   </div>
 * ));
 *
 * // Navigate to custom UI
 * Game.jumpTo(inventoryUI);
 * ```
 *
 * @see newWidget - Factory function for creating Widget instances
 */
export class Widget extends Passage {
    /**
     * The React component/element to render.
     */
    private readonly content: ReactNode;

    /**
     * Creates a new Widget passage.
     *
     * @param id - Unique identifier for this widget
     * @param content - React node (element, component, etc.) to display
     */
    constructor(id: string, content: ReactNode) {
        super(id, "widget");
        this.content = content;
    }

    /**
     * Returns the React node for rendering.
     *
     * @returns The React content to be rendered
     */
    display() {
        return this.content;
    }
}

/**
 * Factory function for creating Widget passages.
 *
 * @param id - Unique identifier for the widget
 * @param content - React node to display
 * @returns New Widget instance
 *
 * @example
 * ```typescript
 * const customMenu = newWidget('menu', (
 *   <CustomMenuComponent />
 * ));
 * ```
 */
export const newWidget = (id: string, content: ReactNode) =>
    new Widget(id, content);
