import { describe, expect, spyOn, test } from "bun:test";
import { compile } from "@mdx-js/mdx";
import type {
    Expression,
    Literal,
    ObjectExpression,
    Program,
    Property,
} from "estree";

import { reactTextGameStoryPlugin } from "#plugins";
import { mdxStructToEstree } from "#plugins/recma-story-register/component-transforms";
import { extractExpression } from "#plugins/recma-story-register/estree-helpers";
import type { MdxStructItem } from "#types";

function getProperty(object: ObjectExpression, name: string): Property {
    const property = object.properties.find(
        (candidate): candidate is Property =>
            candidate.type === "Property" &&
            ((candidate.key.type === "Identifier" &&
                candidate.key.name === name) ||
                (candidate.key.type === "Literal" &&
                    candidate.key.value === name))
    );

    if (!property) {
        throw new Error(`Missing ESTree property: ${name}`);
    }

    return property;
}

function getObjectProperty(object: ObjectExpression, name: string) {
    const value = getProperty(object, name).value;
    if (value.type !== "ObjectExpression") {
        throw new Error(`Expected ${name} to be an object expression`);
    }
    return value;
}

function getLiteralValue(object: ObjectExpression, name: string) {
    const value = getProperty(object, name).value as Expression;
    if (value.type !== "Literal") {
        throw new Error(`Expected ${name} to be a literal`);
    }
    return (value as Literal).value;
}

describe("plugin edge cases", () => {
    test("reports invalid YAML and does not register a story", async () => {
        const consoleError = spyOn(console, "error").mockImplementation(
            () => undefined
        );

        try {
            const result = await compile(
                `---\npassageId: [unterminated\n---\n# Invalid metadata`,
                reactTextGameStoryPlugin()
            );

            expect(consoleError).toHaveBeenCalledTimes(1);
            expect(result.messages.map((message) => message.reason)).toEqual([
                "Invalid frontmatter YAML",
                "MDX story requires 'passageId' in frontmatter for auto-registration",
            ]);
            expect(result.value).not.toContain("newStory(");
        } finally {
            consoleError.mockRestore();
        }
    });

    test("normalizes emphasis, links, and non-Var inline JSX to text", async () => {
        const result = await compile(
            `---
passageId: rich-inline
---
Hello *brave* [traveler](/map), <span>friend</span>!`,
            reactTextGameStoryPlugin()
        );

        expect(result.value).toContain(
            'content: "Hello brave traveler, friend!"'
        );
    });

    test("ignores a top-level nameless JSX fragment", async () => {
        const result = await compile(
            `---
passageId: nameless-fragment
---
<>
This fragment has no component name.
</>`,
            reactTextGameStoryPlugin()
        );

        expect(result.value).toContain(
            'newStory("nameless-fragment", () => [])'
        );
        expect(result.value).not.toContain(
            "This fragment has no component name"
        );
    });

    test("builds literal and expression conversation props in ESTree", () => {
        const classNamesExpression = {
            type: "expression" as const,
            data: {
                estree: { type: "Identifier" as const, name: "dynamicClasses" },
            },
        };
        const items: MdxStructItem[] = [
            {
                component: "img",
                children: "",
                props: { src: "/hero.png", disableModal: false },
            },
            {
                component: "Conversation",
                props: { className: "conversation" },
                children: [
                    {
                        component: "Say",
                        children: "Literal speaker",
                        props: {
                            who: { name: "Guide" },
                            classNames: { base: "bubble" },
                        },
                    },
                    {
                        component: "Say",
                        children: "Dynamic classes",
                        props: { classNames: classNamesExpression },
                    },
                ],
            },
        ];

        const ast = mdxStructToEstree(items);
        const image = ast.elements[0] as ObjectExpression;
        const imageProps = getObjectProperty(image, "props");
        expect(getLiteralValue(image, "content")).toBe("/hero.png");
        expect(getLiteralValue(imageProps, "disableModal")).toBe(false);

        const conversation = ast.elements[1] as ObjectExpression;
        const bubbles = getProperty(conversation, "content").value;
        if (bubbles.type !== "ArrayExpression") {
            throw new Error("Expected conversation content to be an array");
        }

        const literalBubble = bubbles.elements[0] as ObjectExpression;
        const literalWho = getObjectProperty(literalBubble, "who");
        const literalProps = getObjectProperty(literalBubble, "props");
        const literalClassNames = getObjectProperty(literalProps, "classNames");
        expect(getLiteralValue(literalWho, "name")).toBe("Guide");
        expect(getLiteralValue(literalClassNames, "base")).toBe("bubble");

        const dynamicBubble = bubbles.elements[1] as ObjectExpression;
        const dynamicProps = getObjectProperty(dynamicBubble, "props");
        expect(getProperty(dynamicProps, "classNames").value).toEqual({
            type: "Identifier",
            name: "dynamicClasses",
        });

        const conversationProps = getObjectProperty(conversation, "props");
        expect(getLiteralValue(conversationProps, "className")).toBe(
            "conversation"
        );
    });

    test("extractExpression preserves programs without an expression statement", () => {
        const program: Program = {
            type: "Program",
            sourceType: "module",
            body: [{ type: "EmptyStatement" }],
        };

        expect(extractExpression(program) as unknown).toBe(program);
    });
});
