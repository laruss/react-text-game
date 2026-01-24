import { createElement, ReactNode } from "react";

import { Passage } from "#passages/passage";

/**
 * Content type for Widget passages.
 * Can be a ReactNode directly, or a React functional component.
 *
 * **Important:** When passing a function, it is always treated as a React
 * component and rendered via `createElement`. This ensures hooks work correctly
 * even in minified production builds where function names are mangled.
 *
 * @example
 * ```typescript
 * // As ReactNode (static content)
 * const content: WidgetContent = <div>Hello</div>;
 *
 * // As React component (supports hooks)
 * const MyComponent = () => {
 *   const [count, setCount] = useState(0);
 *   return <div>Count: {count}</div>;
 * };
 * const content: WidgetContent = MyComponent;
 *
 * // For dynamic content without hooks, pre-evaluate the function:
 * const content: WidgetContent = (() => <div>{Date.now()}</div>)();
 * ```
 */
export type WidgetContent = ReactNode | React.FC;

/**
 * Custom React component passage for fully customized UI.
 *
 * Widget passages allow you to use any React component as a game passage,
 * providing complete control over the UI when the built-in passage types
 * (Story, InteractiveMap) don't meet your needs.
 *
 * **Important:** When passing a function, it is always treated as a React
 * component and rendered via `createElement`. This ensures hooks work correctly
 * even in minified production builds.
 *
 * @example
 * ```typescript
 * import { newWidget } from '@react-text-game/core';
 *
 * // With ReactNode (static content)
 * const inventoryUI = newWidget('inventory', (
 *   <div className="inventory">
 *     <h2>Your Inventory</h2>
 *     <InventoryGrid items={player.inventory} />
 *     <button onClick={() => Game.jumpTo('game')}>Close</button>
 *   </div>
 * ));
 *
 * // With React component (supports hooks)
 * const MyMenu = () => {
 *   const [selected, setSelected] = useState(null);
 *   return <MenuUI selected={selected} onSelect={setSelected} />;
 * };
 * const menuWidget = newWidget('menu', MyMenu);
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
     * If content is a function, it is treated as a React component and
     * rendered via createElement to properly support hooks.
     *
     * **Note:** Functions are always rendered via `createElement`, never called
     * directly. This ensures hooks work correctly in minified builds where
     * function names are mangled to lowercase identifiers.
     *
     * @returns The React content to be rendered
     */
    display(): ReactNode {
        let result: ReactNode;

        if (typeof this.content === "function") {
            // Always use createElement for functions to ensure hooks work
            // correctly in minified builds where function names are mangled
            result = createElement(this.content);
        } else {
            result = this.content;
        }

        this._lastDisplayResult = result;
        return result;
    }
}

/**
 * Factory function for creating Widget passages.
 *
 * **Important:** When passing a function, it is always treated as a React
 * component and rendered via `createElement`. This ensures hooks work correctly
 * even in minified production builds where function names are mangled.
 *
 * @param id - Unique identifier for the widget
 * @param content - React node or React functional component to display
 * @returns New Widget instance
 *
 * @example
 * ```typescript
 * // With ReactNode (static content)
 * const customMenu = newWidget('menu', (
 *   <CustomMenuComponent />
 * ));
 *
 * // With React component (supports hooks)
 * const MyComponent = () => {
 *   const [count, setCount] = useState(0);
 *   return <Counter count={count} onChange={setCount} />;
 * };
 * const counterWidget = newWidget('counter', MyComponent);
 *
 * // For dynamic content without hooks, pre-evaluate:
 * const timestampWidget = newWidget('time', (() => <div>{Date.now()}</div>)());
 * ```
 */
export const newWidget = (id: string, content: WidgetContent) =>
    new Widget(id, content);
