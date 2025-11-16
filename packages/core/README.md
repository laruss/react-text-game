# @react-text-game/core

A powerful, reactive text-based game engine built for React applications. This package provides a comprehensive framework for creating interactive narrative experiences with support for story passages, interactive maps, and state management.

## Features

- **Reactive State Management** - Built on Valtio for automatic UI updates
- **Multiple Passage Types** - Story, Interactive Map, and Widget passages
- **Flexible Save System** - JSONPath-based storage with auto-save support
- **Audio System** - Comprehensive audio support with reactive state, persistence, and global controls
- **Entity Registry** - Automatic registration and proxying of game objects
- **Factory-Based Entities** - Plain-object factories for beginners with class-based escape hatches
- **Type-Safe** - Full TypeScript support with comprehensive types
- **React Hooks** - Built-in hooks for seamless React integration
- **Internationalization** - i18next-powered translations with automatic language persistence

## Installation

```bash
# bun
bun add @react-text-game/core

# npm
npm install @react-text-game/core

# yarn
yarn add @react-text-game/core

# pnpm
pnpm add @react-text-game/core
```

## Quick Start

```tsx
import { Game, createEntity, newStory } from "@react-text-game/core";

// IMPORTANT: Initialize the game first
await Game.init({
    gameName: "My Adventure",
    translations: {
        defaultLanguage: "en",
        fallbackLanguage: "en",
        resources: {
            en: {
                passages: { intro: "Welcome to the Game" },
                common: { save: "Save", load: "Load" },
            },
            ru: {
                passages: { intro: "Добро пожаловать в игру" },
            },
        },
    },
    // ...other options
});

// Create a game entity with the factory (recommended)
const player = createEntity("player", {
    name: "Hero",
    stats: {
        health: 100,
        mana: 50,
    },
    inventory: [] as string[],
});

// Direct property updates automatically stay reactive
player.stats.health -= 10;

// Persist manual changes when you need them stored
player.save();

// Create a story passage
const introStory = newStory("intro", () => [
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
                action: () => Game.jumpTo("adventure"),
            },
        ],
    },
]);

// Navigate to passage
Game.jumpTo(introStory);
```

