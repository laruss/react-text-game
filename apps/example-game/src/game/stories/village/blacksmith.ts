import { Game, newStory } from "@react-text-game/core";

import {
    blacksmith,
    player,
    playerActions,
    sfxCoinPickup,
    sfxItemPickup,
    tavernKeeper,
} from "@/game/entities";

/**
 * Blacksmith Story - Gareth's Smithy
 * Demonstrates:
 * - Actions with all button colors (primary, secondary, success, warning, danger)
 * - Actions with all button variants (solid, bordered, light, flat, faded, shadow, ghost)
 * - Disabled actions with tooltips
 * - Dynamic action state based on player gold/inventory
 * - Conversation with "atOnce" appearance
 */
export const blacksmithStory = newStory(
    "blacksmithStory",
    () => {
        blacksmith.conversationCount++;
        const isFirstVisit = blacksmith.conversationCount === 1;
        const hasDiscount = tavernKeeper.rumors.blacksmithSecret;

        // Apply discount if Martha told player about Gareth
        const discountMultiplier = hasDiscount ? 0.8 : 1;

        // Calculate prices
        const prices = {
            ironSword: Math.floor(30 * discountMultiplier),
            steelSword: Math.floor(75 * discountMultiplier),
            chainmail: Math.floor(50 * discountMultiplier),
            plateArmor: Math.floor(120 * discountMultiplier),
            woodenShield: Math.floor(15 * discountMultiplier),
            ironShield: Math.floor(40 * discountMultiplier),
            healthPotion: Math.floor(20 * discountMultiplier),
        };

        return [
            // Scene header
            {
                type: "header",
                content: "Gareth's Smithy",
                props: { level: 1, className: "text-orange-400" },
            },

            // Scene image
            {
                type: "image",
                content: "./assets/backgrounds/blacksmith-interior.webp",
                props: {
                    alt: "Inside the blacksmith's forge",
                    className: "rounded-lg shadow-lg mb-6",
                },
            },

            // Scene description
            {
                type: "text",
                content: `The heat from the forge hits you as you enter. Gareth, a burly man with arms like tree trunks, looks up from his work.`,
                props: { className: "text-lg mb-4" },
            },

            // Conversation - atOnce for quick exchange
            {
                type: "conversation",
                appearance: "atOnce",
                props: { variant: "chat", className: "my-4" },
                content: [
                    {
                        content: isFirstVisit
                            ? `A knight, eh? Haven't seen many of your kind around here lately. Looking for weapons or armor?`
                            : `Back for more, ${player.name}? My steel is the finest in the realm!`,
                        who: {
                            name: "Gareth",
                            avatar: "./assets/avatars/gareth.webp",
                        },
                        side: "left",
                        color: "#CD853F", // Peru/tan color for blacksmith
                    },
                    ...(hasDiscount && isFirstVisit
                        ? [
                              {
                                  content:
                                      "Martha from the tavern sent me. She said you might offer a fair price.",
                                  who: {
                                      name: player.name,
                                      avatar: "./assets/avatars/knight.webp",
                                  },
                                  side: "right" as const,
                                  color: "#4169E1" as const,
                              },
                              {
                                  content: `*Gareth's expression softens* Ah, Martha! Fine woman, that one. Alright, friend of Martha's gets 20% off. Take a look at what I've got.`,
                                  who: {
                                      name: "Gareth",
                                      avatar: "./assets/avatars/gareth.webp",
                                  },
                                  side: "left" as const,
                                  color: "#CD853F" as const,
                              },
                          ]
                        : []),
                ],
            },

            // Player's gold display
            {
                type: "header",
                content: `Your Gold: ${player.gold}`,
                props: {
                    level: 3,
                    className: "text-yellow-400 text-center my-4",
                },
            },

            // Discount notice if applicable
            ...(hasDiscount
                ? [
                      {
                          type: "text" as const,
                          content:
                              "*You have Martha's discount: 20% off all items!*",
                          props: {
                              className:
                                  "text-success-400 text-center italic mb-4",
                          },
                      },
                  ]
                : []),

            // Shop header - Weapons
            {
                type: "header",
                content: "Weapons",
                props: {
                    level: 4,
                    className: "text-muted-foreground mt-6 mb-2",
                },
            },

            // Weapons actions - demonstrates different button colors
            {
                type: "actions",
                props: { direction: "vertical", className: "gap-2" },
                content: [
                    // Iron Sword - primary color, solid variant
                    {
                        label: `Iron Sword (${prices.ironSword} gold)`,
                        action: () => {
                            if (playerActions.spendGold(prices.ironSword)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("iron_sword");
                                playerActions.equipWeapon("iron_sword");
                                blacksmith.shopInventory.iron_sword.available = false;
                            }
                        },
                        color: "primary",
                        variant: "solid",
                        isDisabled:
                            player.gold < prices.ironSword ||
                            player.inventory.includes("iron_sword"),
                        tooltip:
                            player.gold < prices.ironSword
                                ? {
                                      content: `Not enough gold (need ${prices.ironSword})`,
                                      position: "right",
                                  }
                                : player.inventory.includes("iron_sword")
                                  ? {
                                        content: "You already own this weapon",
                                        position: "right",
                                    }
                                  : {
                                        content:
                                            "Attack +5 - A reliable blade for any warrior",
                                        position: "right",
                                    },
                    },
                    // Steel Sword - secondary color, bordered variant
                    {
                        label: `Steel Sword (${prices.steelSword} gold)`,
                        action: () => {
                            if (playerActions.spendGold(prices.steelSword)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("steel_sword");
                                playerActions.equipWeapon("steel_sword");
                            }
                        },
                        color: "secondary",
                        variant: "bordered",
                        isDisabled:
                            player.gold < prices.steelSword ||
                            player.inventory.includes("steel_sword"),
                        tooltip:
                            player.gold < prices.steelSword
                                ? {
                                      content: `Not enough gold (need ${prices.steelSword})`,
                                      position: "right",
                                  }
                                : player.inventory.includes("steel_sword")
                                  ? {
                                        content: "You already own this weapon",
                                        position: "right",
                                    }
                                  : {
                                        content:
                                            "Attack +15 - Superior craftsmanship",
                                        position: "right",
                                    },
                    },
                ],
            },

            // Shop header - Armor
            {
                type: "header",
                content: "Armor",
                props: {
                    level: 4,
                    className: "text-muted-foreground mt-6 mb-2",
                },
            },

            // Armor actions - demonstrates more variants
            {
                type: "actions",
                props: { direction: "vertical", className: "gap-2" },
                content: [
                    // Chainmail - success color, light variant
                    {
                        label: `Chainmail (${prices.chainmail} gold)`,
                        action: () => {
                            if (playerActions.spendGold(prices.chainmail)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("chainmail");
                                playerActions.equipArmor("chainmail");
                            }
                        },
                        color: "success",
                        variant: "light",
                        isDisabled:
                            player.gold < prices.chainmail ||
                            player.inventory.includes("chainmail"),
                        tooltip: {
                            content:
                                "Defense +5 - Good protection without sacrificing mobility",
                            position: "right",
                        },
                    },
                    // Plate Armor - warning color, shadow variant (locked until later)
                    {
                        label: `Plate Armor (${prices.plateArmor} gold)`,
                        action: () => {
                            if (playerActions.spendGold(prices.plateArmor)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("plate_armor");
                                playerActions.equipArmor("plate_armor");
                            }
                        },
                        color: "warning",
                        variant: "shadow",
                        isDisabled:
                            !player.quests.mainQuestStarted ||
                            player.gold < prices.plateArmor ||
                            player.inventory.includes("plate_armor"),
                        tooltip: !player.quests.mainQuestStarted
                            ? {
                                  content:
                                      "Gareth will craft this only for proven heroes",
                                  position: "right",
                              }
                            : {
                                  content:
                                      "Defense +15 - The finest armor in the realm",
                                  position: "right",
                              },
                    },
                ],
            },

            // Shop header - Shields
            {
                type: "header",
                content: "Shields",
                props: {
                    level: 4,
                    className: "text-muted-foreground mt-6 mb-2",
                },
            },

            // Shields - demonstrates horizontal layout
            {
                type: "actions",
                props: {
                    direction: "horizontal",
                    className: "gap-2 flex-wrap",
                },
                content: [
                    // Wooden Shield - default color, flat variant
                    {
                        label: `Wooden Shield (${prices.woodenShield}g)`,
                        action: () => {
                            if (playerActions.spendGold(prices.woodenShield)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("wooden_shield");
                                playerActions.equipShield("wooden_shield");
                            }
                        },
                        color: "default",
                        variant: "flat",
                        isDisabled:
                            player.gold < prices.woodenShield ||
                            player.inventory.includes("wooden_shield"),
                        tooltip: { content: "Defense +3", position: "top" },
                    },
                    // Iron Shield - primary color, faded variant
                    {
                        label: `Iron Shield (${prices.ironShield}g)`,
                        action: () => {
                            if (playerActions.spendGold(prices.ironShield)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("iron_shield");
                                playerActions.equipShield("iron_shield");
                            }
                        },
                        color: "primary",
                        variant: "faded",
                        isDisabled:
                            player.gold < prices.ironShield ||
                            player.inventory.includes("iron_shield"),
                        tooltip: { content: "Defense +7", position: "top" },
                    },
                ],
            },

            // Shop header - Consumables
            {
                type: "header",
                content: "Consumables",
                props: {
                    level: 4,
                    className: "text-muted-foreground mt-6 mb-2",
                },
            },

            // Health Potion - danger color, ghost variant
            {
                type: "actions",
                props: { direction: "horizontal" },
                content: [
                    {
                        label: `Health Potion (${prices.healthPotion} gold)`,
                        action: () => {
                            if (playerActions.spendGold(prices.healthPotion)) {
                                sfxCoinPickup.play();
                                sfxItemPickup.play();
                                playerActions.addItem("health_potion");
                            }
                        },
                        color: "danger",
                        variant: "ghost",
                        isDisabled: player.gold < prices.healthPotion,
                        tooltip: {
                            content: "Restores 50 HP - Can buy multiple",
                            position: "top",
                        },
                    },
                ],
            },

            // Navigation actions
            {
                type: "header",
                content: "",
                props: { level: 6 }, // Just for spacing
            },

            {
                type: "actions",
                props: { direction: "horizontal", className: "mt-8" },
                content: [
                    {
                        label: "Return to Village",
                        action: () => Game.jumpTo("villageMap"),
                        color: "default",
                        variant: "bordered",
                    },
                    {
                        label: "View Inventory",
                        action: () => Game.jumpTo("inventory"),
                        color: "secondary",
                        variant: "bordered",
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/forge-bg.webp",
        },
        classNames: {
            base: "min-h-screen",
            container:
                "max-w-2xl mx-auto py-8 px-6 bg-card/95 backdrop-blur-sm",
        },
    }
);
