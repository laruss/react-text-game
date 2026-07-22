import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { AudioManager, createAudio } from "#audio";
import { SYSTEM_PASSAGE_NAMES } from "#constants";
import { Game } from "#game";
import { type BaseGameObject, createEntity } from "#gameObjects";
import {
    useAudio,
    useAudioManager,
    useCurrentPassage,
    useGameEntity,
    useGameIsStarted,
    useIsStoryMode,
} from "#hooks";
import { newStory } from "#passages/story/fabric";
import { Storage } from "#storage";

class HookAudioElement {
    src = "";
    volume = 1;
    loop = false;
    playbackRate = 1;
    muted = false;
    preload = "metadata";
    currentTime = 0;
    duration = 120;
    paused = true;
    parentNode: ParentNode | null = null;

    private listeners = new Map<string, Set<EventListener>>();

    constructor(src?: string) {
        this.src = src ?? "";
    }

    addEventListener(type: string, listener: EventListener) {
        const listeners = this.listeners.get(type) ?? new Set<EventListener>();
        listeners.add(listener);
        this.listeners.set(type, listeners);
    }

    removeEventListener(type: string, listener: EventListener) {
        this.listeners.get(type)?.delete(listener);
    }

    dispatchEvent(event: Event) {
        this.listeners.get(event.type)?.forEach((listener) => {
            listener(event);
        });
        return true;
    }

    async play() {
        this.paused = false;
        this.dispatchEvent(new Event("play"));
    }

    pause() {
        this.paused = true;
        this.dispatchEvent(new Event("pause"));
    }

    cloneNode() {
        return new HookAudioElement(this.src);
    }
}

const originalAudio = globalThis.Audio;

describe("Runtime hooks", () => {
    beforeEach(async () => {
        (globalThis as unknown as { Audio: typeof HookAudioElement }).Audio =
            HookAudioElement;
        AudioManager.disposeAll();
        AudioManager.setMasterVolume(1);
        Game._resetForTesting();
        Storage.setState({});
        await Game.init({
            gameName: "Hook Test",
            gameId: "runtime-hook-test",
            isDevMode: true,
        });
    });

    afterEach(() => {
        cleanup();
        AudioManager.disposeAll();
        Game._resetForTesting();
        Storage.setState({});
        globalThis.Audio = originalAudio;
    });

    test("observes an audio track as its playback state changes", async () => {
        const audio = createAudio("theme.mp3", {
            id: "hook-theme",
            volume: 0.6,
        });
        const { result } = renderHook(() => useAudio(audio));

        expect(result.current.isStopped).toBe(true);
        expect(result.current.volume).toBe(0.6);

        await act(async () => {
            await audio.play();
        });
        await waitFor(() => expect(result.current.isPlaying).toBe(true));

        act(() => audio.setVolume(0.25));
        await waitFor(() => expect(result.current.volume).toBe(0.25));
    });

    test("exposes reactive manager state and bound controls", async () => {
        const first = createAudio("first.mp3", { id: "first" });
        const second = createAudio("second.mp3", { id: "second" });
        const { result } = renderHook(() => useAudioManager());

        expect(result.current.getAllTracks()).toEqual([first, second]);
        expect(result.current.getTrackById("second")).toBe(second);

        act(() => result.current.setMasterVolume(0.4));
        await waitFor(() => expect(result.current.masterVolume).toBe(0.4));

        act(() => result.current.muteAll());
        await waitFor(() => expect(result.current.isMuted).toBe(true));
        expect(first.getState().muted).toBe(true);

        act(() => result.current.unmuteAll());
        await waitFor(() => expect(result.current.isMuted).toBe(false));

        await first.play();
        result.current.pauseAll();
        expect(first.getState().isPaused).toBe(true);
        result.current.resumeAll();
        await waitFor(() => expect(first.getState().isPlaying).toBe(true));
        result.current.stopAll();
        expect(first.getState().isStopped).toBe(true);

        result.current.disposeAll();
        expect(result.current.getAllTracks()).toEqual([]);
    });

    test("returns the current passage and render id reactively", async () => {
        const story = newStory("hook-story", () => [
            { type: "text", content: "A story" },
        ]);
        const { result } = renderHook(() => useCurrentPassage());

        expect(result.current[0]).toBeNull();
        expect(result.current[1]).toBe(Game.selfState.renderId);

        act(() => Game.jumpTo(story));
        await waitFor(() => expect(result.current[0]).toBe(story));
        expect(result.current[1]).toBeString();

        act(() => {
            Game.selfState.currentPassageId = null;
        });
        await waitFor(() => expect(result.current[0]).toBeNull());
    });

    test("tracks whether the game has left the start menu", async () => {
        const story = newStory("started-story", () => []);
        const { result } = renderHook(() => useGameIsStarted());

        expect(Game.selfState.currentPassageId).toBe(
            SYSTEM_PASSAGE_NAMES.START_MENU
        );
        expect(result.current).toBe(false);

        act(() => Game.jumpTo(story));
        await waitFor(() => expect(result.current).toBe(true));
    });

    test("detects story mode from the active passage", async () => {
        const story = newStory("mode-story", () => []);
        const { result } = renderHook(() => useIsStoryMode());

        expect(result.current).toBe(false);
        act(() => Game.jumpTo(story));
        await waitFor(() => expect(result.current).toBe(true));
    });

    test("observes a registered game entity", async () => {
        const player = createEntity("hook-player", {
            health: 100,
            profile: { title: "Rookie" },
        });
        const { result } = renderHook(() => useGameEntity(player));

        expect(result.current.health).toBe(100);
        expect(result.current.profile.title).toBe("Rookie");

        act(() => {
            player.health = 75;
            player.profile.title = "Veteran";
        });
        await waitFor(() => expect(result.current.health).toBe(75));
        expect(result.current.profile.title).toBe("Veteran");
    });

    test("explains how to fix an unregistered entity", () => {
        const unregistered = {
            id: "missing-player",
        } as BaseGameObject;

        expect(() => renderHook(() => useGameEntity(unregistered))).toThrow(
            'Entity "missing-player" is not registered'
        );
    });
});
