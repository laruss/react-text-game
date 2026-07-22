/**
 * Game Registry
 *
 * This file ensures all game entities, passages, and widgets are loaded.
 * Simply importing this file will register all game content with the Game system.
 *
 * Import order matters:
 * 1. Entities first (they have no dependencies)
 * 2. Stories/Passages (may reference entities)
 * 3. Maps (may reference entities and stories)
 * 4. Widgets (may reference everything)
 */

// =============================================================================
// ENTITIES
// =============================================================================
export * from "./entities";
// =============================================================================
// MAPS
// =============================================================================
export * from "./maps";
// =============================================================================
// STORIES
// =============================================================================
export * from "./stories";

// =============================================================================
// WIDGETS
// =============================================================================
export * from "./widgets";
