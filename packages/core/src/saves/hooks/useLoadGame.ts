import { Game } from "#game";
import { loadGame } from "#saves";
import { migrateToCurrentVersion } from "#saves/migrations";

/**
 * React hook that provides a function to load a saved game by its ID.
 * Restores the game state from the specified save.
 *
 * **Automatic Migration**: If the save version differs from the current game version,
 * registered migrations will be automatically applied to bring the save data up to date.
 *
 * @returns Function that accepts an optional save ID and loads the game, returning a result object on failure
 *
 * @example
 * ```tsx
 * const loadGame = useLoadGame();
 * const handleLoad = async () => {
 *   const result = await loadGame(saveId);
 *   if (result?.success === false) {
 *     console.error('Load failed:', result.message);
 *   }
 * };
 * ```
 */
export const useLoadGame = () => async (id: number) => {
    try {
        const data = await loadGame(id);
        if (!data) {
            return {
                success: false,
                message: "The requested game save does not exist",
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
                    message: `Failed to migrate save from version ${saveVersion} to ${currentVersion}: ${migrationResult.error}`,
                };
            }

            gameData = migrationResult.data!;

            // Log migration info for user visibility
            if (migrationResult.migrationsApplied.length > 0) {
                console.log(
                    `Save migrated from version ${saveVersion} to ${currentVersion} (${migrationResult.migrationsApplied.length} step(s))`
                );
            }
        }

        Game.setState(gameData);
    } catch (e) {
        console.error("Failed to load game:", e);
        return {
            success: false,
            message:
                (e as Error).message ||
                "Failed to load game. Check console for more info.",
        };
    }
};
