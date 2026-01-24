import { Game, newStory } from "@react-text-game/core";

import { player, playerActions } from "@/game/entities";

/**
 * Castle Gardens Story
 * Demonstrates:
 * - Peaceful healing location
 * - Ambient storytelling
 * - Time-based healing with cost/benefit
 */
export const castleGardens = newStory(
    "castleGardens",
    () => {
        const needsHealing = player.health < player.maxHealth;

        return [
            {
                type: "header" as const,
                content: "The Royal Gardens",
                props: { level: 1 as const, className: "text-success-400" },
            },

            {
                type: "image" as const,
                content: "./assets/backgrounds/castle-gardens.webp",
                props: {
                    alt: "Beautiful royal gardens",
                    className: "rounded-lg shadow-lg my-4",
                },
            },

            {
                type: "text" as const,
                content: `The royal gardens are a sanctuary of peace amidst the stone walls of the castle. Flowering vines climb ancient trellises, and the scent of roses fills the air. A marble fountain burbles softly at the center, its waters said to have healing properties.`,
                props: { className: "text-lg mb-4" },
            },

            {
                type: "text" as const,
                content: needsHealing
                    ? `Your wounds ache, reminding you of your mortality. Perhaps some rest in this peaceful place would do you good.`
                    : `You feel strong and healthy. The beauty of the gardens fills you with determination.`,
                props: {
                    className: needsHealing
                        ? "text-warning-400 italic mb-6"
                        : "text-success-400 italic mb-6",
                },
            },

            {
                type: "text" as const,
                content: `<p class="text-muted-foreground">Current HP: <span class="${needsHealing ? "text-warning-400" : "text-success-400"}">${player.health}</span> / ${player.maxHealth}</p>`,
                props: { isHTML: true, className: "text-center mb-6" },
            },

            {
                type: "actions" as const,
                props: { direction: "vertical" as const },
                content: [
                    {
                        label: "Rest by the fountain (+30 HP)",
                        action: () => {
                            playerActions.heal(30);
                            Game.jumpTo("gardensRest");
                        },
                        color: "success" as const,
                        variant: "solid" as const,
                        isDisabled: player.health >= player.maxHealth,
                        tooltip:
                            player.health >= player.maxHealth
                                ? {
                                      content: "You are already at full health",
                                      position: "right" as const,
                                  }
                                : undefined,
                    },
                    {
                        label: "Drink from the healing fountain (+50 HP)",
                        action: () => {
                            playerActions.heal(50);
                            Game.jumpTo("gardensFountain");
                        },
                        color: "primary" as const,
                        variant: "solid" as const,
                        isDisabled: player.health >= player.maxHealth,
                    },
                    {
                        label: "Return to the castle",
                        action: () => Game.jumpTo("castleMap"),
                        color: "default" as const,
                        variant: "bordered" as const,
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/garden-bg.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/85 backdrop-blur-sm",
        },
    }
);

newStory("gardensRest", () => [
    {
        type: "header",
        content: "A Moment of Peace",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `You sit on a stone bench beside the fountain, letting the gentle sound of water wash away your fatigue. The warm sun filters through the leaves above, and for a moment, you can almost forget the dangers that await.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+30 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "horizontal" },
        content: [
            {
                label: "Rest more",
                action: () => Game.jumpTo("castleGardens"),
                color: "success",
                variant: "bordered",
            },
            {
                label: "Return to castle",
                action: () => Game.jumpTo("castleMap"),
                color: "default",
            },
        ],
    },
]);

newStory("gardensFountain", () => [
    {
        type: "header",
        content: "The Healing Waters",
        props: { level: 2, className: "text-primary-400" },
    },
    {
        type: "text",
        content: `You cup the crystal-clear water in your hands and drink deeply. A warm, tingling sensation spreads through your body as the magical waters work their healing.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+50 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the gardens",
                action: () => Game.jumpTo("castleGardens"),
                color: "success",
            },
            {
                label: "Return to castle",
                action: () => Game.jumpTo("castleMap"),
                color: "default",
            },
        ],
    },
]);
