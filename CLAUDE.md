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
bun run typecheck

# Linting
bun run lint

# Code formatting
bun run format

# Documentation site (Docusaurus)
bun run docs

# Build documentation site
bun run docs:build

# Generate API documentation (TypeDoc)
bun run docs:api
```

## Turborepo Filtering

Use `--filter` to target specific packages:

```bash
# Run dev for a specific app
bun run dev --filter=example-game
bun run dev --filter=@react-text-game/docs

# Build only the core package
bun run build --filter=@react-text-game/core

# Build all packages
bun run build --filter='@react-text-game/*'
```

## Architecture

This is a **text-based game engine** built as a Turborepo monorepo with React integration.

### Workspaces

**Packages (`packages/`):**

- **`packages/core`** - The core game engine (`@react-text-game/core`)
    - Uses TypeScript, Valtio for state management
    - Dependencies: `valtio`, `jsonpath-plus`, `dexie`, `crypto-js`, `consola`
    - Exports via `dist/index.js` after compilation
    - Uses subpath imports (`#*` maps to `./dist/*`)
    - Has subpath exports: `.`, `./saves`, `./passages`

- **`packages/ui`** - UI components library (`@react-text-game/ui`)
    - React components with Tailwind CSS v4
    - Semantic theming system with dark mode support
    - Depends on `@react-text-game/core` (peer dependency)
    - Exports: `.` (components), `./styles` (CSS)

- **`packages/mdx`** - MDX integration package (`@react-text-game/mdx`)
    - Markdown-based passage authoring
    - Vite plugin for MDX compilation
    - Peer dependencies: `@mdx-js/mdx`, `@mdx-js/react`, `@react-text-game/core`
    - Exports: `.` (main), `./plugin` (Vite plugin)

**Apps (`apps/`):**

- **`apps/docs`** - Docusaurus documentation site
    - Comprehensive guides and API reference
    - TypeDoc integration for auto-generated API docs

- **`apps/example-game`** - Example game implementation
    - Vite + React 19 + TypeScript
    - Demonstrates core and UI package usage

- **`apps/core-test-app`** - Core package testing app
    - Used for testing core functionality

- **`apps/ui-test-app`** - UI components testing app
    - Used for testing UI components

### Core Game Engine (`packages/core`)

The engine uses a **factory-first approach** with reactive state management (Valtio):

#### Core Concepts

1. **`Game`** (`src/game.ts`) - Central orchestrator
    - **MUST call `Game.init(options)` before using any other Game methods**
    - Manages two registries: `objectRegistry` (game entities) and `passagesRegistry` (game passages)
    - All registered objects are proxied with Valtio for reactivity
    - Handles navigation via `jumpTo()` and `setCurrent()`
    - `Game.getState()` / `Game.setState()` for full game serialization
    - Supports custom logging via `consola`

2. **Factory Functions** - Preferred approach for creating entities
    - `createEntity(id, props)` - Creates reactive game entities
    - `createBaseGameObject(id, props)` - Alternative factory function
    - Plain-object factories that return Valtio-proxied objects
    - Automatically register with Game on creation
    - Alternative to class-based approach

3. **`BaseGameObject`** (`src/baseGameObject.ts`) - Class-based escape hatch
    - Base class for all game entities (optional, use factories instead)
    - Auto-registers with `Game` on construction
    - Variables stored in `_variables` and persisted via JSONPath
    - `save()` / `load()` methods sync with storage system

4. **`Passage`** (`src/passages/passage.ts`)
    - Base class for game screens/scenes
    - Auto-registers with `Game` on construction
    - Subclasses must implement `display<T>(_props: T)` method
    - Built-in passage types: `Story`, `InteractiveMap`, and `Widget`

5. **`Storage`** (`src/storage.ts`)
    - JSONPath-based storage system using `jsonpath-plus` library
    - `getValue<T>(jsonPath)` / `setValue(jsonPath, value)` for querying/updating
    - Protected system paths (prefixed with `STORAGE_SYSTEM_PATH`)
    - `getState()` / `setState()` for full state serialization

6. **Save System** (`src/saves/`)
    - **IndexedDB persistence** via Dexie
    - **Encrypted export/import** using crypto-js
    - Save slots with metadata (name, timestamp, screenshot)
    - Auto-save support with debouncing
    - React hooks: `useSaves()`, `useAutoSave()`

#### Passage Types

The engine supports three built-in passage types:

1. **Story passages** (`src/passages/story/`)
    - Text-based narrative passages
    - Factory function: `newStory(id, displayFn)`
    - Supports: headers, text, images, actions, conversations
    - Dynamic content generation via display function

2. **Interactive Map passages** (`src/passages/interactiveMap/`)
    - Image-based interactive passages with clickable hotspots
    - Factory function: `newInteractiveMap(id, displayFn)`
    - Hotspots with customizable colors, positions, and actions
    - Responsive positioning system

3. **Widget passages** (`src/passages/widget.ts`)
    - Custom React component passages
    - For special UI screens (inventory, character sheet, etc.)
    - Fully customizable via React components

All passage types have corresponding factory functions and TypeScript type definitions.

#### State Management Flow

1. **Game initialization** - `Game.init(options)` must be called first
2. Entities created via factories (or classes) auto-register with Game
3. Passages created via factories (or classes) auto-register with Game
4. All state changes go through Valtio proxies for reactivity
5. Storage uses JSONPath queries for flexible state access
6. Auto-save (if enabled) debounces writes to IndexedDB
7. Import/export saves as encrypted files

**IMPORTANT:** NEVER fix TypeScript path aliases to their built names (from `#<something>` to `./<something>.js`). The build process handles this via `tsc-alias`.

