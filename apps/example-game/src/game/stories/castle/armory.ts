import { Game, newStory } from "@react-text-game/core";
import { toast } from "sonner";

import { player, playerActions } from "@/game/entities";

/**
 * Castle Armory Story
 * Demonstrates:
 * - Premium shop with expensive items
 * - Conditional availability based on quest state
 * - Special "dragon slayer" weapon
 */
export const castleArmory = newStory(
    "castleArmory",
    () => {
        // Check if player has access
        if (!player.quests.hasRoyalBlessing && !player.quests.talkedToKing) {
            return getRestrictedContent();
        }

        return getArmoryContent();
    },
    {
        background: {
            image: "./assets/backgrounds/armory.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

function getRestrictedContent() {
    return [
        {
            type: "header" as const,
            content: "Royal Armory",
            props: { level: 1 as const, className: "text-danger-400" },
        },

        {
            type: "text" as const,
            content: `Two heavily armored guards block your path, their halberds crossed before the ornate doors.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `<p class="font-semibold text-danger-400">"Halt! The Royal Armory is restricted to those with the King's permission."</p>`,
            props: { isHTML: true, className: "mb-6" },
        },

        {
            type: "actions" as const,
            props: { direction: "vertical" as const },
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

function getArmoryContent() {
    const hasDragonSlayer = playerActions.hasItem("dragon_slayer");
    const hasRoyalArmor = playerActions.hasItem("royal_armor");

    return [
        {
            type: "header" as const,
            content: "The Royal Armory",
            props: { level: 1 as const, className: "text-warning-400" },
        },

        {
            type: "image" as const,
            content: "./assets/backgrounds/armory-interior.webp",
            props: {
                alt: "Rows of legendary weapons and armor",
                className: "rounded-lg shadow-lg my-4",
            },
        },

        {
            type: "text" as const,
            content: `The armory is filled with weapons and armor of legendary quality. Swords that gleam with magical enchantments, shields bearing the royal crest, and armor crafted by master smiths line the walls.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `A royal armorer approaches you. "Ah, the knight who bears the King's blessing. I've been instructed to outfit you for your quest. Choose wisely."`,
            props: { className: "mb-6" },
        },

        {
            type: "header" as const,
            content: "Available Equipment",
            props: { level: 2 as const, className: "text-primary-400" },
        },

        {
            type: "text" as const,
            content: `<p class="text-muted-foreground mb-4">Your gold: <span class="text-warning-400 font-bold">${player.gold}</span></p>`,
            props: { isHTML: true },
        },

        {
            type: "actions" as const,
            props: { direction: "vertical" as const },
            content: [
                // Dragon Slayer Sword - the ultimate weapon
                {
                    label: `Dragon Slayer Sword - 200 gold ${hasDragonSlayer ? "(Owned)" : ""}`,
                    action: () => {
                        if (playerActions.spendGold(200)) {
                            playerActions.addItem("dragon_slayer");
                            playerActions.equipWeapon("dragon_slayer");
                            Game.jumpTo("armoryPurchaseDragonSlayer");
                        }
                    },
                    color: "warning" as const,
                    variant: "solid" as const,
                    isDisabled: player.gold < 200 || hasDragonSlayer,
                    tooltip:
                        player.gold < 200 && !hasDragonSlayer
                            ? {
                                  content: `Need ${200 - player.gold} more gold`,
                                  position: "right" as const,
                              }
                            : hasDragonSlayer
                              ? {
                                    content: "You already own this weapon",
                                    position: "right" as const,
                                }
                              : {
                                    content:
                                        "A legendary blade forged to slay dragons (+40 Attack)",
                                    position: "right" as const,
                                },
                },
                // Royal Plate Armor
                {
                    label: `Royal Plate Armor - 150 gold ${hasRoyalArmor ? "(Owned)" : ""}`,
                    action: () => {
                        if (playerActions.spendGold(150)) {
                            playerActions.addItem("royal_armor");
                            playerActions.equipArmor("royal_armor");
                            const oldDefense = player.defense;
                            player.defense += 25;
                            toast.success(
                                `Royal bonus! Defense: ${oldDefense} → ${player.defense}`
                            );
                            Game.jumpTo("armoryPurchaseArmor");
                        }
                    },
                    color: "primary" as const,
                    variant: "solid" as const,
                    isDisabled: player.gold < 150 || hasRoyalArmor,
                    tooltip:
                        player.gold < 150 && !hasRoyalArmor
                            ? {
                                  content: `Need ${150 - player.gold} more gold`,
                                  position: "right" as const,
                              }
                            : hasRoyalArmor
                              ? {
                                    content: "You already own this armor",
                                    position: "right" as const,
                                }
                              : {
                                    content:
                                        "The finest armor in the kingdom (+25 Defense)",
                                    position: "right" as const,
                                },
                },
                // Health potions (can buy multiple)
                {
                    label: "Greater Health Potion - 30 gold",
                    action: () => {
                        if (playerActions.spendGold(30)) {
                            playerActions.addItem("greater_health_potion");
                            Game.jumpTo("armoryPurchasePotion");
                        }
                    },
                    color: "success" as const,
                    variant: "bordered" as const,
                    isDisabled: player.gold < 30,
                    tooltip:
                        player.gold < 30
                            ? {
                                  content: `Need ${30 - player.gold} more gold`,
                                  position: "right" as const,
                              }
                            : {
                                  content: "Restores 50 HP when used",
                                  position: "right" as const,
                              },
                },
                {
                    label: "Return to Castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
}

// Purchase confirmations
newStory("armoryPurchaseDragonSlayer", () => [
    {
        type: "header",
        content: "Legendary Weapon Acquired!",
        props: { level: 2, className: "text-warning-400" },
    },
    {
        type: "image",
        content: "./assets/items/dragon-slayer.webp",
        props: {
            alt: "The Dragon Slayer sword",
            className: "rounded-lg shadow-lg my-4 max-w-xs mx-auto",
        },
    },
    {
        type: "text",
        content: `The armorer carefully lifts a magnificent sword from its display. The blade seems to shimmer with an inner fire. "The Dragon Slayer," he says reverently. "Forged in dragonfire itself. It is said to be the only blade that can pierce a dragon's scales."`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-danger-400 font-bold">-200 Gold</p>
        <p class="text-center text-warning-400">Attack increased to 50!</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
    },
]);

newStory("armoryPurchaseArmor", () => [
    {
        type: "header",
        content: "Royal Armor Acquired!",
        props: { level: 2, className: "text-primary-400" },
    },
    {
        type: "text",
        content: `The armorer helps you into a suit of gleaming plate armor, crafted from the finest steel and enchanted for protection.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-danger-400 font-bold">-150 Gold</p>
        <p class="text-center text-primary-400">Defense increased by 25!</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
    },
]);

newStory("armoryPurchasePotion", () => [
    {
        type: "header",
        content: "Potion Acquired!",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `You add a vial of shimmering red liquid to your inventory. It glows faintly with healing magic.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-danger-400 font-bold">-30 Gold</p>
        <p class="text-center text-success-400">Greater Health Potion added to inventory</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
    },
]);
