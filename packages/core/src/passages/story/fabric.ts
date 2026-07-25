import { compact } from "#passages/definition";
import type { EmptyObject, InitVarsType } from "#types";

import { storyHelpers } from "./helpers";
import { Story } from "./story";
import type { StoryContent, StoryContentFn, StoryOptions } from "./types";

/**
 * Creates a story passage from a props-first content callback.
 *
 * @remarks
 * Fully supported and not scheduled for removal. New code is encouraged to use
 * {@link defineStory} instead, which hands the content callback a toolbox of
 * component builders so component objects never have to be written by hand.
 *
 * @param id - Unique identifier for the story
 * @param content - Function returning the story's components
 * @param options - Optional background and styling configuration
 * @returns New Story instance, already registered with the Game
 *
 * @example
 * ```typescript
 * newStory('intro', () => [
 *   { type: 'header', content: 'Chapter 1', props: { level: 1 } },
 *   { type: 'text', content: 'Your journey begins...' }
 * ]);
 * ```
 */
export const newStory = (
    id: string,
    content: StoryContent,
    options?: StoryOptions
): Story => new Story(id, content, options);

/**
 * Creates a story passage from a helpers-first content callback.
 *
 * The callback receives the {@link StoryHelpers} toolbox as its first argument
 * and the display props as its second. Helpers return plain
 * {@link Component} objects, so helper calls and hand-written component
 * literals can be mixed in the same array, and falsy entries are dropped so
 * conditional content can be written inline.
 *
 * @template TProps - Type of props passed to `story.display()`
 * @param id - Unique identifier for the story
 * @param content - Function returning the story's components
 * @param options - Optional background and styling configuration
 * @returns New Story instance, already registered with the Game
 *
 * @example
 * ```typescript
 * import { defineStory } from '@react-text-game/core';
 *
 * defineStory('forest', (h) => [
 *   h.header('The Whispering Woods', { level: 1 }),
 *   h.image('/forest.webp', { alt: 'A mysterious forest path' }),
 *   h.text('The forest is ancient and alive.'),
 *   player.hasKey && h.text('The rusty key feels warm in your pocket.'),
 *   h.actions([
 *     { label: 'Go deeper', action: h.jump('forest-deep') },
 *     { label: 'Turn back', action: h.jump('village') }
 *   ])
 * ], {
 *   background: { image: '/backgrounds/forest.webp' }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Typed props, resolved when display() is called explicitly
 * const greeting = defineStory<{ playerName: string }>(
 *   'greeting',
 *   (h, props) => [h.text(`Hello, ${props.playerName}!`)]
 * );
 *
 * greeting.display({ playerName: 'Hero' });
 * ```
 *
 * @see newStory - Previous props-first factory, still supported
 */
export const defineStory = <TProps extends InitVarsType = EmptyObject>(
    id: string,
    content: StoryContentFn<TProps>,
    options?: StoryOptions
): Story => {
    const adapted: StoryContent = (props) =>
        compact(content(storyHelpers, props as unknown as TProps));

    return new Story(id, adapted, options);
};
