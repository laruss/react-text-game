import { beforeEach, describe, expect, test } from "bun:test";

import { Storage } from "#storage";

describe("Storage", () => {
    beforeEach(() => {
        // Clear storage state before each test
        Storage.setState({});
    });

    describe("getValue", () => {
        test("returns empty array when path does not exist", () => {
            const result = Storage.getValue<number>("$.nonexistent");
            expect(result).toEqual([]);
        });

        test("retrieves a simple value", () => {
            Storage.setValue("$.player.health", 100);
            const result = Storage.getValue<number>("$.player.health");
            expect(result).toEqual([100]);
        });

        test("retrieves multiple values with wildcard", () => {
            Storage.setValue("$.inventory.sword.damage", 50);
            Storage.setValue("$.inventory.shield.defense", 30);
            const result = Storage.getValue<number>("$.inventory.*.damage");
            expect(result).toEqual([50]);
        });

        test("retrieves nested values", () => {
            Storage.setValue("$.player.stats.strength", 10);
            Storage.setValue("$.player.stats.dexterity", 8);
            const result = Storage.getValue<number>("$.player.stats.strength");
            expect(result).toEqual([10]);
        });

        test("retrieves array values", () => {
            Storage.setValue("$.items", ["sword", "shield", "potion"]);
            const result = Storage.getValue<string[]>("$.items");
            expect(result).toEqual([["sword", "shield", "potion"]]);
        });

        test("retrieves values from arrays using index", () => {
            Storage.setValue("$.items", ["sword", "shield", "potion"]);
            const result = Storage.getValue<string>("$.items[0]");
            expect(result).toEqual(["sword"]);
        });

        test("retrieves multiple array items with wildcard", () => {
            Storage.setValue("$.items", ["sword", "shield", "potion"]);
            const result = Storage.getValue<string>("$.items[*]");
            expect(result).toEqual(["sword", "shield", "potion"]);
        });

        test("retrieves complex objects", () => {
            const playerData = { name: "Hero", level: 5, hp: 100 };
            Storage.setValue("$.player", playerData);
            const result = Storage.getValue<typeof playerData>("$.player");
            expect(result).toEqual([playerData]);
        });
    });

    describe("setValue", () => {
        test("sets a simple value at root level", () => {
            Storage.setValue("$.health", 100);
            expect(Storage.getState()).toEqual({ health: 100 });
        });

        test("sets a nested value creating intermediate objects", () => {
            Storage.setValue("$.player.stats.strength", 10);
            expect(Storage.getState()).toEqual({
                player: { stats: { strength: 10 } },
            });
        });

        test("updates an existing value", () => {
            Storage.setValue("$.player.health", 100);
            Storage.setValue("$.player.health", 75);
            const result = Storage.getValue<number>("$.player.health");
            expect(result).toEqual([75]);
        });

        test("sets string values", () => {
            Storage.setValue("$.player.name", "Hero");
            expect(Storage.getValue<string>("$.player.name")).toEqual(["Hero"]);
        });

        test("sets boolean values", () => {
            Storage.setValue("$.settings.musicEnabled", true);
            expect(
                Storage.getValue<boolean>("$.settings.musicEnabled")
            ).toEqual([true]);
        });

        test("sets array values", () => {
            Storage.setValue("$.inventory", ["sword", "shield"]);
            expect(Storage.getValue<string[]>("$.inventory")).toEqual([
                ["sword", "shield"],
            ]);
        });

        test("sets null values", () => {
            Storage.setValue("$.data", null);
            expect(Storage.getValue<null>("$.data")).toEqual([null]);
        });

        test("sets complex objects", () => {
            const player = { name: "Hero", hp: 100, level: 5 };
            Storage.setValue("$.player", player);
            expect(Storage.getValue("$.player")).toEqual([player]);
        });

        test("throws error when setting system path without _isSystem flag", () => {
            expect(() => {
                Storage.setValue("$._system.test", "value");
            }).toThrow("Cannot set value at system path");
        });

        test("allows setting system path with _isSystem flag", () => {
            Storage.setValue("$._system.test", "value", true);
            expect(Storage.getValue<string>("$._system.test")).toEqual([
                "value",
            ]);
        });

        test("creates deeply nested paths", () => {
            Storage.setValue("$.a.b.c.d.e.f", "deep");
            expect(Storage.getValue<string>("$.a.b.c.d.e.f")).toEqual(["deep"]);
        });

        test("handles multiple values at same level", () => {
            Storage.setValue("$.player.health", 100);
            Storage.setValue("$.player.mana", 50);
            Storage.setValue("$.player.stamina", 75);

            expect(Storage.getState()).toEqual({
                player: { health: 100, mana: 50, stamina: 75 },
            });
        });
    });

    describe("getState", () => {
        test("returns empty object initially", () => {
            expect(Storage.getState()).toEqual({});
        });

        test("returns full state after setting values", () => {
            Storage.setValue("$.player.health", 100);
            Storage.setValue("$.player.name", "Hero");
            Storage.setValue("$.inventory", ["sword"]);

            expect(Storage.getState()).toEqual({
                player: { health: 100, name: "Hero" },
                inventory: ["sword"],
            });
        });

        test("returns state that can be serialized", () => {
            Storage.setValue("$.player.health", 100);
            const state = Storage.getState();
            const serialized = JSON.stringify(state);
            const deserialized = JSON.parse(serialized);

            expect(deserialized).toEqual(state);
        });
    });

    describe("setState", () => {
        test("sets the entire state from an object", () => {
            const newState = {
                player: { health: 100, name: "Hero" },
                inventory: ["sword", "shield"],
            };

            Storage.setState(newState);
            expect(Storage.getState()).toEqual(newState);
        });

        test("clears existing state when setting new state", () => {
            Storage.setValue("$.oldData", "old");
            const newState = { newData: "new" };

            Storage.setState(newState);
            expect(Storage.getState()).toEqual(newState);
            expect(Storage.getValue("$.oldData")).toEqual([]);
        });

        test("throws error when state is null", () => {
            expect(() => {
                Storage.setState(null as never);
            }).toThrow("Invalid state provided");
        });

        test("throws error when state is not an object", () => {
            expect(() => {
                Storage.setState("string" as never);
            }).toThrow("Invalid state provided");
        });

        test("allows setting empty state", () => {
            Storage.setValue("$.data", "value");
            Storage.setState({});
            expect(Storage.getState()).toEqual({});
        });

        test("preserves complex nested structures", () => {
            const complexState = {
                player: {
                    name: "Hero",
                    stats: { str: 10, dex: 8, int: 12 },
                    inventory: [
                        { item: "sword", quantity: 1 },
                        { item: "potion", quantity: 5 },
                    ],
                },
                settings: { volume: 0.8, fullscreen: true },
            };

            Storage.setState(complexState);
            expect(Storage.getState()).toEqual(complexState);
        });
    });

    describe("createPath (indirect testing via setValue)", () => {
        test("creates path with object properties", () => {
            Storage.setValue("$.a.b.c", "value");
            expect(Storage.getState()).toEqual({ a: { b: { c: "value" } } });
        });

        test("creates path with mixed object and array structures", () => {
            // First create the array structure
            Storage.setValue("$.items", []);
            Storage.setValue("$.items[0]", { name: "sword" });

            const state = Storage.getState();
            expect(state).toHaveProperty("items");
            expect(Array.isArray(state.items)).toBe(true);
            expect((state.items as Array<unknown>)[0]).toEqual({
                name: "sword",
            });
        });

        test("handles numeric-like property names", () => {
            Storage.setValue("$.data", { "123": "value" });
            expect(Storage.getValue<string>("$.data['123']")).toEqual([
                "value",
            ]);
        });
    });

    describe("Integration tests", () => {
        test("complete game state scenario", () => {
            // Setup initial game state
            Storage.setValue("$.player.name", "Hero");
            Storage.setValue("$.player.level", 1);
            Storage.setValue("$.player.health", 100);
            Storage.setValue("$.player.maxHealth", 100);
            Storage.setValue("$.player.gold", 50);

            // Add inventory
            Storage.setValue("$.inventory", [
                { name: "Wooden Sword", damage: 5 },
                { name: "Leather Armor", defense: 3 },
                { name: "Health Potion", quantity: 3 },
            ]);

            // Add quest data
            Storage.setValue("$.quests.active", ["Defeat the Dragon"]);
            Storage.setValue("$.quests.completed", []);

            // Verify full state
            const state = Storage.getState();
            expect(state.player).toEqual({
                name: "Hero",
                level: 1,
                health: 100,
                maxHealth: 100,
                gold: 50,
            });
            expect(state.inventory).toHaveLength(3);
            expect(state.quests).toEqual({
                active: ["Defeat the Dragon"],
                completed: [],
            });

            // Simulate game progress
            Storage.setValue("$.player.level", 2);
            Storage.setValue("$.player.health", 75);
            Storage.setValue("$.player.gold", 150);

            // Verify updates
            expect(Storage.getValue<number>("$.player.level")).toEqual([2]);
            expect(Storage.getValue<number>("$.player.health")).toEqual([75]);
            expect(Storage.getValue<number>("$.player.gold")).toEqual([150]);
        });

        test("save and load game state", () => {
            // Set up initial state
            Storage.setValue("$.player.name", "Hero");
            Storage.setValue("$.player.level", 5);
            Storage.setValue("$.currentMap", "dungeon");

            // Save state
            const savedState = Storage.getState();
            const serialized = JSON.stringify(savedState);

            // Simulate loading a different state
            Storage.setState({ player: { name: "NewHero", level: 1 } });

            // Restore saved state
            const restored = JSON.parse(serialized);
            Storage.setState(restored);

            // Verify restoration
            expect(Storage.getValue<string>("$.player.name")).toEqual(["Hero"]);
            expect(Storage.getValue<number>("$.player.level")).toEqual([5]);
            expect(Storage.getValue<string>("$.currentMap")).toEqual([
                "dungeon",
            ]);
        });

        test("updating multiple values preserves other data", () => {
            Storage.setValue("$.player.name", "Hero");
            Storage.setValue("$.player.health", 100);
            Storage.setValue("$.player.mana", 50);

            // Update only health
            Storage.setValue("$.player.health", 75);

            // Verify other values remain unchanged
            expect(Storage.getValue<string>("$.player.name")).toEqual(["Hero"]);
            expect(Storage.getValue<number>("$.player.health")).toEqual([75]);
            expect(Storage.getValue<number>("$.player.mana")).toEqual([50]);
        });
    });

    describe("Edge cases", () => {
        test("handles empty string values", () => {
            Storage.setValue("$.text", "");
            expect(Storage.getValue<string>("$.text")).toEqual([""]);
        });

        test("handles zero values", () => {
            Storage.setValue("$.count", 0);
            expect(Storage.getValue<number>("$.count")).toEqual([0]);
        });

        test("handles false boolean values", () => {
            Storage.setValue("$.flag", false);
            expect(Storage.getValue<boolean>("$.flag")).toEqual([false]);
        });

        test("handles empty arrays", () => {
            Storage.setValue("$.items", []);
            expect(Storage.getValue<unknown[]>("$.items")).toEqual([[]]);
        });

        test("handles empty objects", () => {
            Storage.setValue("$.data", {});
            expect(Storage.getValue<object>("$.data")).toEqual([{}]);
        });

        test("handles special characters in values", () => {
            Storage.setValue("$.text", "Hello\nWorld\t!");
            expect(Storage.getValue<string>("$.text")).toEqual([
                "Hello\nWorld\t!",
            ]);
        });

        test("handles unicode characters", () => {
            Storage.setValue("$.name", "H�ro �� <�");
            expect(Storage.getValue<string>("$.name")).toEqual(["H�ro �� <�"]);
        });

        test("overwrites existing different type", () => {
            Storage.setValue("$.data", "string");
            Storage.setValue("$.data", 123);
            expect(Storage.getValue<number>("$.data")).toEqual([123]);
        });

        test("handles large numbers", () => {
            const largeNum = 9007199254740991; // Number.MAX_SAFE_INTEGER
            Storage.setValue("$.bigNumber", largeNum);
            expect(Storage.getValue<number>("$.bigNumber")).toEqual([largeNum]);
        });

        test("handles deeply nested arrays", () => {
            Storage.setValue("$.nested", [[[["deep"]]]]);
            expect(Storage.getValue("$.nested")).toEqual([[[[["deep"]]]]]);
        });
    });
});
