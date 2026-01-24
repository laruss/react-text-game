import { AudioManager, createAudio } from "@react-text-game/core/audio";

/**
 * Audio tracks for the game
 * Demonstrates: createAudio factory, background music, sound effects
 */

// Background music tracks
export const musicMainTheme = createAudio(
    "./assets/audio/music/main-theme.mp3",
    {
        id: "music-main-theme",
        volume: 0.5,
        loop: true,
        preload: "metadata",
    }
);

export const musicVillage = createAudio("./assets/audio/music/village.mp3", {
    id: "music-village",
    volume: 0.4,
    loop: true,
    preload: "metadata",
});

export const musicForest = createAudio("./assets/audio/music/forest.mp3", {
    id: "music-forest",
    volume: 0.4,
    loop: true,
    preload: "metadata",
});

export const musicCastle = createAudio("./assets/audio/music/castle.mp3", {
    id: "music-castle",
    volume: 0.5,
    loop: true,
    preload: "metadata",
});

export const musicDragonLair = createAudio(
    "./assets/audio/music/dragon-lair.mp3",
    {
        id: "music-dragon-lair",
        volume: 0.6,
        loop: true,
        preload: "metadata",
    }
);

export const musicBattle = createAudio("./assets/audio/music/battle.mp3", {
    id: "music-battle",
    volume: 0.7,
    loop: true,
    preload: "metadata",
});

export const musicVictory = createAudio("./assets/audio/music/victory.mp3", {
    id: "music-victory",
    volume: 0.6,
    loop: false,
    preload: "metadata",
});

// Sound effects
export const sfxButtonClick = createAudio(
    "./assets/audio/sfx/button-click.mp3",
    {
        volume: 0.6,
        preload: "auto",
    }
);

export const sfxSwordSwing = createAudio("./assets/audio/sfx/sword-swing.mp3", {
    volume: 0.7,
    preload: "auto",
});

export const sfxCoinPickup = createAudio("./assets/audio/sfx/coin-pickup.mp3", {
    volume: 0.5,
    preload: "auto",
});

export const sfxItemPickup = createAudio("./assets/audio/sfx/item-pickup.mp3", {
    volume: 0.5,
    preload: "auto",
});

export const sfxDoorOpen = createAudio("./assets/audio/sfx/door-open.mp3", {
    volume: 0.6,
    preload: "auto",
});

export const sfxDragonRoar = createAudio("./assets/audio/sfx/dragon-roar.mp3", {
    volume: 0.8,
    preload: "auto",
});

// Helper to switch background music with fade
export const switchMusic = async (
    newTrack: ReturnType<typeof createAudio>,
    currentTrack?: ReturnType<typeof createAudio>
) => {
    if (currentTrack) {
        await currentTrack.fadeOut(500);
        currentTrack.stop();
    }
    await newTrack.fadeIn(1000);
};

// Helper to play music only if not already playing (safe for repeated calls)
export const playMusicIfNotPlaying = (
    track: ReturnType<typeof createAudio>
) => {
    const state = track.getState();
    if (!state.isPlaying) {
        track.play();
    }
};

// Track the currently playing background music for easy switching
let currentBgMusic: ReturnType<typeof createAudio> | null = null;
// Track if a music switch is in progress to prevent race conditions
let isSwitchingMusic = false;
// Track pending music switch request
let pendingMusicTrack: ReturnType<typeof createAudio> | null = null;

export const switchBgMusic = async (
    newTrack: ReturnType<typeof createAudio>
): Promise<void> => {
    // Don't switch if already the current track (whether playing or switching to it)
    if (currentBgMusic === newTrack) {
        // If already playing, nothing to do
        if (newTrack.getState().isPlaying) {
            return;
        }
        // If we're currently switching TO this track, let it finish
        if (isSwitchingMusic && pendingMusicTrack === newTrack) {
            return;
        }
    }

    // If a switch is already in progress, queue this one
    if (isSwitchingMusic) {
        pendingMusicTrack = newTrack;
        return;
    }

    isSwitchingMusic = true;
    pendingMusicTrack = newTrack;

    try {
        // Stop ALL currently playing music tracks first (handles restart/load scenarios)
        // This ensures no orphaned audio keeps playing
        AudioManager.getAllTracks().forEach((track) => {
            const state = track.getState();
            if (state.isPlaying && track !== newTrack) {
                track.stop();
            }
        });

        // Fade out current music if different (for smooth transition when tracked correctly)
        if (currentBgMusic && currentBgMusic !== newTrack) {
            await currentBgMusic.fadeOut(500);
            currentBgMusic.stop();
        }

        // Check if another track was requested while we were fading out
        if (pendingMusicTrack !== newTrack) {
            isSwitchingMusic = false;
            // Recursively handle the pending track
            if (pendingMusicTrack) {
                return switchBgMusic(pendingMusicTrack);
            }
            return;
        }

        // Play new track using the stored original volume
        currentBgMusic = newTrack;

        // Get the track's configured volume from options (stored in state initially)
        // If state.volume is 0 (from interrupted fade), use a reasonable default
        const state = newTrack.getState();
        const targetVolume = state.volume > 0 ? state.volume : 0.4;

        // Manually set volume to 0 and play, then fade
        newTrack.setVolume(0);
        await newTrack.play();

        // Fade to target volume manually
        const startTime = Date.now();
        const duration = 1000;

        await new Promise<void>((resolve) => {
            const fade = () => {
                // Check if we should abort (different track requested)
                if (pendingMusicTrack !== newTrack) {
                    resolve();
                    return;
                }

                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentVolume = targetVolume * progress;

                newTrack.setVolume(currentVolume);

                if (progress < 1) {
                    requestAnimationFrame(fade);
                } else {
                    resolve();
                }
            };
            requestAnimationFrame(fade);
        });
    } finally {
        isSwitchingMusic = false;
    }
};

export const getCurrentBgMusic = () => currentBgMusic;
