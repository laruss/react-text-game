import { Game, newStory } from "@react-text-game/core";

import {
    musicForest,
    player,
    playerActions,
    switchBgMusic,
} from "@/game/entities";

/**
 * Forest Encounter Story
 * Demonstrates:
 * - Random events based on game state
 * - State changes (finding treasure, taking damage)
 * - Multiple outcomes
 * - Clickable images for interaction
 */
export const forestEncounter = newStory(
    "forestEncounter",
    () => {
        // Play forest music
        switchBgMusic(musicForest);

        // Determine encounter based on whether treasure was already found
        if (player.flags.foundForestTreasure) {
            return getExploredForestContent();
        }

        // First time or looking for treasure
        return getForestExplorationContent();
    },
    {
        background: {
            image: "./assets/backgrounds/forest.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/85 backdrop-blur-sm",
        },
    }
);

function getForestExplorationContent() {
    return [
        {
            type: "header" as const,
            content: "The Whispering Woods",
            props: { level: 1 as const, className: "text-emerald-400" },
        },

        {
            type: "image" as const,
            content: "./assets/backgrounds/forest-path.webp",
            props: {
                alt: "A mysterious forest path",
                className: "rounded-lg shadow-lg mb-6",
            },
        },

        {
            type: "text" as const,
            content: `The forest is ancient and alive. Massive oaks stretch toward the sky, their branches intertwining to create a canopy that filters the sunlight into dappled patterns on the forest floor. The air is thick with the scent of moss and wildflowers.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `As you venture deeper, you hear whispers on the wind - hence the forest's name. Some say they are the voices of spirits; others claim they are merely the rustling of leaves. Either way, it's unnerving.`,
            props: { className: "text-base mb-6 italic text-muted-foreground" },
        },

        {
            type: "header" as const,
            content: "A Glimmer in the Undergrowth",
            props: { level: 2 as const, className: "text-warning-400" },
        },

        {
            type: "text" as const,
            content: `Following the rumors you heard at the tavern, you search carefully among the ferns and fallen logs. After what feels like hours, something catches your eye - a faint golden glimmer beneath a ancient oak tree.`,
            props: { className: "text-base mb-4" },
        },

        // Clickable treasure image
        {
            type: "image" as const,
            content: "./assets/items/hidden-treasure.webp",
            props: {
                alt: "Something glimmering beneath the tree",
                className:
                    "rounded-lg shadow-lg mb-6 cursor-pointer hover:ring-2 hover:ring-warning-400 transition-all",
                disableModal: true,
                onClick: () => {
                    player.flags.foundForestTreasure = true;
                    playerActions.addItem("forest_treasure");
                    playerActions.addGold(25);
                    Game.jumpTo("forestTreasureFound");
                },
            },
        },

        {
            type: "text" as const,
            content: `*Click the image to investigate the glimmer*`,
            props: {
                className: "text-center text-muted-foreground italic mb-6",
            },
        },

        {
            type: "actions" as const,
            props: { direction: "horizontal" as const },
            content: [
                {
                    label: "Leave the forest",
                    action: () => Game.jumpTo("worldMap"),
                    color: "default" as const,
                    variant: "bordered" as const,
                },
                {
                    label: "Search elsewhere",
                    action: () => {
                        // Random chance of finding something or getting hurt
                        const roll = Math.random();
                        if (roll > 0.7) {
                            playerActions.addGold(10);
                            Game.jumpTo("forestMinorFind");
                        } else if (roll < 0.2) {
                            playerActions.takeDamage(10);
                            Game.jumpTo("forestDanger");
                        } else {
                            Game.jumpTo("forestNothing");
                        }
                    },
                    color: "secondary" as const,
                    variant: "bordered" as const,
                },
            ],
        },
    ];
}

// Treasure found story
newStory("forestTreasureFound", () => [
    {
        type: "header",
        content: "Treasure Found!",
        props: { level: 1, className: "text-warning-400" },
    },
    {
        type: "image",
        content: "./assets/items/amulet.webp",
        props: {
            alt: "An ancient amulet",
            className: "rounded-lg shadow-lg my-6 max-w-xs mx-auto",
        },
    },
    {
        type: "text",
        content: `You carefully dig through the soft earth and uncover a small chest, half-rotted with age. Inside, you find an ancient amulet and a pouch of gold coins!`,
        props: { className: "text-lg text-center mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+25 Gold</p>
        <p class="text-center text-primary-400">Item received: Ancient Amulet</p>`,
        props: { isHTML: true, className: "my-4" },
    },
    {
        type: "text",
        content: `*The amulet feels warm in your hand. Perhaps it has some magical property...*`,
        props: { className: "italic text-muted-foreground text-center" },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Return to the World Map",
                action: () => Game.jumpTo("worldMap"),
                color: "primary",
                variant: "solid",
            },
        ],
    },
]);

