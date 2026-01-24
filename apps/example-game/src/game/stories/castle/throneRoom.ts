import type { StoryComponents } from "@react-text-game/core";
import { Game, newStory } from "@react-text-game/core";

import { environment, kingAlderon, npcActions, player } from "@/game/entities";

/**
 * Throne Room Story
 * Demonstrates:
 * - Complex NPC dialogue with state machine
 * - anotherStory embedding for nested content
 * - Quest progression
 * - Multiple dialogue branches
 */
export const throneRoom = newStory(
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
        {
            type: "header",
            content: "The Throne Room",
            props: { level: 1, className: "text-warning-400" },
        },

        {
            type: "image",
            content: "./assets/npc/king-alderon.webp",
            props: {
                alt: "King Alderon III on his throne",
                className: "rounded-lg shadow-lg my-6 max-w-md mx-auto",
            },
        },

        {
            type: "text",
            content: `The grand throne room stretches before you, its vaulted ceiling supported by massive stone pillars. Tapestries depicting the kingdom's history line the walls, and a red carpet leads to the imposing throne where King Alderon III sits, his crown gleaming in the torchlight.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text",
            content: `<p class="font-semibold text-warning-400">"Approach, knight,"</p> the King commands, his voice echoing through the chamber. <p class="text-muted-foreground">"I have heard of your arrival. The Elder Marcus sent word ahead."</p>`,
            props: { isHTML: true, className: "mb-6" },
        },

        {
            type: "conversation",
            appearance: "byClick",
            props: { variant: "messenger" },
            content: [
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
        },

        { type: "anotherStory", storyId: "throneRoomDecision" },
    ];
}

// Decision point after initial dialogue
newStory("throneRoomDecision", () => {
    npcActions.incrementConversation(kingAlderon);
    kingAlderon.dialogue.gaveAudience = true;
    player.quests.talkedToKing = true;

    return [
        {
            type: "text",
            content: `The King leans forward, studying you intently. "I will make you an offer, knight. Prove yourself worthy, and I shall grant you my blessing and access to the Royal Armory."`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "header",
            content: "The King's Challenge",
            props: { level: 2, className: "text-primary-400" },
        },

        {
            type: "text",
            content: `"Tell me, knight - what drives you to face such danger? Is it glory? Gold? Or something more?"`,
            props: { className: "italic text-muted-foreground mb-6" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: '"I seek to protect the innocent."',
                    action: () => {
                        kingAlderon.mood = "pleased";
                        Game.jumpTo("throneRoomNobleAnswer");
                    },
                    color: "primary" as const,
                    variant: "bordered" as const,
                },
                {
                    label: '"I seek glory and honor."',
                    action: () => {
                        kingAlderon.mood = "stern";
                        Game.jumpTo("throneRoomGloryAnswer");
                    },
                    color: "secondary" as const,
                    variant: "bordered" as const,
                },
                {
                    label: '"I seek the dragon\'s treasure."',
                    action: () => {
                        kingAlderon.mood = "angry";
                        Game.jumpTo("throneRoomGreedyAnswer");
                    },
                    color: "warning" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
});

// Noble answer - immediate blessing
newStory("throneRoomNobleAnswer", () => [
    {
        type: "image",
        content: "./assets/npc/king-pleased.webp",
        props: {
            alt: "King Alderon smiles approvingly",
            className: "rounded-lg shadow-lg my-4 max-w-xs mx-auto",
        },
    },

    {
        type: "text",
        content: `The King's stern expression softens, and he nods slowly. "A noble answer. Such selflessness is rare in these troubled times."`,
        props: { className: "text-lg mb-4" },
    },

    {
        type: "conversation",
        appearance: "byClick",
        props: { variant: "messenger" },
        content: [
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
    },

    { type: "anotherStory", storyId: "receiveBlessing" },
]);

