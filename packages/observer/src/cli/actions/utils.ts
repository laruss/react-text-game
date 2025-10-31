import { existsSync } from "node:fs";
import { join } from "node:path";

import { CONFIG_FILE, GROUPS_FILE, METADATA_DIR, PASSAGES_FILE } from "#consts";
import { getGameObserverPaths } from "#paths";

/**
 * Check if the game is initialized
 *
 * Checks that main folder is created and has config and metadata files
 * @param rootDir - Root directory to check (defaults to process.cwd())
 * @returns void
 * @throws Error if game is not initialized
 */
export const checkIsInitialized = (rootDir: string = process.cwd()): void => {
    const paths = getGameObserverPaths(rootDir);
    const missingFiles: string[] = [];

    // Check main directory
    if (!existsSync(paths.root)) {
        throw new Error(
            `Game Observer is not initialized. Run 'rtg-observer init' to initialize.`
        );
    }

    // Check config.json
    if (!existsSync(paths.config)) {
        missingFiles.push(CONFIG_FILE);
    }

    // Check metadata directory
    if (!existsSync(paths.metadataDir)) {
        missingFiles.push(join(METADATA_DIR, "/"));
    } else {
        // Check metadata files only if directory exists
        if (!existsSync(paths.passages)) {
            missingFiles.push(join(METADATA_DIR, PASSAGES_FILE));
        }

        if (!existsSync(paths.groups)) {
            missingFiles.push(join(METADATA_DIR, GROUPS_FILE));
        }
    }

    if (missingFiles.length > 0) {
        throw new Error(
            `Game Observer is not properly initialized. Missing files:\n  - ${missingFiles.join("\n  - ")}\n\nRun 'rtg-observer init --force' to reinitialize.`
        );
    }
};
