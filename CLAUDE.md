# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **Bun** (`bun@1.2.23`) as the package manager. Always use `bun` commands instead of npm/yarn/pnpm.

## Common Commands

```bash
# Development (runs all workspaces in watch mode)
bun run dev

# Build all packages
bun run build

# Type checking
bun run check-types

# Linting
bun run lint

# Code formatting
bun run format
```

## Turborepo Filtering

Use `--filter` to target specific packages:

```bash
# Run dev for a specific app
bun run dev --filter=example-game

# Build only the core package
bun run build --filter=@react-text-game/core
```

## Architecture

This is a **text-based game engine** built as a Turborepo monorepo with React integration.

### Workspaces

- **`packages/core`** - The core game engine (`@react-text-game/core`)
  - Uses TypeScript, Valtio for state management
  - Exports via `dist/index.js` after compilation
  - Uses subpath imports (`#*` maps to `./src/*`)

- **`apps/example-game`** - Example game implementation using the core package
  - Vite + React 19 + TypeScript
  - Consumes `@react-text-game/core` via workspace protocol

### Core Game Engine (`packages/core`)

The engine uses a **registry pattern** with reactive state management (Valtio):

1. **`Game`** (`src/game.ts`) - Central orchestrator
   - **MUST call `Game.init(options)` before using any other Game methods**
   - Manages two registries: `objectRegistry` (game entities) and `passagesRegistry` (game passages)
   - All registered objects are proxied with Valtio for reactivity
   - Handles navigation via `jumpTo()` and `setCurrent()`
   - Save/load system via `Storage` class with auto-save support (session storage)
   - `Game.getState()` / `Game.setState()` for full game serialization

2. **`BaseGameObject`** (`src/baseGameObject.ts`)
   - Base class for all game entities
   - Auto-registers with `Game` on construction
   - Variables stored in `_variables` and persisted via JSONPath
   - `save()` / `load()` methods sync with `Storage`

3. **`Passage`** (`src/passages/passage.ts`)
   - Base class for game screens/scenes
   - Auto-registers with `Game` on construction
   - Subclasses must implement `display<T>(_props: T)` method
   - Two built-in passage types: `Story` and `InteractiveMap`

4. **`Storage`** (`src/storage.ts`)
   - JSONPath-based storage system using the `jsonpath` library
   - `getValue<T>(jsonPath)` / `setValue(jsonPath, value)` for querying/updating
   - Protected system paths (prefixed with `STORAGE_SYSTEM_PATH`)
   - `getState()` / `setState()` for full state serialization

### Passage Types

- **Story passages** (`src/passages/story/`) - Text-based narrative passages
- **Interactive Map passages** (`src/passages/interactiveMap/`) - Map-based interactive passages

Both have corresponding factory functions and type definitions.

### State Management Flow

