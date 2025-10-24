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
 * Container for all passage metadata
 */
export interface PassagesMetadata {
  passages: Record<string, PassageExtendedMetadata>;
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
