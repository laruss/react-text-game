import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createElement } from "react";

import { Game } from "#game";
import { newWidget, Widget } from "#passages/widget";
import { Storage } from "#storage";

// Counter for unique IDs
let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("Widget Passage", () => {
    beforeEach(async () => {
        Storage.setState({});
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        Game._resetForTesting();
    });

    describe("Creation", () => {
        test("creates widget with static ReactNode content", () => {
            const content = createElement("div", null, "Hello World");
            const widget = newWidget(uniqueId("widget"), content);

            expect(widget).toBeInstanceOf(Widget);
            expect(widget.type).toBe("widget");
        });

        test("creates widget with string content", () => {
            const widget = newWidget(uniqueId("widget"), "Simple String");

            expect(widget).toBeInstanceOf(Widget);
            expect(widget.type).toBe("widget");
        });

        test("creates widget with number content", () => {
            const widget = newWidget(uniqueId("widget"), 42);

            expect(widget).toBeInstanceOf(Widget);
        });

        test("creates widget with null content", () => {
            const widget = newWidget(uniqueId("widget"), null);

            expect(widget).toBeInstanceOf(Widget);
        });

        test("creates widget with function component", () => {
            const MyComponent = () => createElement("div", null, "Component");
            const widget = newWidget(uniqueId("widget"), MyComponent);

            expect(widget).toBeInstanceOf(Widget);
        });

        test("registers widget with Game on creation", () => {
            const id = uniqueId("widget");
            const widget = newWidget(id, "Content");

            expect(Game.getPassageById(id)).toBe(widget);
        });
    });

    describe("Display - Static Content", () => {
        test("display returns static string content directly", () => {
            const widget = newWidget(uniqueId("widget"), "Static String");

            const result = widget.display();

            expect(result).toBe("Static String");
        });

        test("display returns static number content directly", () => {
            const widget = newWidget(uniqueId("widget"), 123);

            const result = widget.display();

            expect(result).toBe(123);
        });

        test("display returns null content directly", () => {
            const widget = newWidget(uniqueId("widget"), null);

            const result = widget.display();

            expect(result).toBeNull();
        });

        test("display returns ReactNode content directly", () => {
            const content = createElement(
                "span",
                { className: "test" },
                "Text"
            );
            const widget = newWidget(uniqueId("widget"), content);

            const result = widget.display();

            expect(result).toBe(content);
        });

        test("display returns pre-evaluated JSX directly", () => {
            // Simulating: newWidget('id', (() => <div>...</div>)())
            const preEvaluated = createElement("div", null, Date.now());
            const widget = newWidget(uniqueId("widget"), preEvaluated);

            const result = widget.display();

            expect(result).toBe(preEvaluated);
        });
    });

    describe("Display - Function Content (React Components)", () => {
        test("display wraps function in createElement", () => {
            const MyComponent = () => createElement("div", null, "Hello");
            const widget = newWidget(uniqueId("widget"), MyComponent);

            const result = widget.display();

            // Result should be a React element, not the string "Hello"
            expect(result).toBeDefined();
            expect(typeof result).toBe("object");
            expect(result).not.toBe("Hello");
        });

        test("display creates React element with correct type", () => {
            const MyComponent = () => createElement("div", null, "Content");
            const widget = newWidget(uniqueId("widget"), MyComponent);

            const result = widget.display() as React.ReactElement;

            // The element's type should be the component function
            expect(result.type).toBe(MyComponent);
        });

        test("function is NOT called directly during display", () => {
            let wasCalled = false;
            const MyComponent = () => {
                wasCalled = true;
                return createElement("div", null, "Content");
            };
            const widget = newWidget(uniqueId("widget"), MyComponent);

            // display() should NOT call the function - it wraps it in createElement
            widget.display();

            // The function is not called until React renders the element
            expect(wasCalled).toBe(false);
        });

        test("arrow function component is wrapped in createElement", () => {
            const ArrowComponent = () => createElement("span", null, "Arrow");
            const widget = newWidget(uniqueId("widget"), ArrowComponent);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(ArrowComponent);
        });

        test("named function component is wrapped in createElement", () => {
            function NamedComponent() {
                return createElement("div", null, "Named");
            }
            const widget = newWidget(uniqueId("widget"), NamedComponent);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(NamedComponent);
        });

        test("lowercase named function is still wrapped in createElement", () => {
            // This is the key fix - even with lowercase names (like minified code),
            // functions should be wrapped in createElement
            function lowercaseComponent() {
                return createElement("div", null, "lowercase");
            }
            const widget = newWidget(uniqueId("widget"), lowercaseComponent);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(lowercaseComponent);
            expect(typeof result).toBe("object");
        });

        test("minified-style single letter function is wrapped in createElement", () => {
            // Simulating minified component names like 'e', 't', 'n'
            const e = () => createElement("div", null, "minified");
            const widget = newWidget(uniqueId("widget"), e);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(e);
            expect(typeof result).toBe("object");
        });
    });

    describe("Display Caching", () => {
        test("caches static content after display", () => {
            const widget = newWidget(uniqueId("widget"), "Cached Content");

            expect(widget.hasDisplayCache()).toBe(false);

            widget.display();

            expect(widget.hasDisplayCache()).toBe(true);
            expect(widget.getLastDisplayResult<string>()).toBe(
                "Cached Content"
            );
        });

        test("caches React element after display", () => {
            const MyComponent = () => createElement("div", null, "Component");
            const widget = newWidget(uniqueId("widget"), MyComponent);

            expect(widget.hasDisplayCache()).toBe(false);

            const displayResult = widget.display();

            expect(widget.hasDisplayCache()).toBe(true);
            const cachedResult = widget.getLastDisplayResult();
            expect(cachedResult).toEqual(displayResult);
        });

        test("getLastDisplayResult returns null before first display", () => {
            const widget = newWidget(uniqueId("widget"), "Content");

            expect(widget.getLastDisplayResult()).toBeNull();
        });

        test("cache updates on subsequent display calls", () => {
            const content1 = createElement("div", null, "First");
            const widget = newWidget(uniqueId("widget"), content1);

            widget.display();
            const cache1 = widget.getLastDisplayResult();

            // For static content, cache remains the same
            widget.display();
            const cache2 = widget.getLastDisplayResult();

            expect(cache1).toBe(cache2);
        });
    });

    describe("Integration with Game", () => {
        test("can navigate to widget passage", () => {
            const widget = newWidget(uniqueId("widget"), "Navigate Test");

            Game.jumpTo(widget.id);

            expect(Game.currentPassage).toBe(widget);
        });

        test("widget is accessible via Game.getPassageById", () => {
            const id = uniqueId("widget");
            const widget = newWidget(id, "Accessible Content");

            const retrieved = Game.getPassageById(id);

            expect(retrieved).toBe(widget);
        });

        test("multiple widgets can coexist", () => {
            const widget1 = newWidget(uniqueId("widget1"), "Content 1");
            const widget2 = newWidget(uniqueId("widget2"), "Content 2");
            const widget3 = newWidget(uniqueId("widget3"), "Content 3");

            expect(Game.getPassageById(widget1.id)).toBe(widget1);
            expect(Game.getPassageById(widget2.id)).toBe(widget2);
            expect(Game.getPassageById(widget3.id)).toBe(widget3);
        });
    });

    describe("Edge Cases", () => {
        test("handles undefined content gracefully", () => {
            const widget = newWidget(uniqueId("widget"), undefined);

            const result = widget.display();

            expect(result).toBeUndefined();
        });

        test("handles boolean content", () => {
            const widgetTrue = newWidget(uniqueId("widget"), true);
            const widgetFalse = newWidget(uniqueId("widget"), false);

            expect(widgetTrue.display()).toBe(true);
            expect(widgetFalse.display()).toBe(false);
        });

        test("handles array content (fragment-like)", () => {
            const content = [
                createElement("div", { key: "1" }, "First"),
                createElement("div", { key: "2" }, "Second"),
            ];
            const widget = newWidget(uniqueId("widget"), content);

            const result = widget.display();

            expect(result).toBe(content);
            expect(Array.isArray(result)).toBe(true);
        });

        test("handles nested createElement", () => {
            const content = createElement(
                "div",
                null,
                createElement("span", null, "Nested"),
                createElement("p", null, "Content")
            );
            const widget = newWidget(uniqueId("widget"), content);

            const result = widget.display();

            expect(result).toBe(content);
        });

        test("function returning null is wrapped in createElement", () => {
            const NullComponent = () => null;
            const widget = newWidget(uniqueId("widget"), NullComponent);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(NullComponent);
        });

        test("function returning undefined is wrapped in createElement", () => {
            const UndefinedComponent = (): undefined => undefined;
            const widget = newWidget(uniqueId("widget"), UndefinedComponent);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(UndefinedComponent);
        });
    });

    describe("Minification Safety", () => {
        // These tests verify the fix for the minification issue where
        // function names get mangled to lowercase identifiers

        test("component with mangled name 'a' works correctly", () => {
            const a = () => createElement("div", null, "Mangled A");
            const widget = newWidget(uniqueId("widget"), a);

            const result = widget.display() as React.ReactElement;

            expect(typeof result).toBe("object");
            expect(result.type).toBe(a);
        });

        test("component with mangled name 't' works correctly", () => {
            const t = () => createElement("div", null, "Mangled T");
            const widget = newWidget(uniqueId("widget"), t);

            const result = widget.display() as React.ReactElement;

            expect(typeof result).toBe("object");
            expect(result.type).toBe(t);
        });

        test("component with numeric-like name works correctly", () => {
            const _0 = () => createElement("div", null, "Numeric");
            const widget = newWidget(uniqueId("widget"), _0);

            const result = widget.display() as React.ReactElement;

            expect(typeof result).toBe("object");
            expect(result.type).toBe(_0);
        });

        test("anonymous function works correctly", () => {
            const widget = newWidget(uniqueId("widget"), function () {
                return createElement("div", null, "Anonymous");
            });

            const result = widget.display() as React.ReactElement;

            expect(typeof result).toBe("object");
        });

        test("component assigned to variable with different name works", () => {
            function OriginalName() {
                return createElement("div", null, "Original");
            }
            // Simulating: const x = OriginalName; (name property becomes 'OriginalName')
            const x = OriginalName;
            const widget = newWidget(uniqueId("widget"), x);

            const result = widget.display() as React.ReactElement;

            expect(result.type).toBe(x);
            expect(result.type).toBe(OriginalName);
        });
    });
});
