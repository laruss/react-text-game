import { proxy, subscribe } from "valtio";

import { STORAGE_SYSTEM_PATH, SYSTEM_PASSAGE_NAMES } from "#constants";
import { BaseGameObject } from "#gameObjects";
import { logger } from "#logger";
import { _getOptions, NewOptions, newOptions, Options } from "#options";
import { Passage } from "#passages/passage";
import { createOrUpdateSystemSave } from "#saves";
import { Storage } from "#storage";
import { GameSaveState, JsonPath } from "#types";

const objectRegistry = new Map<string, BaseGameObject>();
const passagesRegistry = new Map<string, Passage>();

const jsonPath = `${STORAGE_SYSTEM_PATH}.game` as const satisfies JsonPath;

type GameInternalSaveState = {
    currentPassageId: string | null;
};

/**
 * Central orchestrator for the text game engine.
 *
 * The `Game` class manages all core game functionality including:
 * - Entity registration and proxying with Valtio for reactive state
 * - Passage registration and navigation
 * - State serialization and persistence
 * - Auto-save to session storage with debouncing
 *
 * All entities and passages are automatically registered through their constructors,
 * and the Game provides static methods for navigation and state management.
 *
 * @example
 * ```typescript
 * // Create entities and passages (auto-registered)
 * const player = new Player();
 * const intro = newStory('intro', () => [...]);
 *
 * // Navigate
 * Game.jumpTo('intro');
 *
 * // Save/Load
 * const state = Game.getState();
 * Game.setState(state);
 *
 * // Auto-save
 * Game.enableAutoSave();
 * Game.loadFromSessionStorage();
 * ```
 */
export class Game {
    private static state = proxy({
        currentPassageId: null as string | null,
    });

    private static initialized = false;
    private static autoSaveEnabled = false;
    private static saveTimer: ReturnType<typeof setTimeout> | null = null;
    private static unsubscribeFunctions: Array<() => void> = [];
    private static readonly AUTO_SAVE_KEY = "gameAutoSave";
    private static readonly SAVE_DEBOUNCE_MS = 500;

    /**
     * Ensures the game has been initialized before allowing method calls.
     *
     * @private
     * @throws Error if Game.init() has not been called
     */
    private static ensureInitialized(): void {
        if (!Game.initialized) {
            throw new Error(
                "Game not initialized. Please call Game.init() before using the game engine."
            );
        }
    }

    /**
     * Registers and proxies the provided game objects for further use by adding them to the object registry.
     *
     * @param {...BaseGameObject[]} objects - The array of BaseGameObject instances to be registered.
     * @return {void} This method does not return a value.
     */
    static registerEntity(...objects: Array<BaseGameObject>): void {
        objects.forEach((object) => {
            if (objectRegistry.has(object.id)) {
                throw new Error(`Object "${object.id}" is already registered.`);
            }

            const proxiedObject = proxy(object);
            objectRegistry.set(object.id, proxiedObject);

            logger.log(`Registered entity: ${object.id}`);
        });
    }

    /**
     * Registers one or more passages into the passage registry. Each passage must have a unique identifier.
     * Throws an error if a passage with the same id is already registered.
     *
     * @param {...Passage} passages The passages to be registered. Each passage should be an object containing an `id` property.
     * @return {void} Does not return a value.
     * @throws Error if Game.init() has not been called
     */
    static registerPassage(...passages: Array<Passage>): void {
        const systemPassages = Object.values(SYSTEM_PASSAGE_NAMES);

        passages.forEach((passage) => {
            if (
                passagesRegistry.has(passage.id) &&
                // letting user to re-register system passages
                !systemPassages.includes(
                    passage.id as (typeof systemPassages)[number]
                )
            ) {
                throw new Error(
                    `Passage "${passage.id}" is already registered.`
                );
            }

            passagesRegistry.set(passage.id, passage);

            logger.log(`Registered passage: ${passage.id}`);
        });
    }

