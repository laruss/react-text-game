# React Text Game

![React Text Game](./apps/docs/static/img/og-image.webp)

A powerful, reactive text-based game engine for React applications. Build interactive narrative experiences with TypeScript, featuring state management, multiple passage types, and a comprehensive save system.

[![@react-text-game/core](https://img.shields.io/npm/v/@react-text-game/core?label=core)](https://www.npmjs.com/package/@react-text-game/core)
[![@react-text-game/ui](https://img.shields.io/npm/v/@react-text-game/ui?label=ui)](https://www.npmjs.com/package/@react-text-game/ui)
[![@react-text-game/mdx](https://img.shields.io/npm/v/@react-text-game/mdx?label=mdx)](https://www.npmjs.com/package/@react-text-game/mdx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why React Text Game?

Building interactive narrative experiences shouldn't require reinventing the wheel. React Text Game provides a production-ready game engine that handles the complexity of state management, save systems, and UI components—so you can focus on crafting your story.

- **Zero boilerplate** - Start building immediately with factory functions and pre-built components
- **Production-ready** - Built-in save system with IndexedDB persistence and encrypted exports
- **Author-friendly** - Write passages in Markdown (MDX) or programmatically with TypeScript
- **Fully customizable** - Use our UI components or build your own with the core engine
- **Type-safe** - Catch errors at compile time with comprehensive TypeScript support
- **Modern React** - Built for React 18+ with hooks and reactive state management

Whether you're building a visual novel, interactive fiction, or educational narrative experience, React Text Game provides the foundation to ship faster.

## Features

- **Reactive State Management** - Built on Valtio for automatic UI updates
- **Multiple Passage Types** - Story passages, Interactive Maps, and custom Widget passages
- **Comprehensive Save System** - IndexedDB persistence with encrypted export/import
- **Audio System** - Full-featured audio management with reactive state, persistence, and global controls
- **Themeable UI Components** - Tailwind CSS v4 with semantic color tokens
- **Internationalization** - i18next-powered translations with persistent language switching
- **Type-Safe** - Full TypeScript support with detailed JSDoc documentation
- **Factory-Based Entities** - Plain-object factories with optional class-based escape hatches
- **React Integration** - Built-in hooks and React 19 support
- **Modular Architecture** - Use core engine independently or with UI components

## Packages

This monorepo contains three publishable packages:

### [@react-text-game/core](./packages/core)

The core game engine providing:

- Game orchestration and entity registry
- Reactive state management (Valtio)
- JSONPath-based storage system
- Story and Interactive Map passages
- Audio system with reactive state and persistence
- Save/load system with auto-save
- React hooks for game integration

[Core Package Documentation](./packages/core/README.md)

### [@react-text-game/ui](./packages/ui)

UI components library featuring:

- Pre-built game components (GameProvider, MainMenu, PassageController)
- Story and Interactive Map renderers
- Save/Load modals with slot management
- Tailwind CSS v4 semantic theming
- Dark mode support

[UI Package Documentation](./packages/ui/README.md)

### [@react-text-game/mdx](./packages/mdx)

MDX integration package enabling:

- Author-friendly Markdown syntax for game passages
- Seamless React component integration in narratives
- Type-safe custom components with full TypeScript support
- Vite plugin for optimized build pipeline
- Automatic metadata and story structure extraction
- Runtime-evaluated dynamic variables

[MDX Package Documentation](./packages/mdx/README.md)

## Quick Start

### Installation

```bash
# Install core and UI packages
bun add @react-text-game/core @react-text-game/ui

# Optional: Add MDX support for Markdown-based passages
bun add @react-text-game/mdx @mdx-js/mdx @mdx-js/react

# Or use npm/yarn/pnpm
npm install @react-text-game/core @react-text-game/ui
npm install @react-text-game/mdx @mdx-js/mdx @mdx-js/react
```

### Basic Example

```tsx
import { Game, createEntity, newStory } from "@react-text-game/core";
import { GameProvider, PassageController } from "@react-text-game/ui";
import "@react-text-game/ui/styles";

// Initialize the game
await Game.init({
    gameId: "my-game",
    gameName: "My Adventure",
    translations: {
        defaultLanguage: "en",
        fallbackLanguage: "en",
        resources: {
            en: {
                passages: {
                    intro: "Welcome to the Game",
                },
            },
        },
    },
});

// Create a game entity (factory-first approach)
const player = createEntity("player", {
    name: "Hero",
    stats: {
        health: 100,
        mana: 50,
    },
    inventory: [] as string[],
});

// Create a story passage
const intro = newStory("intro", () => [
    {
        type: "header",
        content: "Welcome to the Game",
        props: { level: 1 },
    },
    {
        type: "text",
        content: `Hello, ${player.name}!`,
    },
    {
        type: "actions",
        content: [
            {
                label: "Start Adventure",
                action: () => Game.jumpTo("chapter-1"),
            },
        ],
    },
]);

// React component
function App() {
    return (
        <GameProvider game={Game}>
            <PassageController />
        </GameProvider>
    );
}

// Start the game
Game.jumpTo(intro);
```

> Prefer class-based entities? Extend `BaseGameObject` directly—the factory and class APIs work side by side.

## Internationalization

React Text Game ships with i18next baked into the core engine and the UI package. The `translations` option you pass to `Game.init` accepts the same structure as i18next resources, and the engine automatically persists the player’s language choice in the save database.

- Core exports `useGameTranslation` and `getGameTranslation` so you can localize passages, UI, and game logic.
- The optional UI package exposes a `LanguageToggle` component and contributes default English strings under the `ui` namespace; your resources override them per language.
- Supported language codes are derived from your resources, and missing keys fall back to the language you declare in `fallbackLanguage`.

```tsx
import { useGameTranslation } from "@react-text-game/core/i18n";
import { LanguageToggle } from "@react-text-game/ui";

function StatusBar() {
    const { t, currentLanguage } = useGameTranslation("common");

    return (
        <header className="flex items-center gap-4">
            <span>
                {t("status.currentLanguage", { language: currentLanguage })}
            </span>
            <LanguageToggle />
        </header>
    );
}
```

## Documentation

- **[Full Documentation](./apps/docs)** - Comprehensive guides and tutorials (Docusaurus site)
- **[API Reference](./apps/docs/api)** - Auto-generated TypeDoc API documentation
- **[Example Game](./apps/example-game)** - Complete game implementation example

## Development

This is a Turborepo monorepo using **Bun** as the package manager.

### Prerequisites

- [Bun](https://bun.sh) 1.2.23 or later
- Node.js 18 or later

### Setup

```bash
# Install dependencies
bun install

# Run all packages in watch mode
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

### Turborepo Filtering

Target specific packages or apps:

```bash
# Run dev for specific app
bun run dev --filter=example-game

# Build only the core package
bun run build --filter=@react-text-game/core

# Build both packages
bun run build --filter='@react-text-game/*'
```

### Repository Structure

```text
react-text-game/
├── packages/
│   ├── core/          # @react-text-game/core - Game engine
│   ├── ui/            # @react-text-game/ui - UI components
│   └── mdx/           # @react-text-game/mdx - MDX integration
├── apps/
│   ├── docs/          # Docusaurus documentation site
│   ├── example-game/  # Example game implementation
│   ├── core-test-app/ # Core package testing
│   └── ui-test-app/   # UI components testing
└── turbo.json         # Turborepo configuration
```

**Note:** The `apps/` directory contains examples, tests, and documentation. The main deliverables are the packages in `packages/`.

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository** and create a new branch for your feature or bugfix
2. **Install dependencies** with `bun install`
3. **Follow existing patterns** - Use factory functions, semantic colors in UI, and TypeScript types
4. **Test your changes** in the test apps (`apps/core-test-app` or `apps/ui-test-app`)
5. **Ensure code quality**:
    - Run `bun run lint` to check for linting issues
    - Run `bun run check-types` to verify TypeScript types
    - Run `bun run format` to format code with Prettier
6. **Create a changeset** if you're modifying a package:
    - Run `bun run changeset` and follow the prompts
    - This helps with version management and changelog generation
7. **Submit a pull request** with a clear description of your changes

Please ensure all checks pass before submitting your PR. If you're adding new features, consider updating the documentation in `apps/docs`.

## License

MIT (c) [laruss](https://github.com/laruss)

## Links

- **NPM Packages:**
    - [@react-text-game/core](https://www.npmjs.com/package/@react-text-game/core)
    - [@react-text-game/ui](https://www.npmjs.com/package/@react-text-game/ui)
    - [@react-text-game/mdx](https://www.npmjs.com/package/@react-text-game/mdx)
- **Repository:** [GitHub](https://github.com/laruss/react-text-game)
- **Issues:** Report bugs and request features on GitHub Issues
