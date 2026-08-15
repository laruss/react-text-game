import { Game } from "#game";
import { loadGame } from "#saves";
import { errorMessage } from "#saves/helpers";
import { migrateToCurrentVersion } from "#saves/migrations";
import type { SaveResult } from "#saves/types";

/**
 * Loads the save in a slot, applying migrations when it predates the current
 * game version.
 *
 * @remarks
 * Shared by {@link useLoadGame} and `useLastLoadGame` so that both paths into a
 * save run the same migrations.
 *
 * @param slot - Slot to load, *not* the save's database id
 * @returns The outcome of the load
 */
export const loadGameIntoState = async (
    slot: string | number
): Promise<SaveResult> => {
    try {
        const data = await loadGame(slot);
        if (!data) {
            return {
                success: false,
                code: "not-found",
                error: "The requested game save does not exist",
            };
        }

        // Apply migrations if needed
        const currentVersion = Game.options.gameVersion;
        const saveVersion = data.version;

        let gameData = data.gameData;

        if (saveVersion !== currentVersion) {
            const migrationResult = migrateToCurrentVersion(
                data.gameData,
                saveVersion
            );

            if (!migrationResult.success) {
                return {
                    success: false,
                    code: "migration-failed",
                    error: `Failed to migrate save from version ${saveVersion} to ${currentVersion}: ${migrationResult.error}`,
                };
            }

            if (!migrationResult.data) {
                throw new Error("Migration completed without game data");
            }
            gameData = migrationResult.data;

            // Log migration info for user visibility
            if (migrationResult.migrationsApplied.length > 0) {
                console.log(
                    `Save migrated from version ${saveVersion} to ${currentVersion} (${migrationResult.migrationsApplied.length} step(s))`
                );
            }
        }

        Game.setState(gameData);
        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to load game:", e);
        return {
            success: false,
            code: "storage-failed",
            error: errorMessage(
                e,
                "Failed to load game. Check console for more info."
            ),
        };
    }
};

/**
 * React hook that provides a function to load the save in a slot.
 * Restores the game state from the specified save.
 *
 * **Automatic Migration**: If the save version differs from the current game version,
 * registered migrations will be automatically applied to bring the save data up to date.
 *
 * @returns Function that accepts a slot and loads the game
 *
 * @example
 * ```tsx
 * const loadGame = useLoadGame();
 * const handleLoad = async () => {
 *   const result = await loadGame(slotIndex);
 *   if (!result.success) {
 *     console.error('Load failed:', result.error);
 *   }
 * };
 * ```
 */
export const useLoadGame = () => loadGameIntoState;
