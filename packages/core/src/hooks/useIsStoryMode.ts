import { useCurrentPassage } from "./useCurrentPassage";

/**
 * Determines if the current passage is in "story" mode.
 *
 * This function uses the `useCurrentPassage` hook to retrieve the current
 * passage and evaluates its type to check if it represents a "story."
 *
 * @function
 * @returns {boolean} Returns `true` if the current passage type is "story", otherwise `false`.
 */
export const useIsStoryMode = (): boolean => {
    const [currentPassage] = useCurrentPassage();

    return currentPassage?.type === "story";
};
