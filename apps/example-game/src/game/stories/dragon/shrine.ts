import { Game, newStory } from "@react-text-game/core";
import { toast } from "sonner";

import { player, playerActions } from "@/game/entities";

/**
 * Dragon Lair Shrine Story
 * Demonstrates:
 * - Environmental lore
 * - Healing location
 * - Optional stat boost
 */
export const dragonLairShrine = newStory(
    "dragonLairShrine",
    () => {
        const hasBlessed = playerActions.hasItem("shrine_blessing");

        return [
            {
                type: "header" as const,
                content: "Ancient Shrine",
                props: { level: 1 as const, className: "text-primary-400" },
            },

            {
                type: "image" as const,
                content: "./assets/backgrounds/ancient-shrine.webp",
                props: {
                    alt: "A mystical shrine in the volcanic cave",
                    className: "rounded-lg shadow-lg my-4",
                },
            },

            {
                type: "text" as const,
                content: `In a quiet alcove away from the heat, you find an ancient shrine. Carved from obsidian, it depicts figures that might be dragons and humans standing together. Offerings of gold and gemstones lie at its base, untouched for centuries.`,
                props: { className: "text-lg mb-4" },
            },

            {
                type: "text" as const,
                content: `A faint magical energy emanates from the shrine, soothing your wounds and calming your mind.`,
                props: { className: "italic text-muted-foreground mb-6" },
            },

            {
                type: "text" as const,
                content: `<p class="text-muted-foreground">Current HP: <span class="${player.health < player.maxHealth ? "text-warning-400" : "text-success-400"}">${player.health}</span> / ${player.maxHealth}</p>`,
                props: { isHTML: true, className: "text-center mb-6" },
            },

            {
                type: "actions" as const,
                props: { direction: "vertical" as const },
                content: [
                    {
                        label: "Pray at the shrine (Full heal)",
                        action: () => {
                            const healAmount = player.maxHealth - player.health;
                            player.health = player.maxHealth;
                            toast.success(`Fully healed! +${healAmount} HP`);
                            Game.jumpTo("shrinePrayer");
                        },
                        color: "success" as const,
                        variant: "solid" as const,
                        isDisabled: player.health >= player.maxHealth,
                        tooltip:
                            player.health >= player.maxHealth
                                ? {
                                      content: "Already at full health",
                                      position: "right" as const,
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
                        color: "primary" as const,
                        variant: "solid" as const,
                        isDisabled: hasBlessed,
                        tooltip: hasBlessed
                            ? {
                                  content:
                                      "You have already received this blessing",
                                  position: "right" as const,
                              }
                            : {
                                  content:
                                      "A one-time blessing from the ancient gods",
                                  position: "right" as const,
                              },
                    },
                    {
                        label: "Return to the lair",
                        action: () => Game.jumpTo("dragonLairMap"),
                        color: "default" as const,
                        variant: "bordered" as const,
                    },
                ],
            },
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

newStory("shrinePrayer", () => [
    {
        type: "header",
        content: "Healing Light",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `A warm, golden light washes over you as you kneel before the shrine. Your wounds close, your fatigue fades, and you feel renewed.`,
        props: { className: "text-lg mb-4 text-center" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">Fully healed!</p>
        <p class="text-center text-muted-foreground">HP: ${player.health}/${player.maxHealth}</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue",
                action: () => Game.jumpTo("dragonLairShrine"),
                color: "primary",
            },
        ],
    },
]);

newStory("shrineBlessing", () => [
    {
        type: "header",
        content: "Ancient Blessing",
        props: { level: 2, className: "text-primary-400" },
    },
    {
        type: "text",
        content: `As you touch the shrine, ancient words echo in your mind - a language long forgotten, yet somehow understood. Power flows into you, strengthening your very essence.`,
        props: { className: "text-lg mb-4 text-center" },
    },
    {
        type: "text",
        content: `<p class="text-center text-primary-400 font-bold">Blessing received!</p>
        <p class="text-center text-success-400">+10 Maximum HP (permanent)</p>
        <p class="text-center text-muted-foreground">New Max HP: ${player.maxHealth}</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue",
                action: () => Game.jumpTo("dragonLairShrine"),
                color: "primary",
            },
        ],
    },
]);