    /**
     * Retrieves all registered passages from the passage registry.
     *
     * @return {IterableIterator<Passage>} An iterator containing all the Passage objects.
     * @throws Error if Game.init() has not been called
     */
    static get registeredPassages(): IterableIterator<Passage> {
        return passagesRegistry.values();
    }

    /**
     * Retrieves the current passage from the passage registry based on the current passage ID in the game state.
     * If the current passage ID is null or the passage cannot be found, returns null.
     *
     * @return {Passage | null} The current passage object or null if not available.
     * @throws Error if Game.init() has not been called
     */
    static get currentPassage(): Passage | null {
        Game.ensureInitialized();

        if (Game.state.currentPassageId === null) {
            return null;
        }
        return passagesRegistry.get(Game.state.currentPassageId) || null;
    }

    /**
     * Retrieves a passage by its unique identifier.
     *
     * @param {string} passageId - The unique ID of the passage to retrieve.
     * @return {Passage|null} The passage object if found, or null if no passage exists with the given ID.
     * @throws Error if Game.init() has not been called
     */
    static getPassageById(passageId: string): Passage | null {
        Game.ensureInitialized();
        return passagesRegistry.get(passageId) || null;
    }

    /**
     * Retrieves all the passages from the passages registry.
     *
     * @return {Array<Passage>} An array containing all the Passage objects.
     * @throws Error if Game.init() has not been called
     */
    static getAllPassages(): Array<Passage> {
        Game.ensureInitialized();
        return Array.from(passagesRegistry.values());
    }

    /**
     * Navigates the game to a specified passage.
     *
     * @param {Passage|string} passage - The passage object or identifier of the passage to jump to.
     * @return {void} Does not return any value.
     * @throws {Error} Throws an error if the specified passage is not found or if Game.init() has not been called
     */
    static jumpTo(passage: Passage | string): void {
        Game.ensureInitialized();

        const passageId = typeof passage === "string" ? passage : passage.id;

        const retrievedPassage = passagesRegistry.get(passageId) || null;

        if (!retrievedPassage) {
            throw new Error(`Passage "${passageId}" not found.`);
        }

        Game.state.currentPassageId = retrievedPassage
            ? retrievedPassage.id
            : null;

        logger.log(`Jumped to passage: ${passageId}`);
    }

    /**
     * Sets the current passage in the game state.
     *
     * @param {Passage|string} passage - The passage to be set as current. Can be either a Passage object or a string representing the passage ID.
     * @return {void} This method does not return a value.
     * @throws Error if Game.init() has not been called
     */
    static setCurrent(passage: Passage | string): void {
        Game.ensureInitialized();

        Game.state.currentPassageId =
            typeof passage === "string" ? passage : passage.id;

        logger.log(`Set current passage: ${Game.state.currentPassageId}`);
    }

    /**
     * Retrieves the proxied object from the object registry based on its ID.
     * If the object is not found in the registry, the original object is returned.
     *
     * @internal - Used by hooks for reactive state management
     * @param object - The original object to find in the registry
     * @returns The proxied object from the registry if present, otherwise the original object
     */
    static _getProxiedObject<T extends BaseGameObject>(object: T): T {
        return (objectRegistry.get(object.id) as T) || object;
    }

    /**
     * Retrieves all proxied objects from the object registry.
     *
     * @internal - Used for batch operations during save/load
     * @returns An array of BaseGameObject instances stored in the object registry
     */
    static _getAllProxiedObjects(): Array<BaseGameObject> {
        return Array.from(objectRegistry.values());
    }

    /**
     * Provides access to the internal game state for reactive hooks.
     *
     * @returns The game's internal reactive state
     * @throws Error if Game.init() has not been called
     */
    static get selfState() {
        Game.ensureInitialized();
        return Game.state;
    }

    /**
     * Saves the current game state, including critical passage information, into storage.
     *
     * This method saves the Game's internal state (current passage) to the Storage system.
     * It does NOT save entity states - use entity.save() or Game.getState() for that.
     *
     * @private - Called internally by Game.getState()
     */
    private static save(): void {
        const internalState = {
            currentPassageId: Game.state.currentPassageId,
        } as const satisfies GameInternalSaveState;

        Storage.setValue(jsonPath, internalState, true);

        logger.log(`Game state saved: ${JSON.stringify(internalState)}`);
    }

