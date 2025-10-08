import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { GameSave, getAllSaves, useDeleteGame, useLoadGame, useSaveGame } from "#saves";

/**
 * React hook that provides an array of save slots with live updates from IndexedDB.
 * Each slot includes the save data and methods to save, load, and delete.
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
 *         <p>Slot {index}: {slot.data ? 'Saved' : 'Empty'}</p>
 *         <button onClick={() => slot.save()}>Save</button>
 *         <button onClick={() => slot.load()} disabled={!slot.data}>Load</button>
 *         <button onClick={() => slot.delete()} disabled={!slot.data}>Delete</button>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useSaveSlots = ({ count } = { count: 1 }) => {
    const data = useLiveQuery(() => getAllSaves(), [], [] as GameSave[]);
    const deleteGameHandler = useDeleteGame();
    const saveGameHandler = useSaveGame();
    const loadGameHandler = useLoadGame();

    return useMemo(
        () =>
            Array.from({ length: count }).map(
                (_, index) => ({
                    data: data?.find((slot) => slot.name === `${index}`) || null,
                    save: async () => saveGameHandler(index),
                    load: async () => loadGameHandler(index),
                    delete: async () => deleteGameHandler(index),
                })
            ),
        [data, count, deleteGameHandler, loadGameHandler, saveGameHandler]
    );
};
