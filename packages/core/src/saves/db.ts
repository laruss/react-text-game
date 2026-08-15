import Dexie, { type EntityTable } from "dexie";

import { _getOptions } from "#options";

import { normalizeSaveRecord } from "./records";
import type { GameSave, GameSettings, SaveOptions, SaveUpdate } from "./types";

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

        // Migration to version 3: `name` becomes `slot` and `description`
        // becomes `title`, and the `"undefined"` strings that older builds
        // wrote into absent optional fields are dropped.
        this.version(3)
            .stores({
                saves: "++id, slot, timestamp, isSystemSave",
                settings: "++id, &key, timestamp",
            })
            .upgrade((transaction) =>
                transaction
                    .table("saves")
                    .toCollection()
                    .modify(normalizeSaveRecord)
            );
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
    const cachedDatabase = dbCache.get(gameId);
    if (cachedDatabase) {
        return cachedDatabase;
    }

    const database = new GameDatabase(gameId);
    dbCache.set(gameId, database);
    return database;
}

/**
 * Get the database instance for the game currently configured in options.
 *
 * @remarks
 * Always call this at the point of use. Resolving the database once, at module
 * scope, would capture the default empty `gameId`: options are applied by
 * `Game.init()`, which runs after every module has been imported.
 *
 * @returns GameDatabase instance for the current game
 */
export function getDatabase(): GameDatabase {
    return getGameDatabase(_getOptions().gameId);
}

/**
 * The current game's database.
 *
 * @remarks
 * Every property access resolves through {@link getDatabase}, so this reflects
 * the `gameId` that is configured at the moment it is used rather than the one
 * present when the module was imported.
 */
export const db: GameDatabase = new Proxy({} as GameDatabase, {
    get(_target, property) {
        const database = getDatabase();
        const value = Reflect.get(database, property) as unknown;
        return typeof value === "function" ? value.bind(database) : value;
    },
});

/**
 * Save game data to the database
 * @param slot - Slot the save occupies (e.g., a slot number or custom key)
 * @param gameData - Game state data to save
 * @param options - Player-facing annotations and, for restores, the version to
 * stamp the save with. `version` defaults to the current game version; pass the
 * original when restoring a save created by an older build, otherwise
 * migrations will never run for it.
 * @returns Promise<number> - The ID of the save
 */
export async function saveGame(
    slot: string | number,
    gameData: Record<string, unknown>,
    options: SaveOptions & { version?: string } = {}
): Promise<number> {
    const normalizedSlot = `${slot}`;
    if (normalizedSlot === SYSTEM_SAVE_NAME) {
        throw new Error(`Save slot "${SYSTEM_SAVE_NAME}" is reserved`);
    }

    const database = getDatabase();

    return database.transaction("rw", database.saves, async () => {
        const { title, meta, screenshot, version } = options;
        const save = {
            slot: normalizedSlot,
            gameData,
            timestamp: new Date(),
            version: version ?? _getOptions().gameVersion,
            // Absent annotations stay absent: writing them unconditionally is
            // what used to store the literal string "undefined".
            ...(title === undefined ? {} : { title }),
            ...(meta === undefined ? {} : { meta }),
            ...(screenshot === undefined ? {} : { screenshot }),
        };
        const [existingSave, ...duplicates] = await database.saves
            .where({ slot: save.slot })
            .toArray();

        if (existingSave?.id !== undefined) {
            // `put`, not `update`: a fresh capture must not inherit the
            // previous occupant's title, meta or screenshot, which a merging
            // update would leave attached to state they no longer describe.
            await database.saves.put({ ...save, id: existingSave.id });
            await Promise.all(
                duplicates.map((duplicate) =>
                    duplicate.id === undefined
                        ? Promise.resolve()
                        : database.saves.delete(duplicate.id)
                )
            );
            return existingSave.id;
        }

        const id = await database.saves.add(save);
        if (id === undefined) {
            throw new Error("Failed to save game");
        }
        return id;
    });
}

/**
 * Edit a save's annotations without recapturing the game state.
 *
 * @remarks
 * Unlike {@link saveGame} this leaves `timestamp` alone, so renaming a save
 * does not move it to the top of a list ordered by recency.
 *
 * @param slot - Slot of the save to edit
 * @param changes - Fields to write. Only the keys carrying a value are touched.
 * @returns Promise<boolean> - Whether a save occupied that slot
 */
export async function updateSave(
    slot: string | number,
    changes: SaveUpdate
): Promise<boolean> {
    const database = getDatabase();
    const existing = await database.saves.where({ slot: `${slot}` }).first();

    if (existing?.id === undefined) {
        return false;
    }

    const patch: SaveUpdate = {};
    if (changes.title !== undefined) patch.title = changes.title;
    if (changes.meta !== undefined) patch.meta = changes.meta;
    if (changes.screenshot !== undefined) {
        patch.screenshot = changes.screenshot;
    }

    await database.saves.update(existing.id, patch);
    return true;
}

