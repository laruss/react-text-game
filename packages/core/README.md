# @react-text-game/core

A powerful, reactive text-based game engine built for React applications. This package provides a comprehensive framework for creating interactive narrative experiences with support for story passages, interactive maps, and state management.

## Features

- **Reactive State Management** - Built on Valtio for automatic UI updates
- **Multiple Passage Types** - Story, Interactive Map, and Widget passages
- **Flexible Save System** - JSONPath-based storage with auto-save support
- **Entity Registry** - Automatic registration and proxying of game objects
- **Type-Safe** - Full TypeScript support with comprehensive types
- **React Hooks** - Built-in hooks for seamless React integration

## Installation

```bash
bun add @react-text-game/core
```

## Quick Start

```tsx
import { Game, BaseGameObject, newStory } from '@react-text-game/core';

// IMPORTANT: Initialize the game first
await Game.init({
  // your game options
});

// Create a game entity
class Player extends BaseGameObject<{ health: number; name: string }> {
  constructor() {
    super({
      id: 'player',
      variables: { health: 100, name: 'Hero' }
    });
  }
}

const player = new Player();

// Create a story passage
const introStory = newStory('intro', () => [
  {
    type: 'header',
    content: 'Welcome to the Game',
    props: { level: 1 }
  },
  {
    type: 'text',
    content: `Hello, ${player.variables.name}!`
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
Game.jumpTo(introStory);
```

## Core Concepts

### Game

The `Game` class is the central orchestrator that manages:

- **Initialization** - **MUST call `Game.init(options)` before using any other methods**
- **Entity Registry** - All game objects (entities) are registered and proxied
- **Passage Registry** - All passages (screens/scenes) are registered
- **Navigation** - `jumpTo()` and `setCurrent()` for passage navigation
- **State Management** - `getState()` / `setState()` for full serialization
- **Auto-Save** - Optional auto-save to session storage with debouncing

```typescript
// Initialize the game (REQUIRED)
await Game.init({
  // your options
});

// Register entities
Game.registerEntity(player, inventory, quest);

// Register passages
Game.registerPassage(intro, chapter1, finalBattle);

// Navigate
Game.jumpTo('chapter1');

// Save/Load
const savedState = Game.getState();
Game.setState(savedState);

// Auto-save
Game.enableAutoSave();
Game.loadFromSessionStorage();
```

### BaseGameObject

Base class for all game entities. Provides:

- **Auto-registration** - Entities register with `Game` on construction
- **Reactive Variables** - `_variables` object for state storage
- **Persistence** - `save()` / `load()` methods sync with `Storage`
- **JSONPath Integration** - Each entity has a unique storage path

```typescript
class Inventory extends BaseGameObject<{ items: string[] }> {
  constructor() {
    super({
      id: 'inventory',
      variables: { items: [] }
    });
  }

  addItem(item: string) {
    this._variables.items.push(item);
    this.save(); // Persist to storage
  }
}
```

### Passages

Passages represent different screens or scenes in your game. Three types are available:

#### Story Passages

Text-based narrative passages with rich components:

```typescript
import { newStory } from '@react-text-game/core';

const myStory = newStory('my-story', (props) => [
  {
    type: 'header',
    content: 'Chapter 1',
    props: { level: 1 }
  },
  {
    type: 'text',
    content: 'Once upon a time...'
  },
  {
    type: 'image',
    content: '/assets/scene.jpg',
    props: { alt: 'A beautiful scene' }
  },
  {
    type: 'video',
    content: '/assets/intro.mp4',
    props: { controls: true, autoPlay: false }
  },
  {
    type: 'conversation',
    content: [
      {
        content: 'Hello there!',
        who: { name: 'NPC', avatar: '/avatars/npc.png' },
        side: 'left'
      },
      {
        content: 'Hi!',
        who: { name: 'Player' },
        side: 'right'
      }
    ],
    props: { variant: 'messenger' },
    appearance: 'atOnce'
  },
  {
    type: 'actions',
    content: [
      {
        label: 'Continue',
        action: () => Game.jumpTo('chapter-2'),
        color: 'primary'
      },
      {
        label: 'Go Back',
        action: () => Game.jumpTo('intro'),
        color: 'secondary',
        variant: 'bordered'
      }
    ],
    props: { direction: 'horizontal' }
  }
], {
  background: { image: '/bg.jpg' },
  classNames: { container: 'story-container' }
});
```

