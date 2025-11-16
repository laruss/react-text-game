import type {
    ActionsComponent,
    ActionType,
    AnotherStoryComponent,
    Component,
    ConversationBubble,
    ConversationComponent,
    HeaderComponent,
    HeaderLevel,
    ImageComponent,
    TextComponent,
    VideoComponent,
} from "@react-text-game/core";

import type { MdxStructItem, TemplateContent, TransformResult } from "#types";

/**
 * Helper to extract string content from children (handles TemplateContent).
 * Note: TemplateContent is only used with auto-registration, so this is a fallback.
 */
function extractStringContent(
    children: string | MdxStructItem[] | TemplateContent
): string {
    if (typeof children === "string") {
        return children;
    }
    if (
        typeof children === "object" &&
        "type" in children &&
        children.type === "template"
    ) {
        // Template content - extract text parts only (variables won't work in manual mode)
        return children.parts
            .filter((part) => part.type === "text")
            .map((part) => (part.type === "text" ? part.value : ""))
            .join("");
    }
    return ""; // Array children
}

/**
 * Transforms an array of MDX structure items into Core component types.
 *
 * @param items - Array of MDX structure items from remark-mdx-struct
 * @returns Transformation result with components and any errors encountered
 */
export function transformComponents(items: MdxStructItem[]): TransformResult {
    const components: Component[] = [];
    const errors: string[] = [];

    for (const item of items) {
        try {
            const component = transformSingleComponent(item);
            if (component) {
                components.push(component);
            }
        } catch (error) {
            errors.push(
                `Failed to transform component: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    return { components, errors };
}

/**
 * Transforms a single MDX structure item into a Core component.
 *
 * @param item - Single MDX structure item
 * @returns Transformed Core component or null if not transformable
 */
function transformSingleComponent(item: MdxStructItem): Component | null {
    const { component, props, children } = item;

    // Handle heading elements (h1-h6)
    if (/^h[1-6]$/.test(component)) {
        return transformHeader(
            component as `h${1 | 2 | 3 | 4 | 5 | 6}`,
            children,
            props
        );
    }

    // Handle paragraph elements
    if (component === "p") {
        return transformText(children, props);
    }

    // Handle image elements
    if (component === "img") {
        return transformImage(props);
    }

    // Handle video elements
    if (component === "video") {
        return transformVideo(props);
    }

    // Handle Actions component
    if (component === "Actions") {
        return transformActions(children, props);
    }

    // Handle Include component (maps to AnotherStoryComponent)
    if (component === "Include") {
        return transformInclude(props);
    }

    // Handle Conversation component
    if (component === "Conversation") {
        return transformConversation(children, props);
    }

    return null;
}

/**
 * Transforms heading element to HeaderComponent.
 */
function transformHeader(
    tag: `h${1 | 2 | 3 | 4 | 5 | 6}`,
    children: string | MdxStructItem[] | TemplateContent,
    props: Record<string, unknown>
): HeaderComponent {
    const level = parseInt(tag[1] as string, 10) as HeaderLevel;
    const content = extractStringContent(children);
    const className =
        typeof props.className === "string" ? props.className : undefined;

    return {
        type: "header",
        content,
        props: {
            level,
            ...(className && { className }),
        },
    };
}

/**
 * Transforms paragraph element to TextComponent.
 */
function transformText(
    children: string | MdxStructItem[] | TemplateContent,
    props: Record<string, unknown>
): TextComponent {
    const content = extractStringContent(children);
    const className =
        typeof props.className === "string" ? props.className : undefined;

    return {
        type: "text",
        content,
        ...(className && { props: { className } }),
    };
}

/**
 * Transforms img element to ImageComponent.
 */
function transformImage(props: Record<string, unknown>): ImageComponent {
    const src = typeof props.src === "string" ? props.src : "";
    const alt = typeof props.alt === "string" ? props.alt : undefined;
    const className =
        typeof props.className === "string" ? props.className : undefined;
    const disableModal =
        typeof props.disableModal === "boolean"
            ? props.disableModal
            : undefined;

    return {
        type: "image",
        content: src,
        ...(alt || className || disableModal
            ? {
                  props: {
                      ...(alt && { alt }),
                      ...(className && { className }),
                      ...(disableModal !== undefined && { disableModal }),
                  },
              }
            : {}),
    };
}

/**
 * Transforms video element to VideoComponent.
 */
function transformVideo(props: Record<string, unknown>): VideoComponent {
    const src = typeof props.src === "string" ? props.src : "";
    const className =
        typeof props.className === "string" ? props.className : undefined;
    const controls =
        typeof props.controls === "boolean" ? props.controls : undefined;
    const autoPlay =
        typeof props.autoPlay === "boolean" ? props.autoPlay : undefined;
    const loop = typeof props.loop === "boolean" ? props.loop : undefined;
    const muted = typeof props.muted === "boolean" ? props.muted : undefined;

    return {
        type: "video",
        content: src,
        ...(className ||
        controls !== undefined ||
        autoPlay !== undefined ||
        loop !== undefined ||
        muted !== undefined
            ? {
                  props: {
                      ...(className && { className }),
                      ...(controls !== undefined && { controls }),
                      ...(autoPlay !== undefined && { autoPlay }),
                      ...(loop !== undefined && { loop }),
                      ...(muted !== undefined && { muted }),
                  },
              }
            : {}),
    };
}

/**
 * Transforms Actions component to ActionsComponent.
 */
function transformActions(
    children: string | MdxStructItem[] | TemplateContent,
    props: Record<string, unknown>
): ActionsComponent {
    const actions: ActionType[] = [];

    if (Array.isArray(children)) {
        for (const child of children) {
            if (child.component === "Action") {
                const action = transformAction(child);
                if (action) {
                    actions.push(action);
                }
            }
        }
    }

    const direction =
        typeof props.direction === "string" &&
        (props.direction === "horizontal" || props.direction === "vertical")
            ? props.direction
            : undefined;
    const className =
        typeof props.className === "string" ? props.className : undefined;

    return {
        type: "actions",
        content: actions,
        ...(direction || className
            ? {
                  props: {
                      ...(direction && { direction }),
                      ...(className && { className }),
                  },
              }
            : {}),
    };
}

/**
 * Transforms Action element to ActionType.
 *
 * Note: This is only used for the non-auto-registration plugin.
 * The auto-registration plugin (recma-story-register) handles Actions directly.
 */
function transformAction(item: MdxStructItem): ActionType | null {
    const { props, children } = item;

    // Label is the text content of the Action component
    const label = extractStringContent(children);

    // onPerform is the action callback
    const onPerform = props.onPerform as (() => void) | undefined;
    if (!onPerform || typeof onPerform !== "function") {
        // For non-function values (like expressions), skip this action
        // The recma plugin will handle it properly
        return null;
    }

    // Build the action object, only including defined properties
    const action: ActionType = {
        label,
        action: onPerform,
    };

    // Add optional properties only if they are defined and valid
    if (typeof props.color === "string") {
        const validColors = [
            "default",
            "primary",
            "secondary",
            "success",
            "warning",
            "danger",
        ] as const;
        type ValidColor = (typeof validColors)[number];
        if (validColors.includes(props.color as ValidColor)) {
            action.color = props.color as ValidColor;
        }
    }

    if (typeof props.variant === "string") {
        const validVariants = [
            "solid",
            "faded",
            "bordered",
            "light",
            "flat",
            "ghost",
            "shadow",
        ] as const;
        type ValidVariant = (typeof validVariants)[number];
        if (validVariants.includes(props.variant as ValidVariant)) {
            action.variant = props.variant as ValidVariant;
        }
    }

    if (typeof props.isDisabled === "boolean") {
        action.isDisabled = props.isDisabled;
    }

    const className =
        typeof props.className === "string" ? props.className : null;
    if (className) {
        action.className = className;
    }

    // Handle tooltip
    if (props.tooltip && typeof props.tooltip === "object") {
        const tooltip = transformTooltip(
            props.tooltip as Record<string, unknown>
        );
        if (tooltip) {
            action.tooltip = tooltip;
        }
    }

    return action;
}

/**
 * Transforms tooltip props.
 */
function transformTooltip(
    tooltip: Record<string, unknown>
): ActionType["tooltip"] | undefined {
    const content =
        typeof tooltip.content === "string" ? tooltip.content : undefined;
    if (!content) return undefined;

    const position =
        typeof tooltip.position === "string" &&
        (tooltip.position === "top" ||
            tooltip.position === "bottom" ||
            tooltip.position === "left" ||
            tooltip.position === "right")
            ? tooltip.position
            : undefined;
    const className =
        typeof tooltip.className === "string" ? tooltip.className : undefined;

    return {
        content,
        ...(position && { position }),
        ...(className && { className }),
    };
}

/**
 * Transforms Include component to AnotherStoryComponent.
 */
function transformInclude(
    props: Record<string, unknown>
): AnotherStoryComponent {
    const storyId = typeof props.storyId === "string" ? props.storyId : "";

    return {
        type: "anotherStory",
        storyId,
    };
}

/**
 * Transforms Conversation component to ConversationComponent.
 */
function transformConversation(
    children: string | MdxStructItem[] | TemplateContent,
    props: Record<string, unknown>
): ConversationComponent {
    const bubbles: ConversationBubble[] = [];

    if (Array.isArray(children)) {
        for (const child of children) {
            if (child.component === "Say") {
                const bubble = transformSay(child);
                if (bubble) {
                    bubbles.push(bubble);
                }
            }
        }
    }

    const appearance =
        typeof props.appearance === "string" &&
        (props.appearance === "atOnce" || props.appearance === "byClick")
            ? props.appearance
            : undefined;
    const variant =
        typeof props.variant === "string" &&
        (props.variant === "chat" || props.variant === "messenger")
            ? props.variant
            : undefined;
    const className =
        typeof props.className === "string" ? props.className : undefined;

    return {
        type: "conversation",
        content: bubbles,
        ...(appearance && { appearance }),
        ...(variant || className
            ? {
                  props: {
                      ...(variant && { variant }),
                      ...(className && { className }),
                  },
              }
            : {}),
    };
}

/**
 * Transforms Say element to ConversationBubble.
 */
function transformSay(item: MdxStructItem): ConversationBubble | null {
    const { props, children } = item;

    const content = extractStringContent(children);

    // Build the bubble object
    const bubble: ConversationBubble = { content };

    // Add optional properties only if they are defined
    if (props.who && typeof props.who === "object") {
        const who = transformWho(props.who as Record<string, unknown>);
        if (who) {
            bubble.who = who;
        }
    }

    if (typeof props.color === "string" && props.color.startsWith("#")) {
        bubble.color = props.color as `#${string}`;
    }

    if (
        typeof props.side === "string" &&
        (props.side === "left" || props.side === "right")
    ) {
        bubble.side = props.side;
    }

    if (props.classNames && typeof props.classNames === "object") {
        const classNames = transformBubbleClassNames(
            props.classNames as Record<string, unknown>
        );
        if (classNames) {
            bubble.props = { classNames };
        }
    }

    return bubble;
}

/**
 * Transforms who props for ConversationBubble.
 */
function transformWho(
    who: Record<string, unknown>
): ConversationBubble["who"] | undefined {
    const name = typeof who.name === "string" ? who.name : undefined;
    const avatar = typeof who.avatar === "string" ? who.avatar : undefined;

    if (!name && !avatar) return undefined;

    return {
        ...(name && { name }),
        ...(avatar && { avatar }),
    };
}

/**
 * Transforms classNames for ConversationBubble.
 */
function transformBubbleClassNames(
    classNames: Record<string, unknown>
):
    | NonNullable<NonNullable<ConversationBubble["props"]>["classNames"]>
    | undefined {
    const result: NonNullable<
        NonNullable<ConversationBubble["props"]>["classNames"]
    > = {};
    let hasAny = false;

    if (typeof classNames.base === "string") {
        result.base = classNames.base;
        hasAny = true;
    }

    if (typeof classNames.content === "string") {
        result.content = classNames.content;
        hasAny = true;
    }

    if (typeof classNames.avatar === "string") {
        result.avatar = classNames.avatar;
        hasAny = true;
    }

    return hasAny ? result : undefined;
}
