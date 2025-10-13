import type { Program } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";
import type { Plugin } from "unified";

import type { MdxExport, MdxStoryMeta } from "#types";

import { mdxStructToEstree } from "./component-transforms.js";

/**
 * A Recma plugin for automatically registering MDX stories within a React-based interactive text game.
 *
 * This plugin processes the provided abstract syntax tree (AST) of an MDX document during compilation. It leverages the
 * metadata and structured components defined in the MDX file to register the story at runtime. The process includes:
 * - Validating that a `passageId` is specified in the file's metadata. If absent or invalid, a warning is emitted during compilation.
 * - Collecting and transforming existing structured components in the MDX document into an ESTree format.
 * - Adding the necessary import statement for the `newStory` function from the core library.
 * - Inserting code to create a new story by invoking the `newStory` function with the metadata and transformed components.
 * - Modifying the program's AST to include an exported `story` object representing the registered story.
 *
 * Metadata fields:
 * - `passageId` (string): Required identifier for the story's primary passage. Must be defined in the file's frontmatter.
 * - `options` (optional): Custom options to be passed to the `newStory` function for additional configuration.
 *
 * @type {Plugin<[], Program>}
 */
const recmaStoryRegister: Plugin<[], Program> = function () {
    return (program, file) => {
        const meta = (file.data?.meta ?? {}) as MdxStoryMeta;
        const mdxStruct = (file.data?.mdxStruct ?? []) as MdxExport["components"];

        if (!meta.passageId || typeof meta.passageId !== "string") {
            file.message("MDX story requires 'passageId' in frontmatter for auto-registration");
            return;
        }

        const componentsArrayExpr = mdxStructToEstree(mdxStruct);

        const existingImports = program.body.filter(
            (node) =>
                node.type === "ImportDeclaration" &&
                node.source.value !== "@react-text-game/mdx" &&
                node.source.value !== "react/jsx-runtime"
        );

        program.body = [
            ...existingImports,
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
                                { type: "Literal", value: meta.passageId },
                                {
                                    type: "ArrowFunctionExpression",
                                    params: [],
                                    body: componentsArrayExpr,
                                    expression: true,
                                },
                                ...(meta.options ? [valueToEstree(meta.options)] : []),
                            ],
                            optional: false,
                        },
                    },
                ],
            },
            {
                type: "ExportDefaultDeclaration",
                declaration: { type: "Identifier", name: "story" },
            },
        ];
    };
};

export default recmaStoryRegister;