**Available Components:**
- `text` - Text content with ReactNode support and custom styling
- `header` - Semantic headers (h1-h6) with configurable levels
- `image` - Images with built-in modal viewer and custom click handlers
- `video` - HTML5 video with autoplay, loop, mute, and controls options
- `actions` - Interactive button groups with tooltips and disabled states
- `conversation` - Dialogue with chat/messenger variants and progressive reveal (byClick/atOnce)
- `anotherStory` - Embed other story passages for composition and reuse

#### Interactive Map Passages

Map-based interactive passages with hotspots:

```typescript
import { newInteractiveMap } from '@react-text-game/core';

const worldMap = newInteractiveMap('world-map', {
  caption: 'World Map',
  image: '/maps/world.jpg',
  bgImage: '/maps/world-bg.jpg',
  props: { bgOpacity: 0.3 },
  hotspots: [
    // Map label hotspot - positioned on the map
    {
      type: 'label',
      content: 'Village',
      position: { x: 30, y: 40 }, // Percentage-based (0-100)
      action: () => Game.jumpTo('village'),
      props: { color: 'primary', variant: 'solid' }
    },
    // Map image hotspot - with state-dependent images
    {
      type: 'image',
      content: {
        idle: '/icons/chest.png',
        hover: '/icons/chest-glow.png',
        active: '/icons/chest-open.png',
        disabled: '/icons/chest-locked.png'
      },
      position: { x: 60, y: 70 },
      action: () => openChest(),
      isDisabled: () => !player.hasKey,
      tooltip: {
        content: () => player.hasKey ? 'Open chest' : 'Locked',
        position: 'top'
      },
      props: { zoom: '150%' }
    },
    // Conditional hotspot - only visible if discovered
    () => player.hasDiscovered('forest') ? {
      type: 'label',
      content: 'Forest',
      position: { x: 80, y: 50 },
      action: () => Game.jumpTo('forest')
    } : undefined,
    // Side hotspot - positioned on edge
    {
      type: 'label',
      content: 'Menu',
      position: 'top', // top/bottom/left/right
      action: () => openMenu()
    },
    // Context menu - multiple choices at a location
    {
      type: 'menu',
      position: { x: 50, y: 50 },
      direction: 'vertical',
      items: [
        { type: 'label', content: 'Examine', action: () => examine() },
        { type: 'label', content: 'Take', action: () => take() },
        () => player.hasMagic ? {
          type: 'label',
          content: 'Cast Spell',
          action: () => castSpell()
        } : undefined
      ]
    }
  ],
  classNames: {
    container: 'bg-gradient-to-b from-sky-900 to-indigo-900',
    topHotspots: 'bg-muted/50 backdrop-blur-sm'
  }
});
```

**Hotspot Types:**
- `MapLabelHotspot` - Text buttons positioned on map using percentage coordinates (x/y: 0-100)
- `MapImageHotspot` - Image buttons with state variants (idle/hover/active/disabled) and zoom support
- `SideLabelHotspot` - Text buttons on map edges (top/bottom/left/right)
- `SideImageHotspot` - Image buttons on map edges
- `MapMenu` - Contextual menu with multiple items at a specific position

**Dynamic Features:**
- Hotspots can be functions returning `undefined` for conditional visibility
- Images and positions support dynamic functions: `image: () => '/maps/' + season + '.jpg'`
- Disabled states with custom tooltips explaining why actions are unavailable

#### Widget Passages

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

### Storage

JSONPath-based storage system using the `jsonpath` library:

```typescript
import { Storage } from '@react-text-game/core';

// Get values
const health = Storage.getValue<number>('$.player.health');

// Set values
Storage.setValue('$.player.health', 75);

// Full state
const state = Storage.getState();
Storage.setState(state);
```

**Key Features:**
- JSONPath queries for flexible data access
- Protected system paths (prefixed with `$._system`)
- Automatic path creation
- Type-safe with generics

### Save System

The engine includes a comprehensive save/load system built on IndexedDB (via Dexie) with encryption support for export/import:

```typescript
import {
  useSaveSlots,
  useSaveGame,
  useLoadGame,
  useDeleteGame,
  useLastLoadGame,
  useExportSaves,
  useImportSaves,
  useRestartGame
} from '@react-text-game/core/saves';
```

