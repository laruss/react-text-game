import { ReactNode } from "react";

import {
    ButtonColor,
    ButtonVariant,
    EmptyObject,
    InitVarsType,
} from "#types";

/**
 * Base interface shared by all story components.
 * Provides common properties for identification and visibility control.
 */
export interface BaseComponent {
    /**
     * Optional unique identifier for this component.
     * Can be used to reference or manipulate specific components programmatically.
     *
     * @example
     * ```typescript
     * { type: 'text', id: 'intro-text', content: 'Welcome!' }
     * ```
     */
    id?: string;

    /**
     * Controls the initial visibility state of the component.
     *
     * @remarks
     * This property is designed for future UI implementation to support dynamic component visibility.
     * Currently defined but not yet implemented in the UI layer.
     *
     * - `"display"` - Component is visible and rendered immediately (default behavior)
     * - `"hidden"` - Component exists but is not visible initially
     * - `"disclosure"` - Component is initially collapsed/hidden but can be expanded by user interaction
     *
     * @defaultValue `"display"`
     */
    initialVariant?: "display" | "hidden" | "disclosure";
}

/**
 * Component for displaying text content in the story.
 * Supports rich text, JSX elements, and multi-line content with preserved whitespace.
 *
 * @example
 * ```typescript
 * // Simple text
 * { type: 'text', content: 'Once upon a time...' }
 *
 * // Multi-line text
 * { type: 'text', content: 'Line 1\nLine 2\nLine 3' }
 *
 * // JSX content
 * { type: 'text', content: <><strong>Bold</strong> and <em>italic</em></> }
 * ```
 */
export interface TextComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as a text component.
     */
    type: "text";

    /**
     * The text or React element to display.
     * Supports strings, numbers, JSX elements, and any valid React node.
     * Multi-line text is rendered with preserved whitespace and line breaks.
     */
    content: ReactNode;

    /**
     * Optional configuration for styling and behavior.
     */
    props?: {
        /**
         * CSS class name(s) to apply to the text container.
         * Can be used to customize text appearance (color, font, alignment, etc.).
         *
         * @example
         * ```typescript
         * props: { className: 'text-lg font-bold text-center' }
         * ```
         */
        className?: string;
    };
}

/**
 * Defines the heading level for a HeaderComponent.
 * Maps to HTML heading elements (h1-h6), where:
 * - 1 = h1 (largest, main title)
 * - 6 = h6 (smallest, sub-sub-section)
 */
export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Component for displaying heading text at various levels.
 * Headers provide semantic structure and visual hierarchy to story content.
 *
 * @example
 * ```typescript
 * // Main title
 * { type: 'header', content: 'Chapter 1: The Beginning', props: { level: 1 } }
 *
 * // Section heading
 * { type: 'header', content: 'The Journey Begins', props: { level: 2 } }
 *
 * // With custom styling
 * { type: 'header', content: 'Warning!', props: { level: 3, className: 'text-danger-600' } }
 * ```
 */
export interface HeaderComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as a header component.
     */
    type: "header";

    /**
     * The header text to display.
     * Plain text only - use TextComponent for rich content.
     */
    content: string;

    /**
     * Optional configuration for header level and styling.
     */
    props?: {
        /**
         * Semantic heading level (1-6) corresponding to HTML h1-h6 elements.
         * Affects both visual size and document structure.
         *
         * @defaultValue 1
         */
        level?: HeaderLevel;

        /**
         * CSS class name(s) to apply to the header.
         * Can be used to override default styling or add custom appearance.
         *
         * @example
         * ```typescript
         * props: { className: 'text-primary-600 font-bold' }
         * ```
         */
        className?: string;
    };
}
/**
 * Component for displaying images with built-in modal viewer support.
 * By default, images can be clicked to open in a full-screen modal for better viewing.
 *
 * @example
 * ```typescript
 * // Basic image
 * { type: 'image', content: '/images/scene.jpg' }
 *
 * // Image with alt text
 * { type: 'image', content: '/avatar.png', props: { alt: 'Player avatar' } }
 *
 * // Image without modal
 * { type: 'image', content: '/icon.png', props: { disableModal: true } }
 *
 * // Image with custom click handler
 * {
 *   type: 'image',
 *   content: '/button.png',
 *   props: {
 *     disableModal: true,
 *     onClick: () => Game.jumpTo('next-scene')
 *   }
 * }
 * ```
 */
