import { ProcessorOptions } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";

import recmaExportStruct from "./recma-export-struct.js";
import remarkFrontmatterToData from "./remark-frontmatter-to-data.js";
import remarkMdxStruct from "./remark-mdx-struct.js";

export const reactTextGamePlugin = (): Pick<
    ProcessorOptions,
    "recmaPlugins" | "remarkPlugins"
> => ({
    recmaPlugins: [recmaExportStruct],
    remarkPlugins: [
        remarkFrontmatter,
        remarkFrontmatterToData,
        remarkMdxStruct,
    ],
});
