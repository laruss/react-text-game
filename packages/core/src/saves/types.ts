/**
 * Represents a saved game state
 */
export interface GameSave {
    /** Database auto-generated ID */
    id?: number;
    /** User-defined name for the save */
    name: string;
    /** Serialized game state data */
    gameData: Record<string, unknown>;
    /** When the save was created */
    timestamp: Date;
    /** Game version when the save was created */
    version: string;
    /** Base64 encoded screenshot (optional) */
    screenshot?: string;
    /** User-provided description (optional) */
    description?: string;
    /** Mark as system save (won't be shown in UI) */
    isSystemSave?: boolean;
}

/**
 * Represents a game setting stored in the database
 */
export interface GameSettings {
    /** Database auto-generated ID */
    id?: number;
    /** Unique key for the setting */
    key: string;
    /** Setting value (can be string, number, boolean, or object) */
    value: string | number | boolean | object;
    /** When the setting was last updated */
    timestamp: Date;
    /** Game version when the setting was created/updated */
    version: string;
}

/**
 * Represents the state of save slots, used by React hooks
 */
export type SaveSlotsData = {
    /** Whether there are no saves */
    isEmpty: boolean;
    /** Whether saves are currently being loaded */
    isLoading: boolean;
    /** Whether there was an error loading saves */
    isError: boolean;
    /** Error object if an error occurred */
    error: Error | null;
    /** Array of game saves */
    data: GameSave[];
};
