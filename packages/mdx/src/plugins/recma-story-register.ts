import type {
    ArrayExpression,
    Expression,
    ObjectExpression,
    Program,
    Property,
} from "estree";
import { valueToEstree } from "estree-util-value-to-estree";
import type { Plugin } from "unified";

import type { MdxExport, MdxStoryMeta, MdxStructItem } from "#types";

/**
 * Checks if a value is an expression object from MDX.
 */
function isExpression(
    value: unknown
): value is { type: "expression"; data?: { estree?: Program | Expression } } {
    return (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        (value as { type: string }).type === "expression"
    );
}

/**
 * Extracts the actual expression from an estree,
 * which might be wrapped in a Program and ExpressionStatement.
 */
function extractExpression(estree: Program | Expression): Expression {
    // If it's a Program, extract the expression from the first statement
    if (estree.type === "Program" && estree.body.length > 0) {
        const firstStatement = estree.body[0];
        if (firstStatement && firstStatement.type === "ExpressionStatement") {
            return firstStatement.expression;
        }
    }

    // Otherwise, assume it's already an expression
    return estree as Expression;
}

/**
 * Converts MDX struct items to ESTree expressions, preserving function expressions.
 */
function mdxStructToEstree(items: MdxStructItem[]): ArrayExpression {
    const elements: Expression[] = [];

    for (const item of items) {
        elements.push(itemToObjectExpression(item));
    }

    return {
        type: "ArrayExpression",
        elements,
    };
}

/**
 * Converts a single MDX struct item to an ObjectExpression.
 */