    /**
     * Loads the saved game state from storage and sets the current passage ID in the game state.
     *
     * @private - Called internally by Game.setState()
     * @throws Error if no saved state is found
     */
    private static load(): void {
        const savedState = Storage.getValue<GameInternalSaveState>(jsonPath);
        if (!savedState.length) {
            throw new Error("No saved state found.");
        }
        const { currentPassageId } = savedState[0]!;
        Game.state.currentPassageId = currentPassageId || null;

        logger.log(`Game state loaded: ${JSON.stringify(savedState[0])}`);
    }

    /**
     * Captures the complete game state including all entities and passages.
     *
     * This method:
     * 1. Saves the Game's internal state (current passage)
     * 2. Saves all registered entity states
     * 3. Returns the complete state object
     *
     * @returns The complete serializable game state
     * @throws Error if Game.init() has not been called
     *
     * @example
     * ```typescript
     * const savedState = Game.getState();
     * localStorage.setItem('save1', JSON.stringify(savedState));
     * ```
     */
    static getState(_fromI = false): GameSaveState {
        if (!_fromI) {
            Game.ensureInitialized();
        }

        Game.save();
        for (const [, object] of objectRegistry) {
            object.save();
        }
        return Storage.getState();
    }

    /**
     * Restores the complete game state including all entities and passages.
     *
     * This method:
     * 1. Sets the Storage state
     * 2. Loads the Game's internal state (current passage)
     * 3. Loads all registered entity states
     *
     * @param state - The game state to restore
     * @throws Error if Game.init() has not been called
     *
     * @example
     * ```typescript
     * const savedState = JSON.parse(localStorage.getItem('save1'));
     * Game.setState(savedState);
     * ```
     */
    static setState(state: GameSaveState): void {
        Game.ensureInitialized();

        Storage.setState(state);
        Game.load();
        for (const [, object] of objectRegistry) {
            object.load();
        }
    }

    /**
     * Saves the current game state to session storage with debouncing.
     *
     * Uses a 500ms debounce to prevent excessive writes during rapid state changes.
     *
     * @private - Called automatically when auto-save is enabled
     */
    private static saveToSessionStorage(): void {
        if (Game.saveTimer) {
            clearTimeout(Game.saveTimer);
        }

        Game.saveTimer = setTimeout(() => {
            const state = Game.getState();
            sessionStorage.setItem(Game.AUTO_SAVE_KEY, JSON.stringify(state));
        }, Game.SAVE_DEBOUNCE_MS);
    }

    /**
     * Enables auto-save functionality.
     *
     * Subscribes to all game state changes (Game state and all entity states)
     * and automatically saves to session storage with 500ms debouncing.
     *
     * @throws Error if Game.init() has not been called
     *
     * @example
     * ```typescript
     * Game.enableAutoSave();
     * // Now any state change will auto-save after 500ms
     * player.health = 50; // Will trigger auto-save
     * ```
     */
    static enableAutoSave(): void {
        Game.ensureInitialized();

        if (Game.autoSaveEnabled) {
            logger.warn("Auto-save is already enabled");
            return;
        }

        Game.autoSaveEnabled = true;

        // Subscribe to Game state changes
        const unsubGame = subscribe(Game.state, () => {
            Game.saveToSessionStorage();
        });
        Game.unsubscribeFunctions.push(unsubGame);

        // Subscribe to all registered entities
        for (const [, object] of objectRegistry) {
            const unsubEntity = subscribe(object, () => {
                Game.saveToSessionStorage();
            });
            Game.unsubscribeFunctions.push(unsubEntity);
        }

        logger.log("Auto-save enabled");
    }

