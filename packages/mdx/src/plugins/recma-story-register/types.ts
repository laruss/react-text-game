import type { Expression, Program } from "estree";

export type ExpressionWrapper = {
    type: "expression";
    data?: { estree?: Program | Expression };
    value?: string;
};

export type TemplateTextPart = {
    type: "text";
    value: string;
};

export type TemplateVarPart = {
    type: "var";
    expression: ExpressionWrapper;
};

export type TemplatePart = TemplateTextPart | TemplateVarPart;

export type TemplateContent = {
    type: "template";
    parts: TemplatePart[];
};
