import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import {
    type GameSave,
    getAllSaves,
    useDeleteGame,
    useLoadGame,
    useSaveGame,
    useUpdateSave,
} from "#saves";
import type { SaveOptions, SaveResult, SaveUpdate } from "#saves/types";

/**
 * One slot of a save browser: the save it holds, if any, plus the actions that
 * act on that slot.
 */
export type SaveSlot = {
    /** The save occupying this slot, or `null` when it is empty */
    data: GameSave | null;
    /** Capture the current run into this slot */
    save: (options?: SaveOptions) => Promise<SaveResult>;
    /** Restore the run this slot holds */
    load: () => Promise<SaveResult>;
    /** Empty this slot */
    delete: () => Promise<SaveResult>;
    /** Edit the label or metadata without recapturing state or moving the timestamp */
    update: (changes: SaveUpdate) => Promise<SaveResult>;
};

/**
 * React hook that provides an array of save slots with live updates from IndexedDB.
 * Each slot includes the save data and methods to save, load, update and delete.
 *
 * @param config - Configuration object
 * @param config.count - Number of save slots to create (defaults to 1)
 * @returns Array of save slot objects, each containing data and action methods
 *
 * @example
 * ```tsx
 * const slots = useSaveSlots({ count: 5 });
 *
 * return (
 *   <div>
 *     {slots.map((slot, index) => (
 *       <div key={index}>
 *         <p>Slot {index}: {slot.data?.title ?? 'Empty'}</p>
 *         <button onClick={() => slot.save({ title: 'Chapter 2' })}>Save</button>
 *         <button onClick={() => slot.load()} disabled={!slot.data}>Load</button>
 *         <button onClick={() => slot.update({ title: 'Renamed' })} disabled={!slot.data}>Rename</button>
 *         <button onClick={() => slot.delete()} disabled={!slot.data}>Delete</button>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useSaveSlots = ({ count } = { count: 1 }): SaveSlot[] => {
    const data = useLiveQuery(() => getAllSaves(), [], [] as GameSave[]);
    const deleteGameHandler = useDeleteGame();
    const saveGameHandler = useSaveGame();
    const loadGameHandler = useLoadGame();
    const updateSaveHandler = useUpdateSave();

    return useMemo(
        () =>
            Array.from({ length: count }).map((_, index) => ({
                data: data?.find((slot) => slot.slot === `${index}`) || null,
                save: async (options?: SaveOptions) =>
                    saveGameHandler(index, options),
                load: async () => loadGameHandler(index),
                delete: async () => deleteGameHandler(index),
                update: async (changes: SaveUpdate) =>
                    updateSaveHandler(index, changes),
            })),
        [
            data,
            count,
            deleteGameHandler,
            loadGameHandler,
            saveGameHandler,
            updateSaveHandler,
        ]
    );
};
