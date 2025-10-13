import type { ArrayExpression, Expression, ObjectExpression, Property } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";

import type { MdxStructItem } from "#types";

import { contentToExpression } from "./content.js";
import { createProperty, createPropsProperty, extractExpression } from "./estree-helpers.js";
import { isExpression } from "./guards.js";
import type { TemplateContent } from "./types.js";

export function mdxStructToEstree(items: MdxStructItem[]): ArrayExpression {
    return {
        type: "ArrayExpression",
        elements: items.map((item) => itemToObjectExpression(item)),
    };
}

function itemToObjectExpression(item: MdxStructItem): ObjectExpression {
    const properties: Property[] = [];

    if (/^h[1-6]$/.test(item.component)) {
        properties.push(...buildHeadingProperties(item));
    } else if (item.component === "p") {
        properties.push(...buildTextProperties(item));
    } else if (item.component === "img") {
        properties.push(...buildImageProperties(item));
    } else if (item.component === "video") {
        properties.push(...buildVideoProperties(item));
    } else if (item.component === "Actions") {
        properties.push(...buildActionsProperties(item));
    } else if (item.component === "Include") {
        properties.push(...buildIncludeProperties(item));
    } else if (item.component === "Conversation") {
        properties.push(...buildConversationProperties(item));
    }

    return {
        type: "ObjectExpression",
        properties,
    };
}

function buildHeadingProperties(item: MdxStructItem): Property[] {
    const content = contentToExpression(item.children as string | TemplateContent);
    return [
        createProperty("type", valueToEstree("header")),
        createProperty("content", content),
        createProperty(
            "props",
            valueToEstree({ level: parseInt(item.component[1] as string, 10) })
        ),
    ];
}

function buildTextProperties(item: MdxStructItem): Property[] {
    const content = contentToExpression(item.children as string | TemplateContent);
    return [
        createProperty("type", valueToEstree("text")),
        createProperty("content", content),
    ];
}

function buildImageProperties(item: MdxStructItem): Property[] {
    const properties: Property[] = [
        createProperty("type", valueToEstree("image")),
        createProperty("content", valueToEstree(item.props.src)),
    ];

    const baseProps: Record<string, unknown> = {};
    const expressionProps: Array<{ key: string; value: Expression }> = [];

    if (item.props.alt) baseProps.alt = item.props.alt;
    if (item.props.title) baseProps.title = item.props.title;
    if (typeof item.props.className === "string") {
        baseProps.className = item.props.className;
    }

    const disableModal = item.props.disableModal;
    if (typeof disableModal === "boolean") {
        baseProps.disableModal = disableModal;
    } else if (isExpression(disableModal) && disableModal.data?.estree) {
        expressionProps.push({
            key: "disableModal",
            value: extractExpression(disableModal.data.estree),
        });
    }

    const onClick = item.props.onClick;
    if (isExpression(onClick) && onClick.data?.estree) {
        expressionProps.push({
            key: "onClick",
            value: extractExpression(onClick.data.estree),
        });
    }

    const propsProperty = createPropsProperty(baseProps, expressionProps);
    if (propsProperty) {
        properties.push(propsProperty);
    }

    return properties;
}

function buildVideoProperties(item: MdxStructItem): Property[] {
    const properties: Property[] = [
        createProperty("type", valueToEstree("video")),
        createProperty("content", valueToEstree(item.props.src)),
    ];

    const baseProps: Record<string, unknown> = {};
    const expressionProps: Array<{ key: string; value: Expression }> = [];

    if (typeof item.props.className === "string") {
        baseProps.className = item.props.className;
    }

    const booleanPropNames = ["controls", "autoPlay", "loop", "muted"] as const;
    for (const propName of booleanPropNames) {
        const value = item.props[propName];
        if (typeof value === "boolean") {
            baseProps[propName] = value;
        } else if (isExpression(value) && value.data?.estree) {
            expressionProps.push({
                key: propName,
                value: extractExpression(value.data.estree),
            });
        }
    }

    const propsProperty = createPropsProperty(baseProps, expressionProps);
    if (propsProperty) {
        properties.push(propsProperty);
    }

    return properties;
}

