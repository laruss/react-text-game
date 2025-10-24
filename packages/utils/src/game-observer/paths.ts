/**
 * Path utilities for Game Observer
 *
 * Provides helper functions to get full paths to all Game Observer files and directories.
 */

import { join } from "node:path";

import {
	CONFIG_FILE,
	GROUPS_FILE,
	METADATA_DIR,
	PASSAGES_FILE,
	REACT_TEXT_GAME_DIR,
} from "#game-observer/consts";

/**
 * Interface for all Game Observer paths
 */
export interface GameObserverPaths {
	/** Root directory (.react-text-game) */
	root: string;
	/** Config file path (.react-text-game/config.json) */
	config: string;
	/** Metadata directory (.react-text-game/metadata) */
	metadataDir: string;
	/** Passages metadata file (.react-text-game/metadata/passages.json) */
	passages: string;
	/** Groups metadata file (.react-text-game/metadata/groups.json) */
	groups: string;
}

/**
 * Get all Game Observer paths for a given root directory
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Object containing all Game Observer paths
 *
 * @example
 * ```ts
 * const paths = getGameObserverPaths();
 * console.log(paths.config); // /path/to/project/.react-text-game/config.json
 * ```
 */
export function getGameObserverPaths(
	rootDir: string = process.cwd(),
): GameObserverPaths {
	const root = join(rootDir, REACT_TEXT_GAME_DIR);
	const metadataDir = join(root, METADATA_DIR);

	return {
		root,
		config: join(root, CONFIG_FILE),
		metadataDir,
		passages: join(metadataDir, PASSAGES_FILE),
		groups: join(metadataDir, GROUPS_FILE),
	};
}

/**
 * Get the root .react-text-game directory path
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Path to .react-text-game directory
 */
export function getGameObserverRoot(rootDir: string = process.cwd()): string {
	return join(rootDir, REACT_TEXT_GAME_DIR);
}

/**
 * Get the config.json file path
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Path to config.json file
 */
export function getConfigPath(rootDir: string = process.cwd()): string {
	return join(rootDir, REACT_TEXT_GAME_DIR, CONFIG_FILE);
}

/**
 * Get the metadata directory path
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Path to metadata directory
 */
export function getMetadataDir(rootDir: string = process.cwd()): string {
	return join(rootDir, REACT_TEXT_GAME_DIR, METADATA_DIR);
}

/**
 * Get the passages.json file path
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Path to passages.json file
 */
export function getPassagesPath(rootDir: string = process.cwd()): string {
	return join(rootDir, REACT_TEXT_GAME_DIR, METADATA_DIR, PASSAGES_FILE);
}

/**
 * Get the groups.json file path
 *
 * @param rootDir - Root directory of the project (defaults to process.cwd())
 * @returns Path to groups.json file
 */
export function getGroupsPath(rootDir: string = process.cwd()): string {
	return join(rootDir, REACT_TEXT_GAME_DIR, METADATA_DIR, GROUPS_FILE);
}