**Features:**
- **Persistent Storage** - IndexedDB for browser-based saves
- **Multiple Save Slots** - Unlimited save slots with metadata
- **Export/Import** - Encrypted file export/import (`.sx` format)
- **System Saves** - Hidden initial state for game restart
- **Real-time Updates** - Live queries for reactive save lists
- **Type-Safe** - Full TypeScript support

#### Save Management Hooks

**useSaveSlots** - Get save slots with live updates and action methods:

```tsx
function SavesList() {
  const slots = useSaveSlots({ count: 5 });

  return (
    <div>
      {slots.map((slot, index) => (
        <div key={index}>
          <p>Slot {index}: {slot.data ? 'Saved' : 'Empty'}</p>
          <button onClick={() => slot.save()}>Save</button>
          <button onClick={() => slot.load()} disabled={!slot.data}>Load</button>
          <button onClick={() => slot.delete()} disabled={!slot.data}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

**useSaveGame** - Save current game state to a slot:

```tsx
function SaveButton({ slotNumber }) {
  const saveGame = useSaveGame();

  const handleSave = async () => {
    const result = await saveGame(slotNumber);
    if (result?.success === false) {
      alert(result.message);
    }
  };

  return (
    <button onClick={handleSave}>
      Save to Slot {slotNumber}
    </button>
  );
}
```

**useLoadGame** - Load a saved game by ID:

```tsx
function LoadButton({ saveId }) {
  const loadGame = useLoadGame();

  const handleLoad = async () => {
    const result = await loadGame(saveId);
    if (result?.success === false) {
      alert(result.message);
    }
  };

  return <button onClick={handleLoad}>Load Game</button>;
}
```

**useDeleteGame** - Delete a saved game by ID:

```tsx
function DeleteButton({ saveId }) {
  const deleteGame = useDeleteGame();

  const handleDelete = async () => {
    const result = await deleteGame(saveId);
    if (result?.success === false) {
      alert(result.message);
    }
  };

  return <button onClick={handleDelete}>Delete Save</button>;
}
```

**useLastLoadGame** - Load the most recent saved game:

```tsx
function ContinueButton() {
  const { hasLastSave, loadLastGame, isLoading } = useLastLoadGame();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <button onClick={loadLastGame} disabled={!hasLastSave}>
      Continue Last Game
    </button>
  );
}
```

**useExportSaves** - Export all saves to encrypted file:

```tsx
function ExportButton() {
  const exportSaves = useExportSaves();

  const handleExport = async () => {
    const result = await exportSaves();
    if (result.success) {
      console.log('Saves exported successfully');
    } else {
      alert(`Export failed: ${result.error}`);
    }
  };

  return <button onClick={handleExport}>Export Saves</button>;
}
```

**useImportSaves** - Import saves from encrypted file:

```tsx
function ImportButton() {
  const importSaves = useImportSaves();

  const handleImport = async () => {
    const result = await importSaves();
    if (result.success) {
      console.log(`Imported ${result.count} saves`);
    } else {
      alert(`Import failed: ${result.error}`);
    }
  };

  return <button onClick={handleImport}>Import Saves</button>;
}
```

**useRestartGame** - Restart game from initial state:

```tsx
function RestartButton() {
  const restartGame = useRestartGame();

  return (
    <button onClick={restartGame}>
      Restart Game
    </button>
  );
}
```

#### Direct Database Access

For advanced use cases, you can access the database directly:

```typescript
import {
  saveGame,
  loadGame,
  getAllSaves,
  deleteSave,
  db
} from '@react-text-game/core/saves';

// Save game manually
await saveGame('my-save', gameData, 'Description', screenshotBase64);

// Load by ID
const save = await loadGame(1);

// Get all saves
const allSaves = await getAllSaves();

// Delete a save
await deleteSave(1);

// Direct Dexie access
await db.saves.where('name').equals('my-save').first();
```

#### Save File Encryption

Exported save files are encrypted using AES encryption with PBKDF2 key derivation:
- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2 with 1000 iterations
- **Salt & IV**: Randomly generated for each export
- **Password**: Derived from `gameId` and `SAVE_POSTFIX`

### React Hooks

#### useCurrentPassage

Get the current passage with reactive updates:

```tsx
import { useCurrentPassage } from '@react-text-game/core';

