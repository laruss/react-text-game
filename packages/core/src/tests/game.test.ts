import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { SYSTEM_PASSAGE_NAMES } from "#constants";
import { Game } from "#game";
import { BaseGameObject } from "#gameObjects";
import { Passage } from "#passages/passage";
import { setupMockStorage, teardownMockStorage } from "#tests/helpers";
import { GameSaveState } from "#types";

// Test helper classes
class TestEntity extends BaseGameObject<{ health: number; name: string }> {
    constructor(id: string, health = 100, name = "Test") {
        super({
            id,
            variables: { health, name },
        });
    }

    // Provide methods to modify state for testing
    setHealth(value: number) {
        this._variables.health = value;
    }

    setName(value: string) {
        this._variables.name = value;
    }

    getHealth() {
        return this._variables.health;
    }

    getName() {
        return this._variables.name;
    }
}

class TestPassage extends Passage {
    constructor(id: string) {
        super(id, "widget");
    }

    display() {
        return { content: `Passage: ${this.id}` };
    }
}

// Counter for unique IDs
let testCounter = 0;
function uniqueId(prefix: string): string {
    return `${prefix}-${testCounter++}`;
}

describe("Game", () => {
    beforeEach(async () => {
        setupMockStorage();
        sessionStorage.clear();
        await Game.init({ gameName: "Test Game", isDevMode: true });
    });

    afterEach(() => {
        Game._resetForTesting();
        teardownMockStorage();
    });

    describe("Initialization", () => {
        test("sets default options on init", () => {
            expect(Game.options.gameName).toBe("Test Game");
            expect(Game.options.gameVersion).toBe("1.0.0");
        });

        test("sets custom options on init", async () => {
            await Game.init({
                gameName: "Custom Game",
                gameId: "custom-id",
                description: "Test description",
                gameVersion: "2.0.0",
                author: "Test Author",
                isDevMode: true,
            });

            expect(Game.options.gameName).toBe("Custom Game");
            expect(Game.options.gameId).toBe("custom-id");
            expect(Game.options.description).toBe("Test description");
            expect(Game.options.gameVersion).toBe("2.0.0");
            expect(Game.options.author).toBe("Test Author");
            expect(Game.options.isDevMode).toBe(true);
        });

        test("sets start menu as current passage on init", () => {
            expect(Game.selfState.currentPassageId).toBe(
                SYSTEM_PASSAGE_NAMES.START_MENU
            );
        });
    });

    describe("Initial State", () => {
        test("applies full entity state override", async () => {
            // Reset and create a fresh game with entities
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: { health: 25, name: "OverriddenName" },
                },
            });

            expect(player.getHealth()).toBe(25);
            expect(player.getName()).toBe("OverriddenName");
        });

        test("applies partial entity state (merge)", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: { health: 50 },
                },
            });

            expect(player.getHealth()).toBe(50);
            expect(player.getName()).toBe("DefaultName");
        });

        test("replaces arrays instead of merging", async () => {
            Game._resetForTesting();
            setupMockStorage();

            class InventoryEntity extends BaseGameObject<{
                items: Array<string>;
            }> {
                constructor(id: string) {
                    super({
                        id,
                        variables: { items: ["sword", "shield", "potion"] },
                    });
                }

                getItems() {
                    return this._variables.items;
                }
            }

            const inventoryId = uniqueId("inventory");
            const inventory = new InventoryEntity(inventoryId);

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [inventoryId]: { items: ["newItem"] },
                },
            });

            expect(inventory.getItems()).toEqual(["newItem"]);
        });

        test("ignores unknown entities", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: { health: 50 },
                    nonExistentEntity: { foo: "bar" },
                },
            });

            expect(player.getHealth()).toBe(50);
            const state = Game.getState();
            expect(state).not.toHaveProperty("nonExistentEntity");
        });

        test("ignores system paths", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: { health: 50 },
                    _system: { game: { currentPassageId: "hack" } },
                },
            });

            expect(player.getHealth()).toBe(50);
            expect(Game.selfState.currentPassageId).toBe(
                SYSTEM_PASSAGE_NAMES.START_MENU
            );
        });

        test("handles empty initialState", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {},
            });

            expect(player.getHealth()).toBe(100);
            expect(player.getName()).toBe("DefaultName");
        });

        test("handles nested object merging in initialState", async () => {
            Game._resetForTesting();
            setupMockStorage();

            class ComplexEntity extends BaseGameObject<{
                stats: {
                    health: number;
                    mana: number;
                };
                name: string;
            }> {
                constructor(id: string) {
                    super({
                        id,
                        variables: {
                            stats: { health: 100, mana: 50 },
                            name: "Hero",
                        },
                    });
                }

                getStats() {
                    return this._variables.stats;
                }

                getName() {
                    return this._variables.name;
                }
            }

            const playerId = uniqueId("player");
            const player = new ComplexEntity(playerId);

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: {
                        stats: { health: 75 },
                    },
                },
            });

            expect(player.getStats()).toEqual({ health: 75, mana: 50 });
            expect(player.getName()).toBe("Hero");
        });

        test("handles multiple entities in initialState", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const enemyId = uniqueId("enemy");

            const player = new TestEntity(playerId, 100, "Hero");
            const enemy = new TestEntity(enemyId, 50, "Goblin");

            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
                initialState: {
                    [playerId]: { health: 75, name: "TestHero" },
                    [enemyId]: { health: 25, name: "TestGoblin" },
                },
            });

            expect(player.getHealth()).toBe(75);
            expect(player.getName()).toBe("TestHero");
            expect(enemy.getHealth()).toBe(25);
            expect(enemy.getName()).toBe("TestGoblin");
        });

        test("initialState is not required", async () => {
            Game._resetForTesting();
            setupMockStorage();

            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "DefaultName");

            // Init without initialState option
            await Game.init({
                gameName: "Test Game",
                isDevMode: true,
            });

            expect(player.getHealth()).toBe(100);
            expect(player.getName()).toBe("DefaultName");
        });
    });

    describe("Entity Registration", () => {
        test("registers a single entity", () => {
            const entity = new TestEntity(uniqueId("player"));

            // Entity should be registered (constructor calls registerEntity)
            const proxied = Game._getProxiedObject(entity);
            expect(proxied).toBeDefined();
            expect(proxied.id).toBe(entity.id);
        });

        test("registers multiple entities", () => {
            const player = new TestEntity(uniqueId("player"));
            const enemy = new TestEntity(uniqueId("enemy"));

            const allEntities = Game._getAllProxiedObjects();
            expect(allEntities.length).toBeGreaterThanOrEqual(2);

            const playerProxy = Game._getProxiedObject(player);
            const enemyProxy = Game._getProxiedObject(enemy);

            expect(playerProxy.id).toBe(player.id);
            expect(enemyProxy.id).toBe(enemy.id);
        });

        test("throws error when registering duplicate entity", () => {
            const id = uniqueId("duplicate");
            new TestEntity(id);

            expect(() => {
                new TestEntity(id);
            }).toThrow(`Object "${id}" is already registered`);
        });

        test("proxies entities with Valtio", () => {
            const entity = new TestEntity(uniqueId("player"));
            const proxied = Game._getProxiedObject(entity);

            // Proxied object should be reactive
            proxied.setHealth(50);
            expect(entity.getHealth()).toBe(50);
        });
    });

    describe("Passage Registration", () => {
        test("registers a single passage", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);

            const retrieved = Game.getPassageById(passageId);
            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(passageId);
        });

        test("registers multiple passages", () => {
            const id1 = uniqueId("intro");
            const id2 = uniqueId("chapter1");
            const id3 = uniqueId("chapter2");

            new TestPassage(id1);
            new TestPassage(id2);
            new TestPassage(id3);

            const allPassages = Game.getAllPassages();
            expect(allPassages.length).toBeGreaterThanOrEqual(3);

            const intro = Game.getPassageById(id1);
            const chapter1 = Game.getPassageById(id2);

            expect(intro?.id).toBe(id1);
            expect(chapter1?.id).toBe(id2);
        });

        test("throws error when registering duplicate non-system passage", () => {
            const id = uniqueId("intro");
            new TestPassage(id);

            expect(() => {
                new TestPassage(id);
            }).toThrow(`Passage "${id}" is already registered`);
        });

        test("allows re-registration of system passages", () => {
            const systemPassage1 = new TestPassage(
                SYSTEM_PASSAGE_NAMES.START_MENU
            );
            const systemPassage2 = new TestPassage(
                SYSTEM_PASSAGE_NAMES.START_MENU
            );

            // Should not throw
            expect(systemPassage1.id).toBe(SYSTEM_PASSAGE_NAMES.START_MENU);
            expect(systemPassage2.id).toBe(SYSTEM_PASSAGE_NAMES.START_MENU);
        });

        test("returns iterator of registered passages", () => {
            // Create some passages first
            new TestPassage(uniqueId("p1"));
            new TestPassage(uniqueId("p2"));

            const iterator = Game.registeredPassages;
            const passages = Array.from(iterator);

            expect(passages.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Navigation", () => {
        test("jumps to passage by string id", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);

            Game.jumpTo(passageId);

            expect(Game.selfState.currentPassageId).toBe(passageId);
        });

        test("generates renderId on jumpTo", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);

            Game.jumpTo(passageId);

            expect(Game.selfState.renderId).not.toBeNull();
            expect(typeof Game.selfState.renderId).toBe("string");
        });

        test("renderId changes on each jumpTo call", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);

            Game.jumpTo(passageId);
            const firstRenderId = Game.selfState.renderId;

            Game.jumpTo(passageId);
            const secondRenderId = Game.selfState.renderId;

            expect(firstRenderId).not.toBeNull();
            expect(secondRenderId).not.toBeNull();
            expect(firstRenderId).not.toBe(secondRenderId);
        });

        test("renderId is unique across multiple jumps", () => {
            const id1 = uniqueId("p1");
            const id2 = uniqueId("p2");
            new TestPassage(id1);
            new TestPassage(id2);

            const renderIds = new Set<string>();

            for (let i = 0; i < 10; i++) {
                Game.jumpTo(i % 2 === 0 ? id1 : id2);
                const renderId = Game.selfState.renderId;
                expect(renderId).not.toBeNull();
                if (renderId) {
                    renderIds.add(renderId);
                }
            }

            // All render IDs should be unique
            expect(renderIds.size).toBe(10);
        });

        test("jumping to same passage multiple times generates different renderIds", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);

            const renderIds: Array<string | null> = [];
            for (let i = 0; i < 5; i++) {
                Game.jumpTo(passageId);
                renderIds.push(Game.selfState.renderId);
            }

            // All render IDs should exist and be unique
            expect(renderIds.every((id) => id !== null)).toBe(true);
            const uniqueIds = new Set(renderIds);
            expect(uniqueIds.size).toBe(5);
        });

        test("jumps to passage by object", () => {
            const passageId = uniqueId("intro");
            const passage = new TestPassage(passageId);

            Game.jumpTo(passage);

            expect(Game.selfState.currentPassageId).toBe(passageId);
        });

        test("throws error when jumping to non-existent passage", () => {
            expect(() => {
                Game.jumpTo("nonexistent");
            }).toThrow('Passage "nonexistent" not found');
        });

        test("sets current passage without validation", () => {
            Game.setCurrent("any-passage-id");

            expect(Game.selfState.currentPassageId).toBe("any-passage-id");
        });

        test("currentPassage returns null when no current passage exists", () => {
            Game.setCurrent("nonexistent");

            const current = Game.currentPassage;
            expect(current).toBeNull();
        });

        test("currentPassage returns passage object when set", () => {
            const passageId = uniqueId("intro");
            const passage = new TestPassage(passageId);
            Game.jumpTo(passage);

            const current = Game.currentPassage;
            expect(current).not.toBeNull();
            expect(current?.id).toBe(passageId);
        });

        test("getPassageById returns null for non-existent passage", () => {
            const passage = Game.getPassageById("nonexistent");
            expect(passage).toBeNull();
        });

        test("getAllPassages returns array of all passages", () => {
            // Create some passages first
            new TestPassage(uniqueId("p1"));
            new TestPassage(uniqueId("p2"));
            new TestPassage(uniqueId("p3"));

            const passages = Game.getAllPassages();
            expect(Array.isArray(passages)).toBe(true);
            expect(passages.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe("State Management", () => {
        test("getState captures complete game state", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);
            Game.jumpTo(passageId);

            const state = Game.getState();

            expect(state).toBeDefined();
            expect(typeof state).toBe("object");
        });

        test("getState includes Game's internal state", () => {
            const passageId = uniqueId("intro");
            new TestPassage(passageId);
            Game.jumpTo(passageId);

            const state = Game.getState();

            // Should have system data
            expect(state).toHaveProperty("_system");
            expect(state._system).toHaveProperty("game");
            // @ts-expect-error TS18046
            expect(state._system.game.currentPassageId).toBe(passageId);
        });

        test("getState includes entity states", () => {
            const entityId = uniqueId("player");
            new TestEntity(entityId, 75, "Hero");

            const state = Game.getState();

            // Should have player data
            expect(state).toHaveProperty(entityId);
            expect(state[entityId]).toEqual({ health: 75, name: "Hero" });
        });

        test("setState restores complete game state", () => {
            const entityId = uniqueId("player");
            const passageId = uniqueId("intro");

            const entity = new TestEntity(entityId, 100, "Hero");
            new TestPassage(passageId);
            Game.jumpTo(passageId);

            const savedState = Game.getState();

            // Change state
            entity.setHealth(50);
            Game.setCurrent(SYSTEM_PASSAGE_NAMES.START_MENU);

            // Restore - NOTE: This may fail due to Storage system path handling issues
            // when entity registries accumulate state from previous tests
            Game.setState(savedState);

            expect(entity.getHealth()).toBe(100);
            expect(Game.selfState.currentPassageId).toBe(passageId);
        });

        test("setState restores entity variables", () => {
            const playerId = uniqueId("player");
            const enemyId = uniqueId("enemy");

            const player = new TestEntity(playerId, 100, "Hero");
            const enemy = new TestEntity(enemyId, 50, "Goblin");

            const savedState = Game.getState();

            // Modify entities
            player.setHealth(25);
            player.setName("Changed");
            enemy.setHealth(10);

            // Restore
            Game.setState(savedState);

            expect(player.getHealth()).toBe(100);
            expect(player.getName()).toBe("Hero");
            expect(enemy.getHealth()).toBe(50);
            expect(enemy.getName()).toBe("Goblin");
        });

        test("state is serializable", () => {
            const entityId = uniqueId("player");
            const passageId = uniqueId("intro");

            new TestEntity(entityId, 100, "Hero");
            new TestPassage(passageId);
            Game.jumpTo(passageId);

            const state = Game.getState();
            const serialized = JSON.stringify(state);
            const deserialized = JSON.parse(serialized) as GameSaveState;

            expect(deserialized).toEqual(state);
        });
    });

    describe("Auto-save", () => {
        test("enableAutoSave enables auto-saving", async () => {
            const entityId = uniqueId("player");

            const entity = new TestEntity(entityId);

            // Enable auto-save explicitly
            Game.enableAutoSave();

            // Clear session storage to test
            sessionStorage.clear();

            // Change state
            entity.setHealth(50);

            // Wait for debounce
            await new Promise((resolve) => setTimeout(resolve, 600));

            const saved = sessionStorage.getItem("gameAutoSave");
            // When explicitly enabled, auto-save should work even in dev mode
            expect(saved).not.toBeNull();
        });

        test("disableAutoSave stops auto-saving", async () => {
            const entityId = uniqueId("player");
            const entity = new TestEntity(entityId);

            // Disable auto-save
            Game.disableAutoSave();

            // Clear session storage
            sessionStorage.clear();

            // Change state
            entity.setHealth(50);

            // Wait for debounce
            await new Promise((resolve) => setTimeout(resolve, 600));

            const saved = sessionStorage.getItem("gameAutoSave");
            expect(saved).toBeNull();
        });

        test("loadFromSessionStorage loads saved state", async () => {
            const entityId = uniqueId("player");
            const passageId = uniqueId("intro");

            const entity = new TestEntity(entityId, 100, "Hero");
            new TestPassage(passageId);
            Game.jumpTo(passageId);

            const state = Game.getState();
            sessionStorage.setItem("gameAutoSave", JSON.stringify(state));

            // Change state
            entity.setHealth(50);
            Game.setCurrent("different");

            // Load from session storage
            const loaded = Game.loadFromSessionStorage();

            expect(loaded).toBe(true);
            expect(entity.getHealth()).toBe(100);
            expect(Game.selfState.currentPassageId).toBe(passageId);
        });

        test("loadFromSessionStorage returns false when no saved state", () => {
            sessionStorage.clear();

            const loaded = Game.loadFromSessionStorage();
            expect(loaded).toBe(false);
        });

        test("loadFromSessionStorage returns false on invalid JSON", () => {
            sessionStorage.setItem("gameAutoSave", "invalid json");

            const loaded = Game.loadFromSessionStorage();
            expect(loaded).toBe(false);
        });

        test("clearAutoSave removes session storage", () => {
            sessionStorage.setItem("gameAutoSave", "test data");

            Game.clearAutoSave();

            const saved = sessionStorage.getItem("gameAutoSave");
            expect(saved).toBeNull();
        });
    });

    describe("Options Management", () => {
        test("updateOptions updates game options", () => {
            Game.updateOptions({
                gameName: "Updated Game",
                gameVersion: "3.0.0",
            });

            expect(Game.options.gameName).toBe("Updated Game");
            expect(Game.options.gameVersion).toBe("3.0.0");
        });

        test("updateOptions preserves existing options", () => {
            const originalAuthor = Game.options.author;

            Game.updateOptions({
                gameName: "Updated Game",
            });

            expect(Game.options.gameName).toBe("Updated Game");
            expect(Game.options.author).toBe(originalAuthor);
        });
    });

    describe("Integration Tests", () => {
        test("complete game flow: init, create entities, navigate, save, load", async () => {
            await Game.init({
                gameName: "Adventure Game",
                gameVersion: "1.0.0",
                author: "Test Author",
                isDevMode: true,
            });

            // Create entities
            const playerId = uniqueId("player");
            const enemyId = uniqueId("enemy");
            const player = new TestEntity(playerId, 100, "Hero");
            const enemy = new TestEntity(enemyId, 50, "Goblin");

            // Create passages
            const introId = uniqueId("intro");
            const battleId = uniqueId("battle");
            const victoryId = uniqueId("victory");

            new TestPassage(introId);
            new TestPassage(battleId);
            new TestPassage(victoryId);

            // Navigate
            Game.jumpTo(introId);
            expect(Game.currentPassage?.id).toBe(introId);

            // Simulate game progress
            Game.jumpTo(battleId);
            player.setHealth(75);
            enemy.setHealth(25);

            // Save state
            const savedState = Game.getState();

            // Continue playing
            Game.jumpTo(victoryId);
            player.setHealth(100);
            enemy.setHealth(0);

            // Load saved state
            Game.setState(savedState);

            // Verify restoration
            expect(Game.currentPassage?.id).toBe(battleId);
            expect(player.getHealth()).toBe(75);
            expect(enemy.getHealth()).toBe(25);
        });

        test("multiple save slots simulation", () => {
            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "Hero");

            const chapter1Id = uniqueId("chapter1");
            const chapter2Id = uniqueId("chapter2");
            const chapter3Id = uniqueId("chapter3");

            new TestPassage(chapter1Id);
            new TestPassage(chapter2Id);
            new TestPassage(chapter3Id);

            // Save slot 1 - Chapter 1
            Game.jumpTo(chapter1Id);
            player.setHealth(100);
            const save1 = Game.getState();

            // Save slot 2 - Chapter 2
            Game.jumpTo(chapter2Id);
            player.setHealth(80);
            const save2 = Game.getState();

            // Save slot 3 - Chapter 3
            Game.jumpTo(chapter3Id);
            player.setHealth(60);
            const save3 = Game.getState();

            // Load save 1
            Game.setState(save1);
            expect(Game.currentPassage?.id).toBe(chapter1Id);
            expect(player.getHealth()).toBe(100);

            // Load save 3
            Game.setState(save3);
            expect(Game.currentPassage?.id).toBe(chapter3Id);
            expect(player.getHealth()).toBe(60);

            // Load save 2
            Game.setState(save2);
            expect(Game.currentPassage?.id).toBe(chapter2Id);
            expect(player.getHealth()).toBe(80);
        });

        test("entity state persistence across multiple changes", () => {
            const playerId = uniqueId("player");
            const player = new TestEntity(playerId, 100, "Hero");

            // Make multiple changes
            player.setHealth(90);
            player.save();

            player.setHealth(80);
            player.save();

            player.setName("Veteran Hero");
            player.save();

            const state = Game.getState();

            // Change values
            player.setHealth(10);
            player.setName("Defeated");

            // Restore
            Game.setState(state);

            expect(player.getHealth()).toBe(80);
            expect(player.getName()).toBe("Veteran Hero");
        });
    });

    describe("Edge Cases", () => {
        test("handles empty game state", () => {
            const state = Game.getState();
            expect(state).toBeDefined();
            expect(typeof state).toBe("object");
        });

        test("handles setState with minimal state", () => {
            const minimalState = {
                _system: {
                    game: {
                        currentPassageId: null,
                    },
                },
            };

            Game.setState(minimalState as GameSaveState);

            expect(Game.selfState.currentPassageId).toBeNull();
        });

        test("entity with no variables", () => {
            const entityId = uniqueId("empty");
            new BaseGameObject({ id: entityId });

            const state = Game.getState();
            expect(state).toHaveProperty(entityId);
        });

        test("passage display throws error if not implemented", () => {
            class IncompletePassage extends Passage {
                constructor() {
                    super(uniqueId("incomplete"), "widget");
                }
            }

            const passage = new IncompletePassage();

            expect(() => {
                passage.display();
            }).toThrow("Display method not implemented");
        });

        test("multiple consecutive jumpTo calls", () => {
            const id1 = uniqueId("p1");
            const id2 = uniqueId("p2");
            const id3 = uniqueId("p3");

            new TestPassage(id1);
            new TestPassage(id2);
            new TestPassage(id3);

            Game.jumpTo(id1);
            Game.jumpTo(id2);
            Game.jumpTo(id3);

            expect(Game.currentPassage?.id).toBe(id3);
        });

        test("selfState provides access to internal state", () => {
            const state = Game.selfState;

            expect(state).toBeDefined();
            expect(state).toHaveProperty("currentPassageId");
        });

        test("registering entity with special characters in id", () => {
            const entityId = uniqueId("player_123");
            const entity = new TestEntity(entityId);

            const proxied = Game._getProxiedObject(entity);
            expect(proxied.id).toBe(entityId);
        });

        test("state serialization with special values", () => {
            class SpecialEntity extends BaseGameObject<{
                emptyString: string;
                zero: number;
                falseValue: boolean;
                nullValue: null;
            }> {
                constructor(id: string) {
                    super({
                        id,
                        variables: {
                            emptyString: "",
                            zero: 0,
                            falseValue: false,
                            nullValue: null,
                        },
                    });
                }
            }

            const entityId = uniqueId("special");
            new SpecialEntity(entityId);

            const state = Game.getState();
            const serialized = JSON.stringify(state);
            const deserialized = JSON.parse(serialized);

            expect(deserialized[entityId]).toEqual({
                emptyString: "",
                zero: 0,
                falseValue: false,
                nullValue: null,
            });
        });
    });
});
