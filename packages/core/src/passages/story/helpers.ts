import type { ReactNode } from "react";

import {
    buildFromFlatOptions,
    type CommonHelpers,
    type Conditional,
    commonHelpers,
    compact,
    type HelperOptions,
} from "#passages/definition";

import type {
    ActionsComponent,
    ActionType,
    AnotherStoryComponent,
    ConversationBubble,
    ConversationComponent,
    HeaderComponent,
    ImageComponent,
    TextComponent,
    VideoComponent,
} from "./types";

/**
 * Keys that stay at the top level of a story component. Everything else in a
 * helper's options bag is nested under `props`.
 */
const ROOT_KEYS = ["id", "initialVariant"] as const;

/**
 * Conversations additionally carry `appearance` outside of `props`.
 */
const CONVERSATION_ROOT_KEYS = [...ROOT_KEYS, "appearance"] as const;

/** Options accepted by {@link StoryHelpers.text}. */
export type StoryTextOptions = HelperOptions<
    Omit<TextComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.header}. */
export type StoryHeaderOptions = HelperOptions<
    Omit<HeaderComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.image}. */
export type StoryImageOptions = HelperOptions<
    Omit<ImageComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.video}. */
export type StoryVideoOptions = HelperOptions<
    Omit<VideoComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.actions}. */
export type StoryActionsOptions = HelperOptions<
    Omit<ActionsComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.conversation}. */
export type StoryConversationOptions = HelperOptions<
    Omit<ConversationComponent, "type" | "content">
>;

/** Options accepted by {@link StoryHelpers.include}. */
export type StoryIncludeOptions = HelperOptions<
    Omit<AnotherStoryComponent, "type" | "storyId">
>;

/**
 * Toolbox handed to the content callback of {@link defineStory}.
 *
 * Every helper builds a plain {@link Component} object, so helper calls and
 * hand-written component literals can be mixed freely in the same array.
 *
 * @remarks
 * Each helper takes the component's content first and a single flat options
 * bag second. Fields that live under `props` in the raw component type are
 * hoisted into that bag, so there is only ever one level to fill in.
 */
export type StoryHelpers = CommonHelpers & {
    /**
     * Creates a text component.
     *
     * @example
     * ```typescript
     * h.text('Once upon a time...', { className: 'text-lg' })
     * h.text('<strong>Bold</strong>', { isHTML: true })
     * ```
     */
    text: (content: ReactNode, options?: StoryTextOptions) => TextComponent;

    /**
     * Creates a header component.
     *
     * @example
     * ```typescript
     * h.header('Chapter 1', { level: 1, className: 'text-center' })
     * ```
     */
    header: (content: string, options?: StoryHeaderOptions) => HeaderComponent;

    /**
     * Creates an image component.
     *
     * @example
     * ```typescript
     * h.image('/scene.jpg', { alt: 'A dark forest', disableModal: true })
     * ```
     */
    image: (content: string, options?: StoryImageOptions) => ImageComponent;

    /**
     * Creates a video component.
     *
     * @example
     * ```typescript
     * h.video('/cutscene.mp4', { controls: true, loop: false })
     * ```
     */
    video: (content: string, options?: StoryVideoOptions) => VideoComponent;

    /**
     * Creates a group of action buttons. Falsy entries are dropped.
     *
     * @example
     * ```typescript
     * h.actions([
     *   { content: 'Go north', action: h.jump('north-room') },
     *   player.hasKey && { content: 'Unlock', action: h.jump('vault') }
     * ], { direction: 'vertical' })
     * ```
     */
    actions: (
        content: ReadonlyArray<Conditional<ActionType>>,
        options?: StoryActionsOptions
    ) => ActionsComponent;

    /**
     * Creates a conversation component. Falsy bubbles are dropped.
     *
     * @example
     * ```typescript
     * h.conversation([
     *   { content: 'Hello!', who: { name: 'NPC' }, side: 'left' },
     *   { content: 'Hi there!', side: 'right' }
     * ], { appearance: 'byClick', variant: 'messenger' })
     * ```
     */
    conversation: (
        content: ReadonlyArray<Conditional<ConversationBubble>>,
        options?: StoryConversationOptions
    ) => ConversationComponent;

    /**
     * Embeds another registered story passage.
     *
     * @example
     * ```typescript
     * h.include('common-intro')
     * ```
     */
    include: (
        storyId: string,
        options?: StoryIncludeOptions
    ) => AnotherStoryComponent;
};

/**
 * Story component builders.
 *
 * Normally received as the first argument of a {@link defineStory} content
 * callback. Import it directly when a story is split across several files and
 * the helpers are needed outside of the callback body.
 *
 * @example
 * ```typescript
 * import { defineStory, storyHelpers } from '@react-text-game/core';
 *
 * const intro = () => [storyHelpers.header('The Whispering Woods')];
 *
 * defineStory('forest', (h) => [...intro(), h.text('The forest is alive.')]);
 * ```
 */
export const storyHelpers: StoryHelpers = {
    ...commonHelpers,

    text: (content, options = {}) =>
        buildFromFlatOptions({ type: "text", content }, options, ROOT_KEYS),

    header: (content, options = {}) =>
        buildFromFlatOptions({ type: "header", content }, options, ROOT_KEYS),

    image: (content, options = {}) =>
        buildFromFlatOptions({ type: "image", content }, options, ROOT_KEYS),

    video: (content, options = {}) =>
        buildFromFlatOptions({ type: "video", content }, options, ROOT_KEYS),

    actions: (content, options = {}) =>
        buildFromFlatOptions(
            { type: "actions", content: compact(content) },
            options,
            ROOT_KEYS
        ),

    conversation: (content, options = {}) =>
        buildFromFlatOptions(
            { type: "conversation", content: compact(content) },
            options,
            CONVERSATION_ROOT_KEYS
        ),

    include: (storyId, options = {}) =>
        buildFromFlatOptions(
            { type: "anotherStory", storyId },
            options,
            ROOT_KEYS
        ),
};
