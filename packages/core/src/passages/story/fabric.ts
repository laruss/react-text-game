import { Story } from "./story";
import { StoryContent, StoryOptions } from "./types";

export const newStory = (
    id: string,
    content: StoryContent,
    options?: StoryOptions
): Story => new Story(id, content, options);