1. **Game initialization** - `Game.init(options)` must be called first
2. Entities extend `BaseGameObject` and register on construction
3. Passages extend `Passage` and register on construction
4. All state changes go through Valtio proxies
5. Storage uses JSONPath queries for flexible state access
6. Auto-save (if enabled) debounces writes to session storage
- NEVER fix aliases to their built names (from #<something> to ./<something>.js)

## UI Package (`packages/ui`)

The UI package provides React components for the game engine, built with **Tailwind CSS v4** and a semantic theming system.

### Theme System

All components use **semantic color tokens** instead of hardcoded colors. This allows users to customize the entire look and feel by overriding CSS variables.

#### Available Semantic Colors

**Brand Colors (with 50-950 scale):**
- `primary-*` - Main brand color
- `secondary-*` - Secondary brand color

**Semantic State Colors (with 50-950 scale):**
- `success-*` - Success states
- `warning-*` - Warning states
- `danger-*` - Error/danger states
- `info-*` - Informational states

**Neutral/UI Colors (with 50-950 scale):**
- `muted-*` - Muted/subtle UI elements

**Single-Value Semantic Colors:**
- `background` / `foreground` - Main background and text
- `card` / `card-foreground` - Card backgrounds and text
- `popover` / `popover-foreground` - Popover backgrounds and text
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color
- `accent` / `accent-foreground` - Accent backgrounds and text
- `destructive` / `destructive-foreground` - Destructive action colors

### Writing Theme-Compatible Components

When creating new components in the UI package, **ALWAYS** follow these rules:

#### ✅ DO: Use Semantic Color Classes

```tsx
// GOOD - Uses semantic colors
export const MyComponent = () => (
  <div className="bg-card text-card-foreground border border-border">
    <button className="bg-primary-500 hover:bg-primary-600 text-white">
      Click me
    </button>
    <button className="bg-danger-500 hover:bg-danger-600 text-white">
      Delete
    </button>
  </div>
);
```

#### ❌ DON'T: Use Hardcoded Colors

```tsx
// BAD - Hardcoded colors that can't be themed
export const MyComponent = () => (
  <div className="bg-white text-gray-900 border border-gray-200">
    <button className="bg-blue-500 hover:bg-blue-600 text-white">
      Click me
    </button>
    <button className="bg-red-500 hover:bg-red-600 text-white">
      Delete
    </button>
  </div>
);
```

#### Color Selection Guide

**For backgrounds:**
- Main content: `bg-background`
- Cards/panels: `bg-card`
- Muted areas: `bg-muted`
- Popovers/tooltips: `bg-popover`

**For text:**
- Primary text: `text-foreground`
- Secondary text: `text-muted-foreground`
- Card text: `text-card-foreground`
- Popover text: `text-popover-foreground`

**For borders:**
- Standard borders: `border-border`
- Input borders: `border-input`

**For interactive elements (buttons, links):**
- Primary action: `bg-primary-500`, `hover:bg-primary-600`, `text-white`
- Secondary action: `bg-secondary-500`, `hover:bg-secondary-600`, `text-white`
- Success action: `bg-success-500`, `hover:bg-success-600`, `text-white`
- Destructive action: `bg-danger-500`, `hover:bg-danger-600`, `text-white`
- Ghost/subtle: `text-primary-600`, `hover:bg-primary-50`

**For state indicators:**
- Success: `text-success-600` or `bg-success-100`
- Warning: `text-warning-600` or `bg-warning-100`
- Error: `text-danger-600` or `bg-danger-100`
- Info: `text-info-600` or `bg-info-100`

#### Component Variants Example

When creating components with multiple variants, map color props to semantic classes:

```tsx
// GOOD - Color variants using semantic tokens
type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

const colorClasses: Record<ButtonColor, string> = {
  default: 'bg-muted-500 hover:bg-muted-600 text-white',
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  success: 'bg-success-500 hover:bg-success-600 text-white',
  warning: 'bg-warning-500 hover:bg-warning-600 text-white',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white',
};

export const Button = ({ color = 'primary', ...props }) => (
  <button className={twMerge('px-4 py-2 rounded', colorClasses[color])} {...props} />
);
```

#### Dark Mode Support

Dark mode is **automatically handled** by the theme system. Components automatically adapt when the user's system preference is set to dark mode. You don't need to add `dark:` prefixes - the semantic color variables change automatically.

```tsx
// GOOD - Automatically supports dark mode
<div className="bg-background text-foreground border border-border">
  {/* This will adapt to dark mode automatically */}
</div>

// BAD - Don't manually add dark mode classes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* This defeats the theming system */}
</div>
```

#### Custom Colors from Props

If a component accepts custom colors via props (e.g., user-defined hotspot colors), use inline styles:

```tsx
// GOOD - Custom colors via style prop
export const CustomColorComponent = ({ backgroundColor, ...props }) => (
  <div
    className="p-4 rounded"
    style={{ backgroundColor }}
    {...props}
  />
);
```

#### Updating Existing Components

When updating existing components to support theming:

1. **Identify hardcoded colors**: Look for `bg-gray-*`, `text-blue-*`, `border-red-*`, etc.
2. **Map to semantic equivalents**: Replace with semantic tokens based on purpose
3. **Remove dark mode variants**: Remove `dark:bg-*` classes (handled by theme)
4. **Test in light and dark mode**: Verify appearance in both modes
5. **Allow className override**: Accept `className` prop for customization

### Theme Variables Reference

All theme variables are defined in `packages/ui/src/styles/index.css` using Tailwind v4's `@theme` directive with the `oklch()` color format.

### Quick Reference: Common Replacements

When updating components, use these common replacements:

| Old (Hardcoded) | New (Semantic) | Usage |
|-----------------|----------------|-------|
| `bg-white` | `bg-background` or `bg-card` | Main backgrounds |
| `bg-gray-50` | `bg-muted` | Subtle backgrounds |
| `bg-gray-100` | `bg-muted-100` | Light gray areas |
| `bg-gray-900` | `bg-card` (dark auto) | Dark backgrounds |
| `text-gray-900` | `text-foreground` | Primary text |
| `text-gray-600` | `text-muted-foreground` | Secondary text |
| `text-gray-500` | `text-muted-foreground` | Muted text |
| `border-gray-200` | `border-border` | Standard borders |
| `border-gray-300` | `border-input` | Input borders |
| `bg-blue-500` | `bg-primary-500` | Primary actions |
| `bg-blue-600` | `bg-primary-600` | Primary hover |
| `bg-green-500` | `bg-success-500` | Success actions |
| `bg-red-500` | `bg-danger-500` | Danger/delete actions |
| `bg-yellow-500` | `bg-warning-500` | Warning actions |
| `bg-purple-500` | `bg-secondary-500` | Secondary actions |