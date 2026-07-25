import { defineStory, Game } from "@react-text-game/core";
import { toast } from "sonner";

import { player, playerActions } from "@/game/entities";

/**
 * Dragon Lair Shrine Story
 * Demonstrates:
 * - Environmental lore
 * - Healing location
 * - Optional stat boost
 */
export const dragonLairShrine = defineStory(
    "dragonLairShrine",
    (h) => {
        const hasBlessed = playerActions.hasItem("shrine_blessing");

        return [
            h.header("Ancient Shrine", {
                level: 1,
                className: "text-primary-400",
            }),

            h.image("./assets/backgrounds/ancient-shrine.webp", {
                alt: "A mystical shrine in the volcanic cave",
                className: "rounded-lg shadow-lg my-4",
            }),

            h.text(
                `In a quiet alcove away from the heat, you find an ancient shrine. Carved from obsidian, it depicts figures that might be dragons and humans standing together. Offerings of gold and gemstones lie at its base, untouched for centuries.`,
                { className: "text-lg mb-4" }
            ),

            h.text(
                `A faint magical energy emanates from the shrine, soothing your wounds and calming your mind.`,
                { className: "italic text-muted-foreground mb-6" }
            ),

            h.text(
                `<p class="text-muted-foreground">Current HP: <span class="${player.health < player.maxHealth ? "text-warning-400" : "text-success-400"}">${player.health}</span> / ${player.maxHealth}</p>`,
                { isHTML: true, className: "text-center mb-6" }
            ),

            h.actions(
                [
                    {
                        label: "Pray at the shrine (Full heal)",
                        action: () => {
                            const healAmount = player.maxHealth - player.health;
                            player.health = player.maxHealth;
                            toast.success(`Fully healed! +${healAmount} HP`);
                            Game.jumpTo("shrinePrayer");
                        },
                        color: "success",
                        variant: "solid",
                        isDisabled: player.health >= player.maxHealth,
                        tooltip:
                            player.health >= player.maxHealth
                                ? {
                                      content: "Already at full health",
                                      position: "right",
                                  }
                                : undefined,
                    },
                    {
                        label: hasBlessed
                            ? "Receive blessing (already blessed)"
                            : "Receive blessing (+10 max HP permanently)",
                        action: () => {
                            playerActions.addItem("shrine_blessing");
                            player.maxHealth += 10;
                            player.health += 10;
                            toast.success("Max HP increased by 10!");
                            Game.jumpTo("shrineBlessing");
                        },
                        color: "primary",
                        variant: "solid",
                        isDisabled: hasBlessed,
                        tooltip: hasBlessed
                            ? {
                                  content:
                                      "You have already received this blessing",
                                  position: "right",
                              }
                            : {
                                  content:
                                      "A one-time blessing from the ancient gods",
                                  position: "right",
                              },
                    },
                    {
                        label: "Return to the lair",
                        action: () => Game.jumpTo("dragonLairMap"),
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
            image: "./assets/backgrounds/shrine-bg.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/85 backdrop-blur-sm",
        },
    }
);

defineStory("shrinePrayer", (h) => [
    h.header("Healing Light", { level: 2, className: "text-success-400" }),
    h.text(
        `A warm, golden light washes over you as you kneel before the shrine. Your wounds close, your fatigue fades, and you feel renewed.`,
        { className: "text-lg mb-4 text-center" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">Fully healed!</p>
        <p class="text-center text-muted-foreground">HP: ${player.health}/${player.maxHealth}</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                label: "Continue",
                action: () => Game.jumpTo("dragonLairShrine"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("shrineBlessing", (h) => [
    h.header("Ancient Blessing", { level: 2, className: "text-primary-400" }),
    h.text(
        `As you touch the shrine, ancient words echo in your mind - a language long forgotten, yet somehow understood. Power flows into you, strengthening your very essence.`,
        { className: "text-lg mb-4 text-center" }
    ),
    h.text(
        `<p class="text-center text-primary-400 font-bold">Blessing received!</p>
        <p class="text-center text-success-400">+10 Maximum HP (permanent)</p>
        <p class="text-center text-muted-foreground">New Max HP: ${player.maxHealth}</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                label: "Continue",
                action: () => Game.jumpTo("dragonLairShrine"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);
