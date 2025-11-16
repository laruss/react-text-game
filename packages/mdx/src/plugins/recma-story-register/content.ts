import type { Expression, TemplateElement, TemplateLiteral } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";

import { extractExpression } from "./estree-helpers.js";
import { isTemplate } from "./guards.js";
import type { TemplateContent } from "./types.js";

function templateToExpression(template: TemplateContent): TemplateLiteral {
    const quasis: TemplateElement[] = [];
    const expressions: Expression[] = [];

    let currentQuasiValue = "";

    for (const part of template.parts) {
        if (part?.type === "text") {
            currentQuasiValue += part.value;
            continue;
        }

        if (part?.type === "var" && part.expression.data?.estree) {
            quasis.push({
                type: "TemplateElement",
                value: { raw: currentQuasiValue, cooked: currentQuasiValue },
                tail: false,
            });

            expressions.push(extractExpression(part.expression.data.estree));
            currentQuasiValue = "";
        }
    }

    quasis.push({
        type: "TemplateElement",
        value: { raw: currentQuasiValue, cooked: currentQuasiValue },
        tail: true,
    });

    return {
        type: "TemplateLiteral",
        quasis,
        expressions,
    };
}

export function contentToExpression(
    content: string | TemplateContent
): Expression {
    if (isTemplate(content)) {
        return templateToExpression(content);
    }
    return valueToEstree(content);
}
