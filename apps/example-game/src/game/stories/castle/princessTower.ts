import type { StoryComponents } from "@react-text-game/core";
import { defineStory, Game, storyHelpers } from "@react-text-game/core";

import { dragon, player, princessElara } from "@/game/entities";

/**
 * Princess Tower Story
 * Demonstrates:
 * - Optional NPC interaction
 * - Lore revelation (dragon's secret)
 * - Alternative quest path (peaceful resolution hint)
 */
export const princessTower = defineStory(
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
        storyHelpers.header("The Princess's Tower", {
            level: 1,
            className: "text-pink-400",
        }),

        storyHelpers.image("./assets/npc/princess-elara.webp", {
            alt: "Princess Elara",
            className: "rounded-lg shadow-lg my-4 max-w-sm mx-auto",
        }),

        storyHelpers.text(
            `The tower chamber is elegant yet modest, filled with books and paintings. At the window stands a young woman with flowing golden hair, gazing out at the distant mountains.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `She turns as you enter, her eyes bright with curiosity. "A visitor? Father rarely lets anyone up here. You must be the knight everyone is talking about."`,
            { className: "mb-4" }
        ),

        storyHelpers.conversation(
            [
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
            { appearance: "byClick", variant: "messenger" }
        ),

        storyHelpers.include("princessFirstMeetingContinue"),
    ];
}

defineStory("princessFirstMeetingContinue", (h) => {
    princessElara.dialogue.introducedSelf = true;

    return [
        h.text(
            `The princess's words give you pause. She seems to know something she isn't saying directly.`,
            { className: "italic text-muted-foreground mb-4" }
        ),

        h.actions(
            [
                {
                    content: '"What do you know about the dragon?"',
                    action: () => Game.jumpTo("princessDragonSecret"),
                    color: "primary",
                    variant: "bordered",
                },
                {
                    content: "Take your leave politely",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

defineStory("princessDragonSecret", (h) => {
    princessElara.dialogue.revealedDragonSecret = true;
    dragon.dialogue.learnedMotivation = true;

    return [
        h.header("The Dragon's Secret", {
            level: 2,
            className: "text-primary-400",
        }),

        h.text(
            `Elara looks around conspiratorially, then beckons you closer. Her voice drops to a whisper.`,
            { className: "text-lg mb-4" }
        ),

        h.conversation(
            [
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
            { appearance: "byClick", variant: "messenger" }
        ),

        h.text(
            `<p class="text-center text-primary-400 italic my-4">"Perhaps, Sir Knight, the sword is not the only solution."</p>`,
            { isHTML: true }
        ),

        h.text(
            `<p class="text-center text-success-400">You've learned the dragon's secret!</p>
            <p class="text-center text-muted-foreground">A peaceful resolution may be possible...</p>`,
            { isHTML: true, className: "my-4" }
        ),

        h.actions(
            [
                {
                    content: '"Thank you, Princess. This changes everything."',
                    action: () => Game.jumpTo("castleMap"),
                    color: "primary",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

function getSecondVisitContent(): StoryComponents {
    return [
        storyHelpers.header("The Princess's Tower", {
            level: 1,
            className: "text-pink-400",
        }),

        storyHelpers.text(
            `Princess Elara smiles as you enter. "Sir ${player.name}, you've returned. Have you more questions about the dragon?"`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.actions(
            [
                {
                    content: '"Tell me more about Vexarion."',
                    action: () => Game.jumpTo("princessDragonSecret"),
                    color: "primary",
                },
                {
                    content: "Just visiting",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                },
            ],
            { direction: "vertical" }
        ),
    ];
}

function getReturnVisitContent(): StoryComponents {
    return [
        storyHelpers.header("The Princess's Tower", {
            level: 1,
            className: "text-pink-400",
        }),

        storyHelpers.text(
            `Elara looks up from her book with a warm smile. "Sir Knight! How fares your quest?"`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.conversation(
            [
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
            { appearance: "atOnce", variant: "chat" }
        ),

        storyHelpers.actions(
            [
                {
                    content: "Return to the castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                },
            ],
            { direction: "vertical" }
        ),
    ];
}
