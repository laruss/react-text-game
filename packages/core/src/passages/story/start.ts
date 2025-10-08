import { SYSTEM_PASSAGE_NAMES } from "#constants";

import { newStory } from "./fabric";

/**
 * Represents the starting point of the system's story flow.
 *
 * This variable initializes a new story passage using the default system
 * passage name `START_MENU`. It contains a header and a text content placeholder,
 * which can be customized or replaced with a new story.
 *
 * The contents include:
 * - A header element with the title "Start Story".
 * - A text element explaining that this is a placeholder for the initial
 *   story passage and should be updated with a new story identified as `start-menu-passage`.
 */
export const system_start = newStory(SYSTEM_PASSAGE_NAMES.START_MENU, () => [
    { type: "header", content: "Start Story" },
    {
        type: "text",
        content:
            "This is a placeholder for the start passage, please, consider to replace it with new story with id `start-menu-passage`.",
    },
]);
