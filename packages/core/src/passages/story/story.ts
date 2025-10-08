import { Passage } from "#passages/passage";
import { EmptyObject, InitVarsType } from "#types";

import { Component, StoryContent, StoryOptions } from "./types";

/**
 * Text-based narrative passage for displaying story content with rich components.
 *
 * Story passages support various component types including text, headers, images,
 * videos, actions, conversations, and embedded stories. Content is defined via
 * a function that receives props and returns an array of components.
 *
 * @example
 * ```typescript
 * import { newStory } from '@react-text-game/core';
 *
 * const introStory = newStory('intro', (props) => [
 *   {
 *     type: 'header',
 *     content: 'Chapter 1',
 *     props: { level: 1 }
 *   },
 *   {
 *     type: 'text',
 *     content: 'Your journey begins...'
 *   },
 *   {
 *     type: 'actions',
 *     content: [
 *       {
 *         label: 'Continue',
 *         action: () => Game.jumpTo('chapter-1')
 *       }
 *     ]
 *   }
 * ], {
 *   background: { image: '/bg.jpg' },
 *   classNames: { container: 'story-container' }
 * });
 * ```
 *
 * @see newStory - Factory function for creating Story instances
 */
export class Story extends Passage {
    /**
     * Function that generates story components based on props.
     */
    private readonly content: StoryContent;

    /**
     * Optional configuration for story appearance and behavior.
     */
    private readonly options: StoryOptions;

    /**
     * Creates a new Story passage.
     *
     * @param id - Unique identifier for this story
     * @param content - Function that returns an array of story components
     * @param options - Optional configuration for background, styling, etc.
     */
    constructor(id: string, content: StoryContent, options: StoryOptions = {}) {
        super(id, "story");
        this.content = content;
        this.options = options;
    }

    /**
     * Renders the story by invoking the content function with props.
     *
     * The content function receives props and returns an array of components
     * (text, headers, images, actions, etc.) that make up the story.
     *
     * @template T - Type of props to pass to the content function
     * @param props - Properties used during rendering (e.g., player state, game flags)
     * @returns Object containing story options and rendered components
     *
     * @example
     * ```typescript
     * const story = newStory('test', () => [
     *   { type: 'text', content: 'Hello' }
     * ]);
     *
     * const { components, options } = story.display();
     * // components: [{ type: 'text', content: 'Hello' }]
     * ```
     */
    display<T extends InitVarsType = EmptyObject>(
        props: T = {} as T
    ): { options?: StoryOptions; components: Array<Component> } {
        return {
            options: this.options,
            components: this.content(props),
        };
    }
}
