/**
 * Represents a saved game state
 */
export interface GameSave {
    /** Database auto-generated ID. Never use it to address a slot - see {@link GameSave.slot}. */
    id?: number;
    /**
     * Slot the save occupies, as a string.
     *
     * @remarks
     * This is the key every slot-addressed function takes: `loadGame`,
     * `deleteSave`, `updateSave` and the `useSaveSlots` actions all match on it.
     * It is *not* {@link GameSave.id}, which is the database's own primary key.
     */
    slot: string;
    /** Serialized game state data */
    gameData: Record<string, unknown>;
    /**
     * When the run was captured.
     *
     * @remarks
     * Set once, when the state is written. Editing a save's label through
     * `updateSave` leaves it alone, and importing a save file restores the
     * timestamp the save was taken with, so ordering by it survives a round
     * trip through a file.
     */
    timestamp: Date;
    /** Game version when the save was created */
    version: string;
    /**
     * Base64 encoded screenshot (optional).
     *
     * @remarks
     * The engine never produces one - capturing the screen is the host's job.
     * Pass it through {@link SaveOptions.screenshot} to fill it.
     */
    screenshot?: string;
    /** Player-facing label for the save (optional) */
    title?: string;
    /**
     * Free-form annotation owned by the game (optional).
     *
     * @remarks
     * The engine stores and returns it untouched, and save migrations never
     * see it. That is what makes it safe to render a slot list from: it stays
     * readable even when the {@link GameSave.gameData} beside it was written by
     * an older version and has not been migrated yet.
     *
     * @example
     * ```ts
     * slot.save({ title: "Before the boss", meta: { day: 3, place: "flat" } });
     * ```
     */
    meta?: Record<string, unknown>;
    /** Mark as system save (won't be shown in UI) */
    isSystemSave?: boolean;
}

/**
 * Player-facing annotations recorded alongside a save.
 */
export type SaveOptions = {
    /** Label to show in a slot list */
    title?: string | undefined;
    /** Game-owned metadata - see {@link GameSave.meta} */
    meta?: Record<string, unknown> | undefined;
    /** Base64 encoded screenshot */
    screenshot?: string | undefined;
};

/**
 * Fields of an existing save that can be edited without recapturing state.
 *
 * @remarks
 * Only the keys carrying a value are written; the rest of the save is left
 * exactly as it was, `timestamp` included.
 */
export type SaveUpdate = {
    /** Label to show in a slot list */
    title?: string;
    /** Game-owned metadata - see {@link GameSave.meta} */
    meta?: Record<string, unknown>;
    /** Base64 encoded screenshot */
    screenshot?: string;
};

/**
 * Machine-readable reason a save operation failed.
 *
 * @remarks
 * `cancelled` is not a failure the player needs to hear about: it means they
 * closed a file dialog. Hosts should stay silent on it.
 */
export type SaveErrorCode =
    | "cancelled"
    | "not-found"
    | "bad-file"
    | "decode-failed"
    | "migration-failed"
    | "storage-failed";

/**
 * Result of every save operation, discriminated on `success`.
 *
 * @typeParam TData - Extra fields carried by both branches, so a caller can
 * read them without narrowing first.
 *
 * @example
 * ```ts
 * const result = await slot.save({ title: "Chapter 2" });
 * if (!result.success && result.code !== "cancelled") {
 *     toast(result.error);
 * }
 * ```
 */
export type SaveResult<TData = unknown> =
    | ({ success: true; error: null } & TData)
    | ({ success: false; code: SaveErrorCode; error: string } & TData);

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
