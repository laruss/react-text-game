import { Game } from "#game";
import { EmptyObject, InitVarsType, PassageType } from "#types";

/**
 * Base class for all passage types in the text game engine.
 *
 * Passages represent different screens or scenes in the game. Each passage has a unique
 * identifier and type, and is automatically registered with the Game when instantiated.
 *
 * Subclasses must implement the `display()` method to define how the passage renders.
 *
 * @example
 * ```typescript
 * class CustomPassage extends Passage {
 *   constructor(id: string) {
 *     super(id, 'custom');
 *   }
 *
 *   display(props) {
 *     return { content: 'Custom passage content' };
 *   }
 * }
 * ```
 *
 * @see Story - Text-based narrative passage implementation
 * @see InteractiveMap - Map-based interactive passage implementation
 * @see Widget - React component passage implementation
 */
export class Passage {
    /**
     * Unique identifier for this passage.
     * Used for navigation and registry lookup.
     */
    readonly id: string;

    /**
     * The type of this passage.
     * Determines how the passage should be rendered in the UI.
     */
    readonly type: PassageType;

    /**
     * Cached result from the last display() call.
     * Used to access display data without re-executing content functions.
     * @internal
     */
    protected _lastDisplayResult: unknown = null;

    /**
     * Creates a new passage and automatically registers it with the Game.
     *
     * @param id - Unique identifier for this passage
     * @param type - The passage type (story, interactiveMap, or widget)
     */
    constructor(id: string, type: PassageType) {
        this.id = id;
        this.type = type;
        Game.registerPassage(this);
    }

    /**
     * Renders the passage content with optional props.
     *
     * This method must be implemented by subclasses to define the passage behavior.
     *
     * @template T - Type of props passed to the display method
     * @param _props - Optional properties for rendering the passage
     * @returns The rendered passage content (type depends on passage implementation)
     * @throws Error if not implemented by subclass
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    display<T extends InitVarsType = EmptyObject>(_props: T = {} as T) {
        throw new Error(
            `Display method not implemented for passage: ${this.id}`
        );
    }

    /**
     * Returns the cached result from the last display() call.
     * Use this method to access passage data without re-executing content functions,
     * which prevents unwanted side effects.
     *
     * @template T - Expected return type
     * @returns The cached display result, or null if display() has never been called
     *
     * @example
     * ```typescript
     * const story = newStory('test', () => [{ type: 'text', content: 'Hello' }]);
     *
     * // First call to display() - executes content function
     * const result = story.display();
     *
     * // Get cached result - does NOT execute content function again
     * const cached = story.getLastDisplayResult();
     * ```
     */
    getLastDisplayResult<T = unknown>(): T | null {
        return this._lastDisplayResult as T | null;
    }

    /**
     * Checks if a cached display result exists.
     *
     * @returns true if display() has been called at least once, false otherwise
     */
    hasDisplayCache(): boolean {
        return this._lastDisplayResult !== null;
    }
}
