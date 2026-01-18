import { TextComponent } from "@react-text-game/core/passages";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { Text } from "#components/StoryComponent/components/Text";

describe("Text", () => {
    afterEach(() => {
        cleanup();
    });

    describe("Default rendering", () => {
        test("renders plain text string", () => {
            const component: TextComponent = {
                type: "text",
                content: "Hello, world!",
            };

            render(createElement(Text, { component }));

            expect(screen.getByText("Hello, world!")).toBeTruthy();
        });

        test("renders multi-line text with whitespace preservation", () => {
            const component: TextComponent = {
                type: "text",
                content: "Line 1\nLine 2\nLine 3",
            };

            const { container } = render(createElement(Text, { component }));

            const textDiv = container.querySelector("div");
            expect(textDiv?.textContent).toBe("Line 1\nLine 2\nLine 3");
            expect(textDiv?.classList.contains("whitespace-pre-wrap")).toBe(
                true
            );
        });

        test("renders empty string without errors", () => {
            const component: TextComponent = {
                type: "text",
                content: "",
            };

            const { container } = render(createElement(Text, { component }));

            const textDiv = container.querySelector("div");
            expect(textDiv).toBeTruthy();
            expect(textDiv?.textContent).toBe("");
        });
    });

    describe("HTML rendering with isHTML", () => {
        test("renders simple HTML tags when isHTML is true", () => {
            const component: TextComponent = {
                type: "text",
                content: "<strong>Bold</strong> and <em>italic</em>",
                props: { isHTML: true },
            };

            const { container } = render(createElement(Text, { component }));

            const strong = container.querySelector("strong");
            const em = container.querySelector("em");

            expect(strong).toBeTruthy();
            expect(strong?.textContent).toBe("Bold");
            expect(em).toBeTruthy();
            expect(em?.textContent).toBe("italic");
        });

        test("renders nested HTML elements", () => {
            const component: TextComponent = {
                type: "text",
                content:
                    "<div><p>Paragraph with <a href='#'>link</a></p></div>",
                props: { isHTML: true },
            };

            const { container } = render(createElement(Text, { component }));

            const paragraph = container.querySelector("p");
            const link = container.querySelector("a");

            expect(paragraph).toBeTruthy();
            expect(link).toBeTruthy();
            expect(link?.getAttribute("href")).toBe("#");
        });

        test("renders HTML with inline styles", () => {
            const component: TextComponent = {
                type: "text",
                content: '<span style="color: red;">Red text</span>',
                props: { isHTML: true },
            };

            const { container } = render(createElement(Text, { component }));

            const span = container.querySelector("span");
            expect(span).toBeTruthy();
            expect(span?.style.color).toBe("red");
        });

        test("renders HTML with class attributes", () => {
            const component: TextComponent = {
                type: "text",
                content: '<span class="custom-class">Styled text</span>',
                props: { isHTML: true },
            };

            const { container } = render(createElement(Text, { component }));

            const span = container.querySelector("span.custom-class");
            expect(span).toBeTruthy();
            expect(span?.textContent).toBe("Styled text");
        });
    });

    describe("Edge cases", () => {
        test("ignores isHTML when content is not a string (number)", () => {
            const component: TextComponent = {
                type: "text",
                content: 42,
                props: { isHTML: true },
            };

            render(createElement(Text, { component }));

            // Should render as text, not attempt HTML parsing
            expect(screen.getByText("42")).toBeTruthy();
        });

        test("renders HTML as escaped text when isHTML is false", () => {
            const component: TextComponent = {
                type: "text",
                content: "<strong>Not bold</strong>",
                props: { isHTML: false },
            };

            const { container } = render(createElement(Text, { component }));

            // Should not have a strong element - HTML should be escaped
            const strong = container.querySelector("strong");
            expect(strong).toBeNull();

            // The raw HTML string should be visible as text
            expect(
                screen.getByText("<strong>Not bold</strong>")
            ).toBeTruthy();
        });

        test("renders HTML as escaped text when isHTML is not provided", () => {
            const component: TextComponent = {
                type: "text",
                content: "<em>Not italic</em>",
            };

            const { container } = render(createElement(Text, { component }));

            // Should not have an em element
            const em = container.querySelector("em");
            expect(em).toBeNull();

            // The raw HTML string should be visible as text
            expect(screen.getByText("<em>Not italic</em>")).toBeTruthy();
        });

        test("handles malformed HTML gracefully", () => {
            const component: TextComponent = {
                type: "text",
                content: "<div><p>Unclosed tags",
                props: { isHTML: true },
            };

            // Browser should handle malformed HTML without throwing
            const { container } = render(createElement(Text, { component }));

            // Browser auto-closes tags, content should still render
            expect(container.textContent).toContain("Unclosed tags");
        });
    });

    describe("Styling", () => {
        test("applies default classes", () => {
            const component: TextComponent = {
                type: "text",
                content: "Styled text",
            };

            const { container } = render(createElement(Text, { component }));

            const textDiv = container.querySelector("div");
            expect(textDiv?.classList.contains("text-base")).toBe(true);
            expect(textDiv?.classList.contains("text-justify")).toBe(true);
            expect(textDiv?.classList.contains("whitespace-pre-wrap")).toBe(
                true
            );
        });

        test("applies custom className in default mode", () => {
            const component: TextComponent = {
                type: "text",
                content: "Custom styled",
                props: { className: "custom-class text-lg" },
            };

            const { container } = render(createElement(Text, { component }));

            const textDiv = container.querySelector("div");
            expect(textDiv?.classList.contains("custom-class")).toBe(true);
            expect(textDiv?.classList.contains("text-lg")).toBe(true);
        });

        test("applies custom className in HTML mode", () => {
            const component: TextComponent = {
                type: "text",
                content: "<strong>HTML content</strong>",
                props: { isHTML: true, className: "html-custom-class" },
            };

            const { container } = render(createElement(Text, { component }));

            const textDiv = container.querySelector("div");
            expect(textDiv?.classList.contains("html-custom-class")).toBe(true);
            expect(textDiv?.classList.contains("text-base")).toBe(true);
        });
    });
});
