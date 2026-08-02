import { defineStory, Game, storyHelpers } from "@react-text-game/core";
import { toast } from "sonner";

import { player, playerActions } from "@/game/entities";

/**
 * Castle Armory Story
 * Demonstrates:
 * - Premium shop with expensive items
 * - Conditional availability based on quest state
 * - Special "dragon slayer" weapon
 */
export const castleArmory = defineStory(
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
        storyHelpers.header("Royal Armory", {
            level: 1,
            className: "text-danger-400",
        }),

        storyHelpers.text(
            `Two heavily armored guards block your path, their halberds crossed before the ornate doors.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `<p class="font-semibold text-danger-400">"Halt! The Royal Armory is restricted to those with the King's permission."</p>`,
            { isHTML: true, className: "mb-6" }
        ),

        storyHelpers.actions(
            [
                {
                    content: "Return to the castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                },
            ],
            { direction: "vertical" as const }
        ),
    ];
}

function getArmoryContent() {
    const hasDragonSlayer = playerActions.hasItem("dragon_slayer");
    const hasRoyalArmor = playerActions.hasItem("royal_armor");

    return [
        storyHelpers.header("The Royal Armory", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.image("./assets/backgrounds/armory-interior.webp", {
            alt: "Rows of legendary weapons and armor",
            className: "rounded-lg shadow-lg my-4",
        }),

        storyHelpers.text(
            `The armory is filled with weapons and armor of legendary quality. Swords that gleam with magical enchantments, shields bearing the royal crest, and armor crafted by master smiths line the walls.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `A royal armorer approaches you. "Ah, the knight who bears the King's blessing. I've been instructed to outfit you for your quest. Choose wisely."`,
            { className: "mb-6" }
        ),

        storyHelpers.header("Available Equipment", {
            level: 2,
            className: "text-primary-400",
        }),

        storyHelpers.text(
            `<p class="text-muted-foreground mb-4">Your gold: <span class="text-warning-400 font-bold">${player.gold}</span></p>`,
            { isHTML: true }
        ),

        storyHelpers.actions(
            [
                // Dragon Slayer Sword - the ultimate weapon
                {
                    content: `Dragon Slayer Sword - 200 gold ${hasDragonSlayer ? "(Owned)" : ""}`,
                    action: () => {
                        if (playerActions.spendGold(200)) {
                            playerActions.addItem("dragon_slayer");
                            playerActions.equipWeapon("dragon_slayer");
                            Game.jumpTo("armoryPurchaseDragonSlayer");
                        }
                    },
                    color: "warning",
                    variant: "solid",
                    isDisabled: player.gold < 200 || hasDragonSlayer,
                    tooltip:
                        player.gold < 200 && !hasDragonSlayer
                            ? {
                                  content: `Need ${200 - player.gold} more gold`,
                                  position: "right",
                              }
                            : hasDragonSlayer
                              ? {
                                    content: "You already own this weapon",
                                    position: "right",
                                }
                              : {
                                    content:
                                        "A legendary blade forged to slay dragons (+40 Attack)",
                                    position: "right",
                                },
                },
                // Royal Plate Armor
                {
                    content: `Royal Plate Armor - 150 gold ${hasRoyalArmor ? "(Owned)" : ""}`,
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
                    color: "primary",
                    variant: "solid",
                    isDisabled: player.gold < 150 || hasRoyalArmor,
                    tooltip:
                        player.gold < 150 && !hasRoyalArmor
                            ? {
                                  content: `Need ${150 - player.gold} more gold`,
                                  position: "right",
                              }
                            : hasRoyalArmor
                              ? {
                                    content: "You already own this armor",
                                    position: "right",
                                }
                              : {
                                    content:
                                        "The finest armor in the kingdom (+25 Defense)",
                                    position: "right",
                                },
                },
                // Health potions (can buy multiple)
                {
                    content: "Greater Health Potion - 30 gold",
                    action: () => {
                        if (playerActions.spendGold(30)) {
                            playerActions.addItem("greater_health_potion");
                            Game.jumpTo("armoryPurchasePotion");
                        }
                    },
                    color: "success",
                    variant: "bordered",
                    isDisabled: player.gold < 30,
                    tooltip:
                        player.gold < 30
                            ? {
                                  content: `Need ${30 - player.gold} more gold`,
                                  position: "right",
                              }
                            : {
                                  content: "Restores 50 HP when used",
                                  position: "right",
                              },
                },
                {
                    content: "Return to Castle",
                    action: () => Game.jumpTo("castleMap"),
                    color: "default",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" as const }
        ),
    ];
}

// Purchase confirmations
defineStory("armoryPurchaseDragonSlayer", (h) => [
    h.header("Legendary Weapon Acquired!", {
        level: 2,
        className: "text-warning-400",
    }),
    h.image("./assets/items/dragon-slayer.webp", {
        alt: "The Dragon Slayer sword",
        className: "rounded-lg shadow-lg my-4 max-w-xs mx-auto",
    }),
    h.text(
        `The armorer carefully lifts a magnificent sword from its display. The blade seems to shimmer with an inner fire. "The Dragon Slayer," he says reverently. "Forged in dragonfire itself. It is said to be the only blade that can pierce a dragon's scales."`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-danger-400 font-bold">-200 Gold</p>
        <p class="text-center text-warning-400">Attack increased to 50!</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                content: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("armoryPurchaseArmor", (h) => [
    h.header("Royal Armor Acquired!", {
        level: 2,
        className: "text-primary-400",
    }),
    h.text(
        `The armorer helps you into a suit of gleaming plate armor, crafted from the finest steel and enchanted for protection.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-danger-400 font-bold">-150 Gold</p>
        <p class="text-center text-primary-400">Defense increased by 25!</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                content: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("armoryPurchasePotion", (h) => [
    h.header("Potion Acquired!", { level: 2, className: "text-success-400" }),
    h.text(
        `You add a vial of shimmering red liquid to your inventory. It glows faintly with healing magic.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-danger-400 font-bold">-30 Gold</p>
        <p class="text-center text-success-400">Greater Health Potion added to inventory</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                content: "Continue shopping",
                action: () => Game.jumpTo("castleArmory"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);
