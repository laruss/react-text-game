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

Entities and passages may register before initialization, which is the normal pattern for
module-level game registries. You must await `Game.init()` before navigation, save, state,
or option operations. When using `@react-text-game/ui`, `GameProvider` owns this step.

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

Passages represent different screens or scenes in your game. Three types are available, and each has a `define*` factory that follows the same shape:

```typescript
defineStory(id, (helpers, props) => components, options?)
defineInteractiveMap(id, (helpers, props) => hotspots, options)
defineWidget(id, reactNodeOrComponent)
```

The content callback receives a toolbox of builders as its first argument and the display props as its second, so learning one factory teaches all of them. The original `newStory`, `newInteractiveMap` and `newWidget` factories are fully supported and are not scheduled for removal — see [Legacy factories](#legacy-factories).

### Story Passages

Text-based narrative passages with rich components:

```tsx
import { defineStory } from "@react-text-game/core";

const chapter1 = defineStory("chapter1", (h) => [
    h.header("The Beginning", { level: 1 }),
    h.text("You find yourself in a dark forest..."),
    h.image("/assets/forest.jpg", { alt: "Dark forest" }),
    h.actions([
        { content: "Go North", action: h.jump("north-path"), color: "primary" },
        { content: "Go South", action: h.jump("south-path"), color: "secondary" },
    ]),
]);
```

**Story helpers (`h`):**

| Helper | Builds | Signature |
| --- | --- | --- |
| `h.text` | `text` component | `(content, options?)` |
| `h.header` | `header` component | `(content, options?)` |
| `h.image` | `image` component | `(src, options?)` |
| `h.video` | `video` component | `(src, options?)` |
| `h.actions` | `actions` component | `(items, options?)` |
| `h.conversation` | `conversation` component | `(bubbles, options?)` |
| `h.include` | `anotherStory` component | `(storyId, options?)` |
| `h.jump` | click handler | `(passageOrId)` |
| `h.when` | conditional value | `(condition, value)` |

Each helper takes the component's content first and a **single flat options bag** second. Everything nested under `props` in the raw component type is hoisted into that bag, so there is only one level to fill in.

#### Action buttons

An action's caption lives in its `content` field, which accepts any React node — not just a string:

```tsx
h.actions([
    { content: "Go North", action: h.jump("north-path") },
    {
        content: (
            <>
                <KeyIcon /> Unlock the gate
            </>
        ),
        action: h.jump("vault"),
    },
]);
```

:::warning Deprecated: `label`
Actions used to take a plain-string `label`. It is still read when `content` is
absent, so existing stories keep working, but it is deprecated and will be removed
in a future major release. Prefer `content`.
:::

#### Conditional content

Falsy entries are removed from the array, so conditions can be written inline:

```typescript
defineStory("room", (h) => [
    h.text("A locked door blocks your way."),
    player.hasKey && h.text("The rusty key feels warm in your pocket."),
    h.actions([
        { content: "Look around", action: h.jump("room-search") },
        player.hasKey && { content: "Unlock", action: h.jump("vault") },
    ]),
]);
```

#### Mixing helpers and plain objects

Helpers return plain component objects, so hand-written literals still work in the same array — useful when migrating a story a piece at a time:

```typescript
defineStory("mixed", (h) => [
    h.text("Built with a helper"),
    { type: "text", content: "Written by hand" },
]);
```

#### Splitting a story across files

Import `storyHelpers` when you need builders outside the callback body:

```typescript
import { defineStory, storyHelpers } from "@react-text-game/core";

const sharedIntro = () => [storyHelpers.header("The Whispering Woods")];

defineStory("forest", (h) => [
    ...sharedIntro(),
    h.text("The forest is ancient and alive."),
]);
```

#### Typed props

`defineStory` is generic over the props passed to `display()`:

```typescript
const greeting = defineStory<{ playerName: string }>("greeting", (h, props) => [
    h.text(`Hello, ${props.playerName}!`),
]);

greeting.display({ playerName: "Hero" });
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
defineStory("example", (h) => [
    h.text("<strong>Bold</strong> and <em>italic</em> text", { isHTML: true }),
]);
```

:::note
`isHTML` only works when `content` is a string. For complex interactive content
with event handlers or React state, use `.tsx` files with React components.
:::

### Interactive Map Passages

Map-based interactive passages with hotspots. The hotspots come from the content callback; the image, caption and styling stay in the options object:

```tsx
import { defineInteractiveMap } from "@react-text-game/core";

const worldMap = defineInteractiveMap(
    "world-map",
    (h) => [
        // Label hotspot on map
        h.label("Village", {
            position: { x: 30, y: 40 }, // Percentage (0-100)
            action: h.jump("village"),
            color: "primary",
        }),
        // Simple image hotspot (just a string)
        h.image("/icons/treasure.png", {
            position: { x: 50, y: 60 },
            action: () => collectTreasure(),
        }),
        // Image hotspot with hover effect (object with states)
        h.image(
            { idle: "/icons/chest.png", hover: "/icons/chest-glow.png" },
            { position: { x: 60, y: 70 }, action: () => openChest() }
        ),
        // Dynamic image hotspot (function)
        h.image(() => `/icons/portal-${player.level}.png`, {
            position: { x: 75, y: 80 },
            action: () => enterPortal(),
        }),
        // Decorative, non-interactive image
        h.mapImage("/characters/guard.png", {
            position: { x: 42, y: 68 },
            alt: "Castle guard",
        }),
        // Conditional hotspot
        player.hasDiscovered("forest") &&
            h.label("Forest", {
                position: { x: 80, y: 50 },
                action: h.jump("forest"),
            }),
    ],
    { caption: "World Map", image: "/maps/world.jpg" }
);
```

**Map helpers (`h`):**

| Helper | Builds | Signature |
| --- | --- | --- |
| `h.label` | label hotspot | `(content, options)` |
| `h.image` | image hotspot | `(content, options)` |
| `h.mapImage` | decorative map image | `(src, options)` |
| `h.menu` | contextual menu | `(items, options)` |
| `h.jump` | click handler | `(passageOrId)` |
| `h.when` | conditional value | `(condition, value)` |

`position` decides placement: `{ x, y }` percentages put the hotspot on the map, while `"top"`, `"bottom"`, `"left"` or `"right"` dock it to an edge. Options are flat here too — `color`, `variant`, `zoom` and `classNames` go at the top level. Import `mapHelpers` when a map is split across several files.

**Hotspot Types:**

- `MapLabelHotspot` - Text buttons on map (x/y coordinates)
- `MapImageHotspot` - Image buttons with state variants
- `SideLabelHotspot` - Text buttons on edges (top/bottom/left/right)
- `SideImageHotspot` - Image buttons on edges
- `MapImage` - Decorative, non-interactive artwork anchored to map coordinates
- `MapMenu` - Context menu with multiple items

### Widget Passages

Custom React components as passages:

```tsx
import { defineWidget } from "@react-text-game/core";

// With ReactNode (static content)
const customUI = defineWidget(
    "custom-ui",
    <div>
        <h1>Custom Interface</h1>
        <MyCustomComponent />
    </div>
);

// With React component (supports hooks)
const MyMenu = () => {
    const [selected, setSelected] = useState(null);
    return <MenuUI selected={selected} onSelect={setSelected} />;
};
const menuWidget = defineWidget("menu", MyMenu);
```

Widgets take no helper toolbox and no display props: they are ordinary React trees, and `Widget.display()` accepts no arguments. Use `Game.jumpTo()` directly for navigation inside a widget. `defineWidget` is identical to `newWidget` in behaviour and signature — it exists so every passage factory shares the same prefix.

:::warning Important: Function Content Handling
When passing a function to `defineWidget` or `newWidget`, it is **always treated as a React component** and rendered via `createElement`. This ensures hooks work correctly even in minified production builds where function names are mangled.

If you need dynamic content without hooks (e.g., a simple render function), pre-evaluate it:

```tsx
// For dynamic content without hooks, pre-evaluate the function:
const timestampWidget = defineWidget("time", (() => <div>{Date.now()}</div>)());
```

:::

### Legacy factories

`newStory`, `newInteractiveMap` and `newWidget` remain fully supported and produce identical passage objects, so a project can migrate one passage at a time. They take content as data rather than through a builder callback:

```tsx
import { Game, newInteractiveMap, newStory } from "@react-text-game/core";

newStory("chapter1", () => [
    { type: "header", content: "The Beginning", props: { level: 1 } },
    { type: "text", content: "You find yourself in a dark forest..." },
    {
        type: "actions",
        content: [{ content: "Go North", action: () => Game.jumpTo("north") }],
    },
]);

newInteractiveMap("world-map", {
    image: "/maps/world.jpg",
    hotspots: [
        {
            type: "label",
            content: "Village",
            position: { x: 30, y: 40 },
            action: () => Game.jumpTo("village"),
        },
        // conditional hotspots use a callback returning undefined
        () =>
            player.hasKey
                ? {
                      type: "label",
                      content: "Vault",
                      position: { x: 80, y: 30 },
                      action: () => Game.jumpTo("vault"),
                  }
                : undefined,
    ],
});
```

Two differences are worth knowing when comparing the styles:

- **Typed props.** `StoryContent` is a generic *function* type, so a content function cannot annotate its props — `(props: { playerName: string }) => ...` fails to type-check. `StoryContentFn`, used by `defineStory`, is a generic *alias*, so typed props work.
- **Conditional entries.** Only the `define*` factories drop `false`/`null`/`undefined` entries from the arrays.

:::caution Save System and Widget Passages
The save system caches passage display results for performance. However, **Widget passages with function content (React components) cannot be reliably cached** because they return React elements rather than serializable data.

**Best practices:**

- Avoid saving game state while on a Widget passage
- Navigate to a Story or InteractiveMap passage before allowing saves
- If your Widget is a menu or settings screen, consider disabling the save button while it's displayed

```tsx
// Example: Disable save while on settings widget
const SettingsWidget = () => {
    const isOnSettings = Game.currentPassage?.id === "settings";
    return (
        <div>
            <SaveButton disabled={isOnSettings} />
            {/* ... */}
        </div>
    );
};
```

:::

## State Management

React Text Game uses **Valtio** for reactive state management and **jsonpath-plus** for flexible storage queries.

### Reactive Updates

All entities are automatically wrapped in Valtio proxies:

```tsx
const player = createEntity("player", { health: 100 });

// Changes automatically trigger React re-renders
player.health -= 10;
```

### Reading and Writing State

For everyday game logic you read and write state directly through your **entities**, which
are reactive Valtio proxies (see [Entities](#entities)). Assigning to an entity property both
updates the value and triggers re-renders:

```tsx
const player = createEntity("player", { health: 100 });

// Read
const currentHealth = player.health;

// Write (reactive — the UI updates automatically)
player.health = 75;

// Persist the change to the storage layer for save/load
player.save();
```

### Full State Serialization

To snapshot or restore the **entire** game — all registered entities plus the current
passage — use `Game.getState()` and `Game.setState()`. This is what the save system uses
under the hood:

```tsx
import { Game } from "@react-text-game/core";

// Serialize the whole game into a plain, JSON-safe object
const state = Game.getState();

// Restore a previously serialized state
Game.setState(state);
```

`Game.getState()` first flushes the current passage and every registered entity into the
store, then returns the serialized snapshot. `Game.setState()` reverses this: it restores the
store, the current passage, and every registered entity, so the UI reflects the loaded state
immediately.

**Under the hood:** state lives in a central store queried with the
[`jsonpath-plus`](https://github.com/JSONPath-Plus/JSONPath) library and auto-saved to
session storage (configurable), with internal system paths protected. You normally don't
touch that layer directly — reactive entities and `Game.getState()`/`Game.setState()` are the
public API.

## Navigation

Navigate between passages using the Game API:

```tsx
import { Game } from "@react-text-game/core";

// Jump to a passage by ID
Game.jumpTo("chapter1");

// Jump to a passage instance - Story, InteractiveMap and Widget all work
Game.jumpTo(chapter1);
Game.jumpTo(worldMap);
Game.jumpTo(inventoryWidget);

// Set current without navigation effects
Game.setCurrent("chapter1");

// Get current passage
const current = Game.currentPassage;
```

Everywhere the engine asks for a passage — `Game.jumpTo()`, `Game.setCurrent()`,
the `startPassage` option and the `h.jump()` helper — it accepts either a passage
instance or the id of a registered passage (the exported `PassageTarget` type).
Passing the instance is preferred: the id is read from the object, so a renamed
passage cannot silently become a dead link.

```tsx
import { intro } from "./game/stories/intro";

await Game.init({ gameName: "My Game", startPassage: intro });
```

A passage instance handed to `Game.jumpTo()` that is missing from the registry is
registered on the spot, so navigating to an instance never fails with
`Passage "…" not found`. Only a string id can refer to a passage that does not exist.

### Other Game methods

The `Game` object exposes a few more helpers you may reach for:

- `Game.getPassageById(id)` — look up a registered passage by id (`Passage | null`)
- `Game.getAllPassages()` — all registered passages (`Passage[]`)
- `Game.enableAutoSave()` / `Game.disableAutoSave()` — toggle debounced auto-save to session storage
- `Game.updateOptions(options)` — update game options after `init`
- `Game.options` — read the resolved game options

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
- `useDeleteAllSaves` - Delete all saves (except system save)
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

// Save to slot 1 with optional description and screenshot.
// The first argument is the save "slot" name (string or number);
// loadGame/deleteSave look a save up by this same value.
await saveGame(1, gameData, "Before boss fight", screenshotBase64);

// Load the save in slot 1
const save = await loadGame(1);

// Get all saves (excluding system saves)
const allSaves = await getAllSaves();

// Delete the save in slot 1
await deleteSave(1);
```

**Note:** `saveGame` returns an auto-incremented database id, but `loadGame` and `deleteSave` look saves up by the **slot name** you passed to `saveGame` (compared as a string) — so pass the same value to save and load. The system also maintains a special `SYSTEM_SAVE_NAME` for initial state restoration.

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
    // Returns a tuple: [passage, renderId]. renderId changes on every
    // navigation and can be used as a React key to force a remount.
    const [passage, renderId] = useCurrentPassage();

    if (!passage) return <div>Loading...</div>;

    return <div key={renderId}>{/* Render passage */}</div>;
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