/**
 * Write whole save records, preserving the timestamp and version each one
 * carries.
 *
 * @remarks
 * This is the restore path, and the counterpart to {@link saveGame}: it takes
 * saves that already exist rather than capturing the current run. In
 * `"replace"` mode the wipe and the writes share one transaction, so a failure
 * partway through leaves the existing saves untouched instead of destroying
 * them. The system save is never replaced.
 *
 * @param saves - Records to write
 * @param mode - `"replace"` clears the player's other saves first, `"merge"`
 * keeps them and overwrites only the slots being written
 * @returns Promise<number> - How many records were written
 */
export async function putSaves(
    saves: GameSave[],
    mode: "replace" | "merge" = "replace"
): Promise<number> {
    const database = getDatabase();

    return database.transaction("rw", database.saves, async () => {
        const existing = await database.saves.toArray();

        if (mode === "replace") {
            await Promise.all(
                existing
                    .filter((save) => !save.isSystemSave)
                    .map((save) =>
                        save.id === undefined
                            ? Promise.resolve()
                            : database.saves.delete(save.id)
                    )
            );
        }

        const survivors =
            mode === "replace"
                ? existing.filter((save) => save.isSystemSave)
                : existing;

        let written = 0;
        for (const save of saves) {
            if (save.slot === SYSTEM_SAVE_NAME) continue;

            const { id: _ignored, ...record } = save;
            const occupant = survivors.find(
                (candidate) => candidate.slot === save.slot
            );

            if (occupant?.id !== undefined) {
                // The written record replaces the slot outright, so a save
                // restored from a file cannot inherit the annotations of the
                // save it displaced.
                await database.saves.put({
                    ...record,
                    id: occupant.id,
                } as GameSave);
            } else {
                await database.saves.add(record as GameSave);
            }
            written++;
        }

        return written;
    });
}

/**
 * Load the save occupying a slot
 * @param slot - Slot to read, *not* {@link GameSave.id}
 * @returns Promise<GameSave | undefined> - The save data or undefined if the slot is empty
 */
export async function loadGame(
    slot: string | number
): Promise<GameSave | undefined> {
    return getDatabase()
        .saves.where({ slot: `${slot}` })
        .first();
}

/**
 * Load a game save by its exact slot key, including reserved ones
 * @param slot - Slot key of the save to load
 * @returns Promise<GameSave | undefined> - The save data or undefined if not found
 */
export async function loadGameBySlot(
    slot: string
): Promise<GameSave | undefined> {
    return getDatabase().saves.where("slot").equals(slot).first();
}

/**
 * Retrieves all saved games from the database (excluding system saves).
 *
 * @return {Promise<GameSave[]>} A promise that resolves to an array of game save objects.
 */
export async function getAllSaves(): Promise<GameSave[]> {
    return getDatabase()
        .saves.filter((save) => !save.isSystemSave)
        .toArray();
}

/**
 * Delete the save occupying a slot
 * @param slot - Slot to clear, *not* {@link GameSave.id}
 * @returns Promise<void>
 */
export async function deleteSave(slot: string | number): Promise<void> {
    await getDatabase()
        .saves.where({ slot: `${slot}` })
        .delete();
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
    const database = getDatabase();
    // Try to update existing setting first
    const existing = await database.settings.where("key").equals(key).first();
    if (existing) {
        const existingId = existing.id;
        if (existingId === undefined) {
            throw new Error(`Existing setting "${key}" is missing an ID`);
        }
        await database.settings.update(existingId, {
            value,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
        });
        return existingId;
    } else {
        // Create new setting
        const id = await database.settings.add({
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
 * Deletes every player save, keeping the system save.
 *
 * @return {Promise<void>} A promise that resolves when the game save data has been successfully deleted.
 */
export async function deleteAllGameSaves(): Promise<void> {
    await putSaves([], "replace");
}

/**
 * Get a game setting
 * @param key - Setting key
 * @param defaultValue - Default value if setting doesn't exist
 * @returns Promise<T> - The setting value or default value
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await getDatabase()
        .settings.where("key")
        .equals(key)
        .first();
    return setting ? (setting.value as T) : defaultValue;
}

/**
 * Get all settings as a key-value object
 * @returns Promise<Record<string, any>> - Object with all settings
 */
export async function getAllSettings(): Promise<
    Record<string, string | number | boolean | object>
> {
    const settings = await getDatabase().settings.toArray();
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
    await getDatabase().settings.where("key").equals(key).delete();
}

/**
 * Retrieves the system save from the database.
 *
 * @return {Promise<GameSave | undefined>} A promise that resolves to the system save or undefined if not found.
 */
export async function getSystemSave(): Promise<GameSave | undefined> {
    return loadGameBySlot(SYSTEM_SAVE_NAME);
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
    const database = getDatabase();
    const existingSave = await getSystemSave();

    if (existingSave?.id) {
        await database.saves.update(existingSave.id, {
            gameData,
            timestamp: new Date(),
            version: _getOptions().gameVersion,
        });
        return existingSave.id;
    } else {
        const id = await database.saves.add({
            slot: SYSTEM_SAVE_NAME,
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
