import type { StoryComponents } from "@react-text-game/core";
import { Game, newStory } from "@react-text-game/core";

import { dragon, player, princessElara } from "@/game/entities";

/**
 * Princess Tower Story
 * Demonstrates:
 * - Optional NPC interaction
 * - Lore revelation (dragon's secret)
 * - Alternative quest path (peaceful resolution hint)
 */
export const princessTower = newStory(
    "princessTower",
    () => {
        if (!princessElara.dialogue.introducedSelf) {
            return getFirstMeetingContent();
        }

        if (!princessElara.dialogue.revealedDragonSecret) {
            return getSecondVisitContent();
        }

        return getReturnVisitContent();
    },
    {
        background: {
            image: "./assets/backgrounds/princess-tower.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/85 backdrop-blur-sm",
        },
    }
);

function getFirstMeetingContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "The Princess's Tower",
            props: { level: 1, className: "text-pink-400" },
        },

        {
            type: "image",
            content: "./assets/npc/princess-elara.webp",
            props: {
                alt: "Princess Elara",
                className: "rounded-lg shadow-lg my-4 max-w-sm mx-auto",
            },
        },

        {
            type: "text",
            content: `The tower chamber is elegant yet modest, filled with books and paintings. At the window stands a young woman with flowing golden hair, gazing out at the distant mountains.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text",
            content: `She turns as you enter, her eyes bright with curiosity. "A visitor? Father rarely lets anyone up here. You must be the knight everyone is talking about."`,
            props: { className: "mb-4" },
        },

        {
            type: "conversation",
            appearance: "byClick",
            props: { variant: "messenger" },
            content: [
                {
                    content:
                        "Princess Elara, I am honored to meet you. I am " +
                        player.name +
                        ".",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "The honor is mine, Sir Knight. I've heard you seek to face the dragon.",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
                {
                    content: "Yes, Your Highness. It threatens the kingdom.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "Does it? Or do we merely assume so because it is a dragon?",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
            ],
        },

        { type: "anotherStory", storyId: "princessFirstMeetingContinue" },
    ];
}

newStory("princessFirstMeetingContinue", () => {
    princessElara.dialogue.introducedSelf = true;

    return [
        {
            type: "text",
            content: `The princess's words give you pause. She seems to know something she isn't saying directly.`,
            props: { className: "italic text-muted-foreground mb-4" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: '"What do you know about the dragon?"',
                    action: () => Game.jumpTo("princessDragonSecret"),
                    color: "primary" as const,
                    variant: "bordered" as const,
                },
                {
                    label: "Take your leave politely",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
});

newStory("princessDragonSecret", () => {
    princessElara.dialogue.revealedDragonSecret = true;
    dragon.dialogue.learnedMotivation = true;

    return [
        {
            type: "header",
            content: "The Dragon's Secret",
            props: { level: 2, className: "text-primary-400" },
        },

        {
            type: "text",
            content: `Elara looks around conspiratorially, then beckons you closer. Her voice drops to a whisper.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "conversation",
            appearance: "byClick",
            props: { variant: "messenger" },
            content: [
                {
                    content:
                        "I have studied the ancient texts. Vexarion was not always a terror. He was once the guardian of this land.",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
                {
                    content: "A guardian? Then why does he attack villages?",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "He doesn't attack - he scares. No one has actually been hurt. He roars, he breathes fire into the sky, but...",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
                {
                    content:
                        "He's lonely. Centuries alone on that mountain. The last of his kind.",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
            ],
        },

        {
            type: "text",
            content: `<p class="text-center text-primary-400 italic my-4">"Perhaps, Sir Knight, the sword is not the only solution."</p>`,
            props: { isHTML: true },
        },

        {
            type: "text",
            content: `<p class="text-center text-success-400">You've learned the dragon's secret!</p>
            <p class="text-center text-muted-foreground">A peaceful resolution may be possible...</p>`,
            props: { isHTML: true, className: "my-4" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: '"Thank you, Princess. This changes everything."',
                    action: () => Game.jumpTo("castleMap"),
                    color: "primary" as const,
                },
            ],
        },
    ];
});

function getSecondVisitContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "The Princess's Tower",
            props: { level: 1, className: "text-pink-400" },
        },

        {
            type: "text",
            content: `Princess Elara smiles as you enter. "Sir ${player.name}, you've returned. Have you more questions about the dragon?"`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: '"Tell me more about Vexarion."',
                    action: () => Game.jumpTo("princessDragonSecret"),
                    color: "primary" as const,
                },
                {
                    label: "Just visiting",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                },
            ],
        },
    ];
}

function getReturnVisitContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "The Princess's Tower",
            props: { level: 1, className: "text-pink-400" },
        },

        {
            type: "text",
            content: `Elara looks up from her book with a warm smile. "Sir Knight! How fares your quest?"`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "conversation",
            appearance: "atOnce",
            props: { variant: "chat" },
            content: [
                {
                    content:
                        "Remember what I told you about Vexarion. Violence is not the only path.",
                    who: {
                        name: princessElara.name,
                        avatar: "./assets/avatars/princess.webp",
                    },
                    side: "left",
                    color: "#FFB6C1",
                },
            ],
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: "Return to the castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                },
            ],
        },
    ];
}