> Prefer writing classes? Jump to [Advanced Entities](#advanced-entities-basegameobject) for a drop-in replacement using inheritance.

## Audio System

The core engine includes a comprehensive audio system with reactive state management, automatic persistence, and global controls. Built on top of the Web Audio API with Valtio for reactive state, it provides an easy-to-use interface for managing background music, sound effects, and voice-over audio.

### Features

- **Reactive State** - Valtio-powered reactive state for seamless React integration
- **Automatic Persistence** - Audio state (volume, position, playing status) saved automatically
- **Global Controls** - Master volume, mute all, pause/resume all tracks
- **Fade Effects** - Built-in fade in/out for smooth transitions
- **Multiple Tracks** - Independent control of multiple audio files simultaneously
- **Browser-friendly** - Handles autoplay policies and user interaction requirements
- **Type-Safe** - Full TypeScript support with comprehensive types

### Quick Start

```typescript
import { createAudio, AudioManager } from "@react-text-game/core/audio";

// Create an audio track
const bgMusic = createAudio("/audio/background.mp3", {
    id: "bg-music",
    volume: 0.7,
    loop: true,
});

// Play the track
await bgMusic.play();

// Control individual tracks
bgMusic.setVolume(0.5);
bgMusic.pause();
bgMusic.resume();
bgMusic.stop();

// Global controls
AudioManager.setMasterVolume(0.8);
AudioManager.muteAll();
AudioManager.pauseAll();
```

### Creating Audio Tracks

Use the `createAudio` factory function to create audio tracks:

```typescript
import { createAudio } from "@react-text-game/core/audio";

// Basic audio track
const sfx = createAudio("/audio/click.mp3");

// With options
const music = createAudio("/audio/theme.mp3", {
    id: "theme-music", // Required for persistence
    volume: 0.6, // 0.0 to 1.0 (default: 1.0)
    loop: true, // Auto-loop (default: false)
    playbackRate: 1.0, // Playback speed (default: 1.0)
    muted: false, // Start muted (default: false)
    autoPlay: false, // Auto-play on creation (default: false)
    preload: "metadata", // 'none', 'metadata', or 'auto' (default: 'metadata')
});
```

### Audio Track Controls

Each audio track provides comprehensive playback controls:

```typescript
// Playback control
await audio.play(); // Start playback (returns Promise)
audio.pause(); // Pause playback
audio.resume(); // Resume from pause
audio.stop(); // Stop and reset to beginning

// Volume and settings
audio.setVolume(0.5); // Set volume (0.0 to 1.0)
audio.setLoop(true); // Enable/disable looping
audio.setPlaybackRate(1.5); // Set playback speed
audio.setMuted(true); // Mute/unmute

// Seeking
audio.seek(30); // Seek to 30 seconds

// Fade effects
await audio.fadeIn(2000); // Fade in over 2 seconds
await audio.fadeOut(1500); // Fade out over 1.5 seconds

// State and persistence
const state = audio.getState(); // Get reactive state
audio.save(); // Save state to storage
audio.load(); // Load state from storage

// Cleanup
audio.dispose(); // Remove and clean up
```

### Reactive State

Audio tracks use Valtio for reactive state management, making them perfect for React integration:

```typescript
const audio = createAudio("/audio/music.mp3", { id: "music" });

// Get reactive state
const state = audio.getState();

// Access state properties
console.log(state.isPlaying); // boolean
console.log(state.isPaused); // boolean
console.log(state.isStopped); // boolean
console.log(state.currentTime); // number (seconds)
console.log(state.duration); // number (seconds)
console.log(state.volume); // number (0.0 to 1.0)
console.log(state.loop); // boolean
console.log(state.playbackRate); // number
console.log(state.muted); // boolean
```

### Global Audio Manager

The `AudioManager` provides global controls for all registered audio tracks:

```typescript
import { AudioManager } from "@react-text-game/core/audio";

// Master volume control
AudioManager.setMasterVolume(0.5); // Set master volume (0.0 to 1.0)
const volume = AudioManager.getMasterVolume(); // Get master volume

// Global playback control
AudioManager.pauseAll(); // Pause all playing tracks
AudioManager.resumeAll(); // Resume all paused tracks
AudioManager.stopAll(); // Stop all tracks

// Global mute control
AudioManager.muteAll(); // Mute all tracks
AudioManager.unmuteAll(); // Unmute all tracks

// Track management
const tracks = AudioManager.getAllTracks(); // Get all registered tracks
const music = AudioManager.getTrackById("bg-music"); // Get specific track by ID

// Cleanup
AudioManager.disposeAll(); // Dispose all tracks
```

**Master Volume Behavior:**

- Master volume is a multiplier applied to all track volumes
- Does not modify individual track volume settings
- Example: Track at 0.8 volume with 0.5 master = 0.4 effective volume
- Useful for game-wide volume sliders in settings

### React Integration

The audio system includes React hooks for seamless component integration:

#### useAudio Hook

Monitor individual audio track state with automatic re-renders:

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

Access global audio controls in React components:

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

            <p>Muted: {audioManager.isMuted ? "Yes" : "No"}</p>
            <p>Active Tracks: {audioManager.getAllTracks().length}</p>
        </div>
    );
}
```

### Automatic Persistence

Audio tracks with an `id` automatically persist their state:

```typescript
// Create audio with ID for persistence
const music = createAudio("/audio/theme.mp3", {
    id: "theme-music",
    volume: 0.7,
    loop: true,
});

// State is automatically saved when it changes
await music.play();
music.setVolume(0.5);
// State saved automatically

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

**Note:** Audio without an ID will not persist across page reloads.

### Common Patterns

#### Background Music with Crossfade