export interface ImageComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as an image component.
     */
    type: "image";

    /**
     * URL or path to the image file.
     * Can be absolute URL, relative path, or path to public assets.
     *
     * @example
     * ```typescript
     * content: 'https://example.com/image.jpg'  // Absolute URL
     * content: '/images/scene.png'              // Relative path
     * content: 'scene.png'                      // Public folder asset
     * ```
     */
    content: string;

    /**
     * Optional configuration for image behavior and styling.
     */
    props?: {
        /**
         * Alternative text description for accessibility and SEO.
         * Displayed when the image fails to load or for screen readers.
         *
         * @defaultValue `"image"`
         */
        alt?: string;

        /**
         * CSS class name(s) to apply to the image element.
         *
         * @example
         * ```typescript
         * props: { className: 'rounded-lg shadow-xl' }
         * ```
         */
        className?: string;

        /**
         * When `true`, disables the modal viewer functionality.
         * The image becomes a static element without click-to-enlarge behavior.
         *
         * @defaultValue false
         *
         * @remarks
         * Set to `true` when using custom `onClick` handlers or for decorative images
         * that shouldn't open in full-screen mode.
         */
        disableModal?: boolean;

        /**
         * Optional click event handler.
         * Called when the image is clicked (in addition to or instead of modal behavior).
         *
         * @remarks
         * When both `onClick` and modal are enabled, `onClick` fires before the modal opens.
         * To use only `onClick`, set `disableModal: true`.
         *
         * @example
         * ```typescript
         * props: {
         *   onClick: () => {
         *     console.log('Image clicked');
         *     Game.jumpTo('next-passage');
         *   },
         *   disableModal: true
         * }
         * ```
         */
        onClick?: () => void;
    };
}
/**
 * Component for displaying video content with standard HTML5 video controls.
 * Supports local files and remote URLs with customizable playback behavior.
 *
 * @example
 * ```typescript
 * // Basic video with controls
 * {
 *   type: 'video',
 *   content: '/videos/cutscene.mp4',
 *   props: { controls: true }
 * }
 *
 * // Looping background video
 * {
 *   type: 'video',
 *   content: '/videos/ambient.mp4',
 *   props: {
 *     autoPlay: true,
 *     loop: true,
 *     muted: true,
 *     controls: false
 *   }
 * }
 * ```
 */
export interface VideoComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as a video component.
     */
    type: "video";

    /**
     * URL or path to the video file.
     * Supports common formats (MP4, WebM, OGG) depending on browser support.
     *
     * @example
     * ```typescript
     * content: 'https://example.com/video.mp4'  // Remote URL
     * content: '/videos/intro.mp4'              // Local path
     * content: 'cutscene.mp4'                   // Public folder asset
     * ```
     */
    content: string;

    /**
     * Optional configuration for video playback and styling.
     */
    props?: {
        /**
         * CSS class name(s) to apply to the video element.
         *
         * @example
         * ```typescript
         * props: { className: 'rounded-lg shadow-xl' }
         * ```
         */
        className?: string;

        /**
         * Whether to display native browser video controls (play, pause, volume, etc.).
         *
         * @defaultValue false
         *
         * @remarks
         * Set to `true` to allow user control over playback.
         * Set to `false` for non-interactive videos or custom controls.
         */
        controls?: boolean;

        /**
         * Whether the video should start playing automatically when rendered.
         *
         * @defaultValue true
         *
         * @remarks
         * Many browsers restrict autoplay without user interaction, especially with audio.
         * Consider setting `muted: true` for reliable autoplay behavior.
         */
        autoPlay?: boolean;

        /**
         * Whether the video should restart from the beginning when it reaches the end.
         *
         * @defaultValue true
         *
         * @remarks
         * Useful for ambient/background videos that should play continuously.
         */
        loop?: boolean;

        /**
         * Whether the video audio should be muted.
         *
         * @defaultValue true
         *
         * @remarks
         * Setting to `true` helps bypass browser autoplay restrictions.
         * Users can still unmute via controls if `controls: true`.
         */
        muted?: boolean;
    };
}