## MDX Package (`packages/mdx`)

The MDX package enables author-friendly Markdown syntax for game passages:

### Features

- **Markdown-based passages** - Write passages in `.mdx` files with frontmatter
- **React components** - Seamlessly integrate React components in narratives
- **Type-safe** - Full TypeScript support with custom component types
- **Vite plugin** - Optimized build pipeline for MDX files
- **Metadata extraction** - Automatic frontmatter parsing for passage metadata
- **Dynamic variables** - Runtime-evaluated expressions in content

### Usage

```typescript
// Configure Vite plugin
import { vitePlugin } from "@react-text-game/mdx/plugin";

export default defineConfig({
    plugins: [
        vitePlugin({
            /* options */
        }),
    ],
});
```

### MDX Passage Structure

```mdx
---
id: passage-id
title: Passage Title
tags: [tag1, tag2]
---

# Header

Text content with **markdown** formatting.

<CustomComponent prop="value" />

[[Link to another passage->other-passage]]
```

### Key Components

- **`src/plugins/`** - Remark/rehype plugins for MDX processing
- **Frontmatter parsing** - Extracts metadata from passages
- **Link transformation** - Converts `[[text->target]]` to passage navigation
- **Variable evaluation** - Runtime evaluation of dynamic content

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
type ButtonColor =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";

const colorClasses: Record<ButtonColor, string> = {
    default: "bg-muted-500 hover:bg-muted-600 text-white",
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white",
    success: "bg-success-500 hover:bg-success-600 text-white",
    warning: "bg-warning-500 hover:bg-warning-600 text-white",
    danger: "bg-danger-500 hover:bg-danger-600 text-white",
};

export const Button = ({ color = "primary", ...props }) => (
    <button
        className={twMerge("px-4 py-2 rounded", colorClasses[color])}
        {...props}
    />
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
    <div className="p-4 rounded" style={{ backgroundColor }} {...props} />
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

| Old (Hardcoded)   | New (Semantic)               | Usage                 |
| ----------------- | ---------------------------- | --------------------- |
| `bg-white`        | `bg-background` or `bg-card` | Main backgrounds      |
| `bg-gray-50`      | `bg-muted`                   | Subtle backgrounds    |
| `bg-gray-100`     | `bg-muted-100`               | Light gray areas      |
| `bg-gray-900`     | `bg-card` (dark auto)        | Dark backgrounds      |
| `text-gray-900`   | `text-foreground`            | Primary text          |
| `text-gray-600`   | `text-muted-foreground`      | Secondary text        |
| `text-gray-500`   | `text-muted-foreground`      | Muted text            |
| `border-gray-200` | `border-border`              | Standard borders      |
| `border-gray-300` | `border-input`               | Input borders         |
| `bg-blue-500`     | `bg-primary-500`             | Primary actions       |
| `bg-blue-600`     | `bg-primary-600`             | Primary hover         |
| `bg-green-500`    | `bg-success-500`             | Success actions       |
| `bg-red-500`      | `bg-danger-500`              | Danger/delete actions |
| `bg-yellow-500`   | `bg-warning-500`             | Warning actions       |
| `bg-purple-500`   | `bg-secondary-500`           | Secondary actions     |

## Development Practices

### Build System

- **TypeScript compilation** - `tsc` for type checking and compilation
- **Path alias resolution** - `tsc-alias` resolves `#*` imports to `./dist/*`
- **Tailwind CSS** - v4 with `@tailwindcss/cli` for CSS processing (UI package)
- **Watch mode** - All packages support watch mode via `bun run dev`

### Testing

The project uses **Bun's built-in test runner** with:

- **@testing-library/react** - React component testing
- **@testing-library/jest-dom** - DOM matchers
- **@happy-dom/global-registrator** - DOM environment for tests

Run tests with:

```bash
bun test
```

Test apps are located in:

- `apps/core-test-app` - Core functionality tests
- `apps/ui-test-app` - UI component tests

### Publishing

The project uses **Changesets** for version management:

```bash
# Create a changeset
bun run changeset

# Apply changesets and update versions
bunx changeset version

# Publish to npm
bunx changeset publish
```

All packages are published to npm with public access:

- `@react-text-game/core`
- `@react-text-game/ui`
- `@react-text-game/mdx`

### Documentation

Documentation is built with **Docusaurus** and **TypeDoc**:

- **Docusaurus site** - `apps/docs` (user guides, tutorials)
- **API docs** - Auto-generated from TypeScript via TypeDoc
- **API generation** - `bun run docs:api` generates API reference

Documentation is deployed to GitHub Pages.

### Code Style

- **ESLint** - Linting with TypeScript ESLint
- **Prettier** - Code formatting
- **Simple Import Sort** - Automatic import sorting
- **React Hooks Rules** - React-specific linting

Run code quality checks:

```bash
bun run lint
bun run format
bun run check-types
```

### Key Conventions

1. **Factory-first approach** - Use factory functions (e.g., `createEntity`, `newStory`) over classes
2. **TypeScript paths** - Use `#*` imports within packages, resolved at build time
3. **Semantic colors** - Always use semantic tokens in UI components
4. **Workspace protocol** - Internal dependencies use `workspace:*`
5. **Subpath exports** - Packages expose multiple entry points (e.g., `@react-text-game/core/saves`)

## Important Notes

- **Node.js version** - Requires Node.js 18 or later
- **React version** - Supports React 18 and 19
- **TypeScript version** - Requires TypeScript 5+
- **Tailwind CSS version** - UI package requires Tailwind CSS v4
- **Package manager** - Must use Bun 1.2.23 or later
