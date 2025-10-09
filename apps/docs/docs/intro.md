---
sidebar_position: 1
slug: /
---

# Welcome to React Text Game

**React Text Game** is a powerful, reactive text-based game engine built for React applications. Create interactive narrative experiences with support for story passages, interactive maps, and comprehensive state management.

## Key Features

- 🔄 **Reactive State Management** - Built on Valtio for automatic UI updates
- 📖 **Multiple Passage Types** - Story, Interactive Map, and Widget passages
- 💾 **Flexible Save System** - JSONPath-based storage with auto-save support
- 🎮 **Entity Registry** - Automatic registration and proxying of game objects
- 🏭 **Factory-Based Entities** - Plain-object factories for beginners with class-based escape hatches
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive types
- ⚛️ **React Hooks** - Built-in hooks for seamless React integration

## Packages

React Text Game consists of two main packages:

### [@react-text-game/core](https://www.npmjs.com/package/@react-text-game/core)

The core game engine that handles state management, entity registration, passage navigation, and save/load functionality.

```bash
bun add @react-text-game/core
```

[View Core API Documentation →](/docs/api/core)

### [@react-text-game/ui](https://www.npmjs.com/package/@react-text-game/ui)

Ready-to-use React components with Tailwind CSS v4 and a semantic theming system.

```bash
bun add @react-text-game/core @react-text-game/ui
```

[View UI API Documentation →](/docs/api/ui)

## Quick Example

```tsx
import { Game, createEntity, newStory } from '@react-text-game/core';

// Initialize the game
await Game.init({
  // your game options
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

- [**Getting Started**](/docs/getting-started) - Installation and setup guide
- [**Core Concepts**](/docs/core-concepts) - Learn the fundamental concepts
- [**Core API**](/docs/api/core) - Complete API reference for the core package
- [**UI API**](/docs/api/ui) - Complete API reference for the UI package

## Resources

- [GitHub Repository](https://github.com/laruss/react-text-game)
- [Report Issues](https://github.com/laruss/react-text-game/issues)
- [NPM - Core Package](https://www.npmjs.com/package/@react-text-game/core)
- [NPM - UI Package](https://www.npmjs.com/package/@react-text-game/ui)

## License

MIT © [laruss](https://github.com/laruss)
