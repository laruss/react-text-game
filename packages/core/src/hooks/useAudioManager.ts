import { useSnapshot } from "valtio";

import { AudioManager } from "#audio";

/**
 * React hook to access global audio manager state and controls.
 *
 * This hook provides access to the AudioManager's reactive state
 * (master volume, mute status) and bound control methods.
 *
 * @returns Reactive audio manager state and control methods
 *
 * @example
 * ```typescript
 * import { useAudioManager } from '@react-text-game/core';
 *
 * function AudioSettingsMenu() {
 *   const audioManager = useAudioManager();
 *
 *   return (
 *     <div>
 *       <h2>Audio Settings</h2>
 *
 *       <label>
 *         Master Volume: {(audioManager.masterVolume * 100).toFixed(0)}%
 *         <input
 *           type="range"
 *           min="0"
 *           max="1"
 *           step="0.01"
 *           value={audioManager.masterVolume}
 *           onChange={(e) => audioManager.setMasterVolume(parseFloat(e.target.value))}
 *         />
 *       </label>
 *
 *       <button onClick={audioManager.muteAll}>
 *         Mute All
 *       </button>
 *       <button onClick={audioManager.unmuteAll}>
 *         Unmute All
 *       </button>
 *       <button onClick={audioManager.pauseAll}>
 *         Pause All
 *       </button>
 *       <button onClick={audioManager.resumeAll}>
 *         Resume All
 *       </button>
 *
 *       <p>Muted: {audioManager.isMuted ? 'Yes' : 'No'}</p>
 *       <p>Total Tracks: {audioManager.getAllTracks().length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAudioManager = () => {
    const state = useSnapshot(AudioManager.getState());

    return {
        ...state,
        setMasterVolume: AudioManager.setMasterVolume.bind(AudioManager),
        getMasterVolume: AudioManager.getMasterVolume.bind(AudioManager),
        muteAll: AudioManager.muteAll.bind(AudioManager),
        unmuteAll: AudioManager.unmuteAll.bind(AudioManager),
        pauseAll: AudioManager.pauseAll.bind(AudioManager),
        resumeAll: AudioManager.resumeAll.bind(AudioManager),
        stopAll: AudioManager.stopAll.bind(AudioManager),
        getAllTracks: AudioManager.getAllTracks.bind(AudioManager),
        getTrackById: AudioManager.getTrackById.bind(AudioManager),
        disposeAll: AudioManager.disposeAll.bind(AudioManager),
    };
};
