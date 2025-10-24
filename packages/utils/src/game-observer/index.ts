/**
 * Game Observer - Developer tools for React Text Game
 *
 * Provides utilities for passage discovery, visualization, variable tracking,
 * and migration management.
 */

// Actions
export type { InitializeOptions, InitializeResult } from "./actions/initialize";
export { initialize } from "./actions/initialize";

// Utils
export { checkIsInitialized } from "./actions/utils";

// Paths
export type { GameObserverPaths } from "./paths";
export {
	getConfigPath,
	getGameObserverPaths,
	getGameObserverRoot,
	getGroupsPath,
	getMetadataDir,
	getPassagesPath,
} from "./paths";

// Constants
export {
	CONFIG_FILE,
	GROUPS_FILE,
	METADATA_DIR,
	PASSAGES_FILE,
	REACT_TEXT_GAME_DIR,
} from "./consts";

// Types
export type {
	GroupsMetadata,
	PassageExtendedMetadata,
	PassageGroup,
	PassagesMetadata,
	UtilsConfig,
} from "./types";