// Minor find story
newStory("forestMinorFind", () => [
    {
        type: "header",
        content: "A Small Discovery",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `While searching, you stumble upon a traveler's old campsite. Among the debris, you find a small pouch containing some coins!`,
        props: { className: "text-lg text-center mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+10 Gold</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "horizontal" },
        content: [
            {
                label: "Continue exploring",
                action: () => Game.jumpTo("forestEncounter"),
                color: "secondary",
            },
            {
                label: "Leave the forest",
                action: () => Game.jumpTo("worldMap"),
                color: "default",
            },
        ],
    },
]);

// Danger story
newStory("forestDanger", () => [
    {
        type: "header",
        content: "Danger!",
        props: { level: 2, className: "text-danger-400" },
    },
    {
        type: "image",
        content: "./assets/backgrounds/forest-danger.webp",
        props: {
            alt: "A dangerous situation in the forest",
            className: "rounded-lg shadow-lg my-4",
        },
    },
    {
        type: "text",
        content: `While pushing through thick underbrush, you disturb a nest of forest serpents! One strikes before you can react, its fangs sinking into your leg.`,
        props: { className: "text-lg text-center mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-danger-400 font-bold">-10 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "horizontal" },
        content: [
            {
                label: "Retreat to safety",
                action: () => Game.jumpTo("worldMap"),
                color: "warning",
                variant: "solid",
            },
            {
                label: "Continue exploring",
                action: () => Game.jumpTo("forestEncounter"),
                color: "danger",
                variant: "bordered",
                isDisabled: player.health <= 20,
                tooltip:
                    player.health <= 20
                        ? {
                              content: "Too dangerous with low health!",
                              position: "top",
                          }
                        : undefined,
            },
        ],
    },
]);

// Nothing found story
newStory("forestNothing", () => [
    {
        type: "header",
        content: "Nothing Here",
        props: { level: 2, className: "text-muted-foreground" },
    },
    {
        type: "text",
        content: `You search the area thoroughly but find nothing of interest. The forest seems to guard its secrets well.`,
        props: { className: "text-lg text-center mb-4 italic" },
    },
    {
        type: "actions",
        props: { direction: "horizontal" },
        content: [
            {
                label: "Keep searching",
                action: () => Game.jumpTo("forestEncounter"),
                color: "secondary",
            },
            {
                label: "Leave the forest",
                action: () => Game.jumpTo("worldMap"),
                color: "default",
            },
        ],
    },
]);

// Already explored content
function getExploredForestContent() {
    return [
        {
            type: "header" as const,
            content: "The Whispering Woods",
            props: { level: 1 as const, className: "text-emerald-400" },
        },

        {
            type: "image" as const,
            content: "./assets/backgrounds/forest-path.webp",
            props: {
                alt: "A peaceful forest path",
                className: "rounded-lg shadow-lg mb-6",
            },
        },

        {
            type: "text" as const,
            content: `The forest feels less mysterious now that you've explored it. The whispers seem almost welcoming, as if the spirits recognize you as a friend.`,
            props: { className: "text-lg mb-4" },
        },

        {
            type: "text" as const,
            content: `You've already found the hidden treasure beneath the ancient oak. The forest has no more secrets to reveal... for now.`,
            props: { className: "text-base text-muted-foreground italic mb-6" },
        },

        {
            type: "actions" as const,
            props: { direction: "horizontal" as const },
            content: [
                {
                    label: "Return to World Map",
                    action: () => Game.jumpTo("worldMap"),
                    color: "primary" as const,
                    variant: "solid" as const,
                },
                {
                    label: "Rest here (+20 HP)",
                    action: () => {
                        playerActions.heal(20);
                        Game.jumpTo("forestRest");
                    },
                    color: "success" as const,
                    variant: "bordered" as const,
                    isDisabled: player.health >= player.maxHealth,
                    tooltip:
                        player.health >= player.maxHealth
                            ? {
                                  content: "Already at full health",
                                  position: "top" as const,
                              }
                            : undefined,
                },
            ],
        },
    ];
}

// Rest story
newStory("forestRest", () => [
    {
        type: "header",
        content: "A Moment of Peace",
        props: { level: 2, className: "text-success-400" },
    },
    {
        type: "text",
        content: `You find a peaceful clearing and rest beneath the ancient trees. The gentle whispers of the forest lull you into a light sleep. When you awaken, you feel refreshed.`,
        props: { className: "text-lg text-center mb-4" },
    },
    {
        type: "text",
        content: `<p class="text-center text-success-400 font-bold">+20 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        props: { isHTML: true },
    },
    {
        type: "actions",
        props: { direction: "vertical" },
        content: [
            {
                label: "Continue your journey",
                action: () => Game.jumpTo("worldMap"),
                color: "primary",
            },
        ],
    },
]);
