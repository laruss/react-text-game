import { createEntity } from "@react-text-game/core";
import { toast } from "sonner";

// Helper to format item IDs into readable names
const formatItemName = (itemId: string): string => {
    return itemId
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Player entity - tracks all player state
 * Demonstrates: createEntity factory, complex nested state, arrays, quest flags
 */
export const player = createEntity("player", {
    // Basic info
    name: "Sir Aldric",
    title: "Knight of Valdoria",

    // Combat stats
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,

    // Resources
    gold: 50,

    // Inventory - array of item IDs
    inventory: [] as string[],

    // Equipment slots
    equipment: {
        weapon: null as string | null,
        armor: null as string | null,
        shield: null as string | null,
    },

    // Quest flags
    quests: {
        mainQuestStarted: false,
        mainQuestComplete: false,
        talkedToKing: false,
        hasRoyalBlessing: false,
        defeatedDragon: false,
    },

    // Story flags for tracking choices
    flags: {
        heardRumorAboutDragon: false,
        boughtSwordFromBlacksmith: false,
        foundForestTreasure: false,
        savedPrincess: false,
        sparedDragon: false,
    },

    // Stats for tracking gameplay
    stats: {
        monstersDefeated: 0,
        goldEarned: 0,
        goldSpent: 0,
        locationsVisited: 0,
    },
});

// Helper functions for player actions
export const playerActions = {
    addItem: (itemId: string) => {
        if (!player.inventory.includes(itemId)) {
            player.inventory.push(itemId);
            toast.success(`Received: ${formatItemName(itemId)}`);
        }
    },

    removeItem: (itemId: string) => {
        const index = player.inventory.indexOf(itemId);
        if (index > -1) {
            player.inventory.splice(index, 1);
            toast.info(`Used: ${formatItemName(itemId)}`);
        }
    },

    hasItem: (itemId: string) => {
        return player.inventory.includes(itemId);
    },

    addGold: (amount: number) => {
        player.gold += amount;
        player.stats.goldEarned += amount;
        toast.success(`+${amount} gold`);
    },

    spendGold: (amount: number): boolean => {
        if (player.gold >= amount) {
            player.gold -= amount;
            player.stats.goldSpent += amount;
            toast.info(`-${amount} gold`);
            return true;
        }
        toast.error("Not enough gold!");
        return false;
    },

    takeDamage: (amount: number) => {
        const actualDamage = Math.max(1, amount - player.defense);
        player.health = Math.max(0, player.health - actualDamage);
        toast.error(`-${actualDamage} HP`);
        return actualDamage;
    },

    heal: (amount: number) => {
        const actualHeal = Math.min(player.maxHealth - player.health, amount);
        player.health = Math.min(player.maxHealth, player.health + amount);
        if (actualHeal > 0) {
            toast.success(`+${actualHeal} HP`);
        }
    },

    equipWeapon: (weaponId: string) => {
        player.equipment.weapon = weaponId;
        // Increase attack based on weapon
        const oldAttack = player.attack;
        if (weaponId === "iron_sword") player.attack = 15;
        if (weaponId === "steel_sword") player.attack = 25;
        if (weaponId === "dragon_slayer") player.attack = 50;
        toast.success(
            `Equipped: ${formatItemName(weaponId)} (Attack: ${oldAttack} → ${player.attack})`
        );
    },

    equipArmor: (armorId: string) => {
        player.equipment.armor = armorId;
        // Increase defense based on armor
        const oldDefense = player.defense;
        if (armorId === "chainmail") player.defense = 10;
        if (armorId === "plate_armor") player.defense = 20;
        toast.success(
            `Equipped: ${formatItemName(armorId)} (Defense: ${oldDefense} → ${player.defense})`
        );
    },

    equipShield: (shieldId: string) => {
        player.equipment.shield = shieldId;
        const oldDefense = player.defense;
        if (shieldId === "wooden_shield") player.defense += 3;
        if (shieldId === "iron_shield") player.defense += 7;
        toast.success(
            `Equipped: ${formatItemName(shieldId)} (Defense: ${oldDefense} → ${player.defense})`
        );
    },

    isAlive: () => player.health > 0,
};
