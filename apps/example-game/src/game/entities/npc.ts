import { createEntity } from "@react-text-game/core";

/**
 * NPC entities - tracks NPC states and relationships
 * Demonstrates: multiple entities, NPC dialogue states, relationship tracking
 */

// Blacksmith NPC
export const blacksmith = createEntity("blacksmith", {
    name: "Gareth the Smith",
    mood: "neutral" as "friendly" | "neutral" | "annoyed",
    conversationCount: 0,

    // Shop inventory - what items are available
    shopInventory: {
        iron_sword: { price: 30, available: true },
        steel_sword: { price: 75, available: true },
        chainmail: { price: 50, available: true },
        plate_armor: { price: 120, available: false }, // Unlocked later
        wooden_shield: { price: 15, available: true },
        iron_shield: { price: 40, available: true },
        health_potion: { price: 20, available: true },
    },

    // Dialogue flags
    dialogue: {
        introducedSelf: false,
        mentionedDragon: false,
        offeredDiscount: false,
    },
});

// Tavern keeper NPC
export const tavernKeeper = createEntity("tavernKeeper", {
    name: "Martha",
    mood: "friendly" as "friendly" | "neutral" | "suspicious",
    conversationCount: 0,

    // Rumors the player can hear
    rumors: {
        dragonSighting: false,
        castleSecret: false,
        forestTreasure: false,
        blacksmithSecret: false,
    },

    dialogue: {
        introducedSelf: false,
        servedDrink: false,
        sharedAllRumors: false,
    },
});

// Village Elder / Quest Giver
export const elderMarcus = createEntity("elderMarcus", {
    name: "Elder Marcus",
    title: "Village Elder of Millbrook",
    mood: "worried" as "hopeful" | "worried" | "desperate",
    conversationCount: 0,

    // Quest related
    questState: "not_started" as
        | "not_started"
        | "offered"
        | "accepted"
        | "completed",

    dialogue: {
        introducedSelf: false,
        explainedSituation: false,
        gaveReward: false,
    },

    reward: {
        gold: 100,
        item: "royal_seal", // Key item to access castle
    },
});

// King NPC
export const kingAlderon = createEntity("kingAlderon", {
    name: "King Alderon III",
    title: "King of Valdoria",
    mood: "stern" as "pleased" | "stern" | "angry",
    conversationCount: 0,

    dialogue: {
        gaveAudience: false,
        gaveBlessing: false,
        gaveReward: false,
    },

    blessingGiven: false,
});

// Dragon NPC (final boss)
export const dragon = createEntity("dragon", {
    name: "Vexarion the Terrible",
    title: "Dragon of Mount Doom",

    health: 200,
    maxHealth: 200,
    attack: 30,
    defense: 15,

    // Combat state
    isAngry: false,
    isDefeated: false,

    // Dialogue for peaceful resolution
    dialogue: {
        spokeTo: false,
        learnedMotivation: false,
        offeredPeace: false,
        acceptedPeace: false,
    },

    // The dragon's treasure
    treasureLooted: false,
});

// Princess NPC
export const princessElara = createEntity("princessElara", {
    name: "Princess Elara",
    title: "Princess of Valdoria",

    isRescued: false,
    dialogue: {
        introducedSelf: false,
        thankedPlayer: false,
        revealedDragonSecret: false, // Dragon isn't evil, just lonely
    },
});

// Helper type for items
export type ShopItem = {
    price: number;
    available: boolean;
};

// Helper functions for NPCs
export const npcActions = {
    improveRelationship: (npc: {
        mood: "friendly" | "neutral" | "annoyed" | "suspicious";
    }) => {
        if (npc.mood === "annoyed") npc.mood = "neutral";
        else if (npc.mood === "neutral") npc.mood = "friendly";
        else if (npc.mood === "suspicious") npc.mood = "neutral";
    },

    worsenRelationship: (npc: {
        mood: "friendly" | "neutral" | "annoyed" | "suspicious";
    }) => {
        if (npc.mood === "friendly") npc.mood = "neutral";
        else if (npc.mood === "neutral") npc.mood = "annoyed";
    },

    incrementConversation: (npc: { conversationCount: number }) => {
        npc.conversationCount++;
    },
};
