import { defineStory } from "@react-text-game/core";
import { getGameTranslation } from "@react-text-game/core/i18n";

export const testStory = defineStory("testStory", (h) => {
    const t = getGameTranslation();

    return [
        h.header(t("testStory.header"), { level: 1 }),
        h.text(`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        `),
        h.image("living_room.png"),
        h.video("video.mp4"),
        h.actions([
            {
                content: "Action 1",
                action: () => console.log("Action 1 executed"),
            },
            {
                content: "Action 2",
                action: () => console.log("Action 2 executed"),
                isDisabled: true,
                tooltip: {
                    content: "This action is disabled",
                    position: "top",
                    className: "bg-red-500 text-white",
                },
            },
        ]),
        h.include("anotherStory"),
    ];
});

defineStory("anotherStory", (h) => [
    h.header("Another Story", { level: 2 }),
    h.text("This is another story with different content."),
    h.conversation([
        { content: "Hello, this is a conversation line." },
        {
            content: "This is another line.",
            who: { name: "Character1" },
        },
        {
            content: "This is the third line.",
            who: { name: "Character2" },
            side: "right",
        },
        {
            content: "This is the fourth line.",
            who: { name: "Character1" },
            side: "left",
        },
        {
            content: "This is the fifth line.",
            who: {
                name: "NewCharacter",
                avatar: "https://avatar.iran.liara.run/public/12",
            },
            side: "right",
        },
    ]),
]);