/**
 * Represents an interactive button action within a story.
 * Used to create player choices, navigation buttons, and interactive elements.
 *
 * @example
 * ```typescript
 * // Simple navigation action
 * {
 *   label: 'Continue',
 *   action: () => Game.jumpTo('next-scene')
 * }
 *
 * // Action with styling
 * {
 *   label: 'Attack',
 *   action: () => combat.attack(),
 *   color: 'danger',
 *   variant: 'solid'
 * }
 *
 * // Disabled action with tooltip
 * {
 *   label: 'Open Door',
 *   action: () => {},
 *   isDisabled: true,
 *   tooltip: {
 *     content: 'You need a key to open this door',
 *     position: 'top'
 *   }
 * }
 * ```
 */
export type ActionType = {
    /**
     * The text displayed on the button.
     * Should clearly describe the action the player will take.
     */
    label: string;

    /**
     * Callback function executed when the button is clicked.
     * Typically used for navigation, state changes, or triggering game events.
     *
     * @example
     * ```typescript
     * action: () => {
     *   player.inventory.add('key');
     *   Game.jumpTo('next-room');
     * }
     * ```
     */
    action: () => void;

    /**
     * Visual color scheme for the button.
     * Maps to semantic color tokens in the UI theme.
     *
     * @defaultValue `"primary"`
     *
     * @remarks
     * Available colors:
     * - `"default"` - Neutral/muted appearance
     * - `"primary"` - Main action color
     * - `"secondary"` - Alternative action color
     * - `"success"` - Positive/confirmation actions
     * - `"warning"` - Caution/important actions
     * - `"danger"` - Destructive/negative actions
     */
    color?: ButtonColor;

    /**
     * Visual style variant for the button.
     *
     * @defaultValue `"solid"`
     *
     * @remarks
     * Available variants:
     * - `"solid"` - Filled background
     * - `"bordered"` - Outline style
     * - `"light"` - Subtle background
     * - `"flat"` - No background, minimal style
     * - `"faded"` - Translucent background
     * - `"shadow"` - With drop shadow
     * - `"ghost"` - Minimal, text-only style
     */
    variant?: ButtonVariant;

    /**
     * Whether the button should be disabled (non-interactive).
     * Disabled buttons are visually dimmed and cannot be clicked.
     *
     * @defaultValue false
     *
     * @remarks
     * Useful for conditional actions based on game state.
     * Combine with `tooltip` to explain why the action is unavailable.
     */
    isDisabled?: boolean;

    /**
     * Optional tooltip configuration.
     * Displays additional information when the user hovers over the button.
     */
    tooltip?: {
        /**
         * The text or message to show in the tooltip.
         *
         * @example
         * ```typescript
         * content: 'Requires 50 gold coins'
         * ```
         */
        content: string;

        /**
         * Position of the tooltip relative to the button.
         *
         * @defaultValue `"top"`
         */
        position?: "top" | "bottom" | "left" | "right";

        /**
         * CSS class name(s) to apply to the tooltip.
         *
         * @example
         * ```typescript
         * className: 'bg-danger-500 text-white'
         * ```
         */
        className?: string;
    };

    /**
     * CSS class name(s) to apply to the button element.
     *
     * @example
     * ```typescript
     * className: 'w-full text-lg font-bold'
     * ```
     */
    className?: string;
};

