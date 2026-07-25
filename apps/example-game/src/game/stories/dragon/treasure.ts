import { defineStory, Game, storyHelpers } from "@react-text-game/core";

import { dragon, player, playerActions } from "@/game/entities";

/**
 * Dragon Treasure Story
 * Demonstrates:
 * - Loot/reward system
 * - Conditional content based on how dragon was defeated
 * - Multiple item pickups
 */
export const dragonTreasure = defineStory(
    "dragonTreasure",
    () => {
        const peaceful = player.flags.sparedDragon;
        const alreadyLooted = dragon.treasureLooted;

        if (alreadyLooted) {
            return getAlreadyLootedContent();
        }

        if (peaceful) {
            return getPeacefulTreasureContent();
        }

        return getCombatTreasureContent();
    },
    {
        background: {
            image: "./assets/backgrounds/treasure-hoard.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

function getPeacefulTreasureContent() {
    return [
        storyHelpers.header("The Dragon's Gift", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.image("./assets/backgrounds/treasure-gift.webp", {
            alt: "Vexarion offers a gift from his hoard",
            className: "rounded-lg shadow-lg my-4",
        }),

        storyHelpers.text(
            `Vexarion gestures toward his treasure hoard. "Take what you wish, peacemaker. You have earned it not through violence, but through understanding. That is worth more than all the gold here."`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `The dragon selects several items with surprising delicacy for a creature his size.`,
            { className: "italic text-muted-foreground mb-6" }
        ),

        storyHelpers.actions(
            [
                {
                    label: "Accept the dragon's gifts",
                    action: () => {
                        dragon.treasureLooted = true;
                        playerActions.addGold(200);
                        playerActions.addItem("dragon_scale_armor");
                        playerActions.addItem("ancient_tome");
                        Game.jumpTo("treasureAccepted");
                    },
                    color: "warning",
                    variant: "solid",
                },
                {
                    label: '"Your friendship is gift enough."',
                    action: () => {
                        dragon.treasureLooted = true;
                        // Still get something small for being humble
                        playerActions.addGold(50);
                        playerActions.addItem("dragon_friendship_token");
                        Game.jumpTo("treasureDeclined");
                    },
                    color: "primary",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" as const }
        ),
    ];
}

function getCombatTreasureContent() {
    return [
        storyHelpers.header("The Dragon's Hoard", {
            level: 1,
            className: "text-warning-400",
        }),

        storyHelpers.image("./assets/backgrounds/treasure-hoard.webp", {
            alt: "Mountains of gold and treasure",
            className: "rounded-lg shadow-lg my-4",
        }),

        storyHelpers.text(
            `Before you lies centuries of accumulated wealth - gold coins from forgotten kingdoms, jewels that shimmer with inner light, weapons and armor of legendary craftsmanship. The dragon's hoard is yours for the taking.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `Yet as you survey the riches, you notice something else among the gold - portraits, letters, tokens of friendship from ages past. Vexarion was not always alone.`,
            { className: "italic text-muted-foreground mb-6" }
        ),

        storyHelpers.actions(
            [
                {
                    label: "Take everything of value",
                    action: () => {
                        dragon.treasureLooted = true;
                        playerActions.addGold(500);
                        playerActions.addItem("legendary_crown");
                        playerActions.addItem("dragon_scale_armor");
                        playerActions.addItem("ancient_gold_coins");
                        Game.jumpTo("treasureLootedFull");
                    },
                    color: "warning",
                    variant: "solid",
                },
                {
                    label: "Take only what you need",
                    action: () => {
                        dragon.treasureLooted = true;
                        playerActions.addGold(200);
                        playerActions.addItem("dragon_scale_armor");
                        Game.jumpTo("treasureLootedPartial");
                    },
                    color: "default",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" as const }
        ),
    ];
}

function getAlreadyLootedContent() {
    return [
        storyHelpers.header("The Treasure Hoard", {
            level: 1,
            className: "text-muted-foreground",
        }),

        storyHelpers.text(
            `You've already claimed what you came for. The remaining treasures hold less interest now.`,
            { className: "text-lg mb-4 text-center" }
        ),

        storyHelpers.actions(
            [
                {
                    label: "Return to the lair",
                    action: () => Game.jumpTo("dragonLairMap"),
                    color: "default",
                },
            ],
            { direction: "vertical" as const }
        ),
    ];
}

// Treasure result stories
defineStory("treasureAccepted", (h) => [
    h.header("Gifts Received", { level: 2, className: "text-success-400" }),
    h.text(
        `Vexarion places several items before you with care - a suit of armor made from his own shed scales, a tome of ancient knowledge, and a pouch of gold.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+200 Gold</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>
        <p class="text-center text-primary-400">Received: Ancient Tome</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("treasureDeclined", (h) => [
    h.header("True Treasure", { level: 2, className: "text-primary-400" }),
    h.text(
        `Vexarion's eyes soften with something like tears. "In three centuries, no one has ever refused my gold. You are truly remarkable, ${player.name}."`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `He presses a small token into your hand - a scale from his own heart, warm with inner fire.`,
        { className: "mb-4" }
    ),
    h.text(
        `<p class="text-center text-primary-400 font-bold">Received: Dragon Friendship Token</p>
        <p class="text-center text-muted-foreground">(A token of true friendship, beyond any treasure)</p>
        <p class="text-center text-success-400">+50 Gold (insisted upon)</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("treasureLootedFull", (h) => [
    h.header("Riches Beyond Measure", {
        level: 2,
        className: "text-warning-400",
    }),
    h.text(
        `You fill your bags with as much treasure as you can carry. The wealth of centuries is now yours.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+500 Gold</p>
        <p class="text-center text-warning-400">Received: Legendary Crown</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>
        <p class="text-center text-primary-400">Received: Ancient Gold Coins</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

defineStory("treasureLootedPartial", (h) => [
    h.header("A Knight's Share", { level: 2, className: "text-primary-400" }),
    h.text(
        `You take only what you need - some gold for your troubles and a suit of dragon scale armor. The rest you leave undisturbed.`,
        { className: "text-lg mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+200 Gold</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.actions(
        [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);
