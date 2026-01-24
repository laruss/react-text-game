import type { StoryComponents } from "@react-text-game/core";
import { Game, newStory } from "@react-text-game/core";

import {
    elderMarcus,
    environment,
    player,
    playerActions,
} from "@/game/entities";

/**
 * Quest Giver Story - Elder Marcus
 * Demonstrates:
 * - Quest dialogue with state changes
 * - Conditional content based on quest state
 * - AnotherStory component for embedding
 * - Multiple endings based on choices
 * - Unlocking new game locations
 */

// Common description component (demonstrates anotherStory)
newStory("elderHouseDescription", () => [
    {
        type: "text",
        content: `Elder Marcus's home is modest but well-kept. Books and scrolls line the walls, evidence of a scholarly mind. A warm fire crackles in the hearth, casting dancing shadows across the room.`,
        props: { className: "text-base italic text-muted-foreground mb-4" },
    },
]);

export const questGiverStory = newStory(
    "questGiverStory",
    () => {
        elderMarcus.conversationCount++;

        // Different content based on quest state
        if (elderMarcus.questState === "completed") {
            return getCompletedQuestContent();
        }

        if (elderMarcus.questState === "accepted") {
            return getActiveQuestContent();
        }

        // Quest not started or just offered
        return getQuestOfferContent();
    },
    {
        background: {
            image: "./assets/backgrounds/elder-house.webp",
        },
        classNames: {
            base: "min-h-screen",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

// Quest offer content - Part 1: Conversation with Elder Marcus
function getQuestOfferContent(): StoryComponents {
    elderMarcus.dialogue.introducedSelf = true;

    return [
        {
            type: "header",
            content: "Elder Marcus's Home",
            props: { level: 1, className: "" },
        },

        // Embed common description
        { type: "anotherStory", storyId: "elderHouseDescription" },

        // Elder's portrait
        {
            type: "image",
            content: "./assets/characters/elder-marcus.webp",
            props: {
                alt: "Elder Marcus, a wise old man",
                className: "rounded-lg shadow-lg mb-6 max-w-sm mx-auto",
            },
        },

        // Conversation - byClick for dramatic effect
        {
            type: "conversation",
            props: { variant: "messenger", className: "my-6" },
            content: [
                {
                    content: `Ah, ${player.name}! I'm glad you came. Please, sit. We have much to discuss.`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content:
                        "You sent for me, Elder. What troubles the village?",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/knight.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content: `*The Elder's face grows grave* The rumors are true. A dragon has awakened in Mount Doom. But that's not the worst of it...`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content: `Princess Elara, the King's only daughter, ventured north to negotiate with the beast. She believed she could reason with it. She has not returned.`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content:
                        "The Princess? This is dire indeed. What would you have me do?",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/knight.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content: `I need you to go to Castle Valdoria. Speak with the King. Offer your services as a dragon slayer. He will grant you passage to Mount Doom.`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content: `*He reaches into his robes and produces a sealed letter* Take this. It bears my seal and will grant you audience with King Alderon. Will you accept this quest, ${player.name}?`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
            ],
        },

        // Continue action to quest details
        {
            type: "actions",
            props: {
                direction: "horizontal",
                className: "mt-8 justify-center",
            },
            content: [
                {
                    label: "Continue",
                    action: () => Game.jumpTo("questOfferDetails"),
                    color: "primary",
                    variant: "solid",
                },
            ],
        },
    ];
}

// Quest offer content - Part 2: Quest details and acceptance
newStory(
    "questOfferDetails",
    () => [
        {
            type: "header",
            content: "Elder Marcus's Home",
            props: { level: 1, className: "" },
        },

        // Embed common description
        { type: "anotherStory", storyId: "elderHouseDescription" },

        // Quest acceptance actions
        {
            type: "header",
            content: "Quest: The Dragon's Shadow",
            props: { level: 2, className: "mt-6 " },
        },

        {
            type: "text",
            content: `<p class="font-semibold  -mb-6">Objectives:</p>
            <ul class="list-disc list-inside ml-4 -mt-8 ">
                <li>Travel to Castle Valdoria</li>
                <li>Speak with King Alderon III</li>
                <li>Journey to Mount Doom</li>
                <li>Rescue Princess Elara (optional)</li>
                <li>Defeat or negotiate with the dragon Vexarion</li>
            </ul>
            <p class="-mt-10 text-warning-400 ">Reward: 100 gold + Royal recognition</p>`,
            props: { isHTML: true, className: "bg-grey/30 p-4 rounded-lg" },
        },

        // Accept/Decline actions
        {
            type: "actions",
            props: {
                direction: "horizontal",
                className: "mt-8 justify-center gap-4",
            },
            content: [
                {
                    label: "Accept Quest",
                    action: () => {
                        elderMarcus.questState = "accepted";
                        elderMarcus.dialogue.explainedSituation = true;
                        player.quests.mainQuestStarted = true;
                        playerActions.addItem("royal_seal");
                        environment.discoveredLocations.castle = true;
                        environment.worldEvents.dragonAttackAnnounced = true;
                        Game.jumpTo("questAccepted");
                    },
                    color: "success",
                    variant: "solid",
                    className: "px-8",
                },
                {
                    label: "I need to prepare first",
                    action: () => {
                        elderMarcus.questState = "offered";
                        Game.jumpTo("villageMap");
                    },
                    color: "warning",
                    variant: "bordered",
                },
            ],
        },
    ],
    {
        background: {
            image: "./assets/backgrounds/elder-house.webp",
        },
        classNames: {
            base: "min-h-screen",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

// Quest accepted story
newStory("questAccepted", () => [
    {
        type: "header",
        content: "Quest Accepted!",
        props: { level: 1, className: "text-success-400" },
    },
    {
        type: "image",
        content: "./assets/items/royal-seal.webp",
        props: {
            alt: "Elder Marcus's Royal Seal",
            className: "rounded-lg shadow-lg my-6 max-w-xs mx-auto",
            disableModal: true,
        },
    },
    {
        type: "text",
        content: `*Elder Marcus places the sealed letter in your hands. You feel the weight of responsibility settle on your shoulders.*`,
        props: { className: "italic text-center my-4" },
    },
    {
        type: "conversation",
        appearance: "atOnce",
        props: { variant: "chat" },
        content: [
            {
                content: `Thank you, ${player.name}. The kingdom's fate rests in your hands. The castle gates will now be open to you. May the gods guide your blade.`,
                who: {
                    name: "Elder Marcus",
                    avatar: "./assets/avatars/elder-marcus.webp",
                },
                side: "left",
                color: "#8B7355",
            },
        ],
    },
    {
        type: "text",
        content: `<p class="text-center font-bold text-primary-400 my-6">New location discovered: Castle Valdoria!</p>
        <p class="text-center text-muted-foreground">Item received: Elder's Sealed Letter</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Go to World Map",
                action: () => Game.jumpTo("worldMap"),
                color: "primary",
                variant: "solid",
            },
        ],
    },
]);

// Active quest content (already accepted)
function getActiveQuestContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "Elder Marcus's Home",
            props: { level: 1, className: "text-amber-300" },
        },

        { type: "anotherStory", storyId: "elderHouseDescription" },

        {
            type: "conversation",
            appearance: "atOnce",
            props: { variant: "chat" },
            content: [
                {
                    content: `${player.name}! Have you found the Princess? Defeated the dragon?`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content:
                        "Not yet, Elder. I came to prepare further before my journey.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/knight.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content: `Time is of the essence, but wisdom dictates proper preparation. Go, prepare yourself, but do not tarry too long.`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
            ],
        },

        {
            type: "text",
            content: `<p class="text-warning-400 text-center my-4">Quest in progress: The Dragon's Shadow</p>`,
            props: { isHTML: true },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: "Return to Village",
                    action: () => Game.jumpTo("villageMap"),
                    color: "primary",
                },
            ],
        },
    ];
}

// Completed quest content
function getCompletedQuestContent(): StoryComponents {
    // Give reward if not already given
    if (!elderMarcus.dialogue.gaveReward) {
        elderMarcus.dialogue.gaveReward = true;
        playerActions.addGold(elderMarcus.reward.gold);
    }

    return [
        {
            type: "header",
            content: "A Hero's Welcome",
            props: { level: 1, className: "text-success-400" },
        },

        { type: "anotherStory", storyId: "elderHouseDescription" },

        {
            type: "conversation",
            props: { variant: "messenger" },
            content: [
                {
                    content: `${player.name}! The hero of Valdoria returns! Word of your deeds has spread throughout the kingdom!`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
                {
                    content: `I only did what was necessary, Elder.`,
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/knight.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content: `Humble as always. Here, take this reward - you've more than earned it. The kingdom owes you a debt that can never be fully repaid.`,
                    who: {
                        name: "Elder Marcus",
                        avatar: "./assets/avatars/elder-marcus.webp",
                    },
                    side: "left",
                    color: "#8B7355",
                },
            ],
        },

        {
            type: "text",
            content: `<p class="text-center text-success-400 font-bold my-6">Quest Complete: The Dragon's Shadow</p>
            <p class="text-center text-warning-400">Reward received: 100 gold!</p>`,
            props: { isHTML: true },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: "Return to Village",
                    action: () => Game.jumpTo("villageMap"),
                    color: "primary",
                },
            ],
        },
    ];
}