// Glory answer - need to prove further
newStory("throneRoomGloryAnswer", () => [
    {
        type: "text",
        content: `The King's eyes narrow slightly. "Glory fades, knight. Songs are forgotten. I need to know you will not flee when the dragon's fire bears down upon you."`,
        props: { className: "text-lg mb-4" },
    },

    {
        type: "text",
        content: `"Return to me after you have equipped yourself properly. Visit my armory - you have my permission. Let us see if you can find the courage to match your ambition."`,
        props: { className: "mb-6" },
    },

    {
        type: "text",
        content: `<p class="text-center text-primary-400">You may now access the Royal Armory</p>`,
        props: { isHTML: true, className: "my-4" },
    },

    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the castle",
                action: () => Game.jumpTo("castleMap"),
                color: "primary" as const,
            },
        ],
    },
]);

// Greedy answer - must do more to prove worth
newStory("throneRoomGreedyAnswer", () => [
    {
        type: "text",
        content: `The King's face hardens, and he grips the arms of his throne. "Treasure? You would risk your life for gold?"`,
        props: { className: "text-lg mb-4 text-danger-300" },
    },

    {
        type: "conversation",
        appearance: "byClick",
        props: { variant: "messenger" },
        content: [
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
    },

    {
        type: "text",
        content: `<p class="text-center text-muted-foreground italic">You may now visit Princess Elara's Tower</p>`,
        props: { isHTML: true, className: "my-4" },
    },

    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Leave the throne room",
                action: () => Game.jumpTo("castleMap"),
                color: "default" as const,
            },
        ],
    },
]);

// Receive blessing scene
newStory("receiveBlessing", () => {
    // Grant the blessing
    player.quests.hasRoyalBlessing = true;
    kingAlderon.dialogue.gaveBlessing = true;
    kingAlderon.blessingGiven = true;
    environment.discoveredLocations.dragonLair = true;

    return [
        {
            type: "header",
            content: "The King's Blessing",
            props: { level: 2, className: "text-warning-400" },
        },

        {
            type: "text",
            content: `King Alderon rises from his throne and draws his ceremonial sword. He places the flat of the blade on your shoulders.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text",
            content: `<p class="text-center italic text-warning-400">"By the power vested in me as King of Valdoria, I grant you my blessing. May the light of our ancestors guide your blade and shield your heart."</p>`,
            props: { isHTML: true, className: "my-6 text-lg" },
        },

        {
            type: "text",
            content: `<p class="text-center text-success-400 font-bold">Received: Royal Blessing</p>
            <p class="text-center text-primary-400">Dragon's Lair is now accessible!</p>
            <p class="text-center text-warning-400">Royal Armory is now unlocked!</p>`,
            props: { isHTML: true, className: "my-4" },
        },

        {
            type: "text",
            content: `"The dragon's lair lies to the northeast, on Mount Doom. My scouts will guide you to its location. Go now, and may you return victorious."`,
            props: { className: "mb-6" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: "Visit the Royal Armory first",
                    action: () => Game.jumpTo("castleArmory"),
                    color: "warning" as const,
                    variant: "solid" as const,
                },
                {
                    label: "Head to the Dragon's Lair immediately",
                    action: () => Game.jumpTo("worldMap"),
                    color: "danger" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
});

// Return visit content
function getReturnVisitContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "The Throne Room",
            props: { level: 1, className: "text-warning-400" },
        },

        {
            type: "text",
            content: `King Alderon looks up as you approach. "${player.name}, you have returned. Are you ready to prove yourself?"`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: '"I am ready, Your Majesty."',
                    action: () => {
                        kingAlderon.mood = "pleased";
                        Game.jumpTo("receiveBlessing");
                    },
                    color: "primary" as const,
                },
                {
                    label: "I need more time to prepare",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
}

// Already blessed content
function getBlessedContent(): StoryComponents {
    return [
        {
            type: "header",
            content: "The Throne Room",
            props: { level: 1, className: "text-warning-400" },
        },

        {
            type: "text",
            content: `King Alderon nods as you enter. "Knight, you bear my blessing. The dragon awaits. Why do you linger?"`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "conversation",
            appearance: "atOnce",
            props: { variant: "chat" },
            content: [
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
        },

        {
            type: "actions",
            props: { direction: "horizontal" },
            content: [
                {
                    label: "Return to Castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                },
                {
                    label: "Head to Dragon's Lair",
                    action: () => Game.jumpTo("worldMap"),
                    color: "danger" as const,
                },
            ],
        },
    ];
}
