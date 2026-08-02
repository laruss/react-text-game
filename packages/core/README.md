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
import { Game, createEntity, defineStory } from "@react-text-game/core";

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

// Create a story passage. The callback receives a toolbox of component
// builders, so you never have to write component objects by hand.
const introStory = defineStory("intro", (h) => [
    h.header("Welcome to the Game", { level: 1 }),
    h.text(`Hello, ${player.name}!`),
    h.actions([{ content: "Start Adventure", action: h.jump("adventure") }]),
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

// Navigate - by id or by passage instance (Story, InteractiveMap, Widget)
Game.jumpTo("chapter1");
Game.jumpTo(chapter1);

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

Passages represent different screens or scenes in your game. Three types are available, and each has a `define*` factory:

```typescript
defineStory(id, (helpers, props) => components, options?)
defineInteractiveMap(id, (helpers, props) => hotspots, options)
defineWidget(id, reactNodeOrComponent)
```

The content callback always receives a toolbox of builders as its first argument and the display props as its second, so learning one factory teaches all of them.

> **Migrating?** The original `newStory`, `newInteractiveMap` and `newWidget` factories are fully supported and are not scheduled for removal. See [Legacy factories](#legacy-factories) for their signatures.

#### Story Passages

Text-based narrative passages with rich components:

```typescript
import { defineStory } from "@react-text-game/core";

const myStory = defineStory(
    "my-story",
    (h) => [
        h.header("Chapter 1", { level: 1 }),
        h.text("Once upon a time..."),
        h.image("/assets/scene.jpg", { alt: "A beautiful scene" }),
        h.video("/assets/intro.mp4", { controls: true, autoPlay: false }),
        h.conversation(
            [
                {
                    content: "Hello there!",
                    who: { name: "NPC", avatar: "/avatars/npc.png" },
                    side: "left",
                },
                { content: "Hi!", who: { name: "Player" }, side: "right" },
            ],
            { variant: "messenger", appearance: "atOnce" }
        ),
        h.actions(
            [
                {
                    content: "Continue",
                    action: h.jump("chapter-2"),
                    color: "primary",
                },
                {
                    content: "Go Back",
                    action: h.jump("intro"),
                    color: "secondary",
                    variant: "bordered",
                },
            ],
            { direction: "horizontal" }
        ),
    ],
    {
        background: { image: "/bg.jpg" },
        classNames: { container: "story-container" },
    }
);
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

Each helper takes the component's content first and a **single flat options bag** second. Everything that lives under `props` in the raw component type is hoisted into that bag, so there is only one level to fill in: `h.header("Chapter 1", { level: 1, className: "text-center" })`.

**Action buttons**

An action's caption lives in its `content` field, which accepts any React node — not just a string:

```tsx
h.actions([
    { content: "Go North", action: h.jump("north-path") },
    { content: <><KeyIcon /> Unlock the gate</>, action: h.jump("vault") },
]);
```

> **Deprecated:** actions used to take a plain-string `label`. It is still read when
> `content` is absent, so existing stories keep working, but it is deprecated and will
> be removed in a future major release. Prefer `content`.

**Conditional content**

Falsy entries are removed from the array, so conditions can be written inline instead of through a callback that returns `undefined`:

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

**Mixing helpers and plain objects**

Helpers return plain component objects, so hand-written literals still work in the same array — useful when migrating a story a piece at a time:

```typescript
defineStory("mixed", (h) => [
    h.text("Built with a helper"),
    { type: "text", content: "Written by hand" },
]);
```

**Splitting a story across files**

Import `storyHelpers` directly when you need builders outside the callback body:

```typescript
import { defineStory, storyHelpers } from "@react-text-game/core";

const sharedIntro = () => [storyHelpers.header("The Whispering Woods")];

defineStory("forest", (h) => [
    ...sharedIntro(),
    h.text("The forest is ancient and alive."),
]);
```

**Typed props**

`defineStory` is generic over the props passed to `display()`:

```typescript
const greeting = defineStory<{ playerName: string }>("greeting", (h, props) => [
    h.text(`Hello, ${props.playerName}!`),
]);

greeting.display({ playerName: "Hero" });
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

Map-based interactive passages with hotspots. The hotspots come from the content callback; everything else (image, caption, styling) stays in the options object:

```typescript
import { defineInteractiveMap } from "@react-text-game/core";

const worldMap = defineInteractiveMap(
    "world-map",
    (h) => [
        // Map label hotspot - positioned on the map
        h.label("Village", {
            position: { x: 30, y: 40 }, // Percentage-based (0-100)
            action: h.jump("village"),
            color: "primary",
            variant: "solid",
        }),
        // Map image hotspot - with state-dependent images
        h.image(
            {
                idle: "/icons/chest.png",
                hover: "/icons/chest-glow.png",
                active: "/icons/chest-open.png",
                disabled: "/icons/chest-locked.png",
            },
            {
                position: { x: 60, y: 70 },
                action: () => openChest(),
                isDisabled: () => !player.hasKey,
                tooltip: {
                    content: () => (player.hasKey ? "Open chest" : "Locked"),
                    position: "top",
                },
                zoom: "150%",
            }
        ),
        // Conditional hotspot - only visible if discovered
        player.hasDiscovered("forest") &&
            h.label("Forest", {
                position: { x: 80, y: 50 },
                action: h.jump("forest"),
            }),
        // Decorative, non-interactive image
        h.mapImage("/characters/guard.png", {
            position: { x: 42, y: 68 },
            alt: "Castle guard",
        }),
        // Side hotspot - positioned on edge
        h.label("Menu", {
            position: "top", // top/bottom/left/right
            action: () => openMenu(),
        }),
        // Context menu - multiple choices at a location
        h.menu(
            [
                h.label("Examine", { action: () => examine() }),
                h.label("Take", { action: () => take() }),
                player.hasMagic &&
                    h.label("Cast Spell", { action: () => castSpell() }),
            ],
            { position: { x: 50, y: 50 }, direction: "vertical" }
        ),
    ],
    {
        caption: "World Map",
        image: "/maps/world.jpg",
        bgImage: "/maps/world-bg.jpg",
        props: { bgOpacity: 0.3 },
        classNames: {
            container: "bg-gradient-to-b from-sky-900 to-indigo-900",
            topHotspots: "bg-muted/50 backdrop-blur-sm",
        },
    }
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

`position` decides placement: `{ x, y }` percentages put the hotspot on the map, while `"top"`, `"bottom"`, `"left"` or `"right"` dock it to an edge. As with story helpers, the options bag is flat — `color`, `variant`, `zoom` and `classNames` are written at the top level even though they live under `props` in the raw hotspot type.

Omit `position` from `h.label` to build a menu item; the menu supplies the position for its items. A position-less label is rejected by the type system anywhere a standalone hotspot is expected.

Import `mapHelpers` directly when a map is split across several files, exactly like `storyHelpers`.

**Hotspot Types:**

- `MapLabelHotspot` - Text buttons positioned on map using percentage coordinates (x/y: 0-100)
- `MapImageHotspot` - Image buttons with state variants (idle/hover/active/disabled) and zoom support
- `SideLabelHotspot` - Text buttons on map edges (top/bottom/left/right)
- `SideImageHotspot` - Image buttons on map edges
- `MapMenu` - Contextual menu with multiple items at a specific position

**Dynamic Features:**

- Falsy hotspot entries are dropped, so conditional visibility can be written inline with `&&`
- Hotspots can also be functions returning `undefined` for conditional visibility
- Images and positions support dynamic functions: `image: () => '/maps/' + season + '.jpg'`
- Disabled states with custom tooltips explaining why actions are unavailable

#### Widget Passages

Custom React components as passages:

```tsx
import { defineWidget } from "@react-text-game/core";

const customUI = defineWidget(
    "custom-ui",
    <div>
        <h1>Custom Interface</h1>
        <MyCustomComponent />
    </div>
);

// Pass a component (not an element) when you need hooks
const MyMenu = () => {
    const [selected, setSelected] = useState(null);
    return <MenuUI selected={selected} onSelect={setSelected} />;
};
const menu = defineWidget("menu", MyMenu);
```

Widgets take no helper toolbox and no display props: they are ordinary React trees, and `Widget.display()` accepts no arguments. Use `Game.jumpTo()` directly for navigation inside a widget. `defineWidget` is identical to `newWidget` in behaviour and signature — it exists so every passage factory shares the same prefix.

#### Legacy factories

`newStory`, `newInteractiveMap` and `newWidget` remain fully supported. They take the content as data rather than through a builder callback:

```typescript
import { newInteractiveMap, newStory, newWidget } from "@react-text-game/core";

newStory(
    "my-story",
    (props) => [
        { type: "header", content: "Chapter 1", props: { level: 1 } },
        { type: "text", content: "Once upon a time..." },
    ],
    { background: { image: "/bg.jpg" } }
);

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
                      content: "Secret",
                      position: { x: 80, y: 30 },
                      action: () => Game.jumpTo("secret"),
                  }
                : undefined,
    ],
});

