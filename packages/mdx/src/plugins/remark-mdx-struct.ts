/// <reference types="remark-mdx" />

import type { Heading, Image, Paragraph, PhrasingContent, Root } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";

type Props = Record<string, unknown>;

/**
 * Represents a template part - either plain text or a variable expression
 */
type TemplatePart =
    | { type: "text"; value: string }
    | { type: "var"; expression: { type: "expression"; data?: { estree?: unknown }; value?: string } };

/**
 * Template structure for content with variables
 */
type TemplateContent = {
    type: "template";
    parts: TemplatePart[];
};

type Item =
    | {
          component: `h${1 | 2 | 3 | 4 | 5 | 6}`;
          children: string | TemplateContent;
          props: Props;
      }
    | { component: "p"; children: string | TemplateContent; props: Props }
    | {
          component: string;
          props: Props;
          children: string | Item[] | TemplateContent;
      };

declare module "vfile" {
    interface DataMap {
        mdxStruct?: Item[];
    }
}

/**
 * Processes children array to extract text and Var elements into a template structure.
 * Returns either a plain string (if no Var elements) or a TemplateContent structure.
 */
function processChildrenWithVars(children: PhrasingContent[]): string | TemplateContent {
    const parts: TemplatePart[] = [];
    let hasVars = false;


    // Walk through children to find text, Var elements, and bare expressions
    for (const child of children) {
        if (child.type === "text") {
            // Plain text node
            parts.push({ type: "text", value: child.value });
        } else if (child.type === "mdxTextExpression") {
            // Bare expression like {player.name}
            hasVars = true;
            const data = child.data as { estree?: unknown } | undefined;
            parts.push({
                type: "var",
                expression: {
                    type: "expression",
                    value: child.value,
                    ...(data !== undefined && { data }),
                },
            });
        } else if (child.type === "mdxJsxTextElement") {
            const jsxElement = child as MdxJsxTextElement;
            if (jsxElement.name === "Var") {
                hasVars = true;
                // Extract the expression from Var's children
                // Var should have a single mdxTextExpression child (inline expression)
                const expressionChild = jsxElement.children[0];
                if (expressionChild && expressionChild.type === "mdxTextExpression") {
                    const data = expressionChild.data as { estree?: unknown } | undefined;
                    parts.push({
                        type: "var",
                        expression: {
                            type: "expression",
                            value: expressionChild.value,
                            ...(data !== undefined && { data }),
                        },
                    });
                }
            } else {
                // Other JSX elements - convert to string
                parts.push({ type: "text", value: toString(child) });
            }
        } else {
            // Other node types (links, emphasis, etc.) - convert to string
            parts.push({ type: "text", value: toString(child) });
        }
    }

    // If no Var elements found, return plain string by joining parts
    if (!hasVars) {
        return parts.map(p => p.type === "text" ? p.value : "").join("");
    }

    // Return template structure
    return {
        type: "template",
        parts,
    };
}

/**
 * Processes a node's children to extract text and Var elements into a template structure.
 * Returns either a plain string (if no Var elements) or a TemplateContent structure.
 */
function processTextWithVars(node: Paragraph | Heading): string | TemplateContent {
    return processChildrenWithVars(node.children);
}

const remarkMdxStruct: Plugin<[], Root> = function () {
    return (tree, file) => {
        const out: Item[] = [];

        function processJsxElement(element: MdxJsxFlowElement): Item | null {
            const props: Props = {};
            for (const attr of element.attributes ?? []) {
                if (attr.type === "mdxJsxAttribute") {
                    if (attr.value === null) {
                        props[attr.name] = true;
                    } else if (typeof attr.value === "string") {
                        props[attr.name] = attr.value;
                    } else if (
                        typeof attr.value === "object" &&
                        attr.value.type === "mdxJsxAttributeValueExpression"
                    ) {
                        // Expression value (functions, objects, etc.)
                        // Store the estree data which will be used by recma plugin
                        props[attr.name] = {
                            type: "expression",
                            value: attr.value.value,
                            data: attr.value.data,
                        };
                    }
                }
            }

            if (!element.name) {
                return null;
            }

            const childItems: Item[] = [];
            let hasJsxChildren = false;

            if (element.children) {
                for (const child of element.children) {
                    if (child.type === "mdxJsxFlowElement") {
                        hasJsxChildren = true;
                        const processedChild = processJsxElement(
                            child as MdxJsxFlowElement
                        );
                        if (processedChild) {
                            childItems.push(processedChild);
                        }
                    }
                }
            }

            // Determine children content
            let children: string | Item[] | TemplateContent;
            if (hasJsxChildren) {
                // Has block JSX children (like <Action>, <Say>)
                children = childItems;
            } else if (element.children && element.children.length > 0) {
                // Check if children contain a single paragraph (MDX wraps content in paragraphs)
                if (
                    element.children.length === 1 &&
                    element.children[0]?.type === "paragraph"
                ) {
                    // Unwrap the paragraph and process its inline children
                    const paragraph = element.children[0] as Paragraph;
                    children = processTextWithVars(paragraph);
                } else {
                    // Process as inline phrasing content (text, inline JSX like <Var>)
                    // Force cast to PhrasingContent[] since we know these are inline nodes
                    children = processChildrenWithVars(element.children as unknown as PhrasingContent[]);
                }
            } else {
                // No children
                children = "";
            }

            return { component: element.name, props, children };
        }

        // Process only top-level nodes
        for (const node of tree.children) {
            if (node.type === "heading") {
                const heading = node as Heading;
                out.push({
                    component: `h${heading.depth}`,
                    children: processTextWithVars(heading),
                    props: {},
                });
            } else if (node.type === "paragraph") {
                const paragraph = node as Paragraph;

                // Check if paragraph contains a single image (markdown image syntax)
                if (
                    paragraph.children.length === 1 &&
                    paragraph.children[0]?.type === "image"
                ) {
                    const image = paragraph.children[0] as Image;
                    out.push({
                        component: "img",
                        children: "",
                        props: {
                            src: image.url,
                            alt: image.alt ?? undefined,
                            title: image.title ?? undefined,
                        },
                    });
                } else {
                    // Regular paragraph
                    out.push({
                        component: "p",
                        children: processTextWithVars(paragraph),
                        props: {},
                    });
                }
            } else if (node.type === "mdxJsxFlowElement") {
                const processed = processJsxElement(node as MdxJsxFlowElement);
                if (processed) {
                    out.push(processed);
                }
            }
        }

        file.data.mdxStruct = out;
    };
};

export default remarkMdxStruct;
