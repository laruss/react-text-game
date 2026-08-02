import type { StoryComponents } from "@react-text-game/core";
import { defineStory, Game, storyHelpers } from "@react-text-game/core";

import { environment, kingAlderon, npcActions, player } from "@/game/entities";

/**
 * Throne Room Story
 * Demonstrates:
 * - Complex NPC dialogue with state machine
 * - anotherStory embedding for nested content
 * - Quest progression
 * - Multiple dialogue branches
 */
export const throneRoom = defineStory(
    "throneRoom",
    () => {
        // First visit - seeking audience
        if (!kingAlderon.dialogue.gaveAudience) {
            return getFirstAudienceContent();
        }

        // Has blessing - ready for quest
        if (player.quests.hasRoyalBlessing) {
            return getBlessedContent();
        }

        // Talked but no blessing yet
        return getReturnVisitContent();
    },
    {
        background: {
            image: "./assets/backgrounds/throne-room.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

function getFirstAudienceContent(): StoryComponents {
    return [
        storyHelpers.header("The Throne Room", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.image("./assets/npc/king-alderon.webp", {
            alt: "King Alderon III on his throne",
            className: "rounded-lg shadow-lg my-6 max-w-md mx-auto",
        }),

        storyHelpers.text(
            `The grand throne room stretches before you, its vaulted ceiling supported by massive stone pillars. Tapestries depicting the kingdom's history line the walls, and a red carpet leads to the imposing throne where King Alderon III sits, his crown gleaming in the torchlight.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `<p class="font-semibold text-warning-400">"Approach, knight,"</p> the King commands, his voice echoing through the chamber. <p class="text-muted-foreground">"I have heard of your arrival. The Elder Marcus sent word ahead."</p>`,
            { isHTML: true, className: "mb-6" }
        ),

        storyHelpers.conversation(
            [
                {
                    content:
                        "Your Majesty, I come seeking your blessing to face the dragon Vexarion.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "Bold words from a young knight. Many have sought to slay Vexarion. None have returned.",
                    who: {
                        name: kingAlderon.name,
                        avatar: "./assets/avatars/king.webp",
                    },
                    side: "left",
                    color: "#FFD700",
                },
                {
                    content:
                        "I understand the risks, Your Majesty. But I cannot stand idle while the kingdom suffers.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "Hmm. Your courage is admirable. But courage alone will not defeat a dragon.",
                    who: {
                        name: kingAlderon.name,
                        avatar: "./assets/avatars/king.webp",
                    },
                    side: "left",
                    color: "#FFD700",
                },
            ],
            { appearance: "byClick", variant: "messenger" }
        ),

        storyHelpers.include("throneRoomDecision"),
    ];
}

// Decision point after initial dialogue
defineStory("throneRoomDecision", (h) => {
    npcActions.incrementConversation(kingAlderon);
    kingAlderon.dialogue.gaveAudience = true;
    player.quests.talkedToKing = true;

    return [
        h.text(
            `The King leans forward, studying you intently. "I will make you an offer, knight. Prove yourself worthy, and I shall grant you my blessing and access to the Royal Armory."`,
            { className: "text-lg mb-4" }
        ),

        h.header("The King's Challenge", {
            level: 2,
            className: "text-primary-400",
        }),

        h.text(
            `"Tell me, knight - what drives you to face such danger? Is it glory? Gold? Or something more?"`,
            { className: "italic text-muted-foreground mb-6" }
        ),

        h.actions(
            [
                {
                    content: '"I seek to protect the innocent."',
                    action: () => {
                        kingAlderon.mood = "pleased";
                        Game.jumpTo("throneRoomNobleAnswer");
                    },
                    color: "primary",
                    variant: "bordered",
                },
                {
                    content: '"I seek glory and honor."',
                    action: () => {
                        kingAlderon.mood = "stern";
                        Game.jumpTo("throneRoomGloryAnswer");
                    },
                    color: "secondary",
                    variant: "bordered",
                },
                {
                    content: '"I seek the dragon\'s treasure."',
                    action: () => {
                        kingAlderon.mood = "angry";
                        Game.jumpTo("throneRoomGreedyAnswer");
                    },
                    color: "warning",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

// Noble answer - immediate blessing
defineStory("throneRoomNobleAnswer", (h) => [
    h.image("./assets/npc/king-pleased.webp", {
        alt: "King Alderon smiles approvingly",
        className: "rounded-lg shadow-lg my-4 max-w-xs mx-auto",
    }),

    h.text(
        `The King's stern expression softens, and he nods slowly. "A noble answer. Such selflessness is rare in these troubled times."`,
        { className: "text-lg mb-4" }
    ),

    h.conversation(
        [
            {
                content:
                    "You have the heart of a true knight. Rise, and receive my blessing.",
                who: {
                    name: kingAlderon.name,
                    avatar: "./assets/avatars/king.webp",
                },
                side: "left",
                color: "#FFD700",
            },
        ],
        { appearance: "byClick", variant: "messenger" }
    ),

    h.include("receiveBlessing"),
]);

// Glory answer - need to prove further
defineStory("throneRoomGloryAnswer", (h) => [
    h.text(
        `The King's eyes narrow slightly. "Glory fades, knight. Songs are forgotten. I need to know you will not flee when the dragon's fire bears down upon you."`,
        { className: "text-lg mb-4" }
    ),

    h.text(
        `"Return to me after you have equipped yourself properly. Visit my armory - you have my permission. Let us see if you can find the courage to match your ambition."`,
        { className: "mb-6" }
    ),

    h.text(
        `<p class="text-center text-primary-400">You may now access the Royal Armory</p>`,
        { isHTML: true, className: "my-4" }
    ),

    h.actions(
        [
            {
                content: "Return to the castle",
                action: () => Game.jumpTo("castleMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

// Greedy answer - must do more to prove worth
defineStory("throneRoomGreedyAnswer", (h) => [
    h.text(
        `The King's face hardens, and he grips the arms of his throne. "Treasure? You would risk your life for gold?"`,
        { className: "text-lg mb-4 text-danger-300" }
    ),

    h.conversation(
        [
            {
                content:
                    "I should have you thrown from this castle. But perhaps there is hope for you yet.",
                who: {
                    name: kingAlderon.name,
                    avatar: "./assets/avatars/king.webp",
                },
                side: "left",
                color: "#FFD700",
            },
            {
                content:
                    "Speak with my daughter, Princess Elara. Perhaps she can teach you what truly matters.",
                who: {
                    name: kingAlderon.name,
                    avatar: "./assets/avatars/king.webp",
                },
                side: "left",
                color: "#FFD700",
            },
        ],
        { appearance: "byClick", variant: "messenger" }
    ),

    h.text(
        `<p class="text-center text-muted-foreground italic">You may now visit Princess Elara's Tower</p>`,
        { isHTML: true, className: "my-4" }
    ),

    h.actions(
        [
            {
                content: "Leave the throne room",
                action: () => Game.jumpTo("castleMap"),
                color: "default",
            },
        ],
        { direction: "vertical" }
    ),
]);

// Receive blessing scene
defineStory("receiveBlessing", (h) => {
    // Grant the blessing
    player.quests.hasRoyalBlessing = true;
    kingAlderon.dialogue.gaveBlessing = true;
    kingAlderon.blessingGiven = true;
    environment.discoveredLocations.dragonLair = true;

    return [
        h.header("The King's Blessing", {
            level: 2,
            className: "text-warning-400",
        }),

        h.text(
            `King Alderon rises from his throne and draws his ceremonial sword. He places the flat of the blade on your shoulders.`,
            { className: "text-lg mb-4" }
        ),

        h.text(
            `<p class="text-center italic text-warning-400">"By the power vested in me as King of Valdoria, I grant you my blessing. May the light of our ancestors guide your blade and shield your heart."</p>`,
            { isHTML: true, className: "my-6 text-lg" }
        ),

        h.text(
            `<p class="text-center text-success-400 font-bold">Received: Royal Blessing</p>
            <p class="text-center text-primary-400">Dragon's Lair is now accessible!</p>
            <p class="text-center text-warning-400">Royal Armory is now unlocked!</p>`,
            { isHTML: true, className: "my-4" }
        ),

        h.text(
            `"The dragon's lair lies to the northeast, on Mount Doom. My scouts will guide you to its location. Go now, and may you return victorious."`,
            { className: "mb-6" }
        ),

        h.actions(
            [
                {
                    content: "Visit the Royal Armory first",
                    action: () => Game.jumpTo("castleArmory"),
                    color: "warning",
                    variant: "solid",
                },
                {
                    content: "Head to the Dragon's Lair immediately",
                    action: () => Game.jumpTo("worldMap"),
                    color: "danger",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

// Return visit content
function getReturnVisitContent(): StoryComponents {
    return [
        storyHelpers.header("The Throne Room", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.text(
            `King Alderon looks up as you approach. "${player.name}, you have returned. Are you ready to prove yourself?"`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.actions(
            [
                {
                    content: '"I am ready, Your Majesty."',
                    action: () => {
                        kingAlderon.mood = "pleased";
                        Game.jumpTo("receiveBlessing");
                    },
                    color: "primary",
                },
                {
                    content: "I need more time to prepare",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" }
        ),
    ];
}

// Already blessed content
function getBlessedContent(): StoryComponents {
    return [
        storyHelpers.header("The Throne Room", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.text(
            `King Alderon nods as you enter. "Knight, you bear my blessing. The dragon awaits. Why do you linger?"`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.conversation(
            [
                {
                    content:
                        "I wanted to pay my respects before I depart, Your Majesty.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "Honorable. Go then, with the kingdom's hopes riding on your shoulders.",
                    who: {
                        name: kingAlderon.name,
                        avatar: "./assets/avatars/king.webp",
                    },
                    side: "left",
                    color: "#FFD700",
                },
            ],
            { appearance: "atOnce", variant: "chat" }
        ),

        storyHelpers.actions(
            [
                {
                    content: "Return to Castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                },
                {
                    content: "Head to Dragon's Lair",
                    action: () => Game.jumpTo("worldMap"),
                    color: "danger",
                },
            ],
            { direction: "horizontal" }
        ),
    ];
}
