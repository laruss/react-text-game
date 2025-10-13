import { newStory } from "@react-text-game/core";

export const mdxTestInclude = newStory("mdxTestInclude", () => [
    { type: "header", content: "MDX Test Include", props: { level: 1 } },
    {
        type: "text",
        content: "This is a story included from an MDX file."
    }
]);