function itemToObjectExpression(item: MdxStructItem): ObjectExpression {
    const properties: Property[] = [];

    // Add component properties based on type
    if (item.component.match(/^h[1-6]$/)) {
        // Header component
        properties.push(
            createProperty("type", valueToEstree("header")),
            createProperty("content", valueToEstree(item.children)),
            createProperty("props", valueToEstree({ level: parseInt(item.component[1] as string, 10) }))
        );
    } else if (item.component === "p") {
        // Text component
        properties.push(
            createProperty("type", valueToEstree("text")),
            createProperty("content", valueToEstree(item.children))
        );
    } else if (item.component === "img") {
        // Image component
        properties.push(
            createProperty("type", valueToEstree("image")),
            createProperty("content", valueToEstree(item.props.src))
        );
        // Handle optional image props: alt, title, className, disableModal, onClick
        const imgProps: Record<string, unknown> = {};
        const imgPropsWithExpressions: Property[] = [];

        if (item.props.alt) imgProps.alt = item.props.alt;
        if (item.props.title) imgProps.title = item.props.title;
        if (typeof item.props.className === "string") {
            imgProps.className = item.props.className;
        }

        // Handle disableModal - it might be an expression
        const disableModal = item.props.disableModal;
        if (typeof disableModal === "boolean") {
            imgProps.disableModal = disableModal;
        } else if (isExpression(disableModal) && disableModal.data?.estree) {
            const expr = extractExpression(disableModal.data.estree);
            imgPropsWithExpressions.push(createProperty("disableModal", expr));
        }

        // Handle onClick - it might be an expression
        const onClick = item.props.onClick;
        if (isExpression(onClick) && onClick.data?.estree) {
            const funcExpr = extractExpression(onClick.data.estree);
            imgPropsWithExpressions.push(createProperty("onClick", funcExpr));
        }

        if (Object.keys(imgProps).length > 0 || imgPropsWithExpressions.length > 0) {
            if (imgPropsWithExpressions.length > 0) {
                properties.push(createProperty("props", {
                    type: "ObjectExpression",
                    properties: [
                        ...Object.entries(imgProps).map(([key, val]) =>
                            createProperty(key, valueToEstree(val))
                        ),
                        ...imgPropsWithExpressions
                    ]
                }));
            } else {
                properties.push(createProperty("props", valueToEstree(imgProps)));
            }
        }
    } else if (item.component === "video") {
        // Video component
        properties.push(
            createProperty("type", valueToEstree("video")),
            createProperty("content", valueToEstree(item.props.src))
        );
        // Handle optional video props: className, controls, autoPlay, loop, muted
        const videoProps: Record<string, unknown> = {};
        const videoPropsWithExpressions: Property[] = [];

        if (typeof item.props.className === "string") {
            videoProps.className = item.props.className;
        }

        // Handle boolean props that might be expressions
        const booleanProps = ['controls', 'autoPlay', 'loop', 'muted'] as const;
        for (const propName of booleanProps) {
            const propValue = item.props[propName];
            if (typeof propValue === "boolean") {
                videoProps[propName] = propValue;
            } else if (isExpression(propValue) && propValue.data?.estree) {
                const expr = extractExpression(propValue.data.estree);
                videoPropsWithExpressions.push(createProperty(propName, expr));
            }
        }

        if (Object.keys(videoProps).length > 0 || videoPropsWithExpressions.length > 0) {
            if (videoPropsWithExpressions.length > 0) {
                properties.push(createProperty("props", {
                    type: "ObjectExpression",
                    properties: [
                        ...Object.entries(videoProps).map(([key, val]) =>
                            createProperty(key, valueToEstree(val))
                        ),
                        ...videoPropsWithExpressions
                    ]
                }));
            } else {
                properties.push(createProperty("props", valueToEstree(videoProps)));
            }
        }
    } else if (item.component === "Actions") {
        // Actions component - process children
        const actions: ObjectExpression[] = [];
        if (Array.isArray(item.children)) {
            for (const child of item.children) {
                if (child.component === "Action") {
                    const actionProps: Property[] = [];
                    actionProps.push(createProperty("label", valueToEstree(child.children)));

                    // Handle onPerform - it might be an expression
                    const onPerform = child.props.onPerform;
                    if (isExpression(onPerform) && onPerform.data?.estree) {
                        // Extract the actual expression (unwrap from Program/ExpressionStatement if needed)
                        const funcExpr = extractExpression(onPerform.data.estree);
                        actionProps.push(createProperty("action", funcExpr));
                    }

                    actions.push({
                        type: "ObjectExpression",
                        properties: actionProps,
                    });
                }
            }
        }

        properties.push(
            createProperty("type", valueToEstree("actions")),
            createProperty("content", {
                type: "ArrayExpression",
                elements: actions,
            })
        );
    } else if (item.component === "Include") {
        // Include component
        properties.push(
            createProperty("type", valueToEstree("anotherStory")),
            createProperty("storyId", valueToEstree(item.props.storyId))
        );
    } else if (item.component === "Conversation") {
        // Conversation component - process children
        const bubbles: ObjectExpression[] = [];
        if (Array.isArray(item.children)) {
            for (const child of item.children) {
                if (child.component === "Say") {
                    const bubbleProps: Property[] = [];
                    bubbleProps.push(createProperty("content", valueToEstree(child.children)));

                    // Handle optional props: who, color, side, classNames
                    if (child.props.who) {
                        if (isExpression(child.props.who) && child.props.who.data?.estree) {
                            // Extract the object expression from the estree
                            const whoExpr = extractExpression(child.props.who.data.estree);
                            bubbleProps.push(createProperty("who", whoExpr));
                        } else if (typeof child.props.who === "object") {
                            bubbleProps.push(createProperty("who", valueToEstree(child.props.who)));
                        }
                    }
                    if (typeof child.props.color === "string" && child.props.color.startsWith("#")) {
                        bubbleProps.push(createProperty("color", valueToEstree(child.props.color)));
                    }
                    if (typeof child.props.side === "string" &&
                        (child.props.side === "left" || child.props.side === "right")) {
                        bubbleProps.push(createProperty("side", valueToEstree(child.props.side)));
                    }
                    if (child.props.classNames) {
                        if (isExpression(child.props.classNames) && child.props.classNames.data?.estree) {
                            // Extract the object expression from the estree
                            const classNamesExpr = extractExpression(child.props.classNames.data.estree);
                            bubbleProps.push(createProperty("props", {
                                type: "ObjectExpression",
                                properties: [createProperty("classNames", classNamesExpr)]
                            }));
                        } else if (typeof child.props.classNames === "object") {
                            bubbleProps.push(createProperty("props", valueToEstree({ classNames: child.props.classNames })));
                        }
                    }

                    bubbles.push({
                        type: "ObjectExpression",
                        properties: bubbleProps,
                    });
                }
            }
        }

        properties.push(
            createProperty("type", valueToEstree("conversation")),
            createProperty("content", {
                type: "ArrayExpression",
                elements: bubbles,
            })
        );

        // Handle optional Conversation props: appearance, variant, className
        if (item.props.appearance === "byClick" || item.props.appearance === "atOnce") {
            properties.push(createProperty("appearance", valueToEstree(item.props.appearance)));
        }
        if (item.props.variant || item.props.className) {
            const conversationProps: Record<string, unknown> = {};
            if (item.props.variant === "chat" || item.props.variant === "messenger") {
                conversationProps.variant = item.props.variant;
            }
            if (typeof item.props.className === "string") {
                conversationProps.className = item.props.className;
            }
            if (Object.keys(conversationProps).length > 0) {
                properties.push(createProperty("props", valueToEstree(conversationProps)));
            }
        }
    }

    return {
        type: "ObjectExpression",
        properties,
    };
}

