---
sidebar_position: 3
title: Core Concepts
description: Master React Text Game architecture with entities, passages, state management, audio system, and navigation. Learn about the registry pattern, Valtio reactivity, JSONPath storage, save system, audio management, and best practices for building interactive narratives.
keywords:
    - react game architecture
    - valtio state management
    - game entity system
    - story passages
    - interactive map
    - jsonpath storage
    - game save system
    - game audio system
    - reactive game state
    - audio management
    - sound effects
    - background music
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
  ┌─────────────┐      ┌─────────────┐      ┌──────────────┐
  │  Entities   │      │  Passages   │      │ Audio System │
  │  (Valtio)   │      │  (Screens)  │      │  (Valtio)    │
  └─────────────┘      └─────────────┘      └──────────────┘
         │                    │                      │
         ▼                    ▼                      ▼
  ┌─────────────────────────────────────────────────────┐
  │              Storage (JSONPath)                     │
  │     - Session Storage                               │
  │     - IndexedDB (Saves)                             │
  │     - Audio State Persistence                       │
  └─────────────────────────────────────────────────────┘
```

## Game Initialization

**IMPORTANT:** You must call `Game.init()` before using any other Game methods or creating entities.

```tsx
import { Game } from "@react-text-game/core";

await Game.init({
    gameName: "My Adventure",
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
import { createEntity } from "@react-text-game/core";

const player = createEntity("player", {
    name: "Hero",
    health: 100,
    inventory: {
        gold: 50,
        items: [] as string[],
    },
});

// Direct property access - automatically reactive
player.health -= 10;
player.inventory.items.push("sword");

// Persist changes when needed
player.save();
```

**Key Features:**

- Automatic registration with Game
- Direct property access (no `.variables`)
- Deep reactivity for nested objects/arrays
- Explicit `save()` calls for controlled persistence

**IMPORTANT:** All properties in the variables object must be required (non-optional). Optional properties are not supported because the Proxy-based implementation cannot distinguish between undefined optional values and missing properties. If you need optional-like behavior, use explicit `undefined` with a union type:

```tsx
// ❌ Wrong - Optional properties will cause TypeScript errors
const player = createEntity('player', {
  health: 100,
  mana?: 50  // Error: optional keys are not allowed
});

// ✅ Correct - Use explicit undefined for optional-like behavior
const player = createEntity('player', {
  health: 100,
  mana: undefined as number | undefined
});
```

### Advanced Entities (Class-Based)

For more complex scenarios, extend `BaseGameObject`:

```tsx
import { BaseGameObject } from "@react-text-game/core";

class Inventory extends BaseGameObject<{ items: string[] }> {
    constructor() {
        super({
            id: "inventory",
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
import { newStory, Game } from "@react-text-game/core";

const chapter1 = newStory("chapter1", () => [
    {
        type: "header",
        content: "The Beginning",
        props: { level: 1 },
    },
    {
        type: "text",
        content: "You find yourself in a dark forest...",
    },
    {
        type: "image",
        content: "/assets/forest.jpg",
        props: { alt: "Dark forest" },
    },
    {
        type: "actions",
        content: [
            {
                label: "Go North",
                action: () => Game.jumpTo("north-path"),
                color: "primary",
            },
            {
                label: "Go South",
                action: () => Game.jumpTo("south-path"),
                color: "secondary",
            },
        ],
    },
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

#### HTML Content in Text Components

For simple HTML content without needing JSX/TSX files, use the `isHTML` prop:

```typescript
// In a .ts file (no JSX needed)
newStory("example", () => [
    {
        type: "text",
        content: "<strong>Bold</strong> and <em>italic</em> text",
        props: { isHTML: true },
    },
]);
```

:::note
`isHTML` only works when `content` is a string. For complex interactive content
with event handlers or React state, use `.tsx` files with React components.
:::

### Interactive Map Passages

Map-based interactive passages with hotspots:

```tsx
import { newInteractiveMap, Game } from "@react-text-game/core";

const worldMap = newInteractiveMap("world-map", {
    caption: "World Map",
    image: "/maps/world.jpg",
    hotspots: [
        // Label hotspot on map
        {
            type: "label",
            content: "Village",
            position: { x: 30, y: 40 }, // Percentage (0-100)
            action: () => Game.jumpTo("village"),
            props: { color: "primary" },
        },
        // Simple image hotspot (just a string)
        {
            type: "image",
            content: "/icons/treasure.png",
            position: { x: 50, y: 60 },
            action: () => collectTreasure(),
        },
        // Image hotspot with hover effect (object with states)
        {
            type: "image",
            content: {
                idle: "/icons/chest.png",
                hover: "/icons/chest-glow.png",
            },
            position: { x: 60, y: 70 },
            action: () => openChest(),
        },
        // Dynamic image hotspot (function)
        {
            type: "image",
            content: () => `/icons/portal-${player.level}.png`,
            position: { x: 75, y: 80 },
            action: () => enterPortal(),
        },
        // Conditional hotspot
        () =>
            player.hasDiscovered("forest")
                ? {
                      type: "label",
                      content: "Forest",
                      position: { x: 80, y: 50 },
                      action: () => Game.jumpTo("forest"),
                  }
                : undefined,
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
import { newWidget } from "@react-text-game/core";

const customUI = newWidget(
    "custom-ui",
    <div>
        <h1>Custom Interface</h1>
        <MyCustomComponent />
    </div>
);
```

## State Management

React Text Game uses **Valtio** for reactive state management and **jsonpath-plus** for flexible storage queries.

### Reactive Updates

All entities are automatically wrapped in Valtio proxies:

```tsx
const player = createEntity("player", { health: 100 });

// Changes automatically trigger React re-renders
player.health -= 10;
```

### Storage System

The storage system uses JSONPath queries with session storage for auto-save:

```tsx
import { Storage } from "@react-text-game/core";

// Get values using JSONPath queries
const health = Storage.getValue<number>("$.player.health");

// Set values
Storage.setValue("$.player.health", 75);

// Full state serialization for save/load
const state = Storage.getState();
Storage.setState(state);

// Check if a path exists
const hasInventory = Storage.hasPath("$.player.inventory");
```

**Storage Features:**

- Uses `jsonpath-plus` library for flexible querying
- Session storage for auto-save (configurable)
- Protected system paths (prefixed with `STORAGE_SYSTEM_PATH`)
- Type-safe getValue with generic support

## Navigation

Navigate between passages using the Game API:

```tsx
import { Game } from "@react-text-game/core";

// Jump to a passage by ID
Game.jumpTo("chapter1");

// Jump to a passage object
Game.jumpTo(chapter1);

// Set current without navigation effects
Game.setCurrent("chapter1");

// Get current passage
const current = Game.currentPassage;
```

## Save System

React Text Game includes a comprehensive save/load system using **Dexie** (IndexedDB wrapper) with encryption support via **crypto-js**.

### Using Hooks

```tsx
import { useSaveSlots } from "@react-text-game/core/saves";

function SavesList() {
    const slots = useSaveSlots({ count: 5 });

    return (
        <div>
            {slots.map((slot, index) => (
                <div key={index}>
                    <p>
                        Slot {index + 1}: {slot.data ? "Saved" : "Empty"}
                    </p>
                    {slot.data && <p>{slot.data.description}</p>}
                    <button onClick={() => slot.save()}>Save</button>
                    <button onClick={() => slot.load()} disabled={!slot.data}>
                        Load
                    </button>
                    <button onClick={() => slot.delete()} disabled={!slot.data}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
```

### Available Hooks

All save-related hooks are available from `@react-text-game/core/saves`:

- `useSaveSlots` - Manage multiple save slots with save/load/delete actions
- `useSaveGame` - Save current game state
- `useLoadGame` - Load saved game state
- `useDeleteGame` - Delete a specific save
- `useDeleteAllSlots` - Delete all saves (except system save)
- `useLastLoadGame` - Load the most recent save
- `useExportSaves` - Export saves to encrypted file
- `useImportSaves` - Import saves from encrypted file
- `useRestartGame` - Restart game from initial state

### Direct API

The save system also provides direct database functions from `@react-text-game/core/saves`:

```tsx
import {
    saveGame,
    loadGame,
    getAllSaves,
    deleteSave,
} from "@react-text-game/core/saves";

// Save manually with optional description and screenshot
await saveGame("slot-1", gameData, "Before boss fight", screenshotBase64);

// Load by slot ID
const save = await loadGame(1);

// Get all saves (excluding system saves)
const allSaves = await getAllSaves();

// Delete a save
await deleteSave(1);
```

**Note:** Save IDs are auto-incremented. The system also maintains a special `SYSTEM_SAVE_NAME` for initial state restoration.

## Audio System

React Text Game includes a comprehensive audio system with reactive state management, automatic persistence, and global controls. Perfect for background music, sound effects, and voice-over audio.

### Features

- **Reactive State** - Valtio-powered state for seamless React integration
- **Automatic Persistence** - Audio state saved and restored automatically
- **Global Controls** - Master volume, mute all, pause/resume all tracks
- **Fade Effects** - Built-in fade in/out for smooth transitions
- **Multiple Tracks** - Manage multiple audio files independently
- **Browser-friendly** - Handles autoplay policies gracefully

### Creating Audio Tracks

Use the `createAudio` factory function from `@react-text-game/core/audio`:

```tsx
import { createAudio, AudioManager } from "@react-text-game/core/audio";

// Basic audio track
const bgMusic = createAudio("/audio/background.mp3", {
    id: "bg-music", // Required for persistence
    volume: 0.7, // 0.0 to 1.0 (default: 1.0)
    loop: true, // Auto-loop (default: false)
    autoPlay: false, // Auto-play on creation (default: false)
});

// Play the track
await bgMusic.play();

// Control playback
bgMusic.pause();
bgMusic.resume();
bgMusic.stop();

// Adjust settings
bgMusic.setVolume(0.5);
bgMusic.setLoop(true);
bgMusic.seek(30); // Seek to 30 seconds

// Fade effects
await bgMusic.fadeIn(2000); // Fade in over 2 seconds
await bgMusic.fadeOut(1500); // Fade out over 1.5 seconds
```

### Global Audio Manager

Control all audio tracks globally with the `AudioManager`:

```tsx
import { AudioManager } from "@react-text-game/core/audio";

// Master volume control
AudioManager.setMasterVolume(0.5); // Set to 50%
const volume = AudioManager.getMasterVolume();

// Global playback control
AudioManager.pauseAll(); // Pause all playing tracks
AudioManager.resumeAll(); // Resume all paused tracks
AudioManager.stopAll(); // Stop all tracks

// Global mute control
AudioManager.muteAll();
AudioManager.unmuteAll();

// Track management
const allTracks = AudioManager.getAllTracks();
const music = AudioManager.getTrackById("bg-music");
```

**Master Volume Behavior:**

- Master volume multiplies with individual track volumes
- Does not modify track volume settings
- Example: Track at 0.8 volume × 0.5 master = 0.4 effective volume

### React Integration

The audio system includes dedicated hooks for React components:

#### useAudio Hook

Monitor individual audio track state:

```tsx
import { createAudio } from "@react-text-game/core/audio";
import { useAudio } from "@react-text-game/core";

const bgMusic = createAudio("/audio/background.mp3", {
    id: "bg-music",
    loop: true,
});

function MusicPlayer() {
    const audioState = useAudio(bgMusic);

    return (
        <div>
            <p>Status: {audioState.isPlaying ? "Playing" : "Stopped"}</p>
            <p>
                Time: {audioState.currentTime.toFixed(1)}s /{" "}
                {audioState.duration.toFixed(1)}s
            </p>
            <p>Volume: {(audioState.volume * 100).toFixed(0)}%</p>

            <button onClick={() => bgMusic.play()}>Play</button>
            <button onClick={() => bgMusic.pause()}>Pause</button>
            <button onClick={() => bgMusic.stop()}>Stop</button>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioState.volume}
                onChange={(e) => bgMusic.setVolume(parseFloat(e.target.value))}
            />
        </div>
    );
}
```

#### useAudioManager Hook

Access global audio controls:

```tsx
import { useAudioManager } from "@react-text-game/core";

function AudioSettings() {
    const audioManager = useAudioManager();

    return (
        <div>
            <h2>Audio Settings</h2>

            <label>
                Master Volume: {(audioManager.masterVolume * 100).toFixed(0)}%
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioManager.masterVolume}
                    onChange={(e) =>
                        audioManager.setMasterVolume(parseFloat(e.target.value))
                    }
                />
            </label>

            <div>
                <button onClick={audioManager.muteAll}>Mute All</button>
                <button onClick={audioManager.unmuteAll}>Unmute All</button>
                <button onClick={audioManager.pauseAll}>Pause All</button>
                <button onClick={audioManager.resumeAll}>Resume All</button>
            </div>

            <p>Active Tracks: {audioManager.getAllTracks().length}</p>
        </div>
    );
}
```

### Automatic Persistence

Audio tracks with an `id` automatically save and restore their state:

```tsx
// Create audio with ID
const music = createAudio("/audio/theme.mp3", {
    id: "theme-music",
    volume: 0.7,
    loop: true,
});

// State is automatically saved when it changes
await music.play();
music.setVolume(0.5);
// State persisted automatically

// On game restart/reload
const music = createAudio("/audio/theme.mp3", {
    id: "theme-music", // Same ID
});
music.load(); // Restores volume, position, playing state
```

**What Gets Persisted:**

- Volume level
- Loop setting
- Playback rate
- Muted status
- Current playback position
- Playing/paused state

### Common Patterns

#### Background Music with Crossfade

```tsx
const oldMusic = AudioManager.getTrackById("current-music");
const newMusic = createAudio("/audio/new-theme.mp3", {
    id: "current-music",
    loop: true,
});

// Crossfade between tracks
if (oldMusic) {
    await Promise.all([oldMusic.fadeOut(1000), newMusic.fadeIn(1000)]);
    oldMusic.dispose();
}
```

#### Sound Effects Pool

```tsx
// Create one-time sound effect without persistence
function playSoundEffect(src: string) {
    const sfx = createAudio(src, { volume: 0.8 });

    sfx.play();

    // Auto-cleanup when finished
    const audio = (sfx as any).audioElement;
    audio.addEventListener("ended", () => {
        sfx.dispose();
    });
}

playSoundEffect("/audio/click.mp3");
```

#### Pause Audio During Dialogue

```tsx
function showDialogue() {
    // Pause background music
    AudioManager.pauseAll();

    // Show dialogue...

    // Resume when done
    AudioManager.resumeAll();
}
```

### Browser Autoplay Policies

Modern browsers restrict audio autoplay. Handle this gracefully:

```tsx
const music = createAudio("/audio/theme.mp3", {
    autoPlay: true, // May be blocked by browser
});

// Failures are logged but don't throw
// Play after user interaction:
document.addEventListener(
    "click",
    async () => {
        await music.play(); // Works after interaction
    },
    { once: true }
);
```

### Audio API Reference

**createAudio(src, options?)**

- `src: string` - Audio file URL
- `options?: AudioOptions` - Configuration options
- Returns: `AudioTrack`

**AudioTrack Methods:**

- `play(): Promise<void>` - Start playback
- `pause(): void` - Pause playback
- `resume(): void` - Resume from pause
- `stop(): void` - Stop and reset
- `setVolume(volume: number): void` - Set volume (0.0-1.0)
- `setLoop(loop: boolean): void` - Enable/disable looping
- `setPlaybackRate(rate: number): void` - Set playback speed
- `setMuted(muted: boolean): void` - Mute/unmute
- `seek(time: number): void` - Seek to time in seconds
- `fadeIn(duration?: number): Promise<void>` - Fade in effect
- `fadeOut(duration?: number): Promise<void>` - Fade out effect
- `getState(): AudioState` - Get reactive state
- `save(): void` - Save state to storage
- `load(): void` - Load state from storage
- `dispose(): void` - Clean up and remove

**AudioManager Methods:**

- `setMasterVolume(volume: number): void` - Set master volume
- `getMasterVolume(): number` - Get master volume
- `muteAll(): void` - Mute all tracks
- `unmuteAll(): void` - Unmute all tracks
- `pauseAll(): void` - Pause all playing tracks
- `resumeAll(): void` - Resume all paused tracks
- `stopAll(): void` - Stop all tracks
- `getAllTracks(): AudioTrack[]` - Get all tracks
- `getTrackById(id: string): AudioTrack | undefined` - Get track by ID
- `disposeAll(): void` - Dispose all tracks

## React Hooks

### useCurrentPassage

Monitor the current passage with reactive updates:

```tsx
import { useCurrentPassage } from "@react-text-game/core";

function GameScreen() {
    const passage = useCurrentPassage();

    if (!passage) return <div>Loading...</div>;

    return <div>{/* Render passage */}</div>;
}
```

### useGameEntity

Track entity changes with automatic re-renders:

```tsx
import { useGameEntity } from "@react-text-game/core";

function PlayerStats({ player }) {
    const reactivePlayer = useGameEntity(player);

    return <div>Health: {reactivePlayer.health}</div>;
}
```

### useGameIsStarted

Check if game has been initialized:

```tsx
import { useGameIsStarted } from "@react-text-game/core";

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
const player = createEntity("player", { name: "Hero" });

// ❌ Wrong
const player = createEntity("player", { name: "Hero" });
await Game.init();
```

### 2. Use Factory Pattern for Simple Entities

```tsx
// ✅ Recommended for most cases
const player = createEntity("player", { health: 100 });

// ⚠️ Use only when you need inheritance or private methods
class Player extends BaseGameObject {
    /* ... */
}
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
if (player.health <= 0) {
    /* ... */
}
```

### 5. Use TypeScript

```tsx
// ✅ Type-safe entities with explicit types
const player = createEntity("player", {
    name: "Hero",
    inventory: [] as string[], // Explicit array type
});
```

### 6. Avoid Optional Properties in Entities

```tsx
// ❌ Wrong - Optional properties are not supported
const player = createEntity('player', {
  health: 100,
  mana?: 50  // TypeScript will prevent this
});

// ✅ Correct - Use explicit undefined for optional-like behavior
const player = createEntity('player', {
  health: 100,
  mana: undefined as number | undefined,
  questItem: undefined as string | undefined
});

// ✅ Also correct - All required properties
const player = createEntity('player', {
  health: 100,
  mana: 50,  // Always provide a value
  questItem: ''  // Use empty string instead of optional
});
```

## Next Steps

- [**Core API Reference**](/api/core/) - Complete API documentation
- [**UI API Reference**](/api/ui/) - UI components documentation
- [**Example Projects**](https://github.com/laruss/react-text-game/tree/main/apps) - See it in action
    - [Example Game](https://github.com/laruss/react-text-game/tree/main/apps/example-game) - Full game with Vite + React 19
    - [Core Test App](https://github.com/laruss/react-text-game/tree/main/apps/core-test-app) - Core package examples
    - [UI Test App](https://github.com/laruss/react-text-game/tree/main/apps/ui-test-app) - UI components showcase
