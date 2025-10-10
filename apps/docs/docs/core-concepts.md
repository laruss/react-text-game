---
sidebar_position: 3
title: Core Concepts
description: Master React Text Game architecture with entities, passages, state management, and navigation. Learn about the registry pattern, Valtio reactivity, JSONPath storage, save system, and best practices for building interactive narratives.
keywords:
  - react game architecture
  - valtio state management
  - game entity system
  - story passages
  - interactive map
  - jsonpath storage
  - game save system
  - reactive game state
  - text adventure development
  - narrative game patterns
image: /img/og-image.webp
---

# Core Concepts

Understanding the core concepts of React Text Game will help you build powerful interactive narratives.

## Architecture Overview

React Text Game uses a **registry pattern** with **reactive state management** (Valtio) to create a seamless game development experience.

```
┌──────────────────────────────────────┐
│           Game (Central)             │
│  - Entity Registry                   │
│  - Passage Registry                  │
│  - Navigation                        │
│  - State Management                  │
└──────────────────────────────────────┘
         │                    │
         ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │  Entities   │      │  Passages   │
  │  (Valtio)   │      │  (Screens)  │
  └─────────────┘      └─────────────┘
         │                    │
         ▼                    ▼
  ┌─────────────────────────────────┐
  │        Storage (JSONPath)        │
  │     - Session Storage            │
  │     - IndexedDB (Saves)          │
  └─────────────────────────────────┘
```

## Game Initialization

**IMPORTANT:** You must call `Game.init()` before using any other Game methods or creating entities.

```tsx
import { Game } from '@react-text-game/core';

await Game.init({
  gameName: 'My Adventure',
  isDevMode: true,
});
```

The Game class is the central orchestrator that:
- Manages entity and passage registries
- Handles navigation between passages
- Provides save/load functionality
- Wraps all objects in Valtio proxies for reactivity

## Entities

Entities represent game state (player, inventory, quest system, etc.). React Text Game offers two approaches:

### Entity Factory (Recommended)

The `createEntity` factory is the simplest way to create reactive game objects:

```tsx
import { createEntity } from '@react-text-game/core';

const player = createEntity('player', {
  name: 'Hero',
  health: 100,
  inventory: {
    gold: 50,
    items: [] as string[],
  },
});

// Direct property access - automatically reactive
player.health -= 10;
player.inventory.items.push('sword');

// Persist changes when needed
player.save();
```

**Key Features:**
- Automatic registration with Game
- Direct property access (no `.variables`)
- Deep reactivity for nested objects/arrays
- Explicit `save()` calls for controlled persistence

### Advanced Entities (Class-Based)

For more complex scenarios, extend `BaseGameObject`:

```tsx
import { BaseGameObject } from '@react-text-game/core';

class Inventory extends BaseGameObject<{ items: string[] }> {
  constructor() {
    super({
      id: 'inventory',
      variables: { items: [] },
    });
  }

  addItem(item: string) {
    this._variables.items.push(item);
    this.save();
  }

  hasItem(item: string): boolean {
    return this._variables.items.includes(item);
  }
}

const inventory = new Inventory();
```

## Passages

Passages represent different screens or scenes in your game. Three types are available:

### Story Passages

Text-based narrative passages with rich components:

```tsx
import { newStory, Game } from '@react-text-game/core';

const chapter1 = newStory('chapter1', () => [
  {
    type: 'header',
    content: 'The Beginning',
    props: { level: 1 }
  },
  {
    type: 'text',
    content: 'You find yourself in a dark forest...'
  },
  {
    type: 'image',
    content: '/assets/forest.jpg',
    props: { alt: 'Dark forest' }
  },
  {
    type: 'actions',
    content: [
      {
        label: 'Go North',
        action: () => Game.jumpTo('north-path'),
        color: 'primary'
      },
      {
        label: 'Go South',
        action: () => Game.jumpTo('south-path'),
        color: 'secondary'
      }
    ]
  }
]);
```

**Available Components:**
- `text` - Text content with ReactNode support
- `header` - Semantic headers (h1-h6)
- `image` - Images with modal viewer
- `video` - HTML5 video with controls
- `actions` - Interactive button groups
- `conversation` - Dialogue with chat/messenger variants
- `anotherStory` - Embed other story passages

### Interactive Map Passages

Map-based interactive passages with hotspots:

```tsx
import { newInteractiveMap, Game } from '@react-text-game/core';

const worldMap = newInteractiveMap('world-map', {
  caption: 'World Map',
  image: '/maps/world.jpg',
  hotspots: [
    // Label hotspot on map
    {
      type: 'label',
      content: 'Village',
      position: { x: 30, y: 40 }, // Percentage (0-100)
      action: () => Game.jumpTo('village'),
      props: { color: 'primary' }
    },
    // Image hotspot with states
    {
      type: 'image',
      content: {
        idle: '/icons/chest.png',
        hover: '/icons/chest-glow.png',
      },
      position: { x: 60, y: 70 },
      action: () => openChest(),
    },
    // Conditional hotspot
    () => player.hasDiscovered('forest') ? {
      type: 'label',
      content: 'Forest',
      position: { x: 80, y: 50 },
      action: () => Game.jumpTo('forest')
    } : undefined,
  ],
});
```

