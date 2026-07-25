import { defineStory } from "@react-text-game/core";

export const mdxTestInclude = defineStory("mdxTestInclude", (h) => [
    h.header("MDX Test Include", { level: 1 }),
    h.text("This is a story included from an MDX file."),
]);