function buildActionsProperties(item: MdxStructItem): Property[] {
    const actions: ObjectExpression[] = [];

    if (Array.isArray(item.children)) {
        for (const child of item.children) {
            if (child.component !== "Action") {
                continue;
            }

            const actionProps: Property[] = [
                createProperty(
                    "label",
                    contentToExpression(child.children as string | TemplateContent)
                ),
            ];

            const onPerform = child.props.onPerform;
            if (isExpression(onPerform) && onPerform.data?.estree) {
                actionProps.push(
                    createProperty(
                        "action",
                        extractExpression(onPerform.data.estree)
                    )
                );
            }

            actions.push({ type: "ObjectExpression", properties: actionProps });
        }
    }

    return [
        createProperty("type", valueToEstree("actions")),
        createProperty("content", {
            type: "ArrayExpression",
            elements: actions,
        }),
    ];
}

function buildIncludeProperties(item: MdxStructItem): Property[] {
    return [
        createProperty("type", valueToEstree("anotherStory")),
        createProperty("storyId", valueToEstree(item.props.storyId)),
    ];
}

function buildConversationProperties(item: MdxStructItem): Property[] {
    const bubbles: ObjectExpression[] = [];

    if (Array.isArray(item.children)) {
        for (const child of item.children) {
            if (child.component !== "Say") {
                continue;
            }

            const bubbleProperties: Property[] = [
                createProperty(
                    "content",
                    contentToExpression(child.children as string | TemplateContent)
                ),
            ];

            const { who, color, side, classNames } = child.props;

            if (who) {
                if (isExpression(who) && who.data?.estree) {
                    bubbleProperties.push(
                        createProperty("who", extractExpression(who.data.estree))
                    );
                } else if (typeof who === "object") {
                    bubbleProperties.push(createProperty("who", valueToEstree(who)));
                }
            }

            if (typeof color === "string" && color.startsWith("#")) {
                bubbleProperties.push(createProperty("color", valueToEstree(color)));
            }

            if (
                typeof side === "string" &&
                (side === "left" || side === "right")
            ) {
                bubbleProperties.push(createProperty("side", valueToEstree(side)));
            }

            const baseProps: Record<string, unknown> = {};
            const expressionProps: Array<{ key: string; value: Expression }> = [];

            if (classNames) {
                if (isExpression(classNames) && classNames.data?.estree) {
                    expressionProps.push({
                        key: "classNames",
                        value: extractExpression(classNames.data.estree),
                    });
                } else if (typeof classNames === "object") {
                    baseProps.classNames = classNames;
                }
            }

            const propsProperty = createPropsProperty(baseProps, expressionProps);
            if (propsProperty) {
                bubbleProperties.push(propsProperty);
            }

            bubbles.push({
                type: "ObjectExpression",
                properties: bubbleProperties,
            });
        }
    }

    const properties: Property[] = [
        createProperty("type", valueToEstree("conversation")),
        createProperty("content", {
            type: "ArrayExpression",
            elements: bubbles,
        }),
    ];

    if (item.props.appearance === "byClick" || item.props.appearance === "atOnce") {
        properties.push(
            createProperty("appearance", valueToEstree(item.props.appearance))
        );
    }

    const baseProps: Record<string, unknown> = {};
    if (item.props.variant === "chat" || item.props.variant === "messenger") {
        baseProps.variant = item.props.variant;
    }
    if (typeof item.props.className === "string") {
        baseProps.className = item.props.className;
    }

    const propsProperty = createPropsProperty(baseProps, []);
    if (propsProperty) {
        properties.push(propsProperty);
    }

    return properties;
}
