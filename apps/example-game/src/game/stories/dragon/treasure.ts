import { Game, newStory } from "@react-text-game/core";

import { dragon, player, playerActions } from "@/game/entities";

/**
 * Dragon Treasure Story
 * Demonstrates:
 * - Loot/reward system
 * - Conditional content based on how dragon was defeated
 * - Multiple item pickups
 */
export const dragonTreasure = newStory(
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
        {
            type: "header" as const,
            content: "The Dragon's Gift",
            props: { level: 1 as const, className: "text-warning-400" },
        },

        {
            type: "image" as const,
            content: "./assets/backgrounds/treasure-gift.webp",
            props: {
                alt: "Vexarion offers a gift from his hoard",
                className: "rounded-lg shadow-lg my-4",
            },
        },

        {
            type: "text" as const,
            content: `Vexarion gestures toward his treasure hoard. "Take what you wish, peacemaker. You have earned it not through violence, but through understanding. That is worth more than all the gold here."`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `The dragon selects several items with surprising delicacy for a creature his size.`,
            props: { className: "italic text-muted-foreground mb-6" },
        },

        {
            type: "actions" as const,
            props: { direction: "vertical" as const },
            content: [
                {
                    label: "Accept the dragon's gifts",
                    action: () => {
                        dragon.treasureLooted = true;
                        playerActions.addGold(200);
                        playerActions.addItem("dragon_scale_armor");
                        playerActions.addItem("ancient_tome");
                        Game.jumpTo("treasureAccepted");
                    },
                    color: "warning" as const,
                    variant: "solid" as const,
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
                    color: "primary" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
}

function getCombatTreasureContent() {
    return [
        {
            type: "header" as const,
            content: "The Dragon's Hoard",
            props: { level: 1 as const, className: "text-warning-400" },
        },

        {
            type: "image" as const,
            content: "./assets/backgrounds/treasure-hoard.webp",
            props: {
                alt: "Mountains of gold and treasure",
                className: "rounded-lg shadow-lg my-4",
            },
        },

        {
            type: "text" as const,
            content: `Before you lies centuries of accumulated wealth - gold coins from forgotten kingdoms, jewels that shimmer with inner light, weapons and armor of legendary craftsmanship. The dragon's hoard is yours for the taking.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `Yet as you survey the riches, you notice something else among the gold - portraits, letters, tokens of friendship from ages past. Vexarion was not always alone.`,
            props: { className: "italic text-muted-foreground mb-6" },
        },

        {
            type: "actions" as const,
            props: { direction: "vertical" as const },
            content: [
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
                    color: "warning" as const,
                    variant: "solid" as const,
                },
                {
                    label: "Take only what you need",
                    action: () => {
                        dragon.treasureLooted = true;
                        playerActions.addGold(200);
                        playerActions.addItem("dragon_scale_armor");
                        Game.jumpTo("treasureLootedPartial");
                    },
                    color: "default" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
}

function getAlreadyLootedContent() {
    return [
        {
            type: "header" as const,
            content: "The Treasure Hoard",
            props: { level: 1 as const, className: "text-muted-foreground" },
        },

        {
            type: "text" as const,
            content: `You've already claimed what you came for. The remaining treasures hold less interest now.`,
            props: { className: "text-lg mb-4 text-center" },
        },

        {
            type: "actions" as const,
            props: { direction: "vertical" as const },
            content: [
                {
                    label: "Return to the lair",
                    action: () => Game.jumpTo("dragonLairMap"),
                    color: "default" as const,
                },
            ],
        },
    ];
}

// Treasure result stories
newStory("treasureAccepted", () => [
    {
        type: "header",
        content: "Gifts Received",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `Vexarion places several items before you with care - a suit of armor made from his own shed scales, a tome of ancient knowledge, and a pouch of gold.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+200 Gold</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>
        <p class="text-center text-primary-400">Received: Ancient Tome</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
    },
]);

newStory("treasureDeclined", () => [
    {
        type: "header",
        content: "True Treasure",
        props: { level: 2, className: "text-primary-400" },
    },
    {
        type: "text",
        content: `Vexarion's eyes soften with something like tears. "In three centuries, no one has ever refused my gold. You are truly remarkable, ${player.name}."`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `He presses a small token into your hand - a scale from his own heart, warm with inner fire.`,
        props: { className: "mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-primary-400 font-bold">Received: Dragon Friendship Token</p>
        <p class="text-center text-muted-foreground">(A token of true friendship, beyond any treasure)</p>
        <p class="text-center text-success-400">+50 Gold (insisted upon)</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
    },
]);

newStory("treasureLootedFull", () => [
    {
        type: "header",
        content: "Riches Beyond Measure",
        props: { level: 2, className: "text-warning-400" },
    },
    {
        type: "text",
        content: `You fill your bags with as much treasure as you can carry. The wealth of centuries is now yours.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+500 Gold</p>
        <p class="text-center text-warning-400">Received: Legendary Crown</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>
        <p class="text-center text-primary-400">Received: Ancient Gold Coins</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
    },
]);

newStory("treasureLootedPartial", () => [
    {
        type: "header",
        content: "A Knight's Share",
        props: { level: 2, className: "text-primary-400" },
    },
    {
        type: "text",
        content: `You take only what you need - some gold for your troubles and a suit of dragon scale armor. The rest you leave undisturbed.`,
        props: { className: "text-lg mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+200 Gold</p>
        <p class="text-center text-primary-400">Received: Dragon Scale Armor</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the lair",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "primary",
            },
        ],
    },
]);
