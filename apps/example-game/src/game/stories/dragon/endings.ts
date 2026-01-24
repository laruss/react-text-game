import { Game, newStory } from "@react-text-game/core";

import {
    elderMarcus,
    environment,
    musicVictory,
    player,
    playerActions,
    princessElara,
    switchBgMusic,
} from "@/game/entities";

/**
 * Game Endings
 * Demonstrates:
 * - Multiple ending scenarios
 * - Different outcomes based on player choices
 * - Epilogue content
 */

// Ending: Dragon Slain (combat victory)
newStory(
    "endingDragonSlain",
    () => {
        // Play victory music
        switchBgMusic(musicVictory);

        // Complete the quest
        player.quests.mainQuestComplete = true;
        elderMarcus.questState = "completed";
        environment.worldEvents.dragonDefeated = true;

        // Reward
        playerActions.addGold(500);
        playerActions.addItem("dragon_heart");

        return [
            {
                type: "header",
                content: "Victory!",
                props: { level: 1, className: "text-warning-400" },
            },

            {
                type: "image",
                content: "./assets/backgrounds/ending-victory.webp",
                props: {
                    alt: "The hero stands victorious",
                    className: "rounded-lg shadow-lg my-6",
                },
            },

            {
                type: "text",
                content: `The dragon Vexarion is slain. As the beast's final breath rattles through the chamber, you feel... empty. Was this truly necessary?`,
                props: { className: "text-lg mb-4" },
            },

            {
                type: "text",
                content: `You return to the kingdom as a hero. Songs are sung of your valor. The King honors you with gold and title. But sometimes, late at night, you wonder if there might have been another way.`,
                props: { className: "mb-6" },
            },

            {
                type: "text",
                content: `<p class="text-center text-warning-400 font-bold text-xl my-6">ENDING: THE DRAGON SLAYER</p>
                <p class="text-center text-success-400">+500 Gold</p>
                <p class="text-center text-muted-foreground">Quest Complete: The Dragon's Shadow</p>`,
                props: { isHTML: true },
            },

            {
                type: "header",
                content: "Epilogue",
                props: { level: 2, className: "text-muted-foreground" },
            },

            {
                type: "text",
                content: `Years later, you would learn from ancient texts that Vexarion was the last of his kind - a guardian dragon who had protected Valdoria for centuries. His death marked the end of an age.`,
                props: { className: "italic text-muted-foreground mb-6" },
            },

            {
                type: "actions",
                props: { direction: "vertical" },
                content: [
                    {
                        label: "Return to Main Menu",
                        action: () => Game.jumpTo("mainMenu"),
                        color: "primary",
                    },
                    {
                        label: "Continue Exploring",
                        action: () => Game.jumpTo("worldMap"),
                        color: "default",
                        variant: "bordered",
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/ending-bg.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/95 backdrop-blur-sm",
        },
    }
);

// Ending: Peaceful Resolution
newStory(
    "endingPeaceful",
    () => {
        // Play victory music
        switchBgMusic(musicVictory);

        // Complete the quest
        player.quests.mainQuestComplete = true;
        elderMarcus.questState = "completed";

        // Reward (different from combat)
        playerActions.addGold(300);
        playerActions.addItem("dragon_scale_gift");

        return [
            {
                type: "header",
                content: "Peace Restored",
                props: { level: 1, className: "text-success-400" },
            },

            {
                type: "image",
                content: "./assets/backgrounds/ending-peace.webp",
                props: {
                    alt: "Dragon and humans in harmony",
                    className: "rounded-lg shadow-lg my-6",
                },
            },

            {
                type: "text",
                content: `You return to the kingdom not with a dragon's head, but with something far more valuable - peace. King Alderon is skeptical at first, but Princess Elara speaks on your behalf.`,
                props: { className: "text-lg mb-4" },
            },

            {
                type: "conversation",
                appearance: "byClick",
                props: { variant: "messenger" },
                content: [
                    {
                        content:
                            "Sir " +
                            player.name +
                            " has done what no warrior could. He has given us a future where we need not live in fear.",
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
                content: `In time, Vexarion becomes a symbol of Valdoria - no longer a terror, but a guardian once more. You are hailed not as a dragon slayer, but as a peacemaker.`,
                props: { className: "mb-6" },
            },

            {
                type: "text",
                content: `<p class="text-center text-success-400 font-bold text-xl my-6">ENDING: THE PEACEMAKER</p>
                <p class="text-center text-success-400">+300 Gold</p>
                <p class="text-center text-primary-400">Received: Dragon Scale (gift of friendship)</p>
                <p class="text-center text-muted-foreground">Quest Complete: The Dragon's Shadow</p>`,
                props: { isHTML: true },
            },

            {
                type: "header",
                content: "Epilogue",
                props: { level: 2, className: "text-success-400" },
            },

            {
                type: "text",
                content: `The alliance between dragon and kingdom endures for generations. Children grow up hearing tales of the knight who chose compassion over violence, and of the dragon who remembered what it meant to have friends.`,
                props: { className: "italic text-success-300 mb-6" },
            },

            {
                type: "actions",
                props: { direction: "vertical" },
                content: [
                    {
                        label: "Return to Main Menu",
                        action: () => Game.jumpTo("mainMenu"),
                        color: "primary",
                    },
                    {
                        label: "Continue Exploring",
                        action: () => Game.jumpTo("worldMap"),
                        color: "default",
                        variant: "bordered",
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/ending-bg-peace.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/95 backdrop-blur-sm",
        },
    }
);

// Ending: Defeat (game over)
newStory(
    "endingDefeat",
    () => [
        {
            type: "header",
            content: "Defeat",
            props: { level: 1, className: "text-danger-400" },
        },

        {
            type: "image",
            content: "./assets/backgrounds/ending-defeat.webp",
            props: {
                alt: "Fallen hero",
                className: "rounded-lg shadow-lg my-6",
            },
        },

        {
            type: "text",
            content: `The dragon's fire was too fierce, your blade too slow. As darkness claims you, your last thought is of the kingdom you failed to save.`,
            props: { className: "text-lg mb-4 text-danger-300" },
        },

        {
            type: "text",
            content: `<p class="text-center text-danger-400 font-bold text-xl my-6">GAME OVER</p>
            <p class="text-center text-muted-foreground">The dragon continues its reign of terror...</p>`,
            props: { isHTML: true },
        },

        {
            type: "actions",
            props: { direction: "vertical" },
            content: [
                {
                    label: "Load Last Save",
                    action: () => Game.jumpTo("saveLoadWidget"),
                    color: "primary",
                },
                {
                    label: "Return to Main Menu",
                    action: () => Game.jumpTo("mainMenu"),
                    color: "default",
                    variant: "bordered",
                },
            ],
        },
    ],
    {
        background: {
            image: "./assets/backgrounds/ending-defeat.webp",
        },
        classNames: {
            base: "min-h-screen bg-red-950",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/95 backdrop-blur-sm",
        },
    }
);