```typescript
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

```typescript
// Create sound effect without ID (no persistence needed)
function playSoundEffect(src: string) {
    const sfx = createAudio(src, {
        volume: 0.8,
    });

    sfx.play();

    // Auto-cleanup when finished
    sfx.audioElement.addEventListener("ended", () => {
        sfx.dispose();
    });
}

playSoundEffect("/audio/click.mp3");
```

#### Pause Audio During Dialogue

```typescript
function showDialogue() {
    // Pause background music
    AudioManager.pauseAll();

    // Show dialogue...

    // Resume when done
    AudioManager.resumeAll();
}
```

### Browser Autoplay Policies

Modern browsers restrict audio autoplay without user interaction. The audio system handles this gracefully:

```typescript
const music = createAudio("/audio/theme.mp3", {
    autoPlay: true, // May be blocked by browser
});

// Autoplay failures are logged but don't throw errors
// Manually play after user interaction:
document.addEventListener(
    "click",
    async () => {
        await music.play(); // Will work after user interaction
    },
    { once: true }
);
```

### TypeScript Types

```typescript
import type {
    AudioOptions,
    AudioState,
    AudioSaveState,
} from "@react-text-game/core/audio";

// All types include comprehensive JSDoc documentation
```

### API Reference

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

## Internationalization

The core engine ships with first-class i18n based on `i18next` and `react-i18next`. Language preferences are persisted to the save database and automatically restored on load.

### Configuring translations

Pass an `I18nConfig` via the `translations` field when you call `Game.init()`:

```ts
import type { I18nConfig } from "@react-text-game/core/i18n";

const translations: I18nConfig = {
    defaultLanguage: "en",
    fallbackLanguage: "en",
    debug: false,
    resources: {
        en: {
            passages: { intro: "Welcome to the game" },
            common: { save: "Save", load: "Load" },
        },
        es: {
            passages: { intro: "¡Bienvenido al juego!" },
        },
    },
    modules: [],
};

await Game.init({
    gameName: "My Adventure",
    translations,
    // ...other options
});
```

- `resources` contains your language namespaces. Users normally keep them in `src/locales/{lang}/{namespace}.json` before importing into the app entry.
- The engine reads any modules you supply (e.g. `i18next-browser-languagedetector`) and registers them after `initReactI18next`.
- If you omit `translations`, the engine falls back to an English-only default config.

A saved language preference is loaded from the settings store before i18next initializes, so players continue in the language they selected.

### Using translations in React

Use the `useGameTranslation` hook from `@react-text-game/core/i18n`:

```tsx
import { useGameTranslation } from "@react-text-game/core/i18n";

export function LanguageSwitcher() {
    const { t, languages, currentLanguage, changeLanguage } =
        useGameTranslation("common");

    return (
        <div>
            <p>{t("currentLanguage", { language: currentLanguage })}</p>
            <select
                value={currentLanguage}
                onChange={(event) => changeLanguage(event.target.value)}
            >
                {languages.map((lang) => (
                    <option key={lang} value={lang}>
                        {lang}
                    </option>
                ))}
            </select>
        </div>
    );
}
```

The hook filters out the `cimode` debug language unless you enable `debug` and persists language changes via the save system.

### Outside React components

For game logic or utilities, grab a namespace-specific translator with `getGameTranslation`:

```ts
import { getGameTranslation } from "@react-text-game/core/i18n";

const t = getGameTranslation("passages");
const intro = t("forest.description");
```

### UI package integration

If the optional `@react-text-game/ui` package is installed, the core engine automatically loads its bundled namespaces and merges them with your resources. Your translations override the UI defaults when both provide the same keys, and the engine happily runs without the UI package when you ship a custom interface.

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
Game.jumpTo("chapter1");

// Save/Load
const savedState = Game.getState();
Game.setState(savedState);

// Auto-save
Game.enableAutoSave();
Game.loadFromSessionStorage();
```

### Entities

#### Entity Factory (`createEntity`) — Recommended Starting Point

The simplest way to model game state is with the `createEntity` factory. You
provide a unique id and a plain object describing the initial state; the engine
wraps it in a `SimpleObject` that:

- Registers itself with the game automatically
- Exposes variables as direct properties (`player.health`, not `player.variables.health`)
- Keeps nested objects/arrays reactive via deep proxies
- Requires explicit `save()` calls so you stay in control of persistence cadence

```typescript
import { createEntity } from "@react-text-game/core";

const player = createEntity("player", {
    name: "Hero",
    health: 100,
    inventory: {
        gold: 50,
        items: [] as string[],
    },
});

player.health -= 5; // direct property access
player.inventory.items.push("sword");
player.save(); // persist changes when you decide to
```

#### Advanced Entities (`BaseGameObject`)

Prefer a class-based design, private fields, or inheritance? Extend
`BaseGameObject` directly—the same registration and storage hooks remain
available:

```typescript
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
}
```

### Passages

Passages represent different screens or scenes in your game. Three types are available:

#### Story Passages

Text-based narrative passages with rich components:

```typescript
import { newStory } from "@react-text-game/core";

const myStory = newStory(
    "my-story",
    (props) => [
        {
            type: "header",
            content: "Chapter 1",
            props: { level: 1 },
        },
        {
            type: "text",
            content: "Once upon a time...",
        },
        {
            type: "image",
            content: "/assets/scene.jpg",
            props: { alt: "A beautiful scene" },
        },
        {
            type: "video",
            content: "/assets/intro.mp4",
            props: { controls: true, autoPlay: false },
        },
        {
            type: "conversation",
            content: [
                {
                    content: "Hello there!",
                    who: { name: "NPC", avatar: "/avatars/npc.png" },
                    side: "left",
                },
                {
                    content: "Hi!",
                    who: { name: "Player" },
                    side: "right",
                },
            ],
            props: { variant: "messenger" },
            appearance: "atOnce",
        },
        {
            type: "actions",
            content: [
                {
                    label: "Continue",
                    action: () => Game.jumpTo("chapter-2"),
                    color: "primary",
                },
                {
                    label: "Go Back",
                    action: () => Game.jumpTo("intro"),
                    color: "secondary",
                    variant: "bordered",
                },
            ],
            props: { direction: "horizontal" },
        },
    ],
    {
        background: { image: "/bg.jpg" },
        classNames: { container: "story-container" },
    }
);
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
import { newInteractiveMap } from "@react-text-game/core";

const worldMap = newInteractiveMap("world-map", {
    caption: "World Map",
    image: "/maps/world.jpg",
    bgImage: "/maps/world-bg.jpg",
    props: { bgOpacity: 0.3 },
    hotspots: [
        // Map label hotspot - positioned on the map
        {
            type: "label",
            content: "Village",
            position: { x: 30, y: 40 }, // Percentage-based (0-100)
            action: () => Game.jumpTo("village"),
            props: { color: "primary", variant: "solid" },
        },
        // Map image hotspot - with state-dependent images
        {
            type: "image",
            content: {
                idle: "/icons/chest.png",
                hover: "/icons/chest-glow.png",
                active: "/icons/chest-open.png",
                disabled: "/icons/chest-locked.png",
            },
            position: { x: 60, y: 70 },
            action: () => openChest(),
            isDisabled: () => !player.hasKey,
            tooltip: {
                content: () => (player.hasKey ? "Open chest" : "Locked"),
                position: "top",
            },
            props: { zoom: "150%" },
        },
        // Conditional hotspot - only visible if discovered
        () =>
            player.hasDiscovered("forest")
                ? {
                      type: "label",
                      content: "Forest",
                      position: { x: 80, y: 50 },
                      action: () => Game.jumpTo("forest"),
                  }
                : undefined,
        // Side hotspot - positioned on edge
        {
            type: "label",
            content: "Menu",
            position: "top", // top/bottom/left/right
            action: () => openMenu(),
        },
        // Context menu - multiple choices at a location
        {
            type: "menu",
            position: { x: 50, y: 50 },
            direction: "vertical",
            items: [
                { type: "label", content: "Examine", action: () => examine() },
                { type: "label", content: "Take", action: () => take() },
                () =>
                    player.hasMagic
                        ? {
                              type: "label",
                              content: "Cast Spell",
                              action: () => castSpell(),
                          }
                        : undefined,
            ],
        },
    ],
    classNames: {
        container: "bg-gradient-to-b from-sky-900 to-indigo-900",
        topHotspots: "bg-muted/50 backdrop-blur-sm",
    },
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
import { newWidget } from "@react-text-game/core";

const customUI = newWidget(
    "custom-ui",
    <div>
        <h1>Custom Interface</h1>
        <MyCustomComponent />
    </div>
);
```

