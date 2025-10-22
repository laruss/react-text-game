import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { AudioManager, AudioTrack, createAudio } from "#audio";
import { Storage } from "#storage";

// Mock HTMLAudioElement for testing
class MockAudioElement {
    src: string = "";
    volume: number = 1;
    loop: boolean = false;
    playbackRate: number = 1;
    muted: boolean = false;
    preload: string = "metadata";
    currentTime: number = 0;
    duration: number = 0;
    paused: boolean = true;

    private listeners = new Map<string, Array<EventListener>>();

    constructor(src?: string) {
        if (src) {
            this.src = src;
        }
    }

    addEventListener(event: string, listener: EventListener): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(listener);
    }

    removeEventListener(event: string, listener: EventListener): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    dispatchEvent(event: Event): boolean {
        const listeners = this.listeners.get(event.type);
        if (listeners) {
            listeners.forEach((listener) => listener(event));
        }
        return true;
    }

    async play(): Promise<void> {
        this.paused = false;
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
    }

    pause(): void {
        this.paused = true;
        this.dispatchEvent(new Event("pause"));
    }

    cloneNode(): MockAudioElement {
        return new MockAudioElement(this.src);
    }

    // Helper methods for testing
    _triggerLoadedMetadata(): void {
        this.duration = 180; // 3 minutes
        this.dispatchEvent(new Event("loadedmetadata"));
    }

    _triggerTimeUpdate(time: number): void {
        this.currentTime = time;
        this.dispatchEvent(new Event("timeupdate"));
    }

    _triggerEnded(): void {
        this.dispatchEvent(new Event("ended"));
    }
}

// Replace global Audio with mock
(global as unknown as { Audio: typeof MockAudioElement }).Audio =
    MockAudioElement;

// Mock requestAnimationFrame for fade tests
(
    global as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }
).requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 0) as unknown as number;
};

