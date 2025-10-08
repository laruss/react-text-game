import { deleteAllGameSaves } from "#saves";

/**
 * React hook that provides a function to delete all game saves.
 * This function clears all saved game data from the database.
 *
 * @returns Callback function that deletes all game saves
 *
 * @example
 * ```tsx
 * const deleteAllSaves = useDeleteAllSaves();
 * const handleDeleteAll = async () => {
 *   await deleteAllSaves();
 *   console.log('All game saves have been deleted.');
 * };
 * ```
 */
export const useDeleteAllSaves = () => deleteAllGameSaves;
