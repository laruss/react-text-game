import { defineStory, Game } from "@react-text-game/core";

import { player, playerActions } from "@/game/entities";

/**
 * Castle Gardens Story
 * Demonstrates:
 * - Peaceful healing location
 * - Ambient storytelling
 * - Time-based healing with cost/benefit
 */
export const castleGardens = defineStory(
    "castleGardens",
    (h) => {
        const needsHealing = player.health < player.maxHealth;

        return [
            h.header("The Royal Gardens", {
                level: 1,
                className: "text-success-400",
            }),

            h.image("./assets/backgrounds/castle-gardens.webp", {
                alt: "Beautiful royal gardens",
                className: "rounded-lg shadow-lg my-4",
            }),

            h.text(
                `The royal gardens are a sanctuary of peace amidst the stone walls of the castle. Flowering vines climb ancient trellises, and the scent of roses fills the air. A marble fountain burbles softly at the center, its waters said to have healing properties.`,
                { className: "text-lg mb-4" }
            ),

            h.text(
                needsHealing
                    ? `Your wounds ache, reminding you of your mortality. Perhaps some rest in this peaceful place would do you good.`
                    : `You feel strong and healthy. The beauty of the gardens fills you with determination.`,
                {
                    className: needsHealing
                        ? "text-warning-400 italic mb-6"
                        : "text-success-400 italic mb-6",
                }
            ),

            h.text(
                `<p class="text-muted-foreground">Current HP: <span class="${needsHealing ? "text-warning-400" : "text-success-400"}">${player.health}</span> / ${player.maxHealth}</p>`,
                { isHTML: true, className: "text-center mb-6" }
            ),

            h.actions(
                [
                    {
                        content: "Rest by the fountain (+30 HP)",
                        action: () => {
                            playerActions.heal(30);
                            Game.jumpTo("gardensRest");
                        },
                        color: "success",
                        variant: "solid",
                        isDisabled: player.health >= player.maxHealth,
                        tooltip:
                            player.health >= player.maxHealth
                                ? {
                                      content: "You are already at full health",
                                      position: "right",
                                  }
                                : undefined,
                    },
                    {
                        content: "Drink from the healing fountain (+50 HP)",
                        action: () => {
                            playerActions.heal(50);
                            Game.jumpTo("gardensFountain");
                        },
                        color: "primary",
                        variant: "solid",
                        isDisabled: player.health >= player.maxHealth,
                    },
                    {
                        content: "Return to the castle",
                        action: () => Game.jumpTo("castleMap"),
                        color: "default",
                        variant: "bordered",
                    },
                ],
                { direction: "vertical" as const }
            ),
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

defineStory("gardensRest", (h) => [
    h.header("A Moment of Peace", { level: 2, className: "text-success-400" }),
    h.text(
        `You sit on a stone bench beside the fountain, letting the gentle sound of water wash away your fatigue. The warm sun filters through the leaves above, and for a moment, you can almost forget the dangers that await.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+30 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                content: "Rest more",
                action: () => Game.jumpTo("castleGardens"),
                color: "success",
                variant: "bordered",
            },
            {
                content: "Return to castle",
                action: () => Game.jumpTo("castleMap"),
                color: "default",
            },
        ],
        { direction: "horizontal" }
    ),
]);

defineStory("gardensFountain", (h) => [
    h.header("The Healing Waters", { level: 2, className: "text-primary-400" }),
    h.text(
        `You cup the crystal-clear water in your hands and drink deeply. A warm, tingling sensation spreads through your body as the magical waters work their healing.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+50 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                content: "Return to the gardens",
                action: () => Game.jumpTo("castleGardens"),
                color: "success",
            },
            {
                content: "Return to castle",
                action: () => Game.jumpTo("castleMap"),
                color: "default",
            },
        ],
        { direction: "vertical" }
    ),
]);
