import { defineStory, Game, storyHelpers } from "@react-text-game/core";

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
export const forestEncounter = defineStory(
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
        storyHelpers.header("The Whispering Woods", {
            level: 1,
            className: "text-emerald-400",
        }),

        storyHelpers.image("./assets/backgrounds/forest-path.webp", {
            alt: "A mysterious forest path",
            className: "rounded-lg shadow-lg mb-6",
        }),

        storyHelpers.text(
            `The forest is ancient and alive. Massive oaks stretch toward the sky, their branches intertwining to create a canopy that filters the sunlight into dappled patterns on the forest floor. The air is thick with the scent of moss and wildflowers.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `As you venture deeper, you hear whispers on the wind - hence the forest's name. Some say they are the voices of spirits; others claim they are merely the rustling of leaves. Either way, it's unnerving.`,
            { className: "text-base mb-6 italic text-muted-foreground" }
        ),

        storyHelpers.header("A Glimmer in the Undergrowth", {
            level: 2,
            className: "text-warning-400",
        }),

        storyHelpers.text(
            `Following the rumors you heard at the tavern, you search carefully among the ferns and fallen logs. After what feels like hours, something catches your eye - a faint golden glimmer beneath a ancient oak tree.`,
            { className: "text-base mb-4" }
        ),

        // Clickable treasure image
        storyHelpers.image("./assets/items/hidden-treasure.webp", {
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
        }),

        storyHelpers.text(`*Click the image to investigate the glimmer*`, {
            className: "text-center text-muted-foreground italic mb-6",
        }),

        storyHelpers.actions(
            [
                {
                    content: "Leave the forest",
                    action: () => Game.jumpTo("worldMap"),
                    color: "default",
                    variant: "bordered",
                },
                {
                    content: "Search elsewhere",
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
                    color: "secondary",
                    variant: "bordered",
                },
            ],
            { direction: "horizontal" as const }
        ),
    ];
}

// Treasure found story
defineStory("forestTreasureFound", (h) => [
    h.header("Treasure Found!", { level: 1, className: "text-warning-400" }),
    h.image("./assets/items/amulet.webp", {
        alt: "An ancient amulet",
        className: "rounded-lg shadow-lg my-6 max-w-xs mx-auto",
    }),
    h.text(
        `You carefully dig through the soft earth and uncover a small chest, half-rotted with age. Inside, you find an ancient amulet and a pouch of gold coins!`,
        { className: "text-lg text-center mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+25 Gold</p>
        <p class="text-center text-primary-400">Item received: Ancient Amulet</p>`,
        { isHTML: true, className: "my-4" }
    ),
    h.text(
        `*The amulet feels warm in your hand. Perhaps it has some magical property...*`,
        { className: "italic text-muted-foreground text-center" }
    ),
    h.actions(
        [
            {
                content: "Return to the World Map",
                action: () => Game.jumpTo("worldMap"),
                color: "primary",
                variant: "solid",
            },
        ],
        { direction: "vertical" }
    ),
]);

// Minor find story
defineStory("forestMinorFind", (h) => [
    h.header("A Small Discovery", { level: 2, className: "text-success-400" }),
    h.text(
        `While searching, you stumble upon a traveler's old campsite. Among the debris, you find a small pouch containing some coins!`,
        { className: "text-lg text-center mb-4" }
    ),
    h.text(`<p class="text-center text-success-400 font-bold">+10 Gold</p>`, {
        isHTML: true,
    }),
    h.actions(
        [
            {
                content: "Continue exploring",
                action: () => Game.jumpTo("forestEncounter"),
                color: "secondary",
            },
            {
                content: "Leave the forest",
                action: () => Game.jumpTo("worldMap"),
                color: "default",
            },
        ],
        { direction: "horizontal" }
    ),
]);

// Danger story
defineStory("forestDanger", (h) => [
    h.header("Danger!", { level: 2, className: "text-danger-400" }),
    h.image("./assets/backgrounds/forest-danger.webp", {
        alt: "A dangerous situation in the forest",
        className: "rounded-lg shadow-lg my-4",
    }),
    h.text(
        `While pushing through thick underbrush, you disturb a nest of forest serpents! One strikes before you can react, its fangs sinking into your leg.`,
        { className: "text-lg text-center mb-4" }
    ),
    h.text(
        `<p class="text-center text-danger-400 font-bold">-10 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                content: "Retreat to safety",
                action: () => Game.jumpTo("worldMap"),
                color: "warning",
                variant: "solid",
            },
            {
                content: "Continue exploring",
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
        { direction: "horizontal" }
    ),
]);

// Nothing found story
defineStory("forestNothing", (h) => [
    h.header("Nothing Here", { level: 2, className: "text-muted-foreground" }),
    h.text(
        `You search the area thoroughly but find nothing of interest. The forest seems to guard its secrets well.`,
        { className: "text-lg text-center mb-4 italic" }
    ),
    h.actions(
        [
            {
                content: "Keep searching",
                action: () => Game.jumpTo("forestEncounter"),
                color: "secondary",
            },
            {
                content: "Leave the forest",
                action: () => Game.jumpTo("worldMap"),
                color: "default",
            },
        ],
        { direction: "horizontal" }
    ),
]);

// Already explored content
function getExploredForestContent() {
    return [
        storyHelpers.header("The Whispering Woods", {
            level: 1,
            className: "text-emerald-400",
        }),

        storyHelpers.image("./assets/backgrounds/forest-path.webp", {
            alt: "A peaceful forest path",
            className: "rounded-lg shadow-lg mb-6",
        }),

        storyHelpers.text(
            `The forest feels less mysterious now that you've explored it. The whispers seem almost welcoming, as if the spirits recognize you as a friend.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.text(
            `You've already found the hidden treasure beneath the ancient oak. The forest has no more secrets to reveal... for now.`,
            { className: "text-base text-muted-foreground italic mb-6" }
        ),

        storyHelpers.actions(
            [
                {
                    content: "Return to World Map",
                    action: () => Game.jumpTo("worldMap"),
                    color: "primary",
                    variant: "solid",
                },
                {
                    content: "Rest here (+20 HP)",
                    action: () => {
                        playerActions.heal(20);
                        Game.jumpTo("forestRest");
                    },
                    color: "success",
                    variant: "bordered",
                    isDisabled: player.health >= player.maxHealth,
                    tooltip:
                        player.health >= player.maxHealth
                            ? {
                                  content: "Already at full health",
                                  position: "top",
                              }
                            : undefined,
                },
            ],
            { direction: "horizontal" as const }
        ),
    ];
}

// Rest story
defineStory("forestRest", (h) => [
    h.header("A Moment of Peace", { level: 2, className: "text-success-400" }),
    h.text(
        `You find a peaceful clearing and rest beneath the ancient trees. The gentle whispers of the forest lull you into a light sleep. When you awaken, you feel refreshed.`,
        { className: "text-lg text-center mb-4" }
    ),
    h.text(
        `<p class="text-center text-success-400 font-bold">+20 HP</p>
        <p class="text-center text-muted-foreground">Current HP: ${player.health}/${player.maxHealth}</p>`,
        { isHTML: true }
    ),
    h.actions(
        [
            {
                content: "Continue your journey",
                action: () => Game.jumpTo("worldMap"),
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);