    /**
     * Disables auto-save functionality and clears all subscriptions.
     *
     * Cleans up all Valtio subscriptions and cancels any pending debounced saves.
     *
     * @throws Error if Game.init() has not been called
     */
    static disableAutoSave(): void {
        Game.ensureInitialized();

        if (!Game.autoSaveEnabled) {
            logger.warn("Auto-save is already disabled");
            return;
        }

        // Clear debounce timer
        if (Game.saveTimer) {
            clearTimeout(Game.saveTimer);
            Game.saveTimer = null;
        }

        // Unsubscribe all listeners
        Game.unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
        Game.unsubscribeFunctions = [];

        Game.autoSaveEnabled = false;

        logger.log("Auto-save disabled");
    }

    /**
     * Loads game state from session storage if available.
     *
     * @returns True if state was loaded successfully, false otherwise
     * @throws Error if Game.init() has not been called
     *
     * @example
     * ```typescript
     * if (Game.loadFromSessionStorage()) {
     *   console.log('Game loaded from auto-save');
     * } else {
     *   Game.jumpTo('start');
     * }
     * ```
     */
    static loadFromSessionStorage(): boolean {
        Game.ensureInitialized();

        const savedState = sessionStorage.getItem(Game.AUTO_SAVE_KEY);

        if (!savedState) {
            return false;
        }

        try {
            const state = JSON.parse(savedState) as GameSaveState;
            Game.setState(state);
            logger.log("Game state loaded from session storage");
            return true;
        } catch (error) {
            logger.error("Failed to load state from session storage:", error);
            return false;
        }
    }

    /**
     * Clears the auto-saved state from session storage.
     *
     * @throws Error if Game.init() has not been called
     *
     * @example
     * ```typescript
     * Game.clearAutoSave(); // Remove auto-save data
     * ```
     */
    static clearAutoSave(): void {
        Game.ensureInitialized();
        sessionStorage.removeItem(Game.AUTO_SAVE_KEY);
        logger.log("Auto-save data cleared from session storage");
    }

    /**
     * Initializes the game engine with the provided options.
     *
     * This method MUST be called before any other Game methods can be used.
     * Calling this method marks the Game as initialized and allows access to all other functionality.
     *
     * Optionally integrates with `@react-text-game/saves` package if installed.
     *
     * @param opts - Configuration options for the game
     * @returns Promise that resolves when initialization is complete
     *
     * @example
     * ```typescript
     * await Game.init({
     *   // your options here
     * });
     *
     * // Now you can use other Game methods
     * Game.jumpTo('start');
     * ```
     */
    static async init(opts: NewOptions): Promise<void> {
        newOptions(opts);
        Game.initialized = true;
        if (Game.options.isDevMode) {
            logger.warn(
                "Game is running in dev mode, do not use in production!"
            );
        }

        Game.setCurrent(SYSTEM_PASSAGE_NAMES.START_MENU);

        const initialState = Game.getState(true);
        await createOrUpdateSystemSave(initialState);

        if (!Game.options.isDevMode) {
            Game.loadFromSessionStorage();
            Game.enableAutoSave();
        } else {
            logger.warn(
                "Save to session storage is turned off due to dev mode"
            );
        }

        logger.log(`Game initialized with options: ${JSON.stringify(opts)}`);
    }

    /**
     * Gets the game options.
     *
     * @returns The current game options
     * @throws Error if Game.init() has not been called
     */
    static get options(): Options {
        Game.ensureInitialized();

        return _getOptions();
    }

    /**
     * Updates the game options with the provided settings.
     *
     * @param {NewOptions} options - The new options to update the game configuration.
     * @return {void} No return value.
     */
    static updateOptions(options: NewOptions): void {
        Game.ensureInitialized();

        newOptions(options);
    }

    /**
     * Resets the game state for testing purposes.
     *
     * Clears all entity and passage registries, disables auto-save, and resets initialization state.
     * This method is intended for use in test environments only.
     *
     * @internal
     */
    static _resetForTesting(): void {
        // Disable auto-save if enabled
        if (Game.autoSaveEnabled) {
            Game.disableAutoSave();
        }

        // Clear all registries
        objectRegistry.clear();
        passagesRegistry.clear();

        // Reset initialization state
        Game.initialized = false;

        // Reset state
        Game.state.currentPassageId = null;
    }
}
