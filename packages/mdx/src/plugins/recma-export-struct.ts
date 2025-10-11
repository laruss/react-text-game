import type { Program } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";
import type { Plugin } from "unified";

const recmaExportStruct: Plugin<[], Program> = function () {
    return (program, file) => {
        const meta = file.data?.meta ?? {};
        const components = file.data?.mdxStruct ?? [];

        const payload = { meta, components };

        program.body = [
            {
                type: "ExportDefaultDeclaration",
                declaration: valueToEstree(payload),
            },
        ];
    };
};

export default recmaExportStruct;
