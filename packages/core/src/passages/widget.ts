import { ReactNode } from "react";

import { Passage } from "#passages/passage";

/**
 * Content type for Widget passages.
 * Can be a ReactNode directly, or a function that returns a ReactNode.
 *
 * @example
 * ```typescript
 * // As ReactNode
 * const content: WidgetContent = <div>Hello</div>;
 *
 * // As function
 * const content: WidgetContent = () => <div>Hello</div>;
 * ```
 */
export type WidgetContent = ReactNode | (() => ReactNode);

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
 * // With ReactNode
 * const inventoryUI = newWidget('inventory', (
 *   <div className="inventory">
 *     <h2>Your Inventory</h2>
 *     <InventoryGrid items={player.inventory} />
 *     <button onClick={() => Game.jumpTo('game')}>Close</button>
 *   </div>
 * ));
 *
 * // With function component
 * const dynamicUI = newWidget('dynamic', () => (
 *   <div>
 *     <h2>Dynamic Content</h2>
 *     <p>Current time: {Date.now()}</p>
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
     * The React component/element or function to render.
     */
    private readonly content: WidgetContent;

    /**
     * Creates a new Widget passage.
     *
     * @param id - Unique identifier for this widget
     * @param content - React node or function returning React node to display
     */
    constructor(id: string, content: WidgetContent) {
        super(id, "widget");
        this.content = content;
    }

    /**
     * Returns the React node for rendering.
     * If content is a function, it will be called to get the ReactNode.
     *
     * @returns The React content to be rendered
     */
    display(): ReactNode {
        const result =
            typeof this.content === "function"
                ? this.content()
                : this.content;
        this._lastDisplayResult = result;
        return result;
    }
}

/**
 * Factory function for creating Widget passages.
 *
 * @param id - Unique identifier for the widget
 * @param content - React node or function returning React node to display
 * @returns New Widget instance
 *
 * @example
 * ```typescript
 * // With ReactNode
 * const customMenu = newWidget('menu', (
 *   <CustomMenuComponent />
 * ));
 *
 * // With function component
 * const dynamicMenu = newWidget('dynamic-menu', () => (
 *   <CustomMenuComponent data={getCurrentData()} />
 * ));
 * ```
 */
export const newWidget = (id: string, content: WidgetContent) =>
    new Widget(id, content);