describe("Audio System", () => {
    beforeEach(() => {
        // Clear storage before each test
        Storage.setState({});
        // Clear audio manager tracks
        AudioManager.disposeAll();
    });

    afterEach(() => {
        // Clean up after tests
        AudioManager.disposeAll();
        Storage.setState({});
    });

    describe("createAudio factory", () => {
        test("creates an AudioTrack instance", () => {
            const audio = createAudio("test.mp3");
            expect(audio).toBeInstanceOf(AudioTrack);
        });

        test("creates audio with default options", () => {
            const audio = createAudio("test.mp3");
            const state = audio.getState();

            expect(state.volume).toBe(1.0);
            expect(state.loop).toBe(false);
            expect(state.playbackRate).toBe(1.0);
            expect(state.muted).toBe(false);
            expect(state.isStopped).toBe(true);
            expect(state.isPlaying).toBe(false);
            expect(state.isPaused).toBe(false);
        });

        test("creates audio with custom options", () => {
            const audio = createAudio("test.mp3", {
                id: "test-audio",
                volume: 0.5,
                loop: true,
                playbackRate: 1.5,
                muted: true,
            });

            const state = audio.getState();
            expect(state.volume).toBe(0.5);
            expect(state.loop).toBe(true);
            expect(state.playbackRate).toBe(1.5);
            expect(state.muted).toBe(true);
        });

        test("generates unique ID if not provided", () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            expect(audio1.id).toBeDefined();
            expect(audio2.id).toBeDefined();
            expect(audio1.id).not.toBe(audio2.id);
        });

        test("uses provided ID", () => {
            const audio = createAudio("test.mp3", { id: "my-audio" });
            expect(audio.id).toBe("my-audio");
        });
    });

    describe("AudioTrack state management", () => {
        test("initializes with correct state", () => {
            const audio = createAudio("test.mp3", {
                volume: 0.7,
                loop: true,
            });

            const state = audio.getState();
            expect(state.volume).toBe(0.7);
            expect(state.loop).toBe(true);
            expect(state.isPlaying).toBe(false);
            expect(state.isPaused).toBe(false);
            expect(state.isStopped).toBe(true);
            expect(state.currentTime).toBe(0);
            expect(state.duration).toBe(0);
        });

        test("updates state when playing", async () => {
            const audio = createAudio("test.mp3");
            await audio.play();

            const state = audio.getState();
            expect(state.isPlaying).toBe(true);
            expect(state.isPaused).toBe(false);
            expect(state.isStopped).toBe(false);
        });

        test("updates state when paused", async () => {
            const audio = createAudio("test.mp3");
            await audio.play();
            audio.pause();

            const state = audio.getState();
            expect(state.isPlaying).toBe(false);
            expect(state.isPaused).toBe(true);
            expect(state.isStopped).toBe(false);
        });

        test("updates state when stopped", async () => {
            const audio = createAudio("test.mp3");
            await audio.play();
            audio.stop();

            const state = audio.getState();
            expect(state.isPlaying).toBe(false);
            expect(state.isPaused).toBe(false);
            expect(state.isStopped).toBe(true);
        });

        test("resumes from paused state", async () => {
            const audio = createAudio("test.mp3");
            await audio.play();
            audio.pause();

            const pausedState = audio.getState();
            expect(pausedState.isPaused).toBe(true);

            audio.resume();
            // Note: resume is async internally but doesn't return promise
            // Give it a moment to process
            await new Promise((resolve) => setTimeout(resolve, 10));

            const resumedState = audio.getState();
            expect(resumedState.isPlaying).toBe(true);
            expect(resumedState.isPaused).toBe(false);
        });
    });

    describe("AudioTrack controls", () => {
        test("sets volume within valid range", () => {
            const audio = createAudio("test.mp3");

            audio.setVolume(0.5);
            expect(audio.getState().volume).toBe(0.5);

            audio.setVolume(0);
            expect(audio.getState().volume).toBe(0);

            audio.setVolume(1);
            expect(audio.getState().volume).toBe(1);
        });

        test("clamps volume to valid range", () => {
            const audio = createAudio("test.mp3");

            audio.setVolume(-0.5);
            expect(audio.getState().volume).toBe(0);

            audio.setVolume(1.5);
            expect(audio.getState().volume).toBe(1);
        });

        test("toggles loop", () => {
            const audio = createAudio("test.mp3");

            audio.setLoop(true);
            expect(audio.getState().loop).toBe(true);

            audio.setLoop(false);
            expect(audio.getState().loop).toBe(false);
        });

        test("sets playback rate", () => {
            const audio = createAudio("test.mp3");

            audio.setPlaybackRate(1.5);
            expect(audio.getState().playbackRate).toBe(1.5);

            audio.setPlaybackRate(0.5);
            expect(audio.getState().playbackRate).toBe(0.5);
        });

        test("toggles muted", () => {
            const audio = createAudio("test.mp3");

            audio.setMuted(true);
            expect(audio.getState().muted).toBe(true);

            audio.setMuted(false);
            expect(audio.getState().muted).toBe(false);
        });

        test("seeks to specific time", () => {
            const audio = createAudio("test.mp3");
            // Simulate loaded metadata
            const audioEl = (audio as unknown as { audioElement: MockAudioElement })
                .audioElement;
            audioEl._triggerLoadedMetadata();

            audio.seek(30);
            expect(audioEl.currentTime).toBe(30);
        });

        test("clamps seek time to valid range", () => {
            const audio = createAudio("test.mp3");
            // Simulate loaded metadata (duration = 180s)
            const audioEl = (audio as unknown as { audioElement: MockAudioElement })
                .audioElement;
            audioEl._triggerLoadedMetadata();

            audio.seek(-10);
            expect(audioEl.currentTime).toBe(0);

            audio.seek(200);
            expect(audioEl.currentTime).toBe(180);
        });
    });

    describe("AudioTrack save/load", () => {
        test("saves audio state to storage with ID", () => {
            const audio = createAudio("test.mp3", {
                id: "test-audio",
                volume: 0.7,
                loop: true,
            });

            audio.save();

            const savedState = Storage.getValue("$._system.audio.test-audio");
            expect(savedState.length).toBe(1);
            expect(savedState[0]).toMatchObject({
                id: "test-audio",
                src: "test.mp3",
                volume: 0.7,
                loop: true,
            });
        });

        test("loads audio state from storage", () => {
            // First create and save audio
            const audio1 = createAudio("test.mp3", {
                id: "test-audio",
                volume: 0.7,
                loop: true,
            });

            // Manually set some values and save
            audio1.setPlaybackRate(1.5);
            audio1.save();

            // Clear the saved state that gets overwritten by constructor
            const savedState = Storage.getValue("$._system.audio.test-audio");

            // Dispose audio1 to clean up
            audio1.dispose();

            // Restore the saved state
            Storage.setValue("$._system.audio.test-audio", savedState[0]!, true);

            // Create new audio with same ID and different settings
            const audio2 = createAudio("test.mp3", {
                id: "test-audio",
                volume: 0.3,
                loop: false,
            });

            // Load should restore the saved state
            audio2.load();

            const state = audio2.getState();
            expect(state.volume).toBe(0.7);
            expect(state.loop).toBe(true);
            expect(state.playbackRate).toBe(1.5);
        });

        test("handles loading with no saved state gracefully", () => {
            const audio = createAudio("test.mp3", { id: "new-audio" });

            // Should not throw
            expect(() => audio.load()).not.toThrow();
        });
    });

    describe("AudioManager", () => {
        test("registers tracks automatically", () => {
            const audio1 = createAudio("test1.mp3", { id: "audio1" });
            const audio2 = createAudio("test2.mp3", { id: "audio2" });

            const tracks = AudioManager.getAllTracks();
            expect(tracks.length).toBe(2);
            expect(tracks).toContain(audio1);
            expect(tracks).toContain(audio2);
        });

        test("retrieves track by ID", () => {
            const audio = createAudio("test.mp3", { id: "my-audio" });

            const retrieved = AudioManager.getTrackById("my-audio");
            expect(retrieved).toBe(audio);
        });

        test("returns undefined for non-existent track ID", () => {
            const retrieved = AudioManager.getTrackById("non-existent");
            expect(retrieved).toBeUndefined();
        });

        test("sets master volume", () => {
            AudioManager.setMasterVolume(0.5);
            expect(AudioManager.getMasterVolume()).toBe(0.5);
        });

        test("clamps master volume to valid range", () => {
            AudioManager.setMasterVolume(-0.5);
            expect(AudioManager.getMasterVolume()).toBe(0);

            AudioManager.setMasterVolume(1.5);
            expect(AudioManager.getMasterVolume()).toBe(1);
        });

        test("master volume does not permanently modify track volumes", () => {
            const audio = createAudio("test.mp3", { id: "test", volume: 0.8 });

            // Access the audio element to verify effective volume
            const audioEl = (audio as unknown as { audioElement: MockAudioElement })
                .audioElement;

            // Initial state: track volume 0.8, master volume 1.0
            expect(audio.getState().volume).toBe(0.8);
            expect(audioEl.volume).toBe(0.8);

            // Set master volume to 0.5
            AudioManager.setMasterVolume(0.5);

            // Track's state volume should remain 0.8
            expect(audio.getState().volume).toBe(0.8);
            // But effective volume on audio element should be 0.8 * 0.5 = 0.4
            expect(audioEl.volume).toBe(0.4);

            // Set master volume back to 1.0
            AudioManager.setMasterVolume(1.0);

            // Track's state volume should still be 0.8
            expect(audio.getState().volume).toBe(0.8);
            // Effective volume should be back to 0.8
            expect(audioEl.volume).toBe(0.8);
        });

        test("master volume applies to all tracks independently", () => {
            const audio1 = createAudio("test1.mp3", { id: "test1", volume: 0.6 });
            const audio2 = createAudio("test2.mp3", { id: "test2", volume: 0.9 });
            const audio3 = createAudio("test3.mp3", { id: "test3", volume: 0.3 });

            const audioEl1 = (audio1 as unknown as { audioElement: MockAudioElement })
                .audioElement;
            const audioEl2 = (audio2 as unknown as { audioElement: MockAudioElement })
                .audioElement;
            const audioEl3 = (audio3 as unknown as { audioElement: MockAudioElement })
                .audioElement;

            // Set master volume to 0.5
            AudioManager.setMasterVolume(0.5);

            // All tracks should preserve their state volumes
            expect(audio1.getState().volume).toBe(0.6);
            expect(audio2.getState().volume).toBe(0.9);
            expect(audio3.getState().volume).toBe(0.3);

            // But effective volumes should be multiplied by master
            expect(audioEl1.volume).toBe(0.3); // 0.6 * 0.5
            expect(audioEl2.volume).toBe(0.45); // 0.9 * 0.5
            expect(audioEl3.volume).toBe(0.15); // 0.3 * 0.5
        });

        test("changing track volume updates effective volume with current master volume", () => {
            const audio = createAudio("test.mp3", { id: "test", volume: 0.5 });
            const audioEl = (audio as unknown as { audioElement: MockAudioElement })
                .audioElement;

            // Set master volume to 0.5
            AudioManager.setMasterVolume(0.5);

            // Initial effective volume: 0.5 * 0.5 = 0.25
            expect(audioEl.volume).toBe(0.25);

            // Change track volume
            audio.setVolume(0.8);

            // State volume should be 0.8
            expect(audio.getState().volume).toBe(0.8);
            // Effective volume should be 0.8 * 0.5 = 0.4
            expect(audioEl.volume).toBe(0.4);
        });

        test("master volume correctly applies when set to 0", () => {
            const audio1 = createAudio("test1.mp3", { volume: 0.7 });
            const audio2 = createAudio("test2.mp3", { volume: 0.5 });

            const audioEl1 = (audio1 as unknown as { audioElement: MockAudioElement })
                .audioElement;
            const audioEl2 = (audio2 as unknown as { audioElement: MockAudioElement })
                .audioElement;

            // Set master volume to 0 (silence all)
            AudioManager.setMasterVolume(0);

            // Track volumes should be preserved
            expect(audio1.getState().volume).toBe(0.7);
            expect(audio2.getState().volume).toBe(0.5);

            // But effective volumes should be 0
            expect(audioEl1.volume).toBe(0);
            expect(audioEl2.volume).toBe(0);

            // Restore master volume
            AudioManager.setMasterVolume(1.0);

            // Effective volumes should be restored
            expect(audioEl1.volume).toBe(0.7);
            expect(audioEl2.volume).toBe(0.5);
        });

        test("master volume persists for newly created tracks", () => {
            // Set master volume before creating tracks
            AudioManager.setMasterVolume(0.5);

            const audio = createAudio("test.mp3", { volume: 0.8 });
            const audioEl = (audio as unknown as { audioElement: MockAudioElement })
                .audioElement;

            // New track should have master volume applied
            expect(audio.getState().volume).toBe(0.8);
            expect(audioEl.volume).toBe(0.4); // 0.8 * 0.5

            // Reset master volume for other tests
            AudioManager.setMasterVolume(1.0);
        });

        test("mutes all tracks", () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            AudioManager.muteAll();

            expect(audio1.getState().muted).toBe(true);
            expect(audio2.getState().muted).toBe(true);
        });

        test("unmutes all tracks", () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            AudioManager.muteAll();
            AudioManager.unmuteAll();

            expect(audio1.getState().muted).toBe(false);
            expect(audio2.getState().muted).toBe(false);
        });

        test("pauses all playing tracks", async () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            await audio1.play();
            await audio2.play();

            AudioManager.pauseAll();

            expect(audio1.getState().isPaused).toBe(true);
            expect(audio2.getState().isPaused).toBe(true);
        });

        test("resumes all paused tracks", async () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            await audio1.play();
            await audio2.play();
            AudioManager.pauseAll();

            AudioManager.resumeAll();
            // Give resume time to process
            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(audio1.getState().isPlaying).toBe(true);
            expect(audio2.getState().isPlaying).toBe(true);
        });

        test("stops all tracks", async () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");

            await audio1.play();
            await audio2.play();

            AudioManager.stopAll();

            expect(audio1.getState().isStopped).toBe(true);
            expect(audio2.getState().isStopped).toBe(true);
        });

        test("disposes all tracks", () => {
            createAudio("test1.mp3", { id: "audio1" });
            createAudio("test2.mp3", { id: "audio2" });

            expect(AudioManager.getAllTracks().length).toBe(2);

            AudioManager.disposeAll();

            expect(AudioManager.getAllTracks().length).toBe(0);
        });

        test("unregisters track on dispose", () => {
            const audio = createAudio("test.mp3", { id: "test-audio" });

            expect(AudioManager.getAllTracks().length).toBe(1);

            audio.dispose();

            expect(AudioManager.getAllTracks().length).toBe(0);
            expect(AudioManager.getTrackById("test-audio")).toBeUndefined();
        });
    });

    describe("AudioTrack fade effects", () => {
        test("fadeIn starts from 0 volume", async () => {
            const audio = createAudio("test.mp3", { volume: 0.5 });

            // Start fade in (with short duration for test)
            const fadePromise = audio.fadeIn(10);

            // Volume should start at 0
            const initialState = audio.getState();
            expect(initialState.volume).toBeLessThanOrEqual(0.1);

            await fadePromise;

            // After fade, should be at target volume (0.5)
            const finalState = audio.getState();
            expect(finalState.volume).toBeGreaterThanOrEqual(0.4);
        });

        test("fadeOut ends at 0 volume and stops", async () => {
            const audio = createAudio("test.mp3", { volume: 0.5 });
            await audio.play();

            await audio.fadeOut(10);

            const state = audio.getState();
            expect(state.volume).toBeLessThanOrEqual(0.1);
            expect(state.isStopped).toBe(true);
        });
    });

    describe("Integration tests", () => {
        test("multiple audio tracks work independently", async () => {
            const music = createAudio("music.mp3", {
                id: "music",
                volume: 0.7,
                loop: true,
            });

            const sfx = createAudio("sfx.mp3", {
                id: "sfx",
                volume: 0.9,
                loop: false,
            });

            await music.play();
            await sfx.play();

            expect(music.getState().isPlaying).toBe(true);
            expect(sfx.getState().isPlaying).toBe(true);

            music.pause();

            expect(music.getState().isPaused).toBe(true);
            expect(sfx.getState().isPlaying).toBe(true);
        });

        test("audio state persists across save/load cycle", () => {
            // Create and configure audio
            const audio1 = createAudio("test.mp3", {
                id: "persistent-audio",
                volume: 0.6,
                loop: true,
            });
            audio1.setPlaybackRate(1.5);
            audio1.save();

            // Save the state before disposing
            const savedState = Storage.getValue("$._system.audio.persistent-audio");
            audio1.dispose();

            // Restore the saved state (in case dispose cleared it)
            Storage.setValue(
                "$._system.audio.persistent-audio",
                savedState[0]!,
                true
            );

            // Simulate restart by creating new instance
            const audio2 = createAudio("test.mp3", {
                id: "persistent-audio",
            });
            audio2.load();

            const state = audio2.getState();
            expect(state.volume).toBe(0.6);
            expect(state.loop).toBe(true);
            expect(state.playbackRate).toBe(1.5);
        });

        test("AudioManager operations affect all registered tracks", async () => {
            const audio1 = createAudio("test1.mp3");
            const audio2 = createAudio("test2.mp3");
            const audio3 = createAudio("test3.mp3");

            await audio1.play();
            await audio2.play();
            await audio3.play();

            // Mute all
            AudioManager.muteAll();

            expect(audio1.getState().muted).toBe(true);
            expect(audio2.getState().muted).toBe(true);
            expect(audio3.getState().muted).toBe(true);

            // Stop all
            AudioManager.stopAll();

            expect(audio1.getState().isStopped).toBe(true);
            expect(audio2.getState().isStopped).toBe(true);
            expect(audio3.getState().isStopped).toBe(true);
        });
    });

    describe("Edge cases", () => {
        test("handles empty string src", () => {
            expect(() => createAudio("")).not.toThrow();
        });

        test("handles special characters in src", () => {
            expect(() =>
                createAudio("audio/music with spaces.mp3")
            ).not.toThrow();
        });

        test("handles special characters in ID", () => {
            expect(() =>
                createAudio("test.mp3", { id: "audio-id_123" })
            ).not.toThrow();
        });

        test("handles rapid state changes", async () => {
            const audio = createAudio("test.mp3");

            await audio.play();
            audio.pause();
            await audio.play();
            audio.stop();
            await audio.play();

            // Should end up playing
            expect(audio.getState().isPlaying).toBe(true);
        });

        test("dispose stops audio and cleans up", async () => {
            const audio = createAudio("test.mp3", { id: "disposable" });
            await audio.play();

            audio.dispose();

            const state = audio.getState();
            expect(state.isStopped).toBe(true);
            expect(AudioManager.getTrackById("disposable")).toBeUndefined();
        });

        test("handles volume changes during playback", async () => {
            const audio = createAudio("test.mp3", { volume: 0.5 });
            await audio.play();

            audio.setVolume(0.8);
            expect(audio.getState().volume).toBe(0.8);

            audio.setVolume(0.2);
            expect(audio.getState().volume).toBe(0.2);
        });

        test("handles loop changes during playback", async () => {
            const audio = createAudio("test.mp3", { loop: false });
            await audio.play();

            audio.setLoop(true);
            expect(audio.getState().loop).toBe(true);

            audio.setLoop(false);
            expect(audio.getState().loop).toBe(false);
        });
    });
});