newWidget("custom-ui", <MyCustomComponent />);
```

Two differences worth knowing when you compare the two styles:

- **Typed props.** `StoryContent` is a generic *function* type, so a content function cannot annotate its props (`(props: { playerName: string }) => ...` fails to type-check). `StoryContentFn`, used by `defineStory`, is a generic *alias*, so typed props work.
- **Conditional entries.** Only the `define*` factories drop `false`/`null`/`undefined` entries from the arrays.

Migration is mechanical and can be done one passage at a time — the two styles produce identical passage objects and interoperate freely.

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
- `jumpTo(passage)` - Navigate to passage (passage instance or registered id)
- `setCurrent(passage)` - Set current passage (passage instance or registered id)
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
defineStory<TProps>(id: string, content: StoryContentFn<TProps>, options?: StoryOptions): Story
newStory(id: string, content: StoryContent, options?: StoryOptions): Story
```

**Interactive Map:**

```typescript
defineInteractiveMap<TProps>(id: string, content: MapContentFn<TProps>, options: MapDefineOptions): InteractiveMap
newInteractiveMap(id: string, options: InteractiveMapOptions): InteractiveMap
```

**Widget:**

```typescript
defineWidget(id: string, content: WidgetContent): Widget
newWidget(id: string, content: WidgetContent): Widget
```

**Helper toolboxes:**

```typescript
storyHelpers: StoryHelpers  // text, header, image, video, actions, conversation, include, jump, when
mapHelpers: MapHelpers      // label, image, mapImage, menu, jump, when
```

## TypeScript

Full TypeScript support with comprehensive types and detailed JSDoc documentation:

```typescript
// Import types from main package
import type {
    GameSaveState,
    JsonPath,
    InitVarsType,
    PassageTarget,
    PassageType,
    ButtonColor,
    ButtonVariant,
} from "@react-text-game/core";

// Import story passage types
import type {
    Component,
    StoryContent,
    StoryContentFn,
    StoryContentItems,
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
    MapContentFn,
    MapContentItems,
    MapDefineOptions,
    AnyHotspot,
    MapLabelHotspot,
    MapImageHotspot,
    SideLabelHotspot,
    SideImageHotspot,
    MapMenu,
    LabelHotspot,
    ImageHotspot,
} from "@react-text-game/core/passages";

// Import helper toolbox types from the main package
import type {
    StoryHelpers,
    MapHelpers,
    CommonHelpers,
    DefineFn,
    Conditional,
} from "@react-text-game/core";
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
