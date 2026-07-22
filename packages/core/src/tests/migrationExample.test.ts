import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
    clearMigrations,
    getAllMigrations,
    runMigrations,
} from "#saves/migrations";
import {
    registerAllMigrations,
    testMigrationChain,
    testSaves,
} from "#saves/migrations/EXAMPLE";

describe("Migration example", () => {
    beforeEach(clearMigrations);
    afterEach(clearMigrations);

    test("registers and applies the complete documented migration chain", () => {
        registerAllMigrations();

        expect(getAllMigrations()).toHaveLength(5);
        const result = runMigrations(testSaves["1.1.0"], "1.1.0", "3.0.0", {
            verbose: false,
        });

        expect(result.success).toBe(true);
        expect(result.migrationsApplied).toHaveLength(4);
        expect(result.data).toMatchObject({
            player: {
                stats: {
                    health: 80,
                    mana: 30,
                },
                skills: {
                    combat: 1,
                    magic: 1,
                    crafting: 1,
                },
                location: {
                    passageId: "start",
                    zone: "village",
                },
                inventory: [
                    expect.objectContaining({ name: "sword", quantity: 1 }),
                    expect.objectContaining({ name: "potion", quantity: 2 }),
                ],
            },
        });
    });

    test("runs the example's own full and partial chain checks", async () => {
        registerAllMigrations();

        expect(await testMigrationChain()).toBeUndefined();
        expect(getAllMigrations()).toHaveLength(5);
    });
});
