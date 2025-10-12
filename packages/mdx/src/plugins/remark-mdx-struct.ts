/// <reference types="remark-mdx" />

import type { Heading, Paragraph, Root } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";

type Props = Record<string, unknown>;

type Item =
    | {
          component: `h${1 | 2 | 3 | 4 | 5 | 6}`;
          children: string;
          props: Props;
      }
    | { component: "p"; children: string; props: Props }
    | {
          component: string;
          props: Props;
          children: string | Item[];
      };

declare module "vfile" {
    interface DataMap {
        mdxStruct?: Item[];
    }
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
                        // Expression value (functions, objects, etc.) - store everything for evaluation
                        props[attr.name] = {
                            type: "expression",
                            // todo: here is non-serializable value, need to find a way to store it
                            // value: attr.value.value,
                            // data: attr.value.data,
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

            const children = hasJsxChildren ? childItems : toString(element);

            return { component: element.name, props, children };
        }

        // Process only top-level nodes
        for (const node of tree.children) {
            if (node.type === "heading") {
                const heading = node as Heading;
                out.push({
                    component: `h${heading.depth}`,
                    children: toString(heading),
                    props: {},
                });
            } else if (node.type === "paragraph") {
                const paragraph = node as Paragraph;
                out.push({
                    component: "p",
                    children: toString(paragraph),
                    props: {},
                });
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
