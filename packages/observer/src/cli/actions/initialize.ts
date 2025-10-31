import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
    CONFIG_FILE,
    GROUPS_FILE,
    METADATA_DIR,
    PASSAGES_FILE,
    REACT_TEXT_GAME_DIR,
} from "#consts";
import { getGameObserverPaths } from "#paths";
import type { GroupsMetadata, PassagesMetadata, UtilsConfig } from "#types";

/**
 * Default configuration for Game Observer
 */
const DEFAULT_CONFIG: UtilsConfig = {
    passageDirectories: ["src"],
    excludePatterns: ["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**"],
};

/**
 * Default passages metadata (empty)
 *
 * Example passage structure:
 * {
 *   "passages": {
 *     "example-passage": {
 *       "id": "example-passage",
 *       "source": "code",  // 'code' for user-created, 'tool' for tool-created
 *       "position": { "x": 0, "y": 0 },
 *       "tags": ["example"],
 *       "description": "An example passage"
 *     }
 *   }
 * }
 */
const DEFAULT_PASSAGES_METADATA: PassagesMetadata = {
    passages: {},
};

/**
 * Default groups metadata (empty, for Phase 4)
 */
const DEFAULT_GROUPS_METADATA: GroupsMetadata = {
    groups: [],
};

/**
 * Result of initialization
 */
export interface InitializeResult {
    success: boolean;
    message: string;
    created: string[];
}

/**
 * Options for initialization
 */
export interface InitializeOptions {
    /** Root directory where .react-text-game should be created (defaults to process.cwd()) */
    rootDir?: string;
    /** Whether to overwrite existing files (defaults to false) */
    force?: boolean;
}

/**
 * Checks if a file or directory exists
 */
async function exists(path: string): Promise<boolean> {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

/**
 * Initializes the Game Observer by creating the .react-text-game folder structure
 *
 * Creates:
 * - .react-text-game/
 *   - config.json
 *   - metadata/
 *     - passages.json
 *     - groups.json
 *
 * @param options - Initialization options
 * @returns Result of initialization
 */
export async function initialize(
    options: InitializeOptions = {}
): Promise<InitializeResult> {
    const { rootDir = process.cwd(), force = false } = options;

    const paths = getGameObserverPaths(rootDir);
    const created: string[] = [];

    try {
        // Check if .react-text-game already exists
        if ((await exists(paths.root)) && !force) {
            return {
                success: false,
                message: `${REACT_TEXT_GAME_DIR} directory already exists. Use --force to overwrite.`,
                created: [],
            };
        }

        // Create .react-text-game directory
        if (!(await exists(paths.root))) {
            await mkdir(paths.root, { recursive: true });
            created.push(REACT_TEXT_GAME_DIR);
        }

        // Create config.json
        if (!(await exists(paths.config)) || force) {
            await writeFile(
                paths.config,
                JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n",
                "utf-8"
            );
            created.push(join(REACT_TEXT_GAME_DIR, CONFIG_FILE));
        }

        // Create metadata directory
        if (!(await exists(paths.metadataDir))) {
            await mkdir(paths.metadataDir, { recursive: true });
            created.push(join(REACT_TEXT_GAME_DIR, METADATA_DIR));
        }

        // Create metadata/passages.json
        if (!(await exists(paths.passages)) || force) {
            await writeFile(
                paths.passages,
                JSON.stringify(DEFAULT_PASSAGES_METADATA, null, 2) + "\n",
                "utf-8"
            );
            created.push(
                join(REACT_TEXT_GAME_DIR, METADATA_DIR, PASSAGES_FILE)
            );
        }

        // Create metadata/groups.json
        if (!(await exists(paths.groups)) || force) {
            await writeFile(
                paths.groups,
                JSON.stringify(DEFAULT_GROUPS_METADATA, null, 2) + "\n",
                "utf-8"
            );
            created.push(join(REACT_TEXT_GAME_DIR, METADATA_DIR, GROUPS_FILE));
        }

        return {
            success: true,
            message: "Game Observer initialized successfully!",
            created,
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to initialize Game Observer: ${error instanceof Error ? error.message : String(error)}`,
            created,
        };
    }
}
