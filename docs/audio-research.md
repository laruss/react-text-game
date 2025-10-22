# Audio Support Research & Implementation Plan

## Table of Contents

1. [Overview](#overview)
2. [Audio API Analysis](#audio-api-analysis)
3. [Architecture Design](#architecture-design)
4. [Implementation Details](#implementation-details)
5. [API Design](#api-design)
6. [State Management & Persistence](#state-management--persistence)
7. [React Integration](#react-integration)
8. [Testing Strategy](#testing-strategy)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Examples](#examples)

---

## Overview

### Goals

Add comprehensive audio support to the `@react-text-game/core` and `@react-text-game/ui` packages that allows game developers to:

- Play, pause, resume, and stop audio tracks
- Control volume, loop, and playback rate
- Manage multiple audio tracks simultaneously
- Handle background music and sound effects separately
- Persist audio state across save/load operations
- Integrate seamlessly with the existing reactive state management (Valtio)
- Support both streaming (for music) and buffered (for sound effects) audio

### Requirements (from TODO)

```typescript
const audio = createAudio('path/to/audio/file.mp3', {
  loop: true,
  volume: 0.5,
});

audio.play();    // play audio file
audio.pause();   // pause audio file
audio.resume();  // resume audio file
audio.stop();    // stop audio file
```

---

## Audio API Analysis

### HTMLAudioElement vs Web Audio API

Based on research, there are two primary approaches to web audio:

#### HTMLAudioElement (HTML5 Audio)

**Pros:**
- Simple API, easy to use
- Built-in streaming support for long files
- Handles network buffering automatically
- Better for music and long-form audio
- Lower memory footprint
- Standard playback controls

**Cons:**
- Limited processing capabilities
- Less precise timing control
- Cannot manipulate audio data
- Limited to basic playback operations

**Best for:**
- Background music
- Long audio tracks (> 30 seconds)
- Streaming audio files
- Simple play/pause/stop scenarios

#### Web Audio API (AudioContext)

**Pros:**
- Advanced audio processing and effects
- Precise timing and scheduling
- Can generate audio on the fly
- Multiple simultaneous sources
- Volume/panning/filter control
- Better for short sound effects

**Cons:**
- Requires loading entire file into memory
- More complex API
- Overkill for simple playback
- Higher memory usage for large files

**Best for:**
- Sound effects
- Short audio clips (< 30 seconds)
- Advanced audio processing
- Precise timing requirements

### Recommended Approach

**Hybrid solution:** Use HTMLAudioElement as the foundation with the option to integrate Web Audio API later for advanced features.

**Rationale:**
1. Most game audio needs are covered by HTMLAudioElement
2. Simpler implementation aligns with the project's factory-first philosophy
3. Can add Web Audio API features incrementally
4. Better browser compatibility
5. Lower memory footprint for long music tracks

---

## Architecture Design

### Core Package (`@react-text-game/core`)

The audio system will integrate with the existing architecture:

```shell
packages/core/src/
├── audio/
│   ├── audioManager.ts          # Singleton manager for global audio control
│   ├── audioTrack.ts            # Individual audio track class
│   ├── fabric.ts                # Factory function: createAudio()
│   ├── types.ts                 # TypeScript interfaces
│   ├── constants.ts             # Audio-related constants
│   └── index.ts                 # Public exports
├── hooks/
│   ├── useAudio.ts              # Hook for reactive audio state
│   └── useAudioManager.ts       # Hook for global audio control
└── storage.ts                   # Extended to support audio state
```

### Key Design Decisions

#### 1. Factory-First Approach

Following the project's established pattern:

```typescript
// Similar to createEntity() and newStory()
export const createAudio = (src: string, options?: AudioOptions) => {
  return new AudioTrack(src, options);
};
```

#### 2. Reactive State with Valtio

Audio tracks will be Valtio proxies for reactive updates:

```typescript
const state = proxy({
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  loop: false,
  // ...
});
```

#### 3. Integration with Game Registry

Audio tracks can optionally register with the Game for save/load support:

```typescript
// Auto-register with Game if ID provided
const bgMusic = createAudio('music.mp3', {
  id: 'background-music',
  loop: true,
  volume: 0.7
});

// Or standalone (not saved)
const oneTimeSound = createAudio('click.mp3');
```

#### 4. AudioManager for Global Control

A singleton manager for game-wide audio settings:

```typescript
AudioManager.setMasterVolume(0.5);      // Global volume control
AudioManager.muteAll();                  // Mute all audio
AudioManager.unmuteAll();                // Unmute all audio
AudioManager.pauseAll();                 // Pause all playing tracks
AudioManager.resumeAll();                // Resume all paused tracks
AudioManager.stopAll();                  // Stop all tracks
AudioManager.getAllTracks();             // Get all registered tracks
```

---

## Implementation Details

### 1. AudioTrack Class

Core audio track implementation using HTMLAudioElement:

```typescript
// packages/core/src/audio/audioTrack.ts

import { proxy, subscribe } from 'valtio';
import { Game } from '#game';
import { Storage } from '#storage';
import type { AudioOptions, AudioState, JsonPath } from '#types';

export class AudioTrack {
  readonly id: string;
  readonly src: string;
  private audioElement: HTMLAudioElement;
  private state: AudioState;
  private jsonPath: JsonPath;
  private unsubscribe?: () => void;

  constructor(src: string, options: AudioOptions = {}) {
    this.id = options.id || `audio-${Date.now()}-${Math.random()}`;
    this.src = src;
    this.jsonPath = `$.audio.${this.id}` as JsonPath;

    // Create reactive state
    this.state = proxy({
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      currentTime: 0,
      duration: 0,
      volume: options.volume ?? 1,
      loop: options.loop ?? false,
      playbackRate: options.playbackRate ?? 1,
      muted: options.muted ?? false,
    });

    // Create audio element
    this.audioElement = new Audio(src);
    this.audioElement.volume = this.state.volume;
    this.audioElement.loop = this.state.loop;
    this.audioElement.playbackRate = this.state.playbackRate;
    this.audioElement.muted = this.state.muted;

    // Attach event listeners
    this.attachEventListeners();

    // Register with AudioManager
    AudioManager._registerTrack(this);

    // Auto-register with Game if ID provided
    if (options.id) {
      this.save();

      // Subscribe to state changes for auto-save
      this.unsubscribe = subscribe(this.state, () => {
        if (Game.options?.autoSave) {
          this.save();
        }
      });
    }
  }

  private attachEventListeners(): void {
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audioElement.duration;
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.state.currentTime = this.audioElement.currentTime;
    });

    this.audioElement.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.isStopped = false;
    });

    this.audioElement.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.state.isPaused = true;
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.state.loop) {
        this.state.isPlaying = false;
        this.state.isStopped = true;
        this.state.isPaused = false;
        this.state.currentTime = 0;
      }
    });

    this.audioElement.addEventListener('volumechange', () => {
      this.state.volume = this.audioElement.volume;
      this.state.muted = this.audioElement.muted;
    });

    this.audioElement.addEventListener('ratechange', () => {
      this.state.playbackRate = this.audioElement.playbackRate;
    });
  }

  // Playback control methods
  async play(): Promise<void> {
    try {
      await this.audioElement.play();
    } catch (error) {
      console.error(`Failed to play audio: ${this.src}`, error);
      throw error;
    }
  }

  pause(): void {
    this.audioElement.pause();
  }

  resume(): void {
    if (this.state.isPaused) {
      this.play();
    }
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.isStopped = true;
  }

  // Property setters
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = clampedVolume;
    this.state.volume = clampedVolume;
  }

  setLoop(loop: boolean): void {
    this.audioElement.loop = loop;
    this.state.loop = loop;
  }

  setPlaybackRate(rate: number): void {
    this.audioElement.playbackRate = rate;
    this.state.playbackRate = rate;
  }

  setMuted(muted: boolean): void {
    this.audioElement.muted = muted;
    this.state.muted = muted;
  }

  seek(time: number): void {
    const clampedTime = Math.max(0, Math.min(this.state.duration, time));
    this.audioElement.currentTime = clampedTime;
  }

  // Fade effects
  async fadeIn(duration: number = 1000): Promise<void> {
    const targetVolume = this.state.volume;
    this.state.volume = 0;
    this.audioElement.volume = 0;

    await this.play();

    return this.fadeTo(targetVolume, duration);
  }

  async fadeOut(duration: number = 1000): Promise<void> {
    await this.fadeTo(0, duration);
    this.stop();
  }

  private async fadeTo(targetVolume: number, duration: number): Promise<void> {
    const startVolume = this.audioElement.volume;
    const startTime = Date.now();

    return new Promise((resolve) => {
      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentVolume = startVolume + (targetVolume - startVolume) * progress;
        this.audioElement.volume = currentVolume;
        this.state.volume = currentVolume;

        if (progress < 1) {
          requestAnimationFrame(fade);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(fade);
    });
  }

  // State access
  getState(): AudioState {
    return this.state;
  }

  // Save/Load support
  save(): void {
    const saveState = {
      id: this.id,
      src: this.src,
      volume: this.state.volume,
      loop: this.state.loop,
      playbackRate: this.state.playbackRate,
      muted: this.state.muted,
      currentTime: this.state.currentTime,
      isPlaying: this.state.isPlaying,
      isPaused: this.state.isPaused,
    };

    Storage.setValue(this.jsonPath, saveState, true);
  }

  load(): void {
    const savedState = Storage.getValue<ReturnType<typeof this.save>>(this.jsonPath);

    if (savedState.length > 0) {
      const state = savedState[0]!;

      this.state.volume = state.volume;
      this.state.loop = state.loop;
      this.state.playbackRate = state.playbackRate;
      this.state.muted = state.muted;

      this.audioElement.volume = state.volume;
      this.audioElement.loop = state.loop;
      this.audioElement.playbackRate = state.playbackRate;
      this.audioElement.muted = state.muted;
      this.audioElement.currentTime = state.currentTime;

      // Restore playback state
      if (state.isPlaying && !state.isPaused) {
        this.play();
      }
    }
  }

  // Cleanup
  dispose(): void {
    this.stop();
    this.unsubscribe?.();
    AudioManager._unregisterTrack(this);

    // Remove all event listeners
    const clone = this.audioElement.cloneNode() as HTMLAudioElement;
    this.audioElement.parentNode?.replaceChild(clone, this.audioElement);
  }
}
```

### 2. AudioManager Singleton

Global audio management:

```typescript
// packages/core/src/audio/audioManager.ts

import { proxy } from 'valtio';
import type { AudioTrack } from './audioTrack';

class AudioManagerClass {
  private tracks = new Map<string, AudioTrack>();

  private state = proxy({
    masterVolume: 1,
    isMuted: false,
  });

  // Internal registration (called by AudioTrack)
  _registerTrack(track: AudioTrack): void {
    this.tracks.set(track.id, track);
  }

  _unregisterTrack(track: AudioTrack): void {
    this.tracks.delete(track.id);
  }

  // Global controls
  setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.state.masterVolume = clampedVolume;

    // Apply to all tracks
    this.tracks.forEach(track => {
      const trackVolume = track.getState().volume;
      track.setVolume(trackVolume * clampedVolume);
    });
  }

  getMasterVolume(): number {
    return this.state.masterVolume;
  }

  muteAll(): void {
    this.state.isMuted = true;
    this.tracks.forEach(track => track.setMuted(true));
  }

  unmuteAll(): void {
    this.state.isMuted = false;
    this.tracks.forEach(track => track.setMuted(false));
  }

  pauseAll(): void {
    this.tracks.forEach(track => {
      if (track.getState().isPlaying) {
        track.pause();
      }
    });
  }

  resumeAll(): void {
    this.tracks.forEach(track => {
      if (track.getState().isPaused) {
        track.resume();
      }
    });
  }

  stopAll(): void {
    this.tracks.forEach(track => track.stop());
  }

  getAllTracks(): AudioTrack[] {
    return Array.from(this.tracks.values());
  }

  getTrackById(id: string): AudioTrack | undefined {
    return this.tracks.get(id);
  }

  getState() {
    return this.state;
  }

  // Cleanup all tracks
  disposeAll(): void {
    this.tracks.forEach(track => track.dispose());
    this.tracks.clear();
  }
}

// Singleton instance
export const AudioManager = new AudioManagerClass();
```

### 3. Factory Function

```typescript
// packages/core/src/audio/fabric.ts

import type { AudioOptions } from './types';
import { AudioTrack } from './audioTrack';

/**
 * Factory function to create a new audio track.
 *
 * Follows the project's factory-first pattern similar to createEntity() and newStory().
 *
 * @param src - Path to the audio file
 * @param options - Optional audio configuration
 * @returns A reactive AudioTrack instance
 *
 * @example
 * ```typescript
 * // Create background music
 * const bgMusic = createAudio('assets/music/theme.mp3', {
 *   id: 'bg-music',
 *   loop: true,
 *   volume: 0.5,
 * });
 *
 * bgMusic.play();
 *
 * // Create sound effect
 * const clickSound = createAudio('assets/sfx/click.mp3', {
 *   volume: 0.8,
 * });
 */
export const createAudio = (src: string, options?: AudioOptions): AudioTrack => {
  return new AudioTrack(src, options);
};
```

### 4. TypeScript Types

```typescript
// packages/core/src/audio/types.ts

export interface AudioOptions {
  /** Unique identifier for the audio track (required for save/load) */
  id?: string;

  /** Initial volume (0.0 to 1.0) */
  volume?: number;

  /** Whether to loop the audio */
  loop?: boolean;

  /** Playback rate (0.5 = half speed, 2.0 = double speed) */
  playbackRate?: number;

  /** Whether to start muted */
  muted?: boolean;

  /** Auto-play on creation (may be blocked by browser) */
  autoPlay?: boolean;

  /** Preload strategy */
  preload?: 'none' | 'metadata' | 'auto';
}

export interface AudioState {
  /** Whether audio is currently playing */
  isPlaying: boolean;

  /** Whether audio is paused */
  isPaused: boolean;

  /** Whether audio is stopped */
  isStopped: boolean;

  /** Current playback position in seconds */
  currentTime: number;

  /** Total duration in seconds */
  duration: number;

  /** Current volume (0.0 to 1.0) */
  volume: number;

  /** Whether audio is looping */
  loop: boolean;

  /** Current playback rate */
  playbackRate: number;

  /** Whether audio is muted */
  muted: boolean;
}
```

---

## API Design

### Public API (Core Package)

Based on the TODO requirements and extended:

```typescript
import { createAudio, AudioManager } from '@react-text-game/core/audio';

// Create audio track
const audio = createAudio('path/to/audio/file.mp3', {
  loop: true,
  volume: 0.5,
});

// Basic controls
await audio.play();      // Play audio (returns Promise)
audio.pause();           // Pause audio
audio.resume();          // Resume paused audio
audio.stop();            // Stop and reset to beginning

// Advanced controls
audio.setVolume(0.8);           // Set volume (0.0 to 1.0)
audio.setLoop(true);            // Enable/disable looping
audio.setPlaybackRate(1.5);     // Set playback speed
audio.setMuted(true);           // Mute/unmute
audio.seek(30);                 // Seek to 30 seconds

// Fade effects
await audio.fadeIn(2000);       // Fade in over 2 seconds
await audio.fadeOut(1500);      // Fade out over 1.5 seconds

// State access
const state = audio.getState();
console.log(state.isPlaying, state.currentTime, state.duration);

// Cleanup
audio.dispose();

// Global controls
AudioManager.setMasterVolume(0.7);
AudioManager.muteAll();
AudioManager.pauseAll();
AudioManager.stopAll();
```

### React Hooks (Core Package)

```typescript
// packages/core/src/hooks/useAudio.ts

import { useSnapshot } from 'valtio';
import type { AudioTrack } from '#audio';

/**
 * React hook to access reactive audio state.
 *
 * @param audio - The audio track to observe
 * @returns Reactive audio state
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const audioState = useAudio(bgMusic);
 *
 *   return (
 *     <div>
 *       Playing: {audioState.isPlaying ? 'Yes' : 'No'}
 *       Time: {audioState.currentTime} / {audioState.duration}
 *     </div>
 *   );
 * };
 * ```
 */
export const useAudio = (audio: AudioTrack) => {
  return useSnapshot(audio.getState());
};
```

```typescript
// packages/core/src/hooks/useAudioManager.ts

import { useSnapshot } from 'valtio';
import { AudioManager } from '#audio';

/**
 * React hook to access global audio manager state.
 *
 * @returns Reactive audio manager state and controls
 *
 * @example
 * ```typescript
 * const SettingsMenu = () => {
 *   const audioManager = useAudioManager();
 *
 *   return (
 *     <div>
 *       <input
 *         type="range"
 *         value={audioManager.masterVolume}
 *         onChange={(e) => AudioManager.setMasterVolume(+e.target.value)}
 *       />
 *     </div>
 *   );
 * };
 */
export const useAudioManager = () => {
  const state = useSnapshot(AudioManager.getState());

  return {
    ...state,
    setMasterVolume: AudioManager.setMasterVolume.bind(AudioManager),
    muteAll: AudioManager.muteAll.bind(AudioManager),
    unmuteAll: AudioManager.unmuteAll.bind(AudioManager),
    pauseAll: AudioManager.pauseAll.bind(AudioManager),
    resumeAll: AudioManager.resumeAll.bind(AudioManager),
    stopAll: AudioManager.stopAll.bind(AudioManager),
    getAllTracks: AudioManager.getAllTracks.bind(AudioManager),
    getTrackById: AudioManager.getTrackById.bind(AudioManager),
  };
};
```

---

## State Management & Persistence

### Storage Integration

Audio state is stored in the JSONPath storage system:

```json
{
  "_system": {
    "game": { ... },
    "audio": {
      "background-music": {
        "id": "background-music",
        "src": "assets/music/theme.mp3",
        "volume": 0.7,
        "loop": true,
        "currentTime": 45.2,
        "isPlaying": true,
        "isPaused": false
      },
      "ambient-sound": {
        "id": "ambient-sound",
        "src": "assets/ambient/forest.mp3",
        "volume": 0.3,
        "loop": true,
        "currentTime": 120.5,
        "isPlaying": true,
        "isPaused": false
      }
    }
  }
}
```

### Save/Load Behavior

**When saving:**
1. Audio tracks with IDs are automatically saved
2. Current playback position is preserved
3. Volume, loop, and mute settings are saved
4. Playback state (playing/paused) is saved

**When loading:**
1. Audio tracks are recreated from saved state
2. Playback position is restored
3. If audio was playing, it resumes from saved position
4. Volume and settings are restored

**Note:** Audio files must be re-downloaded on load (browser limitation). Consider adding a loading state for user feedback.

---

## React Integration

### UI Package Components

```tsx
// packages/ui/src/components/AudioControls/AudioControls.tsx

import React from 'react';
import { useAudio } from '@react-text-game/core';
import type { AudioTrack } from '@react-text-game/core/audio';

interface AudioControlsProps {
  audio: AudioTrack;
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ audio, className }) => {
  const state = useAudio(audio);

  const handlePlayPause = () => {
    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleStop = () => {
    audio.stop();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.seek(parseFloat(e.target.value));
  };

  return (
    <div className={className}>
      <button onClick={handlePlayPause}>
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={handleStop}>Stop</button>

      <input
        type="range"
        min="0"
        max={state.duration}
        value={state.currentTime}
        onChange={handleSeek}
      />

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={state.volume}
        onChange={handleVolumeChange}
      />

      <span>{formatTime(state.currentTime)} / {formatTime(state.duration)}</span>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

```tsx
// packages/ui/src/components/AudioSettings/AudioSettings.tsx

import React from 'react';
import { useAudioManager } from '@react-text-game/core';

export const AudioSettings: React.FC = () => {
  const audioManager = useAudioManager();

  return (
    <div className="bg-card p-4 rounded border border-border">
      <h3 className="text-foreground text-lg font-semibold mb-4">Audio Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="text-foreground block mb-2">Master Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioManager.masterVolume}
            onChange={(e) => audioManager.setMasterVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={audioManager.muteAll}
            className="bg-danger-500 hover:bg-danger-600 text-white px-4 py-2 rounded"
          >
            Mute All
          </button>
          <button
            onClick={audioManager.unmuteAll}
            className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded"
          >
            Unmute All
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Testing Strategy

### Unit Tests

```typescript
// packages/core/src/tests/audio.test.ts

import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { createAudio } from '#audio';

describe('AudioTrack', () => {
  let audio: ReturnType<typeof createAudio>;

  beforeEach(() => {
    audio = createAudio('test.mp3', {
      id: 'test-audio',
      volume: 0.5,
    });
  });

  afterEach(() => {
    audio.dispose();
  });

  test('should create audio with correct initial state', () => {
    const state = audio.getState();

    expect(state.volume).toBe(0.5);
    expect(state.isPlaying).toBe(false);
    expect(state.isStopped).toBe(true);
  });

  test('should update volume', () => {
    audio.setVolume(0.8);
    expect(audio.getState().volume).toBe(0.8);
  });

  test('should toggle loop', () => {
    audio.setLoop(true);
    expect(audio.getState().loop).toBe(true);

    audio.setLoop(false);
    expect(audio.getState().loop).toBe(false);
  });

  // More tests...
});
```

### Integration Tests

Test audio state persistence with the save/load system:

```typescript
test('should save and restore audio state', () => {
  const audio = createAudio('test.mp3', { id: 'test', volume: 0.7 });

  audio.setVolume(0.3);
  audio.save();

  const savedState = Storage.getValue('$.audio.test');
  expect(savedState[0].volume).toBe(0.3);

  audio.setVolume(0.9);
  audio.load();

  expect(audio.getState().volume).toBe(0.3);
});
```

---

## Implementation Roadmap

### Phase 1: Core Audio System (Week 1-2)

**Tasks:**
1. Create audio directory structure in `packages/core/src/audio/`
2. Implement `AudioTrack` class with HTMLAudioElement
3. Implement `AudioManager` singleton
4. Create `createAudio()` factory function
5. Define TypeScript types and interfaces
6. Write unit tests for audio functionality

**Deliverables:**
- Working audio playback system
- Basic play/pause/stop/volume controls
- Unit test coverage

### Phase 2: State Management & Persistence (Week 2-3)

**Tasks:**
1. Integrate with Storage system using JSONPath
2. Implement save/load functionality
3. Add auto-save support for audio state
4. Handle edge cases (missing files, load failures)
5. Write integration tests

**Deliverables:**
- Audio state persists across save/load
- Integration with existing save system
- Robust error handling

### Phase 3: React Hooks (Week 3)

**Tasks:**
1. Implement `useAudio()` hook
2. Implement `useAudioManager()` hook
3. Write hook tests with React Testing Library
4. Update TypeScript exports

**Deliverables:**
- Reactive audio hooks for React components
- Full hook test coverage

### Phase 4: UI Components (Week 4)

**Tasks:**
1. Create `AudioControls` component
2. Create `AudioSettings` component
3. Apply semantic theming
4. Write component tests
5. Create Storybook stories (if using Storybook)

**Deliverables:**
- Ready-to-use UI components
- Semantic theme compliance
- Component documentation

### Phase 5: Documentation & Examples (Week 5)

**Tasks:**
1. Write comprehensive API documentation
2. Create usage examples
3. Update TypeDoc comments
4. Add examples to example-game app
5. Write migration guide for existing projects

**Deliverables:**
- Complete documentation
- Working examples
- Migration guide

### Phase 6: Advanced Features (Optional, Week 6+)

**Tasks:**
1. Implement fade in/out effects
2. Add crossfade between tracks
3. Implement audio categories (music, sfx, voice)
4. Add Web Audio API integration for advanced features
5. Implement audio preloading system

**Deliverables:**
- Advanced audio features
- Performance optimizations

---

## Examples

### Example 1: Background Music in a Story

```typescript
// In your game setup
import { createAudio } from '@react-text-game/core/audio';
import { newStory } from '@react-text-game/core';

const forestMusic = createAudio('assets/music/forest-theme.mp3', {
  id: 'forest-music',
  loop: true,
  volume: 0.6,
});

const forestScene = newStory('forest', () => ({
  header: { title: 'The Dark Forest' },
  text: 'You enter a mysterious forest...',
  actions: [
    {
      label: 'Venture deeper',
      onClick: async () => {
        // Crossfade to new music
        await forestMusic.fadeOut(2000);
        deepForestMusic.fadeIn(2000);
        Game.jumpTo('deep-forest');
      }
    }
  ],
  onEnter: () => {
    forestMusic.play();
  },
  onLeave: () => {
    forestMusic.fadeOut(1000);
  }
}));
```

### Example 2: Sound Effects

```typescript
// Create sound effects pool
const sounds = {
  click: createAudio('assets/sfx/click.mp3', { volume: 0.8 }),
  success: createAudio('assets/sfx/success.mp3', { volume: 0.7 }),
  error: createAudio('assets/sfx/error.mp3', { volume: 0.6 }),
};

// Use in actions
const action = {
  label: 'Pick up item',
  onClick: () => {
    sounds.success.play();
    player.inventory.push(item);
  }
};
```

### Example 3: Audio Settings Menu

```tsx
import { useAudioManager } from '@react-text-game/core';
import { AudioSettings } from '@react-text-game/ui';

const SettingsPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <AudioSettings />
    </div>
  );
};
```

### Example 4: Custom Audio Player Component

```tsx
import React from 'react';
import { createAudio, useAudio } from '@react-text-game/core';

const audioTrack = createAudio('podcast.mp3', { id: 'podcast' });

const CustomAudioPlayer = () => {
  const state = useAudio(audioTrack);

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center gap-4">
        <button
          onClick={() => state.isPlaying ? audioTrack.pause() : audioTrack.play()}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        >
          {state.isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={state.duration || 100}
            value={state.currentTime}
            onChange={(e) => audioTrack.seek(+e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground mt-1">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.volume}
          onChange={(e) => audioTrack.setVolume(+e.target.value)}
          className="w-24"
        />
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

---

## Additional Considerations

### Browser Autoplay Policies

Modern browsers block autoplay until user interaction. Handle this gracefully:

```typescript
const audio = createAudio('music.mp3', { autoPlay: true });

try {
  await audio.play();
} catch (error) {
  console.log('Autoplay blocked. Waiting for user interaction.');

  // Show UI prompt for user to click
  document.addEventListener('click', () => {
    audio.play();
  }, { once: true });
}
```

### Performance Considerations

1. **Limit concurrent audio tracks**: Too many simultaneous tracks can cause performance issues
2. **Use audio sprites**: Combine multiple sound effects into one file for better performance
3. **Preload critical audio**: Preload important audio during loading screens
4. **Clean up unused tracks**: Call `dispose()` when audio is no longer needed

### Accessibility

1. Provide volume controls
2. Respect user's system sound settings
3. Add visual indicators for audio playback
4. Allow users to disable audio entirely
5. Use ARIA labels for screen readers

### Future Enhancements

1. **Audio categories**: Separate controls for music, SFX, and voice
2. **Audio preloader**: Preload audio assets during game initialization
3. **Audio sprites**: Support for audio sprite sheets
4. **Web Audio API integration**: Advanced effects and processing
5. **3D audio**: Spatial audio for immersive experiences
6. **Audio visualization**: Waveform displays and spectrum analyzers
7. **Audio ducking**: Automatically lower music when voice plays

---

## Conclusion

This implementation plan provides a comprehensive audio system that:

- Follows the project's factory-first architecture
- Integrates seamlessly with Valtio state management
- Persists audio state through the save/load system
- Provides both simple and advanced audio control
- Includes React hooks and UI components
- Maintains semantic theming standards
- Is well-tested and documented

The phased implementation approach allows for incremental development and testing, ensuring a robust and reliable audio system for the react-text-game engine.
