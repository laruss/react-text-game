---
sidebar_position: 2
title: Getting Started
description: Learn how to install and set up React Text Game in your project. Step-by-step guide for installing the core game engine and UI components, configuring Tailwind CSS, and creating your first text-based game or interactive fiction.
keywords:
    - react text game installation
    - text game setup
    - interactive fiction tutorial
    - react game engine setup
    - valtio state management
    - tailwindcss game ui
    - typescript game development
image: /img/og-image.webp
---

# Getting Started

This guide will help you set up React Text Game in your project.

## Installation

React Text Game consists of two packages: the core engine (`@react-text-game/core`) and the UI components (`@react-text-game/ui`).

### Core Package Only

If you want to build your own UI, you can install just the core package:

```bash
# Bun
bun add @react-text-game/core

# npm
npm install @react-text-game/core

# yarn
yarn add @react-text-game/core

# pnpm
pnpm add @react-text-game/core
```

### Core + UI Packages

For a complete solution with ready-to-use React components:

```bash
# Bun
bun add @react-text-game/core @react-text-game/ui

# npm
npm install @react-text-game/core @react-text-game/ui

# yarn
yarn add @react-text-game/core @react-text-game/ui

# pnpm
pnpm add @react-text-game/core @react-text-game/ui
```

## UI Package Setup

If you're using the UI package, you need to configure Tailwind CSS:

### 1. Install Tailwind CSS

Follow the [official Tailwind installation guide](https://tailwindcss.com/docs/installation) for your stack.

### 2. Import UI Styles

Import the UI styles in your global CSS file (e.g., `src/index.css` or `src/main.css`):

```css
@import "@react-text-game/ui/styles";

/* Optional: Override theme colors */
@theme {
    --color-primary-500: oklch(0.65 0.25 265);
}
```

## Basic Setup

### Using Core Package Only

```tsx
import { Game, createEntity, newStory } from "@react-text-game/core";

// IMPORTANT: Initialize the game first
await Game.init({
    gameName: "My Text Adventure",
    isDevMode: true,
});

// Create game entities
const player = createEntity("player", {
    name: "Hero",
    health: 100,
});

// Create story passages
const intro = newStory("intro", () => [
    {
        type: "header",
        content: "Welcome!",
        props: { level: 1 },
    },
    {
        type: "text",
        content: "Your adventure begins...",
    },
]);

// Start the game
Game.jumpTo(intro);
```

### Using Core + UI Packages

The UI package provides a complete game interface with minimal setup:

```tsx
// src/App.tsx
import { GameProvider, PassageController } from "@react-text-game/ui";

export function App() {
    return (
        <GameProvider
            options={{ gameName: "My Text Adventure", isDevMode: true }}
        >
            <PassageController />
        </GameProvider>
    );
}
```

Then define your game entities and passages:

```tsx
// src/game/entities.ts
import { createEntity } from "@react-text-game/core";

export const player = createEntity("player", {
    name: "Hero",
    health: 100,
    inventory: [] as string[],
});
```

```tsx
// src/game/passages.ts
import { newStory, Game } from "@react-text-game/core";
import { player } from "./entities";

export const intro = newStory("intro", () => [
    {
        type: "header",
        content: "Welcome to the Game",
        props: { level: 1 },
    },
    {
        type: "text",
        content: `Hello, ${player.name}! Your health is ${player.health}.`,
    },
    {
        type: "actions",
        content: [
            {
                label: "Start Adventure",
                action: () => Game.jumpTo("chapter1"),
                color: "primary",
            },
        ],
    },
]);
```

## Project Structure

Here's a recommended project structure:

```
src/
├── game/
│   ├── entities/          # Game entities (player, inventory, etc.)
│   │   ├── player.ts
│   │   ├── inventory.ts
│   │   └── index.ts
│   ├── passages/          # Game passages (story screens)
│   │   ├── intro.ts
│   │   ├── chapter1.ts
│   │   └── index.ts
│   └── index.ts           # Game initialization
├── App.tsx                # Main app component
└── main.tsx               # Entry point
```

## Next Steps

Now that you have the basics set up, learn more about:

- [**Core Concepts**](/core-concepts) - Understand entities, passages, and state management
- [**Core API**](/api/core/) - Complete API reference for the core package
- [**UI API**](/api/ui/) - Complete API reference for the UI package

## Example Projects

Check out the example projects in the repository:

- [Example Game Source](https://github.com/laruss/react-text-game/tree/main/apps/example-game) - Full game implementation with Vite + React 19
- [Core Test App](https://github.com/laruss/react-text-game/tree/main/apps/core-test-app) - Basic core package usage
- [UI Test App](https://github.com/laruss/react-text-game/tree/main/apps/ui-test-app) - UI components showcase

## Troubleshooting

### Game Not Initializing

Entities and passages **register themselves when they are created**, so you can safely
define them at module scope (they register on import) and call `Game.init()` afterwards.
This is exactly what the UI package does — `GameProvider` runs `Game.init()` in an effect
after your modules have loaded. You do **not** need to create entities and passages after
`Game.init()`.

What matters is that `Game.init()` is called **once** and has resolved before you rely on
game state or navigation (e.g. `Game.jumpTo`, reading persisted state):

```tsx
// Entities and passages can be defined at module scope — they self-register.
const player = createEntity("player", { name: "Hero" });
const intro = newStory("intro", () => [/* ... */]);

// Initialize once, then navigate.
await Game.init({ gameName: "My Game" });
Game.jumpTo(intro);
```

If you use the UI package, `GameProvider` calls `Game.init()` for you — just render your
app inside it.

### UI Components Not Styled

Ensure you've imported the UI styles in your global CSS:

```css
@import "@react-text-game/ui/styles";
```

And that Tailwind CSS is properly configured for your project.

### TypeScript Errors

Make sure you have TypeScript 5+ installed (5.9+ recommended):

```bash
bun add -d typescript@latest
```

## Need Help?

- [Report an issue](https://github.com/laruss/react-text-game/issues)
- [View the source code](https://github.com/laruss/react-text-game)
