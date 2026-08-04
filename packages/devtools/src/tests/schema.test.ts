import { describe, expect, test } from "bun:test";

import { buildSchema, describeKind, mergeSchemas } from "#schema";
import { SCHEMA_VERSION } from "#types";

import { schemaOf } from "./helpers";

describe("describeKind", () => {
    test("names primitives by their typeof", () => {
        expect(describeKind("a")).toBe("string");
        expect(describeKind(1)).toBe("number");
        expect(describeKind(true)).toBe("boolean");
        expect(describeKind(undefined)).toBe("undefined");
    });

    test("treats null as its own kind rather than an object", () => {
        expect(describeKind(null)).toBe("null");
    });

    test("names plain objects", () => {
        expect(describeKind({ a: 1 })).toBe("object");
    });

    test("reports an empty array as having an unknown element kind", () => {
        expect(describeKind([])).toBe("array<unknown>");
    });

    test("derives the element kind of a uniform array", () => {
        expect(describeKind(["a", "b"])).toBe("array<string>");
        expect(describeKind([{ a: 1 }])).toBe("array<object>");
        expect(describeKind([[1]])).toBe("array<array<number>>");
    });

    test("reports disagreeing elements as mixed", () => {
        expect(describeKind([1, "a"])).toBe("array<mixed>");
    });
});

describe("buildSchema", () => {
    test("flattens every node of the state tree", () => {
        const schema = buildSchema({
            gameVersion: "0.1.0",
            gameData: {
                player: { name: "Ada", inventory: { money: 5, items: [] } },
            },
            passageIds: ["intro"],
            capturedFrom: "code",
        });

        expect(schema.paths).toEqual({
            player: "object",
            "player.inventory": "object",
            "player.inventory.items": "array<unknown>",
            "player.inventory.money": "number",
            "player.name": "string",
        });
        expect(schema.schemaVersion).toBe(SCHEMA_VERSION);
        expect(schema.capturedFrom).toBe("code");
    });

    test("does not descend into arrays", () => {
        const schema = buildSchema({
            gameVersion: "0.1.0",
            gameData: { log: [{ text: "hi" }] },
            passageIds: null,
            capturedFrom: "save",
        });

        expect(Object.keys(schema.paths)).toEqual(["log"]);
        expect(schema.paths.log).toBe("array<object>");
    });

    test("lists entities without the engine-owned system key", () => {
        const schema = buildSchema({
            gameVersion: "0.1.0",
            gameData: {
                wallet: { gold: 1 },
                _system: { game: { currentPassageId: null } },
                player: {},
            },
            passageIds: null,
            capturedFrom: "code",
        });

        expect(schema.entities).toEqual(["player", "wallet"]);
        // A literal dotted key, not a nested lookup - hence the index access.
        expect(schema.paths["_system.game.currentPassageId"]).toBe("null");
    });

    test("sorts paths and passages so snapshots stay stable", () => {
        const schema = buildSchema({
            gameVersion: "0.1.0",
            gameData: { b: { z: 1, a: 2 }, a: {} },
            passageIds: ["village", "attic"],
            capturedFrom: "code",
        });

        expect(Object.keys(schema.paths)).toEqual(["a", "b", "b.a", "b.z"]);
        expect(schema.passages).toEqual(["attic", "village"]);
    });

    test("keeps an unknown passage registry as null", () => {
        expect(
            buildSchema({
                gameVersion: "0.1.0",
                gameData: {},
                passageIds: null,
                capturedFrom: "dump",
            }).passages
        ).toBeNull();
    });
});

describe("mergeSchemas", () => {
    test("rejects an empty list", () => {
        expect(() => mergeSchemas([])).toThrow(
            "Cannot merge an empty list of schemas"
        );
    });

    test("returns a lone schema unchanged", () => {
        const only = schemaOf({ player: "object" });

        expect(mergeSchemas([only])).toBe(only);
    });

    test("unions paths and entities across slots", () => {
        const merged = mergeSchemas([
            schemaOf({ player: "object", "player.name": "string" }),
            schemaOf({ wallet: "object", "wallet.gold": "number" }),
        ]);

        expect(merged.entities).toEqual(["player", "wallet"]);
        expect(Object.keys(merged.paths)).toEqual([
            "player",
            "player.name",
            "wallet",
            "wallet.gold",
        ]);
    });

    test("prefers a concrete element kind over an empty one", () => {
        const merged = mergeSchemas([
            schemaOf({ "player.items": "array<unknown>" }),
            schemaOf({ "player.items": "array<string>" }),
        ]);

        expect(merged.paths["player.items"]).toBe("array<string>");
    });

    test("keeps the first concrete kind when a later slot is empty", () => {
        const merged = mergeSchemas([
            schemaOf({ "player.items": "array<string>" }),
            schemaOf({ "player.items": "array<unknown>" }),
        ]);

        expect(merged.paths["player.items"]).toBe("array<string>");
    });
});