**Hotspot Types:**
- `MapLabelHotspot` - Text buttons on map (x/y coordinates)
- `MapImageHotspot` - Image buttons with state variants
- `SideLabelHotspot` - Text buttons on edges (top/bottom/left/right)
- `SideImageHotspot` - Image buttons on edges
- `MapMenu` - Context menu with multiple items

### Widget Passages

Custom React components as passages:

```tsx
import { newWidget } from '@react-text-game/core';

const customUI = newWidget('custom-ui', (
  <div>
    <h1>Custom Interface</h1>
    <MyCustomComponent />
  </div>
));
```

## State Management

React Text Game uses **Valtio** for reactive state and **JSONPath** for flexible storage queries.

### Reactive Updates

All entities are automatically wrapped in Valtio proxies:

```tsx
const player = createEntity('player', { health: 100 });

// Changes automatically trigger React re-renders
player.health -= 10;
```

### Storage System

The storage system uses JSONPath queries:

```tsx
import { Storage } from '@react-text-game/core';

// Get values
const health = Storage.getValue<number>('$.player.health');

// Set values
Storage.setValue('$.player.health', 75);

// Full state serialization
const state = Storage.getState();
Storage.setState(state);
```

**Protected Paths:** System paths (prefixed with `$._system`) are protected and used internally.

## Navigation

Navigate between passages using the Game API:

```tsx
import { Game } from '@react-text-game/core';

// Jump to a passage by ID
Game.jumpTo('chapter1');

// Jump to a passage object
Game.jumpTo(chapter1);

// Set current without navigation effects
Game.setCurrent('chapter1');

// Get current passage
const current = Game.currentPassage;
```

## Save System

React Text Game includes a comprehensive save/load system with IndexedDB and encryption support.

### Using Hooks (UI Package)

```tsx
import { useSaveSlots } from '@react-text-game/core/saves';

function SavesList() {
  const slots = useSaveSlots({ count: 5 });

  return (
    <div>
      {slots.map((slot, index) => (
        <div key={index}>
          <p>Slot {index}: {slot.data ? 'Saved' : 'Empty'}</p>
          <button onClick={() => slot.save()}>Save</button>
          <button onClick={() => slot.load()}>Load</button>
          <button onClick={() => slot.delete()}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Available Hooks

- `useSaveSlots` - Get save slots with actions
- `useSaveGame` - Save current state
- `useLoadGame` - Load saved state
- `useDeleteGame` - Delete save
- `useLastLoadGame` - Load most recent save
- `useExportSaves` - Export saves to encrypted file
- `useImportSaves` - Import saves from file
- `useRestartGame` - Restart from initial state

### Direct API

```tsx
import { saveGame, loadGame, getAllSaves } from '@react-text-game/core/saves';

// Save manually
await saveGame('my-save', gameData, 'Description', screenshotBase64);

// Load by ID
const save = await loadGame(1);

// Get all saves
const allSaves = await getAllSaves();
```

## React Hooks

### useCurrentPassage

Monitor the current passage with reactive updates:

```tsx
import { useCurrentPassage } from '@react-text-game/core';

function GameScreen() {
  const passage = useCurrentPassage();

  if (!passage) return <div>Loading...</div>;

  return <div>{/* Render passage */}</div>;
}
```

### useGameEntity

Track entity changes with automatic re-renders:

```tsx
import { useGameEntity } from '@react-text-game/core';

function PlayerStats({ player }) {
  const reactivePlayer = useGameEntity(player);

  return <div>Health: {reactivePlayer.health}</div>;
}
```

### useGameIsStarted

Check if game has been initialized:

```tsx
import { useGameIsStarted } from '@react-text-game/core';

function GameUI() {
  const isStarted = useGameIsStarted();

  return isStarted ? <GameScreen /> : <MainMenu />;
}
```

## Best Practices

### 1. Always Initialize First

```tsx
// ✅ Correct
await Game.init();
const player = createEntity('player', { name: 'Hero' });

// ❌ Wrong
const player = createEntity('player', { name: 'Hero' });
await Game.init();
```

### 2. Use Factory Pattern for Simple Entities

```tsx
// ✅ Recommended for most cases
const player = createEntity('player', { health: 100 });

// ⚠️ Use only when you need inheritance or private methods
class Player extends BaseGameObject { /* ... */ }
```

### 3. Organize by Feature

```
src/game/
├── entities/
│   ├── player.ts
│   ├── inventory.ts
│   └── index.ts
├── passages/
│   ├── story/
│   │   ├── intro.ts
│   │   └── chapter1.ts
│   └── maps/
│       └── worldMap.ts
└── index.ts
```

### 4. Keep Passage Logic Simple

```tsx
// ✅ Good - Logic in entity methods
player.takeDamage(10);

// ❌ Avoid - Complex logic in passages
player.health -= 10;
if (player.health <= 0) { /* ... */ }
```

### 5. Use TypeScript

```tsx
// ✅ Type-safe entities
const player = createEntity('player', {
  name: 'Hero',
  inventory: [] as string[],  // Explicit array type
});
```

## Next Steps

- [**Core API Reference**](/api/core) - Complete API documentation
- [**UI API Reference**](/api/ui) - UI components documentation
- [**Example Game**](https://github.com/laruss/react-text-game/tree/main/apps/example-game) - See it in action