/**
 * Helper to create a Property node.
 */
function createProperty(key: string, value: Expression): Property {
    return {
        type: "Property",
        kind: "init",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: key },
        value,
    };
}

/**
 * Recma plugin that transforms MDX output into an auto-registering story module.
 *
 * This plugin:
 * 1. Extracts metadata (passageId, options) from frontmatter
 * 2. Transforms MDX components to Core component types
 * 3. Generates code that calls `newStory()` with transformed data
 * 4. Executes registration as a module side effect
 * 5. Exports the registered Story instance
 *
 * @example
 * Input MDX:
 * ```mdx
 * ---
 * passageId: test-story
 * ---
 * # Hello World
 * ```
 *
 * Generated Output:
 * ```js
 * import { newStory } from '@react-text-game/core';
 * const story = newStory('test-story', () => [
 *   { type: 'header', content: 'Hello World', props: { level: 1 } }
 * ]);
 * export default story;
 * ```
 */
const recmaStoryRegister: Plugin<[], Program> = function () {
    return (program, file) => {
        // Extract metadata and components from vfile data
        const meta = (file.data?.meta ?? {}) as MdxStoryMeta;
        const mdxStruct = (file.data?.mdxStruct ?? []) as MdxExport["components"];

        // Validate required metadata
        if (!meta.passageId || typeof meta.passageId !== "string") {
            file.message(
                "MDX story requires 'passageId' in frontmatter for auto-registration"
            );
            return;
        }

        // Convert MDX struct to ESTree with expressions preserved
        const componentsArrayExpr = mdxStructToEstree(mdxStruct);

        // Preserve existing imports from the MDX file (except component imports and JSX runtime)
        const existingImports = program.body.filter(
            (node) =>
                node.type === "ImportDeclaration" &&
                // Keep all imports except:
                // - @react-text-game/mdx (MDX component helpers)
                // - react/jsx-runtime (not needed since we're not rendering JSX)
                node.source.value !== "@react-text-game/mdx" &&
                node.source.value !== "react/jsx-runtime"
        );

        // Generate the story registration code
        program.body = [
            // Preserve existing imports first
            ...existingImports,

            // Add import statement: import { newStory } from '@react-text-game/core';
            {
                type: "ImportDeclaration",
                specifiers: [
                    {
                        type: "ImportSpecifier",
                        imported: { type: "Identifier", name: "newStory" },
                        local: { type: "Identifier", name: "newStory" },
                    },
                ],
                source: {
                    type: "Literal",
                    value: "@react-text-game/core",
                },
                attributes: [],
            },

            // Variable declaration: const story = newStory(passageId, () => components, options);
            {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: { type: "Identifier", name: "story" },
                        init: {
                            type: "CallExpression",
                            callee: { type: "Identifier", name: "newStory" },
                            arguments: [
                                // First argument: passageId
                                { type: "Literal", value: meta.passageId },

                                // Second argument: content function () => components
                                {
                                    type: "ArrowFunctionExpression",
                                    params: [],
                                    body: componentsArrayExpr,
                                    expression: true,
                                },

                                // Third argument: options (if provided)
                                ...(meta.options
                                    ? [valueToEstree(meta.options)]
                                    : []),
                            ],
                            optional: false,
                        },
                    },
                ],
            },

            // Export statement: export default story;
            {
                type: "ExportDefaultDeclaration",
                declaration: { type: "Identifier", name: "story" },
            },
        ];
    };
};

export default recmaStoryRegister;