/**
 * Component for displaying a group of interactive action buttons.
 * Used to present player choices, navigation options, or any interactive decisions.
 *
 * @example
 * ```typescript
 * // Horizontal action buttons (default)
 * {
 *   type: 'actions',
 *   content: [
 *     { label: 'Go North', action: () => Game.jumpTo('north-room') },
 *     { label: 'Go South', action: () => Game.jumpTo('south-room') }
 *   ]
 * }
 *
 * // Vertical layout for dialogue choices
 * {
 *   type: 'actions',
 *   props: { direction: 'vertical' },
 *   content: [
 *     { label: 'Tell the truth', action: () => increaseHonesty() },
 *     { label: 'Lie', action: () => decreaseHonesty() },
 *     { label: 'Say nothing', action: () => Game.jumpTo('silence') }
 *   ]
 * }
 * ```
 */
export interface ActionsComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as an actions component.
     */
    type: "actions";

    /**
     * Array of action buttons to display.
     * Each action represents a choice or interactive option for the player.
     */
    content: Array<ActionType>;

    /**
     * Optional configuration for layout and styling.
     */
    props?: {
        /**
         * Layout direction for the action buttons.
         *
         * @defaultValue `"horizontal"`
         *
         * @remarks
         * - `"horizontal"` - Buttons arranged in a row (wraps on small screens)
         * - `"vertical"` - Buttons stacked in a column (better for many options or long labels)
         */
        direction?: "horizontal" | "vertical";

        /**
         * CSS class name(s) to apply to the actions container.
         *
         * @example
         * ```typescript
         * props: { className: 'gap-4 p-4' }
         * ```
         */
        className?: string;
    };
}
/**
 * Component for embedding another story passage within the current story.
 * Enables composition and reuse of story content.
 *
 * @example
 * ```typescript
 * // Main story that includes a shared intro
 * newStory('chapter-1', () => [
 *   { type: 'anotherStory', storyId: 'common-intro' },
 *   { type: 'text', content: 'Chapter 1 specific content...' }
 * ]);
 *
 * // Reusable story component
 * newStory('common-intro', () => [
 *   { type: 'header', content: 'Welcome', props: { level: 1 } },
 *   { type: 'text', content: 'This intro is shared across multiple chapters.' }
 * ]);
 * ```
 *
 * @remarks
 * Use this to:
 * - Reuse common story segments (intros, outros, recurring dialogues)
 * - Create modular story components
 * - Implement story templates or patterns
 * - Build complex narratives from smaller pieces
 */
export interface AnotherStoryComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as an embedded story component.
     */
    type: "anotherStory";

    /**
     * The unique identifier of the story passage to embed.
     * Must reference a story that has been registered with `newStory()`.
     *
     * @example
     * ```typescript
     * storyId: 'common-intro'
     * storyId: 'character-dialogue-bob'
     * ```
     *
     * @remarks
     * If the referenced story ID doesn't exist, the component will fail to render.
     * Ensure the story is registered before it's referenced.
     */
    storyId: string;
}

/**
 * Defines which side of the conversation view a message appears on.
 * Typically used to distinguish between different speakers or perspectives.
 */
export type ConversationBubbleSide = "left" | "right";

/**
 * Represents a single message/bubble in a conversation sequence.
 * Can include speaker information, avatar, and custom styling.
 *
 * @example
 * ```typescript
 * // Simple message
 * { content: 'Hello there!' }
 *
 * // Message with speaker
 * {
 *   content: 'How can I help you?',
 *   who: { name: 'Shopkeeper' },
 *   side: 'left'
 * }
 *
 * // Message with avatar
 * {
 *   content: 'I need supplies.',
 *   who: {
 *     name: 'Player',
 *     avatar: '/avatars/player.png'
 *   },
 *   side: 'right'
 * }
 *
 * // Message with custom color
 * {
 *   content: 'System message',
 *   color: '#ff6b6b',
 *   side: 'left'
 * }
 * ```
 */
