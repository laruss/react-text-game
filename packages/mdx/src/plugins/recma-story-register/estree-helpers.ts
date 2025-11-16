import type { Expression, Program, Property } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";

export function extractExpression(estree: Program | Expression): Expression {
    if (estree.type === "Program" && estree.body.length > 0) {
        const [first] = estree.body;
        if (first?.type === "ExpressionStatement") {
            return first.expression;
        }
    }
    return estree as Expression;
}

export function createProperty(key: string, value: Expression): Property {
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

export function createPropsProperty(
    baseProps: Record<string, unknown>,
    expressionEntries: Array<{ key: string; value: Expression }>
): Property | null {
    if (!Object.keys(baseProps).length && expressionEntries.length === 0) {
        return null;
    }

    if (expressionEntries.length === 0) {
        return createProperty("props", valueToEstree(baseProps));
    }

    return createProperty("props", {
        type: "ObjectExpression",
        properties: [
            ...Object.entries(baseProps).map(([key, val]) =>
                createProperty(key, valueToEstree(val))
            ),
            ...expressionEntries.map(({ key, value }) =>
                createProperty(key, value)
            ),
        ],
    });
}