### Storage

JSONPath-based storage system using the `jsonpath` library:

```typescript
import { Storage } from "@react-text-game/core";

// Get values
const health = Storage.getValue<number>("$.player.health");

// Set values
Storage.setValue("$.player.health", 75);

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

> **💾 Save Migrations**: For managing save compatibility across game versions, see the [Save Migration Guide](./MIGRATIONS.md).

```typescript
import {
    useSaveSlots,
    useSaveGame,
    useLoadGame,
    useDeleteGame,
    useLastLoadGame,
    useExportSaves,
    useImportSaves,
    useRestartGame,
} from "@react-text-game/core/saves";
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
                    <p>
                        Slot {index}: {slot.data ? "Saved" : "Empty"}
                    </p>
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

    return <button onClick={handleSave}>Save to Slot {slotNumber}</button>;
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
            console.log("Saves exported successfully");
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

    return <button onClick={restartGame}>Restart Game</button>;
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
    db,
} from "@react-text-game/core/saves";

// Save game manually
await saveGame("my-save", gameData, "Description", screenshotBase64);

// Load by ID
const save = await loadGame(1);

// Get all saves
const allSaves = await getAllSaves();

// Delete a save
await deleteSave(1);

// Direct Dexie access
await db.saves.where("name").equals("my-save").first();
```

#### Save File Encryption

Exported save files are encrypted using AES encryption with PBKDF2 key derivation:

- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2 with 1000 iterations
- **Salt & IV**: Randomly generated for each export
- **Password**: Derived from `gameId` and `SAVE_POSTFIX`

### React Hooks

#### useCurrentPassage

Get the current passage with reactive updates. Returns a tuple containing the current passage and a unique render ID that changes on each navigation:

```tsx
import { useCurrentPassage } from "@react-text-game/core";

function GameScreen() {
    const [passage, renderId] = useCurrentPassage();

    if (!passage) return <div>Loading...</div>;

    // Render based on passage type
    if (passage.type === "story") {
        const { components } = passage.display();
        // Render story components
    }
}
```

**Render ID Purpose:**
The `renderId` is automatically generated on each `Game.jumpTo()` call, ensuring that React components re-render even when navigating to the same passage multiple times. This is useful for forcing component remounts, resetting animations, or clearing component state.

**Usage Example:**

```tsx
function PassageRenderer() {
    const [passage, renderId] = useCurrentPassage();

    // Use renderId as a React key to force remount on navigation
    return (
        <div key={renderId} className="animate-fade-in">
            {passage && <PassageContent passage={passage} />}
        </div>
    );
}
```

#### useGameEntity

Monitor entity changes with automatic re-renders:

```tsx
import { useGameEntity } from "@react-text-game/core";

function PlayerStats({ player }) {
    const reactivePlayer = useGameEntity(player);

    return (
        <div>
            Health: {reactivePlayer.health}
            {/* Direct property access stays reactive */}
        </div>
    );
}
```

#### useGameIsStarted

Check if game has started:

```tsx
import { useGameIsStarted } from "@react-text-game/core";

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
    ButtonVariant,
} from "@react-text-game/core";

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
    ConversationAppearance,
} from "@react-text-game/core/passages";

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
    ImageHotspot,
} from "@react-text-game/core/passages";
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