export type ConversationBubble = {
    /**
     * Optional speaker information for this message.
     */
    who?: {
        /**
         * Display name of the speaker.
         * Shown with the message or as avatar fallback (first letter).
         */
        name?: string;

        /**
         * URL or path to the speaker's avatar image.
         * If not provided, a generated avatar with the first letter of the name is shown.
         *
         * @example
         * ```typescript
         * avatar: '/characters/merchant.png'
         * avatar: 'https://example.com/avatars/123.jpg'
         * ```
         */
        avatar?: string;
    };

    /**
     * The message content to display.
     * Supports strings, JSX elements, and any valid React node.
     */
    content: ReactNode;

    /**
     * Optional custom background color for the message bubble.
     * Must be a valid hex color code.
     *
     * @example
     * ```typescript
     * color: '#3b82f6'  // Blue
     * color: '#ef4444'  // Red
     * ```
     *
     * @remarks
     * When not provided, the color is determined by the conversation variant and side.
     */
    color?: `#${string}`;

    /**
     * Which side of the conversation to display this message.
     *
     * @defaultValue `"left"`
     *
     * @remarks
     * - `"left"` - Typically used for NPCs or other characters
     * - `"right"` - Typically used for the player character
     */
    side?: ConversationBubbleSide;

    /**
     * Optional CSS class overrides for fine-grained styling control.
     */
    props?: {
        /**
         * CSS class names for different parts of the bubble.
         */
        classNames?: {
            /**
             * CSS class for the entire bubble container.
             * Controls layout, spacing, and alignment.
             */
            base?: string;

            /**
             * CSS class for the message content area.
             * Controls text styling, padding, and background.
             */
            content?: string;

            /**
             * CSS class for the avatar element.
             * Controls avatar size, shape, and positioning.
             */
            avatar?: string;
        };
    };
};

/**
 * Visual style preset for conversation display.
 * Each variant provides different bubble styling and layout.
 */
export type ConversationVariant = "chat" | "messenger";

/**
 * Controls how conversation messages are revealed to the player.
 */
export type ConversationAppearance = "atOnce" | "byClick";

/**
 * Component for displaying dialogue, conversations, or sequential messages.
 * Supports different visual styles and progressive message reveal.
 *
 * @example
 * ```typescript
 * // All messages shown at once (default)
 * {
 *   type: 'conversation',
 *   content: [
 *     { content: 'Hello!', who: { name: 'NPC' }, side: 'left' },
 *     { content: 'Hi there!', who: { name: 'Player' }, side: 'right' }
 *   ]
 * }
 *
 * // Progressive reveal - click to show next message
 * {
 *   type: 'conversation',
 *   appearance: 'byClick',
 *   content: [
 *     { content: 'Let me tell you a story...', side: 'left' },
 *     { content: 'It was a dark and stormy night...', side: 'left' },
 *     { content: 'When suddenly...', side: 'left' }
 *   ]
 * }
 *
 * // Messenger-style conversation
 * {
 *   type: 'conversation',
 *   props: { variant: 'messenger' },
 *   content: [
 *     {
 *       content: 'Check out this new quest!',
 *       who: { name: 'Guild Master', avatar: '/guild.png' },
 *       side: 'left'
 *     },
 *     {
 *       content: 'I\'m interested!',
 *       who: { name: 'You' },
 *       side: 'right'
 *     }
 *   ]
 * }
 * ```
 */
export interface ConversationComponent extends BaseComponent {
    /**
     * Discriminator property identifying this as a conversation component.
     */
    type: "conversation";

    /**
     * Array of conversation bubbles/messages to display.
     * Order determines the sequence in which messages appear.
     */
    content: Array<ConversationBubble>;

    /**
     * Controls how messages are revealed to the player.
     *
     * @defaultValue `"atOnce"`
     *
     * @remarks
     * - `"atOnce"` - All messages visible immediately (default)
     * - `"byClick"` - Messages appear one at a time when clicked
     *   - Creates a progressive storytelling effect
     *   - Click anywhere in the conversation area to reveal the next message
     *   - Useful for paced dialogue or dramatic reveals
     */
    appearance?: ConversationAppearance;

