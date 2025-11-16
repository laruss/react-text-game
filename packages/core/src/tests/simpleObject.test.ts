import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { Game } from "#game";
import { SimpleObject } from "#gameObjects/simpleObject";
import { setupMockStorage, teardownMockStorage } from "#tests/helpers";
import { MockStorage } from "#tests/mocks";

describe("SimpleObject", () => {
    beforeEach(async () => {
        setupMockStorage();
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        Game._resetForTesting();
        teardownMockStorage();
    });

    describe("Initialization", () => {
        test("should initialize with simple variables", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100, mana: 50 },
            });

            expect(player.id).toBe("player");
            expect(player.health).toBe(100);
            expect(player.mana).toBe(50);
        });

        test("should initialize with nested object variables", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                    stats: { strength: 10, agility: 15 },
                },
            });

            expect(player.id).toBe("player");
            expect(player.health.mental).toBe(20);
            expect(player.health.physical).toBe(30);
            expect(player.stats.strength).toBe(10);
        });

        test("should initialize with array variables", () => {
            const inventory = new SimpleObject({
                id: "inventory",
                variables: { items: ["sword", "shield"] },
            });

            expect(inventory.items).toEqual(["sword", "shield"]);
        });

        test("should initialize without variables", () => {
            const obj = new SimpleObject({ id: "test" });

            expect(obj.id).toBe("test");
            expect(obj.variables).toEqual({});
        });
    });

    describe("Variable Access and Modification", () => {
        test("should allow direct property access", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            expect(player.health).toBe(100);
        });

        test("should allow direct property assignment", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            player.health = 50;

            expect(player.health).toBe(50);
        });

        test("should support += operator for primitives", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            player.health += 25;

            expect(player.health).toBe(125);
        });

        test("should support -= operator for primitives", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            player.health -= 30;

            expect(player.health).toBe(70);
        });

        test("should support *= operator for primitives", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { damage: 10 },
            });

            player.damage *= 2;

            expect(player.damage).toBe(20);
        });

        test("should allow string concatenation", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { name: "Hero" },
            });

            player.name += " of Light";

            expect(player.name).toBe("Hero of Light");
        });
    });

    describe("Nested Object Access and Modification", () => {
        test("should allow nested object property access", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            expect(player.health.mental).toBe(20);
            expect(player.health.physical).toBe(30);
        });

        test("should allow nested object property modification", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            player.health.mental = 50;

            expect(player.health.mental).toBe(50);
        });

        test("should support += operator for nested properties", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            player.health.mental += 10;

            expect(player.health.mental).toBe(30);
        });

        test("should support deeply nested object modification", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    stats: {
                        combat: {
                            melee: { damage: 10, accuracy: 80 },
                        },
                    },
                },
            });

            player.stats.combat.melee.damage += 5;

            expect(player.stats.combat.melee.damage).toBe(15);
        });
    });

    describe("Array Modification", () => {
        test("should allow array push", () => {
            const inventory = new SimpleObject({
                id: "inventory",
                variables: { items: ["sword"] },
            });

            inventory.items.push("shield");

            expect(inventory.items).toEqual(["sword", "shield"]);
        });

        test("should allow array pop", () => {
            const inventory = new SimpleObject({
                id: "inventory",
                variables: { items: ["sword", "shield"] },
            });

            const popped = inventory.items.pop();

            expect(popped).toBe("shield");
            expect(inventory.items).toEqual(["sword"]);
        });

        test("should allow array index assignment", () => {
            const inventory = new SimpleObject({
                id: "inventory",
                variables: { items: ["sword", "shield"] },
            });

            inventory.items[0] = "axe";

            expect(inventory.items[0]).toBe("axe");
        });
    });

    describe("Save and Load", () => {
        test("should save simple variables to storage", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100, mana: 50 },
            });

            player.save();

            const savedData = MockStorage.getValue("$.player");
            expect(savedData[0]).toEqual({ health: 100, mana: 50 });
        });

        test("should save nested variables to storage", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            player.save();

            const savedData = MockStorage.getValue("$.player");
            expect(savedData[0]).toEqual({
                health: { mental: 20, physical: 30 },
            });
        });

        test("should require manual save() call to persist changes", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            // Save initial state
            player.save();

            // Modify without saving
            player.health = 50;

            // Storage should still have old value
            const savedData = MockStorage.getValue("$.player");
            expect(savedData[0]).toEqual({ health: 100 });

            // Now save
            player.save();

            // Storage should have new value
            const savedDataAfter = MockStorage.getValue("$.player");
            expect(savedDataAfter[0]).toEqual({ health: 50 });
        });

        test("should require manual save() for nested property changes", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            // Save initial state
            player.save();

            // Modify nested property without saving
            player.health.mental = 50;

            // Storage should still have old value
            const savedData = MockStorage.getValue("$.player");
            expect(
                (savedData[0] as { health: { mental: number } }).health.mental
            ).toBe(20);

            // Now save
            player.save();

            // Storage should have new value
            const savedDataAfter = MockStorage.getValue("$.player");
            expect(
                (savedDataAfter[0] as { health: { mental: number } }).health
                    .mental
            ).toBe(50);
        });

        test("should load variables from storage", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100, mana: 50 },
            });

            // Save initial state
            player.save();

            // Modify in-memory
            player.health = 999;
            expect(player.health).toBe(999);

            // Load should restore from storage
            player.load();
            expect(player.health).toBe(100);
            expect(player.mana).toBe(50);
        });

        test("should load nested variables from storage", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { mental: 20, physical: 30 },
                },
            });

            player.save();

            // Modify
            player.health.mental = 999;

            // Load
            player.load();

            expect(player.health.mental).toBe(20);
            expect(player.health.physical).toBe(30);
        });

        test("should clear variables when loading empty storage", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100 },
            });

            // Don't save, just load
            player.load();

            // @ts-expect-error TS2769
            expect(player.variables).toEqual({});
        });
    });

    describe("Special Type Handling", () => {
        test("should handle Date objects without proxying", () => {
            const date = new Date("2024-01-01");
            const player = new SimpleObject({
                id: "player",
                variables: { createdAt: date },
            });

            expect(player.createdAt).toBeInstanceOf(Date);
            expect(player.createdAt.getTime()).toBe(date.getTime());
        });

        test("should handle RegExp without proxying", () => {
            const pattern = /test/i;
            const player = new SimpleObject({
                id: "player",
                variables: { pattern },
            });

            expect(player.pattern).toBeInstanceOf(RegExp);
            expect(player.pattern.test("TEST")).toBe(true);
        });

        test("should handle boolean values", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { isAlive: true },
            });

            expect(player.isAlive).toBe(true);

            player.isAlive = false;

            expect(player.isAlive).toBe(false);
        });
    });

    describe("Complex Scenarios", () => {
        test("should handle mixed primitive and nested object updates", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    name: "Hero",
                    level: 1,
                    stats: { strength: 10, agility: 10 },
                },
            });

            player.name = "Champion";
            player.level += 1;
            player.stats.strength += 5;

            expect(player.name).toBe("Champion");
            expect(player.level).toBe(2);
            expect(player.stats.strength).toBe(15);
        });

        test("should maintain proxy consistency across multiple accesses", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { current: 100, max: 100 },
                },
            });

            // Access health multiple times
            const health1 = player.health;
            const health2 = player.health;

            // Both should reference the same proxy
            health1.current = 50;

            expect(health2.current).toBe(50);
            expect(player.health.current).toBe(50);
        });

        test("should handle complete state replacement", () => {
            const player = new SimpleObject({
                id: "player",
                variables: {
                    health: { current: 100, max: 100 },
                },
            });

            // Replace entire health object
            player.health = { current: 50, max: 150 };

            expect(player.health.current).toBe(50);
            expect(player.health.max).toBe(150);
        });

        test("should work with Game state serialization", () => {
            const player = new SimpleObject({
                id: "player",
                variables: { health: 100, mana: 50 },
            });

            player.health = 75;

            const gameState = Game.getState();
            expect(gameState.player).toEqual({ health: 75, mana: 50 });

            // Modify and restore
            player.health = 25;
            Game.setState(gameState);

            expect(player.health).toBe(75);
        });
    });
});
