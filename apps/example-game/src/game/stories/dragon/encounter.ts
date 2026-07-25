import type { StoryComponents } from "@react-text-game/core";
import { defineStory, Game, storyHelpers } from "@react-text-game/core";

import {
    dragon,
    environment,
    musicBattle,
    player,
    playerActions,
    sfxDragonRoar,
    sfxSwordSwing,
    switchBgMusic,
} from "@/game/entities";

/**
 * Dragon Encounter Story
 * Demonstrates:
 * - Boss encounter with multiple approaches
 * - Combat system with damage calculations
 * - Peaceful resolution path (based on learned lore)
 * - Multiple endings trigger
 */
export const dragonEncounter = defineStory(
    "dragonEncounter",
    () => {
        // Already defeated
        if (dragon.isDefeated) {
            return getPostDefeatContent();
        }

        // First encounter
        if (!dragon.dialogue.spokeTo) {
            return getFirstEncounterContent();
        }

        // Return encounter
        return getContinuedEncounterContent();
    },
    {
        background: {
            image: "./assets/backgrounds/dragon-chamber.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

function getFirstEncounterContent(): StoryComponents {
    dragon.dialogue.spokeTo = true;

    // Play dragon roar SFX on first encounter
    sfxDragonRoar.play();

    return [
        storyHelpers.header("The Dragon's Chamber", {
            level: 1,
            className: "text-danger-400",
        }),

        storyHelpers.image("./assets/npc/vexarion.webp", {
            alt: "Vexarion the Terrible",
            className: "rounded-lg shadow-lg my-6 max-w-lg mx-auto",
        }),

        storyHelpers.text(
            `The chamber is vast, lit by rivers of molten rock flowing along the walls. At its center, upon a mountain of gold and bones, lies Vexarion - a dragon of terrible majesty. His scales shimmer like liquid fire, and his eyes, ancient and weary, fix upon you.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.conversation(
            [
                {
                    content:
                        "*A voice like rumbling thunder fills your mind* Another knight come to slay me. How... tiresome.",
                    who: {
                        name: dragon.name,
                        avatar: "./assets/avatars/dragon.webp",
                    },
                    side: "left",
                    color: "#8B0000",
                },
                {
                    content:
                        "I am " +
                        player.name +
                        ", and I have come to end your terror upon this land!",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "*The dragon's laugh shakes the chamber* Terror? Is that what they call it? I have harmed no one, little knight. I merely... remind them I exist.",
                    who: {
                        name: dragon.name,
                        avatar: "./assets/avatars/dragon.webp",
                    },
                    side: "left",
                    color: "#8B0000",
                },
            ],
            { appearance: "byClick", variant: "messenger" }
        ),

        storyHelpers.include("dragonEncounterChoice"),
    ];
}

// Choice after initial encounter
defineStory("dragonEncounterChoice", (h) => {
    const knowsSecret = dragon.dialogue.learnedMotivation;
    const hasStrongWeapon = playerActions.hasItem("dragon_slayer");

    return [
        h.header("What Do You Do?", {
            level: 2,
            className: "text-warning-400",
        }),

        h.text(
            knowsSecret
                ? `*You remember what Princess Elara told you - the dragon is lonely, not evil. Perhaps there is another way...*`
                : `*The dragon's words give you pause, but your duty is clear... isn't it?*`,
            { className: "italic text-muted-foreground mb-6" }
        ),

        h.actions(
            [
                // Attack option
                {
                    label: "Attack! (Combat)",
                    action: () => Game.jumpTo("dragonCombat"),
                    color: "danger",
                    variant: "solid",
                    tooltip: {
                        content: hasStrongWeapon
                            ? "Dragon Slayer equipped - good odds"
                            : "Standard weapons - dangerous fight",
                        position: "right",
                    },
                },
                // Peaceful option (only if learned secret)
                knowsSecret && {
                    label: '"Why do you do this, Vexarion?"',
                    action: () => Game.jumpTo("dragonPeacefulPath"),
                    color: "primary",
                    variant: "bordered",
                },
                // Retreat option
                {
                    label: "Retreat (I need to prepare more)",
                    action: () => Game.jumpTo("dragonLairMap"),
                    color: "default",
                    variant: "bordered",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

// Combat path
defineStory("dragonCombat", (h) => {
    // Switch to battle music
    switchBgMusic(musicBattle);

    // Play sword swing SFX for attack
    sfxSwordSwing.play();

    dragon.isAngry = true;
    const hasStrongWeapon = playerActions.hasItem("dragon_slayer");

    // Calculate combat
    const playerDamage = player.attack * (hasStrongWeapon ? 2 : 1);
    const dragonDamage = Math.max(5, dragon.attack - player.defense);

    // Apply damage to dragon
    dragon.health = Math.max(0, dragon.health - playerDamage);

    // Apply damage to player
    playerActions.takeDamage(dragonDamage);

    return [
        h.header("COMBAT!", { level: 1, className: "text-danger-400" }),

        h.image("./assets/backgrounds/dragon-battle.webp", {
            alt: "Battle with Vexarion",
            className: "rounded-lg shadow-lg my-4",
        }),

        h.text(
            hasStrongWeapon
                ? `Your Dragon Slayer sword flares with magical energy as you charge! The blade bites deep into the dragon's scales, drawing a roar of pain!`
                : `You charge forward, your blade ringing against the dragon's iron scales! The impact numbs your arm, but you press on!`,
            { className: "text-lg mb-4" }
        ),

        h.text(
            `<p class="text-center text-success-400 font-bold">You dealt ${playerDamage} damage!</p>
            <p class="text-center text-danger-400 font-bold">Vexarion dealt ${dragonDamage} damage to you!</p>`,
            { isHTML: true, className: "my-4" }
        ),

        h.text(
            `<p class="text-muted-foreground">Your HP: <span class="${player.health < 30 ? "text-danger-400" : "text-success-400"}">${player.health}</span>/${player.maxHealth}</p>
            <p class="text-muted-foreground">Dragon HP: <span class="${dragon.health < 50 ? "text-danger-400" : "text-warning-400"}">${dragon.health}</span>/${dragon.maxHealth}</p>`,
            { isHTML: true, className: "text-center my-4" }
        ),

        h.include("dragonCombatContinue"),
    ];
});

// Combat continuation
defineStory("dragonCombatContinue", (h) => {
    // Check win/lose conditions
    if (dragon.health <= 0) {
        return [
            h.text(
                `*With a final, mighty blow, you drive your blade into the dragon's heart. Vexarion lets out a thunderous roar that shakes the mountain, then falls silent.*`,
                { className: "text-lg text-center mb-4 text-warning-400" }
            ),
            h.actions(
                [
                    {
                        label: "Continue...",
                        action: () => {
                            dragon.isDefeated = true;
                            player.quests.defeatedDragon = true;
                            player.stats.monstersDefeated++;
                            Game.jumpTo("endingDragonSlain");
                        },
                        color: "warning",
                    },
                ],
                { direction: "vertical" }
            ),
        ];
    }

    if (player.health <= 0) {
        return [
            h.text(
                `*The dragon's fire engulfs you. Your vision fades to black...*`,
                { className: "text-lg text-center mb-4 text-danger-400" }
            ),
            h.actions(
                [
                    {
                        label: "Game Over",
                        action: () => Game.jumpTo("endingDefeat"),
                        color: "danger",
                    },
                ],
                { direction: "vertical" }
            ),
        ];
    }

    // Combat continues
    const knowsSecret = dragon.dialogue.learnedMotivation;

    return [
        h.text(
            `The battle rages on! Vexarion circles above, preparing another attack.`,
            { className: "text-lg mb-4" }
        ),

        h.actions(
            [
                {
                    label: "Continue attacking!",
                    action: () => Game.jumpTo("dragonCombat"),
                    color: "danger",
                },
                // Can still try peace mid-combat if know secret
                knowsSecret && {
                    label: '"Wait! I know why you\'re doing this!"',
                    action: () => Game.jumpTo("dragonPeacefulPathMidCombat"),
                    color: "primary",
                    variant: "bordered",
                },
                {
                    label: "Use health potion",
                    action: () => {
                        if (playerActions.hasItem("greater_health_potion")) {
                            playerActions.removeItem("greater_health_potion");
                            playerActions.heal(50);
                        } else if (playerActions.hasItem("health_potion")) {
                            playerActions.removeItem("health_potion");
                            playerActions.heal(30);
                        }
                        Game.jumpTo("dragonCombat");
                    },
                    color: "success",
                    isDisabled:
                        !playerActions.hasItem("health_potion") &&
                        !playerActions.hasItem("greater_health_potion"),
                    tooltip:
                        !playerActions.hasItem("health_potion") &&
                        !playerActions.hasItem("greater_health_potion")
                            ? {
                                  content: "No health potions!",
                                  position: "right",
                              }
                            : undefined,
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

// Peaceful path
defineStory("dragonPeacefulPath", (h) => [
    h.header("A Different Approach", {
        level: 2,
        className: "text-primary-400",
    }),

    h.text(
        `You lower your weapon. The dragon's eyes narrow with suspicion, but also... curiosity.`,
        { className: "text-lg mb-4" }
    ),

    h.conversation(
        [
            {
                content:
                    "You're lonely, aren't you? The last of your kind. The Princess told me about you.",
                who: {
                    name: player.name,
                    avatar: "./assets/avatars/player.webp",
                },
                side: "right",
                color: "#4169E1",
            },
            {
                content:
                    "*The dragon's expression shifts, surprise replacing hostility* The Princess... she listened. She understood.",
                who: {
                    name: dragon.name,
                    avatar: "./assets/avatars/dragon.webp",
                },
                side: "left",
                color: "#8B0000",
            },
            {
                content:
                    "You don't want to hurt anyone. You just want to be remembered. To matter.",
                who: {
                    name: player.name,
                    avatar: "./assets/avatars/player.webp",
                },
                side: "right",
                color: "#4169E1",
            },
            {
                content:
                    "*A sound like a sigh rumbles through the chamber* For three hundred years, I have watched this kingdom from my mountain. I protected them once. Now they only see a monster.",
                who: {
                    name: dragon.name,
                    avatar: "./assets/avatars/dragon.webp",
                },
                side: "left",
                color: "#8B0000",
            },
        ],
        { appearance: "byClick", variant: "messenger" }
    ),

    h.actions(
        [
            {
                label: '"What if things could be different?"',
                action: () => {
                    dragon.dialogue.offeredPeace = true;
                    Game.jumpTo("dragonPeacefulResolution");
                },
                color: "primary",
            },
        ],
        { direction: "vertical" }
    ),
]);

// Mid-combat peaceful option
defineStory("dragonPeacefulPathMidCombat", (h) => [
    h.header("A Pause in Battle", { level: 2, className: "text-warning-400" }),

    h.text(
        `You throw down your weapon and raise your hands. The dragon hesitates, fire dying in its throat.`,
        { className: "text-lg mb-4" }
    ),

    h.conversation(
        [
            {
                content:
                    "Wait! I know why you do this! The Princess told me - you're not evil, you're alone!",
                who: {
                    name: player.name,
                    avatar: "./assets/avatars/player.webp",
                },
                side: "right",
                color: "#4169E1",
            },
            {
                content:
                    "*The dragon lands heavily, wounds smoking* You... you would spare me? Even after I attacked you?",
                who: {
                    name: dragon.name,
                    avatar: "./assets/avatars/dragon.webp",
                },
                side: "left",
                color: "#8B0000",
            },
            {
                content:
                    "We've both shed blood today. But that doesn't mean we have to continue.",
                who: {
                    name: player.name,
                    avatar: "./assets/avatars/player.webp",
                },
                side: "right",
                color: "#4169E1",
            },
        ],
        { appearance: "byClick", variant: "messenger" }
    ),

    h.actions(
        [
            {
                label: "Offer peace",
                action: () => {
                    dragon.dialogue.offeredPeace = true;
                    Game.jumpTo("dragonPeacefulResolution");
                },
                color: "primary",
            },
            {
                label: "No, finish the fight!",
                action: () => Game.jumpTo("dragonCombat"),
                color: "danger",
                variant: "bordered",
            },
        ],
        { direction: "vertical" }
    ),
]);

// Peaceful resolution
defineStory("dragonPeacefulResolution", (h) => {
    dragon.dialogue.acceptedPeace = true;
    dragon.isDefeated = true;
    player.flags.sparedDragon = true;
    environment.worldEvents.peacefulEnding = true;

    return [
        h.header("An Ancient Alliance Renewed", {
            level: 1,
            className: "text-success-400",
        }),

        h.image("./assets/backgrounds/dragon-peace.webp", {
            alt: "Knight and Dragon in peace",
            className: "rounded-lg shadow-lg my-6",
        }),

        h.conversation(
            [
                {
                    content:
                        "Long ago, dragons and humans were allies. We guarded this land together. Perhaps... perhaps that could be again.",
                    who: {
                        name: dragon.name,
                        avatar: "./assets/avatars/dragon.webp",
                    },
                    side: "left",
                    color: "#228B22",
                },
                {
                    content:
                        "I will speak to the King. I will tell him what I've learned here today.",
                    who: {
                        name: player.name,
                        avatar: "./assets/avatars/player.webp",
                    },
                    side: "right",
                    color: "#4169E1",
                },
                {
                    content:
                        "*The dragon bows its massive head* Then I shall wait. And hope. You have shown me there is still good in this world, " +
                        player.name +
                        ".",
                    who: {
                        name: dragon.name,
                        avatar: "./assets/avatars/dragon.webp",
                    },
                    side: "left",
                    color: "#228B22",
                },
            ],
            { appearance: "byClick", variant: "messenger" }
        ),

        h.text(
            `<p class="text-center text-success-400 font-bold my-4">Peace achieved!</p>
            <p class="text-center text-muted-foreground">The dragon has agreed to stop terrorizing the kingdom.</p>`,
            { isHTML: true }
        ),

        h.actions(
            [
                {
                    label: "Continue to the ending...",
                    action: () => Game.jumpTo("endingPeaceful"),
                    color: "success",
                },
            ],
            { direction: "vertical" }
        ),
    ];
});

// Continued encounter (if returned after initial talk)
function getContinuedEncounterContent(): StoryComponents {
    return [
        storyHelpers.header("The Dragon's Chamber", {
            level: 1,
            className: "text-danger-400",
        }),

        storyHelpers.text(
            `Vexarion raises his head as you enter. His ancient eyes study you with weary recognition.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.conversation(
            [
                {
                    content:
                        "You return, knight. Have you come to fight, or to talk?",
                    who: {
                        name: dragon.name,
                        avatar: "./assets/avatars/dragon.webp",
                    },
                    side: "left",
                    color: "#8B0000",
                },
            ],
            { appearance: "atOnce", variant: "chat" }
        ),

        storyHelpers.include("dragonEncounterChoice"),
    ];
}

// Post-defeat chamber visit
function getPostDefeatContent(): StoryComponents {
    const peaceful = player.flags.sparedDragon;

    return [
        storyHelpers.header("The Dragon's Chamber", {
            level: 1,
            className: peaceful ? "text-success-400" : "text-muted-foreground",
        }),

        storyHelpers.text(
            peaceful
                ? `Vexarion rests peacefully, a gentle smoke rising from his nostrils. He acknowledges your presence with a respectful nod.`
                : `The chamber is silent now. The dragon's body lies still upon its treasure hoard, a monument to your victory... and perhaps, to a tragedy.`,
            { className: "text-lg mb-4" }
        ),

        storyHelpers.actions(
            [
                {
                    label: "Return to the lair",
                    action: () => Game.jumpTo("dragonLairMap"),
                    color: "default",
                },
            ],
            { direction: "vertical" }
        ),
    ];
}

// Empty chamber story (for map link after defeat)
defineStory("dragonChamberEmpty", (h) => [
    h.header("The Dragon's Chamber", {
        level: 2,
        className: "text-muted-foreground",
    }),
    h.text(
        player.flags.sparedDragon
            ? "Vexarion rests here, awaiting news of the peace negotiations."
            : "The chamber holds only memories now.",
        { className: "text-lg mb-4 text-center" }
    ),
    h.actions(
        [
            {
                label: "Return",
                action: () => Game.jumpTo("dragonLairMap"),
                color: "default",
            },
        ],
        { direction: "vertical" }
    ),
]);