    /**
     * Optional configuration for visual style and layout.
     */
    props?: {
        /**
         * Visual style preset for the conversation.
         *
         * @defaultValue `"chat"`
         *
         * @remarks
         * - `"chat"` - Casual chat interface style
         *   - Rounded bubbles with colored backgrounds
         *   - Minimal shadows, compact layout
         *   - Good for informal conversations
         *
         * - `"messenger"` - Messaging app style (like SMS or WhatsApp)
         *   - Card-like bubbles with shadows
         *   - More pronounced visual separation
         *   - Professional appearance, good for important dialogues
         */
        variant?: ConversationVariant;

        /**
         * CSS class name(s) to apply to the conversation container.
         *
         * @example
         * ```typescript
         * props: { className: 'my-8 p-4 bg-muted-50 rounded-lg' }
         * ```
         */
        className?: string;
    };
}

/**
 * Union type of all available story component types.
 * Used for type-safe story content arrays.
 *
 * @remarks
 * This discriminated union allows TypeScript to narrow component types
 * based on the `type` property when rendering or processing components.
 */
export type Component =
    | TextComponent
    | HeaderComponent
    | ImageComponent
    | VideoComponent
    | ActionsComponent
    | ConversationComponent
    | AnotherStoryComponent;

/**
 * Function type for story content generation.
 * Receives props and returns an array of components to display.
 *
 * @template T - Type of props passed to the story (extends InitVarsType)
 * @param props - Properties used for conditional rendering or dynamic content
 * @returns Array of components that make up the story
 *
 * @example
 * ```typescript
 * // Simple static story
 * const story: StoryContent = () => [
 *   { type: 'header', content: 'Welcome' },
 *   { type: 'text', content: 'Your adventure begins...' }
 * ];
 *
 * // Dynamic story based on game state
 * const story: StoryContent<{ playerName: string; hasKey: boolean }> = (props) => [
 *   { type: 'text', content: `Hello, ${props.playerName}!` },
 *   {
 *     type: 'actions',
 *     content: [
 *       {
 *         label: 'Open Door',
 *         action: () => Game.jumpTo('next-room'),
 *         isDisabled: !props.hasKey,
 *         tooltip: props.hasKey ? undefined : {
 *           content: 'You need a key to open this door'
 *         }
 *       }
 *     ]
 *   }
 * ];
 * ```
 *
 * @remarks
 * The function is called during rendering, so:
 * - Keep logic lightweight for performance
 * - Access reactive game state through props for dynamic content
 * - Return value is memoized based on props
 */
export type StoryContent = <T extends InitVarsType = EmptyObject>(
    props: T
) => Array<Component>;

/**
 * Configuration options for story appearance and behavior.
 * Applied to the entire story passage.
 *
 * @example
 * ```typescript
 * const options: StoryOptions = {
 *   background: {
 *     image: '/backgrounds/forest.jpg'
 *   },
 *   classNames: {
 *     base: 'min-h-screen bg-cover bg-center',
 *     container: 'max-w-4xl mx-auto p-8'
 *   }
 * };
 *
 * newStory('forest-scene', () => [...], options);
 * ```
 */
export type StoryOptions = {
    /**
     * Background configuration for the story.
     */
    background?: {
        /**
         * URL or path to the background image.
         * Can be a static string or a function that returns a string for dynamic backgrounds.
         *
         * @example
         * ```typescript
         * // Static background
         * image: '/backgrounds/castle.jpg'
         *
         * // Dynamic background based on game state
         * image: () => player.location === 'night'
         *   ? '/backgrounds/castle-night.jpg'
         *   : '/backgrounds/castle-day.jpg'
         * ```
         */
        image?: string | (() => string);
    };

    /**
     * CSS class name overrides for story layout.
     */
    classNames?: {
        /**
         * CSS class for the outermost story container.
         * Controls overall layout, background, and viewport settings.
         *
         * @example
         * ```typescript
         * base: 'min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black'
         * ```
         */
        base?: string;

        /**
         * CSS class for the inner content container.
         * Controls content width, padding, and component spacing.
         *
         * @example
         * ```typescript
         * container: 'max-w-2xl p-6 bg-card/90 backdrop-blur-sm rounded-xl shadow-2xl'
         * ```
         */
        container?: string;
    };
};
