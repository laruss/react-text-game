/// <reference types="remark-mdx" />

import type { Heading, Paragraph, Root } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Props = Record<string, unknown>;

type Item =
    | {
          component: `h${1 | 2 | 3 | 4 | 5 | 6}`;
          children: string;
          props: Props;
      }
    | { component: "p"; children: string; props: Props }
    | { component: string; props: Props; children?: undefined };

declare module "vfile" {
    interface DataMap {
        mdxStruct?: Item[];
    }
}

const remarkMdxStruct: Plugin<[], Root> = function () {
    return (tree, file) => {
        const out: Item[] = [];

        visit(tree, (node) => {
            if (node.type === "heading") {
                const heading = node as Heading;
                out.push({
                    component: `h${heading.depth}` as const,
                    children: toString(heading),
                    props: {},
                } as Item);
            } else if (node.type === "paragraph") {
                const paragraph = node as Paragraph;
                out.push({
                    component: "p",
                    children: toString(paragraph),
                    props: {},
                });
            } else if (node.type === "mdxJsxFlowElement") {
                const element = node as MdxJsxFlowElement;
                const props = {} as Props;
                for (const attr of element.attributes ?? []) {
                    if (attr.type === "mdxJsxAttribute") {
                        props[attr.name] =
                            attr.value === null ? true : attr.value;
                    }
                }
                if (element.name) {
                    out.push({ component: element.name, props, children: undefined });
                }
            }
        });

        file.data.mdxStruct = out;
    };
};

export default remarkMdxStruct;
