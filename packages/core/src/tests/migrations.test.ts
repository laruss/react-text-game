import { beforeEach, describe, expect, test } from "bun:test";

import {
    clearMigrations,
    findMigrationPath,
    getAllMigrations,
    registerMigration,
    runMigrations,
    type SaveMigration,
    validateMigrations,
} from "#saves/migrations";

describe("Migration System", () => {
    beforeEach(() => {
        // Clear all registered migrations before each test
        clearMigrations();
    });

    describe("registerMigration", () => {
        test("registers a migration successfully", () => {
            const migration: SaveMigration = {
                from: "1.0.0",
                to: "1.1.0",
                description: "Test migration",
                migrate: (data) => data,
            };

            registerMigration(migration);
            const migrations = getAllMigrations();

            expect(migrations).toHaveLength(1);
            expect(migrations[0]).toBe(migration);
        });

        test("throws error when registering duplicate migration", () => {
            const migration: SaveMigration = {
                from: "1.0.0",
                to: "1.1.0",
                description: "Test migration",
                migrate: (data) => data,
            };

            registerMigration(migration);

            expect(() => registerMigration(migration)).toThrow(
                "Migration from 1.0.0 to 1.1.0 is already registered"
            );
        });

        test("allows multiple migrations with different paths", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "First",
                migrate: (data) => data,
            });

            registerMigration({
                from: "1.1.0",
                to: "1.2.0",
                description: "Second",
                migrate: (data) => data,
            });

            expect(getAllMigrations()).toHaveLength(2);
        });
    });

    describe("findMigrationPath", () => {
        test("returns empty array for same version", () => {
            const path = findMigrationPath("1.0.0", "1.0.0");
            expect(path).toEqual([]);
        });

        test("finds single migration path", () => {
            const migration: SaveMigration = {
                from: "1.0.0",
                to: "1.1.0",
                description: "Test",
                migrate: (data) => data,
            };

            registerMigration(migration);

            const path = findMigrationPath("1.0.0", "1.1.0");
            expect(path).toHaveLength(1);
            expect(path![0]).toBe(migration);
        });

        test("finds multi-step migration path", () => {
            const m1: SaveMigration = {
                from: "1.0.0",
                to: "1.1.0",
                description: "Step 1",
                migrate: (data) => data,
            };
            const m2: SaveMigration = {
                from: "1.1.0",
                to: "1.2.0",
                description: "Step 2",
                migrate: (data) => data,
            };
            const m3: SaveMigration = {
                from: "1.2.0",
                to: "2.0.0",
                description: "Step 3",
                migrate: (data) => data,
            };

            registerMigration(m1);
            registerMigration(m2);
            registerMigration(m3);

            const path = findMigrationPath("1.0.0", "2.0.0");
            expect(path).toHaveLength(3);
            expect(path![0]).toBe(m1);
            expect(path![1]).toBe(m2);
            expect(path![2]).toBe(m3);
        });

        test("returns null when no path exists", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Test",
                migrate: (data) => data,
            });

            const path = findMigrationPath("1.0.0", "2.0.0");
            expect(path).toBeNull();
        });

        test("finds shortest path when multiple paths exist", () => {
            // Create two paths: direct and indirect
            const direct: SaveMigration = {
                from: "1.0.0",
                to: "2.0.0",
                description: "Direct",
                migrate: (data) => data,
            };
            const indirect1: SaveMigration = {
                from: "1.0.0",
                to: "1.5.0",
                description: "Indirect 1",
                migrate: (data) => data,
            };
            const indirect2: SaveMigration = {
                from: "1.5.0",
                to: "2.0.0",
                description: "Indirect 2",
                migrate: (data) => data,
            };

            registerMigration(direct);
            registerMigration(indirect1);
            registerMigration(indirect2);

            const path = findMigrationPath("1.0.0", "2.0.0");
            // Should find the shortest path (direct)
            expect(path).toHaveLength(1);
            expect(path![0]).toBe(direct);
        });
    });

    describe("runMigrations", () => {
        test("returns original data when versions match", () => {
            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "1.0.0");

            expect(result.success).toBe(true);
            expect(result.data).toBe(data);
            expect(result.migrationsApplied).toHaveLength(0);
        });

        test("applies single migration successfully", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Add inventory",
                migrate: (data) => ({
                    ...data,
                    inventory: [],
                }),
            });

            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "1.1.0");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                player: { health: 100 },
                inventory: [],
            });
            expect(result.migrationsApplied).toHaveLength(1);
            expect(result.migrationsApplied[0]?.from).toBe("1.0.0");
            expect(result.migrationsApplied[0]?.to).toBe("1.1.0");
        });

        test("applies multiple migrations in sequence", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Add inventory",
                migrate: (data) => ({
                    ...data,
                    inventory: [],
                }),
            });

            registerMigration({
                from: "1.1.0",
                to: "1.2.0",
                description: "Add quests",
                migrate: (data) => ({
                    ...data,
                    quests: [],
                }),
            });

            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "1.2.0");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                player: { health: 100 },
                inventory: [],
                quests: [],
            });
            expect(result.migrationsApplied).toHaveLength(2);
        });

        test("handles migration that renames fields", () => {
            registerMigration({
                from: "1.0.0",
                to: "2.0.0",
                description: "Rename hp to health",
                migrate: (data) => {
                    const player = data.player as Record<string, unknown>;
                    const { hp, ...playerRest } = player;
                    return {
                        ...data,
                        player: {
                            ...playerRest,
                            health: hp,
                        },
                    };
                },
            });

            const data = { player: { hp: 80, name: "Hero" } };
            const result = runMigrations(data, "1.0.0", "2.0.0");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                player: { health: 80, name: "Hero" },
            });
        });

        test("handles migration that restructures data", () => {
            registerMigration({
                from: "1.0.0",
                to: "2.0.0",
                description: "Move stats to separate object",
                migrate: (data) => {
                    const player = data.player as Record<string, unknown>;
                    return {
                        ...data,
                        player: {
                            name: player.name,
                            stats: {
                                health: player.health,
                                mana: player.mana,
                            },
                        },
                    };
                },
            });

            const data = {
                player: { name: "Hero", health: 100, mana: 50 },
            };
            const result = runMigrations(data, "1.0.0", "2.0.0");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                player: {
                    name: "Hero",
                    stats: { health: 100, mana: 50 },
                },
            });
        });

        test("returns error when no migration path exists (non-strict)", () => {
            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "2.0.0", {
                strict: false,
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain("No migration path found");
            expect(result.migrationsApplied).toHaveLength(0);
        });

        test("throws error when no migration path exists (strict mode)", () => {
            const data = { player: { health: 100 } };

            expect(() => {
                runMigrations(data, "1.0.0", "2.0.0", { strict: true });
            }).toThrow("No migration path found");
        });

        test("returns error when migration function throws", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Failing migration",
                migrate: () => {
                    throw new Error("Migration failed");
                },
            });

            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "1.1.0");

            expect(result.success).toBe(false);
            expect(result.error).toContain("Migration failed");
        });

        test("returns error when migration returns invalid data", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Invalid migration",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                migrate: () => null as any,
            });

            const data = { player: { health: 100 } };
            const result = runMigrations(data, "1.0.0", "1.1.0");

            expect(result.success).toBe(false);
            expect(result.error).toContain("returned invalid data type");
        });

        test("complex migration chain scenario", () => {
            // Simulate a realistic migration chain
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Add inventory",
                migrate: (data) => {
                    const player = data.player as Record<string, unknown>;
                    return {
                        ...data,
                        player: {
                            ...player,
                            inventory: [],
                        },
                    };
                },
            });

            registerMigration({
                from: "1.1.0",
                to: "1.2.0",
                description: "Rename hp to health",
                migrate: (data) => {
                    const player = data.player as Record<string, unknown>;
                    const { hp, ...rest } = player;
                    return {
                        ...data,
                        player: {
                            ...rest,
                            health: hp ?? 100,
                        },
                    };
                },
            });

            registerMigration({
                from: "1.2.0",
                to: "2.0.0",
                description: "Add skills",
                migrate: (data) => {
                    const player = data.player as Record<string, unknown>;
                    return {
                        ...data,
                        player: {
                            ...player,
                            skills: { combat: 1, magic: 1 },
                        },
                    };
                },
            });

            const oldData = {
                player: { name: "Hero", hp: 75 },
            };

            const result = runMigrations(oldData, "1.0.0", "2.0.0");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                player: {
                    name: "Hero",
                    health: 75,
                    inventory: [],
                    skills: { combat: 1, magic: 1 },
                },
            });
            expect(result.migrationsApplied).toHaveLength(3);
        });
    });

    describe("validateMigrations", () => {
        test("returns valid for empty migrations", () => {
            const result = validateMigrations("1.0.0");
            expect(result.valid).toBe(true);
            expect(result.issues).toHaveLength(0);
        });

        test("returns valid for complete migration chain", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Step 1",
                migrate: (data) => data,
            });
            registerMigration({
                from: "1.1.0",
                to: "1.2.0",
                description: "Step 2",
                migrate: (data) => data,
            });
            registerMigration({
                from: "1.2.0",
                to: "2.0.0",
                description: "Step 3",
                migrate: (data) => data,
            });

            const result = validateMigrations("2.0.0");
            expect(result.valid).toBe(true);
            expect(result.issues).toHaveLength(0);
        });

        test("detects missing path to latest version", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Step 1",
                migrate: (data) => data,
            });
            // Missing: 1.1.0 -> 2.0.0

            const result = validateMigrations("2.0.0");
            expect(result.valid).toBe(false);
            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues[0]).toContain(
                "No migration path from base version 1.0.0 to latest version 2.0.0"
            );
        });

        test("detects dead ends", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Step 1",
                migrate: (data) => data,
            });
            registerMigration({
                from: "1.0.0",
                to: "1.5.0",
                description: "Branch",
                migrate: (data) => data,
            });
            // 1.5.0 is a dead end - no path from it to anywhere

            const result = validateMigrations("1.1.0");
            expect(result.valid).toBe(false);
            expect(result.issues.some((issue) => issue.includes("Dead end"))).toBe(
                true
            );
        });

        test("accepts multiple base versions if all reach latest", () => {
            // Two separate starting points
            registerMigration({
                from: "1.0.0",
                to: "2.0.0",
                description: "Path 1",
                migrate: (data) => data,
            });
            registerMigration({
                from: "1.5.0",
                to: "2.0.0",
                description: "Path 2",
                migrate: (data) => data,
            });

            const result = validateMigrations("2.0.0");
            expect(result.valid).toBe(true);
        });
    });

    describe("clearMigrations", () => {
        test("clears all registered migrations", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Test",
                migrate: (data) => data,
            });

            expect(getAllMigrations()).toHaveLength(1);

            clearMigrations();

            expect(getAllMigrations()).toHaveLength(0);
        });
    });

    describe("Real-world migration scenarios", () => {
        test("handles adding optional fields with defaults", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Add optional settings",
                migrate: (data) => ({
                    ...data,
                    settings: {
                        volume: 1.0,
                        difficulty: "normal",
                    },
                }),
            });

            const oldSave = {
                player: { name: "Hero" },
            };

            const result = runMigrations(oldSave, "1.0.0", "1.1.0");

            expect(result.success).toBe(true);
            if (result.data) {
                expect(result.data.settings).toEqual({
                    volume: 1.0,
                    difficulty: "normal",
                });
            }
        });

        test("handles transforming array data", () => {
            registerMigration({
                from: "1.0.0",
                to: "2.0.0",
                description: "Convert inventory to item objects",
                migrate: (data) => {
                    const oldInventory = (data.inventory || []) as string[];
                    const itemCounts = new Map<string, number>();

                    oldInventory.forEach((item: string) => {
                        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
                    });

                    const newInventory = Array.from(itemCounts.entries()).map(
                        ([name, quantity], index) => ({
                            id: `item_${index}`,
                            name,
                            quantity,
                        })
                    );

                    return {
                        ...data,
                        inventory: newInventory,
                    };
                },
            });

            const oldSave = {
                inventory: ["sword", "potion", "potion", "shield"],
            };

            const result = runMigrations(oldSave, "1.0.0", "2.0.0");

            expect(result.success).toBe(true);
            if (result.data) {
                expect(result.data.inventory).toHaveLength(3);
                expect(result.data.inventory).toEqual([
                    { id: "item_0", name: "sword", quantity: 1 },
                    { id: "item_1", name: "potion", quantity: 2 },
                    { id: "item_2", name: "shield", quantity: 1 },
                ]);
            }
        });

        test("handles conditional migrations based on data presence", () => {
            registerMigration({
                from: "1.0.0",
                to: "1.1.0",
                description: "Migrate conditional data",
                migrate: (data) => {
                    const player = (data.player || {}) as Record<string, unknown>;
                    return {
                        ...data,
                        player: {
                            ...player,
                            // Use existing value or default
                            health: player.hp ?? player.health ?? 100,
                            hp: undefined, // Remove old field if it exists
                        },
                    };
                },
            });

            // Test with hp field
            const save1 = { player: { hp: 75 } };
            const result1 = runMigrations(save1, "1.0.0", "1.1.0");
            expect(result1.success).toBe(true);
            if (result1.data) {
                expect((result1.data.player as Record<string, unknown>).health).toBe(75);
            }

            // Test with health field already
            const save2 = { player: { health: 80 } };
            const result2 = runMigrations(save2, "1.0.0", "1.1.0");
            expect(result2.success).toBe(true);
            if (result2.data) {
                expect((result2.data.player as Record<string, unknown>).health).toBe(80);
            }

            // Test with neither field
            const save3 = { player: { name: "Hero" } };
            const result3 = runMigrations(save3, "1.0.0", "1.1.0");
            expect(result3.success).toBe(true);
            if (result3.data) {
                expect((result3.data.player as Record<string, unknown>).health).toBe(100);
            }
        });
    });

    describe("Generic type safety", () => {
        test("works with typed migrations for better type safety", () => {
            // Define a typed migration with specific field types
            // Note: Must extend Record<string, unknown> to satisfy MigrationGameSaveState constraint
            type PlayerInventory = {
                player?: {
                    inventory: string[];
                };
            } & Record<string, unknown>;

            const migration: SaveMigration<PlayerInventory> = {
                from: "1.0.0",
                to: "1.1.0",
                description: "Add typed inventory",
                migrate: (data) => {
                    const player = data.player || {};
                    return {
                        ...data,
                        player: {
                            ...player,
                            inventory: [], // TypeScript knows this should be string[]
                        },
                    };
                },
            };

            registerMigration(migration);

            const oldSave = { player: { name: "Hero" } };
            const result = runMigrations(oldSave, "1.0.0", "1.1.0");

            expect(result.success).toBe(true);
            if (result.data) {
                expect((result.data as PlayerInventory).player?.inventory).toEqual([]);
            }
        });

        test("supports complex nested types for type safety", () => {
            // Note: Must extend Record<string, unknown> to satisfy MigrationGameSaveState constraint
            type ComplexPlayerState = {
                player?: {
                    stats?: {
                        health: number;
                        mana: number;
                    };
                };
            } & Record<string, unknown>;

            const migration: SaveMigration<ComplexPlayerState> = {
                from: "1.0.0",
                to: "2.0.0",
                description: "Restructure player stats with types",
                migrate: (data) => {
                    const player = (data.player || {}) as Record<string, unknown>;
                    return {
                        ...data,
                        player: {
                            name: player.name,
                            stats: {
                                health: (player.health as number) ?? 100,
                                mana: (player.mana as number) ?? 50,
                            },
                        },
                    };
                },
            };

            registerMigration(migration);

            const oldSave = {
                player: { name: "Hero", health: 80, mana: 30 },
            };
            const result = runMigrations(oldSave, "1.0.0", "2.0.0");

            expect(result.success).toBe(true);
            if (result.data) {
                const migratedData = result.data as ComplexPlayerState;
                expect(migratedData.player?.stats?.health).toBe(80);
                expect(migratedData.player?.stats?.mana).toBe(30);
            }
        });
    });
});
