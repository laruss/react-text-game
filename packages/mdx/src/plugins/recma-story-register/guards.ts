import type { ExpressionWrapper, TemplateContent } from "./types.js";

export function isTemplate(value: unknown): value is TemplateContent {
    return (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        (value as { type: string }).type === "template" &&
        "parts" in value
    );
}

export function isExpression(value: unknown): value is ExpressionWrapper {
    return (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        (value as { type: string }).type === "expression"
    );
}
