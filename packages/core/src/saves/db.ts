import Dexie, { EntityTable } from "dexie";

import { _getOptions } from "#options";

import { GameSave, GameSettings } from "./types";

/**
 * Special save name used for the system initial state.
 * This save is marked as a system save and won't be shown in the UI.
 */
export const SYSTEM_SAVE_NAME = "__SYSTEM_INITIAL_STATE__" as const;

/**
 * Dexie database class for managing game saves and settings.
 * Uses IndexedDB for browser-based persistent storage.
 */
export class GameDatabase extends Dexie {
    /** Table for storing game saves */
    saves!: EntityTable<GameSave, "id">;
    /** Table for storing game settings */
    settings!: EntityTable<GameSettings, "id">;

    /**
     * Creates a new GameDatabase instance
     * @param gameId - Unique identifier for the game, used as database name prefix
     */
    constructor(gameId: string) {
        super(`${gameId}-gamedb`);

        this.version(1).stores({
            saves: "++id, name, timestamp", // Auto-incrementing id, indexed name and timestamp
            settings: "++id, &key, timestamp", // Auto-incrementing id, unique key, indexed timestamp
        });

        // Migration to version 2: Add isSystemSave field
        this.version(2).stores({
            saves: "++id, name, timestamp, isSystemSave", // Add isSystemSave to indexed fields
            settings: "++id, &key, timestamp",
        });
    }
}

/**
 * Cache for database instances to prevent creating multiple instances for the same game ID
 */
const dbCache = new Map<string, GameDatabase>();

/**
 * Get the database instance for a specific game ID
 * @param gameId - The unique identifier for the game
 * @returns GameDatabase instance
 */
export function getGameDatabase(gameId: string): GameDatabase {
    if (!dbCache.has(gameId)) {
        const db = new GameDatabase(gameId);
        dbCache.set(gameId, db);
    }
    return dbCache.get(gameId)!;
}

/**
 * Get the default database instance for the current game
 * @returns GameDatabase instance for the current game
 */
export function getDatabase(): GameDatabase {
    return getGameDatabase(_getOptions().gameId);
}

/**
 * Default database instance for the current game.
 * Automatically uses the game ID from game options.
 */
export const db = getDatabase();

/**
 * Save game data to the database
 * @param name - Name of the save (e.g., slot number or custom name)
 * @param gameData - Game state data to save
 * @param description - Optional description
 * @param screenshot - Optional base64 encoded screenshot
 * @returns Promise<number> - The ID of the save
 */
export async function saveGame(
    name: string | number,
    gameData: Record<string, unknown>,
    description?: string,
    screenshot?: string
): Promise<number> {
    // Create new save with the given name
    const id = await db.saves.add({
        name: `${name}`,
        gameData,
        timestamp: new Date(),
        version: _getOptions().gameVersion,
        description: String(description),
        screenshot: String(screenshot),
    });
    if (id === undefined) {
        throw new Error("Failed to save game");
    }
    return id;
}

/**
 * Load game data from the database
 * @param id - ID of the save to load
 * @returns Promise<GameSave | undefined> - The save data or undefined if not found
 */
export async function loadGame(id: number): Promise<GameSave | undefined> {
    return db.saves.where({ name: `${id}` }).first();
}

/**
 * Load a game save by its name
 * @param name - Name of the save to load
 * @returns Promise<GameSave | undefined> - The save data or undefined if not found
 */
export async function loadGameByName(
    name: string
): Promise<GameSave | undefined> {
    return db.saves.where("name").equals(name).first();
}

/**
 * Retrieves all saved games from the database (excluding system saves).
 *
 * @return {Promise<GameSave[]>} A promise that resolves to an array of game save objects.
 */
export async function getAllSaves(): Promise<GameSave[]> {
    return db.saves.filter((save) => !save.isSystemSave).toArray();
}

/**
 * Delete a save
 * @param id - ID of the save to delete
 * @returns Promise<void>
 */
export async function deleteSave(id: number): Promise<void> {
    await db.saves.where({ name: `${id}` }).delete();
}

/**
 * Set a game setting
 * @param key - Setting key
 * @param value - Setting value
 * @returns Promise<number> - The ID of the setting
 */
export async function setSetting(
    key: string,
    value: string | number | boolean | object
): Promise<number> {
    // Try to update existing setting first
    const existing = await db.settings.where("key").equals(key).first();
    if (existing) {
        await db.settings.update(existing.id!, {
            value,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
        });
        return existing.id!;
    } else {
        // Create new setting
        const id = await db.settings.add({
            key,
            value,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
        });
        if (id === undefined) {
            throw new Error("Failed to create setting");
        }
        return id;
    }
}

/**
 * Deletes all game save data from the database.
 *
 * This method clears all records within the "saves" table or collection,
 * resulting in the complete removal of stored game save data.
 *
 * @return {Promise<void>} A promise that resolves when the game save data has been successfully deleted.
 */
export async function deleteAllGameSaves(): Promise<void> {
    const systemSave = await getSystemSave();

    await db.saves.clear();

    if (systemSave) {
        await createOrUpdateSystemSave(systemSave.gameData);
    }
}

/**
 * Get a game setting
 * @param key - Setting key
 * @param defaultValue - Default value if setting doesn't exist
 * @returns Promise<T> - The setting value or default value
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await db.settings.where("key").equals(key).first();
    return setting ? (setting.value as T) : defaultValue;
}

/**
 * Get all settings as a key-value object
 * @returns Promise<Record<string, any>> - Object with all settings
 */
export async function getAllSettings(): Promise<
    Record<string, string | number | boolean | object>
> {
    const settings = await db.settings.toArray();
    const result: Record<string, string | number | boolean | object> = {};
    for (const setting of settings) {
        result[setting.key] = setting.value;
    }
    return result;
}

/**
 * Delete a setting
 * @param key - Setting key to delete
 * @returns Promise<void>
 */
export async function deleteSetting(key: string): Promise<void> {
    await db.settings.where("key").equals(key).delete();
}

/**
 * Retrieves the system save from the database.
 *
 * @return {Promise<GameSave | undefined>} A promise that resolves to the system save or undefined if not found.
 */
export async function getSystemSave(): Promise<GameSave | undefined> {
    return db.saves.where("name").equals(SYSTEM_SAVE_NAME).first();
}

/**
 * Creates or updates the system save with the provided game data.
 *
 * @param {Record<string, unknown>} gameData - The game state data to save as the system initial state.
 * @return {Promise<number>} A promise that resolves to the ID of the system save.
 */
export async function createOrUpdateSystemSave(
    gameData: Record<string, unknown>
): Promise<number> {
    const existingSave = await getSystemSave();

    if (existingSave?.id) {
        await db.saves.update(existingSave.id, {
            gameData,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
        });
        return existingSave.id;
    } else {
        const id = await db.saves.add({
            name: SYSTEM_SAVE_NAME,
            gameData,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
            isSystemSave: true,
        });
        if (id === undefined) {
            throw new Error("Failed to create system save");
        }
        return id;
    }
}
