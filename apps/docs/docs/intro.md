---
sidebar_position: 1
slug: /
title: React Text Game
description: Build interactive narrative experiences, visual novels, and text adventures in React with a powerful, type-safe game engine featuring reactive state management, story passages, interactive maps, and flexible JSONPath-based save system.
keywords:
  - react
  - reactjs
  - typescript
  - text game
  - text adventure
  - interactive fiction
  - react text game
  - react text adventure
  - react interactive fiction
  - narrative engine
  - story engine
  - game engine
  - browser game
  - visual novel
  - twine alternative
  - ink alternative
  - choicescript
  - passages
  - save system
  - jsonpath
  - valtio
  - tailwindcss
image: /img/og-image.webp
---

# Welcome to React Text Game

**React Text Game** is a powerful, reactive text-based game engine built for React applications. Create interactive narrative experiences with support for story passages, interactive maps, and comprehensive state management.

## Key Features

- 🔄 **Reactive State Management** - Built on Valtio for automatic UI updates
- 📖 **Multiple Passage Types** - Story, Interactive Map, and Widget passages
- 📝 **MDX Support** - Write narratives in Markdown with embedded React components
- 💾 **Flexible Save System** - IndexedDB-based storage with encryption and migrations
- 🎮 **Entity Registry** - Automatic registration and proxying of game objects
- 🏭 **Factory-Based Entities** - Plain-object factories for beginners with class-based escape hatches
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive types
- ⚛️ **React Hooks** - Built-in hooks for seamless React integration

## Packages

React Text Game consists of three packages:

### [@react-text-game/core](https://www.npmjs.com/package/@react-text-game/core)

The core game engine that handles state management, entity registration, passage navigation, and save/load functionality.

```bash
bun add @react-text-game/core
```

[View Core API Documentation →](/api/core)

### [@react-text-game/ui](https://www.npmjs.com/package/@react-text-game/ui)

Ready-to-use React components with Tailwind CSS v4 and a semantic theming system.

```bash
bun add @react-text-game/core @react-text-game/ui
```

[View UI API Documentation →](/api/ui)

### [@react-text-game/mdx](https://www.npmjs.com/package/@react-text-game/mdx)

MDX integration for writing game passages in Markdown with embedded React components. Perfect for narrative-focused games.

```bash
bun add @react-text-game/mdx @react-text-game/core @mdx-js/mdx @mdx-js/react
```

**Example MDX passage:**

```mdx
---
passageId: intro
---
import { Action, Actions } from "@react-text-game/mdx";
import { player } from "../entities/player";

# Welcome, {player.name}!

Your adventure begins in a dark forest...

<Actions>
    <Action onPerform={() => Game.jumpTo("forest")}>
        Enter the forest
    </Action>
</Actions>
```

## Quick Example

```tsx
import { Game, createEntity, newStory } from '@react-text-game/core';

// Initialize the game first (required!)
await Game.init({
  gameName: 'My Text Adventure',
  isDevMode: true,
});

// Create a game entity
const player = createEntity('player', {
  name: 'Hero',
  health: 100,
});

// Create a story passage
const intro = newStory('intro', () => [
  {
    type: 'header',
    content: 'Welcome to the Game',
    props: { level: 1 }
  },
  {
    type: 'text',
    content: `Hello, ${player.name}!`
  },
  {
    type: 'actions',
    content: [
      {
        label: 'Start Adventure',
        action: () => Game.jumpTo('adventure')
      }
    ]
  }
]);

// Navigate to passage
Game.jumpTo(intro);
```

## Next Steps

- [**Getting Started**](/getting-started) - Installation and setup guide
- [**Core Concepts**](/core-concepts) - Learn the fundamental concepts
- [**Core API**](/api/core) - Complete API reference for the core package
- [**UI API**](/api/ui) - Complete API reference for the UI package

## Resources

- [GitHub Repository](https://github.com/laruss/react-text-game)
- [Report Issues](https://github.com/laruss/react-text-game/issues)
- [NPM - Core Package](https://www.npmjs.com/package/@react-text-game/core)
- [NPM - UI Package](https://www.npmjs.com/package/@react-text-game/ui)

## License

MIT © [laruss](https://github.com/laruss)
