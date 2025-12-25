import { describe, expect, test } from "bun:test";

import { deepMerge } from "#helpers";

describe("deepMerge", () => {
    test("should merge simple objects", () => {
        const target = { a: 1, b: 2 };
        const source = { b: 3, c: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 3, c: 4 } as typeof result);
    });

    test("should merge nested objects deeply", () => {
        const target = { a: 1, b: { c: 2, d: 3 } };
        const source = { b: { c: 4 }, e: 5 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: { c: 4, d: 3 }, e: 5 } as typeof result);
    });

    test("should replace arrays instead of merging", () => {
        const target = { items: [1, 2, 3] };
        const source = { items: [4, 5] };
        const result = deepMerge(target, source);

        expect(result).toEqual({ items: [4, 5] });
    });

    test("should skip undefined values", () => {
        const target = { a: 1, b: 2 };
        const source = { b: undefined, c: 3 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2, c: 3 } as typeof result);
    });

    test("should skip null values", () => {
        const target = { a: 1, b: 2 };
        const source = { b: null, c: 3 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2, c: 3 } as typeof result);
    });

    test("should replace primitives with different types", () => {
        const target = { a: 1 };
        const source = { a: "string" };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: "string" } as unknown as typeof result);
    });

    test("should handle deeply nested objects", () => {
        const target = {
            level1: {
                level2: {
                    level3: {
                        value: 1,
                        keep: true,
                    },
                },
            },
        };
        const source = {
            level1: {
                level2: {
                    level3: {
                        value: 2,
                    },
                },
            },
        };
        const result = deepMerge(target, source);

        expect(result).toEqual({
            level1: {
                level2: {
                    level3: {
                        value: 2,
                        keep: true,
                    },
                },
            },
        });
    });

    test("should handle mixed types correctly", () => {
        const target = {
            string: "hello",
            number: 42,
            boolean: true,
            array: [1, 2, 3],
            object: { nested: "value" },
        };
        const source = {
            string: "world",
            array: [4, 5],
            object: { nested: "updated", new: "field" },
        };
        const result = deepMerge(target, source);

        expect(result).toEqual({
            string: "world",
            number: 42,
            boolean: true,
            array: [4, 5],
            object: { nested: "updated", new: "field" },
        } as typeof result);
    });

    test("should replace object with primitive", () => {
        const target = { a: { nested: "value" } };
        const source = { a: "primitive" };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: "primitive" } as unknown as typeof result);
    });

    test("should replace primitive with object", () => {
        const target = { a: "primitive" };
        const source = { a: { nested: "value" } };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: { nested: "value" } } as unknown as typeof result);
    });

    test("should not mutate target object", () => {
        const target = { a: 1, b: { c: 2 } };
        const source = { b: { c: 3 } };
        const result = deepMerge(target, source);

        expect(target).toEqual({ a: 1, b: { c: 2 } });
        expect(result).toEqual({ a: 1, b: { c: 3 } });
        expect(result).not.toBe(target);
    });

    test("should handle empty objects", () => {
        const target = {};
        const source = { a: 1 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1 });
    });

    test("should handle empty source", () => {
        const target = { a: 1 };
        const source = {};
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1 });
    });

    test("should handle complex game state scenario", () => {
        const target = {
            player: {
                health: 100,
                mana: 50,
                inventory: {
                    items: ["sword", "shield"],
                    gold: 100,
                },
            },
            enemy: {
                health: 50,
            },
        };
        const source = {
            player: {
                health: 75,
                inventory: {
                    items: ["potion"],
                },
            },
        };
        const result = deepMerge(target, source);

        expect(result).toEqual({
            player: {
                health: 75,
                mana: 50,
                inventory: {
                    items: ["potion"],
                    gold: 100,
                },
            },
            enemy: {
                health: 50,
            },
        });
    });
});
