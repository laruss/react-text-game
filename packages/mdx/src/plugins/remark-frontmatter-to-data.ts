import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import YAML from "yaml";

declare module "vfile" {
    interface DataMap {
        meta?: Record<string, unknown>;
    }
}

const remarkFrontmatterToData: Plugin<[], Root> = function () {
    return (tree, file) => {
        let meta: Record<string, unknown> = {};

        visit(tree, "yaml", (node) => {
            if (typeof node.value === "string") {
                try {
                    const parsed = YAML.parse(node.value);
                    if (parsed && typeof parsed === "object") {
                        meta = { ...meta, ...parsed };
                    }
                } catch (e) {
                    console.error(e);
                    file.message("Invalid frontmatter YAML", node);
                }
            }
        });

        file.data.meta = meta;
    };
};

export default remarkFrontmatterToData;
