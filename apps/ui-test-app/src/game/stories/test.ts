import { newStory } from "@react-text-game/core";

export const testStory = newStory("testStory", () => [
    { type: "header", content: "Test Story", props: { level: 1 } },
    {
        type: "text",
        content: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
    `,
    },
    { type: "image", content: "living_room.png" },
    { type: "video", content: "video.mp4" },
    {
        type: "actions",
        content: [
            {
                label: "Action 1",
                action: () => console.log("Action 1 executed"),
            },
            {
                label: "Action 2",
                action: () => console.log("Action 2 executed"),
                isDisabled: true,
                tooltip: {
                    content: "This action is disabled",
                    position: "top",
                    className: "bg-red-500 text-white",
                },
            },
        ],
    },
    { type: "anotherStory", storyId: "anotherStory" },
]);

newStory("anotherStory", () => [
    { type: "header", content: "Another Story", props: { level: 2 } },
    { type: "text", content: "This is another story with different content." },
    {
        type: "conversation",
        props: {
            variant: "messenger",
        },
        content: [
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
        ],
    },
]);