function GameScreen() {
  const passage = useCurrentPassage();

  if (!passage) return <div>Loading...</div>;

  // Render based on passage type
  if (passage.type === 'story') {
    const { components } = passage.display();
    // Render story components
  }
}
```

#### useGameEntity

Monitor entity changes with automatic re-renders:

```tsx
import { useGameEntity } from '@react-text-game/core';

function PlayerStats({ player }) {
  const reactivePlayer = useGameEntity(player);

  return (
    <div>
      Health: {reactivePlayer.variables.health}
      {/* Updates automatically when health changes */}
    </div>
  );
}
```

#### useGameIsStarted

Check if game has started:

```tsx
import { useGameIsStarted } from '@react-text-game/core';

function GameUI() {
  const isStarted = useGameIsStarted();

  return isStarted ? <GameScreen /> : <MainMenu />;
}
```

## Architecture

### State Flow

1. **Initialization** - Call `Game.init(options)` to initialize the game engine
2. **Entities** extend `BaseGameObject` and auto-register on construction
3. **Passages** extend `Passage` and auto-register on construction
4. **All state changes** go through Valtio proxies for reactivity
5. **Storage** uses JSONPath queries for flexible state access
6. **Auto-save** (if enabled) debounces writes to session storage

### Registry Pattern

The engine uses two registries:
- `objectRegistry` - Stores all game entities as Valtio proxies
- `passagesRegistry` - Stores all passages

All objects are automatically wrapped in Valtio proxies for reactive state management.

### Save System

The save system consists of:
- **Entity State** - Each entity's `_variables` stored at `$.{entityId}`
- **Game State** - Current passage stored at `$._system.game`
- **JSONPath Access** - Flexible queries for any state data
- **Auto-Save** - Debounced saves to session storage (500ms)

## API Reference

### Game

Static methods:
- `init(options)` - **Initialize the game (REQUIRED - must be called first)**
- `registerEntity(...objects)` - Register game objects
- `registerPassage(...passages)` - Register passages
- `jumpTo(passage)` - Navigate to passage
- `setCurrent(passage)` - Set current passage
- `getPassageById(id)` - Get passage by ID
- `getAllPassages()` - Get all passages
- `getState()` - Get full game state
- `setState(state)` - Restore game state
- `enableAutoSave()` - Enable auto-save
- `disableAutoSave()` - Disable auto-save
- `loadFromSessionStorage()` - Load from session storage
- `clearAutoSave()` - Clear auto-saved state

Properties:
- `currentPassage` - Get current passage
- `selfState` - Get game internal state
- `options` - Get game options

### BaseGameObject

Constructor:
- `new BaseGameObject({ id, variables? })`

Properties:
- `id` - Unique identifier
- `variables` - Entity variables (readonly)
- `_variables` - Internal variables (protected)

Methods:
- `save()` - Save to storage
- `load()` - Load from storage

### Passage Types

**Story:**
```typescript
newStory(id: string, content: StoryContent, options?: StoryOptions): Story
```

**Interactive Map:**
```typescript
newInteractiveMap(id: string, options: InteractiveMapOptions): InteractiveMap
```

**Widget:**
```typescript
newWidget(id: string, content: ReactNode): Widget
```

## TypeScript

Full TypeScript support with comprehensive types and detailed JSDoc documentation:

```typescript
// Import types from main package
import type {
  GameSaveState,
  JsonPath,
  InitVarsType,
  PassageType,
  ButtonColor,
  ButtonVariant
} from '@react-text-game/core';

// Import story passage types
import type {
  Component,
  StoryContent,
  StoryOptions,
  TextComponent,
  HeaderComponent,
  ImageComponent,
  VideoComponent,
  ActionsComponent,
  ConversationComponent,
  AnotherStoryComponent,
  ActionType,
  ConversationBubble,
  ConversationVariant,
  ConversationAppearance
} from '@react-text-game/core/passages';

// Import interactive map types
import type {
  InteractiveMapOptions,
  InteractiveMapType,
  AnyHotspot,
  MapLabelHotspot,
  MapImageHotspot,
  SideLabelHotspot,
  SideImageHotspot,
  MapMenu,
  LabelHotspot,
  ImageHotspot
} from '@react-text-game/core/passages';
```

All types include comprehensive JSDoc comments with:
- Detailed descriptions of each property
- Usage examples and code snippets
- Default value annotations
- Remarks about behavior and implementation details

## Examples

See the `apps/example-game` directory for a complete implementation example.

## License

MIT (c) laruss
