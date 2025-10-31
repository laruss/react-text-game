/**
 * Configuration for the Game Observer utilities
 */
export interface UtilsConfig {
    /** Directories to scan for passages (defaults to ["src"]) */
    passageDirectories?: string[];
    /** Glob patterns to exclude from scanning */
    excludePatterns?: string[];
}

/**
 * Extended metadata for a passage, stored separately from source code
 */
export interface PassageExtendedMetadata {
    /** Reference to passage ID */
    id: string;
    /** Source of passage creation: 'code' = user-created in source files (read-only in UI), 'tool' = created by utils tools (editable in UI) */
    source: "code" | "tool";
    /** User-defined categories/tags */
    tags?: string[];
    /** Passage description */
    description?: string;
    /** Visual editor position */
    position?: { x: number; y: number };
    /** Extensible custom metadata */
    customMetadata?: Record<string, unknown>;
}

/**
 * Connection between passages via Game.jumpTo()
 */
export interface PassageConnection {
    /** Source passage ID, or "_CODE" if called outside of any passage */
    from: string;
    /** Target passage ID (argument to Game.jumpTo()) */
    to: string;
}

/**
 * Game settings detected from user code
 */
export interface PassageSettings {
    /** Start passage ID configured via Game.init() or GameProvider */
    startPassage: string;
}

/**
 * Container for all passage metadata
 */
export interface PassagesMetadata {
    passages: Record<string, PassageExtendedMetadata>;
    connections?: PassageConnection[];
    settings?: PassageSettings;
}

/**
 * Group definition for organizing passages (Phase 4)
 */
export interface PassageGroup {
    id: string;
    name: string;
    description?: string;
    passages: string[];
    subgroups?: PassageGroup[];
    order?: number;
}

/**
 * Container for all passage groups
 */
export interface GroupsMetadata {
    groups: PassageGroup[];
}
