import { Game, newWidget } from "@react-text-game/core";
import { useGameEntity } from "@react-text-game/core";
import { Button } from "@react-text-game/ui";

import { player, playerActions } from "../entities";

/**
 * Item definitions for the game
 */
const itemDefinitions: Record<
    string,
    { name: string; description: string; type: string; icon: string }
> = {
    iron_sword: {
        name: "Iron Sword",
        description: "A sturdy iron blade. Attack +5",
        type: "weapon",
        icon: "./assets/items/iron-sword.webp",
    },
    steel_sword: {
        name: "Steel Sword",
        description: "A finely crafted steel blade. Attack +15",
        type: "weapon",
        icon: "./assets/items/steel-sword.webp",
    },
    dragon_slayer: {
        name: "Dragon Slayer",
        description: "A legendary blade forged to slay dragons. Attack +40",
        type: "weapon",
        icon: "./assets/items/dragon-slayer.webp",
    },
    chainmail: {
        name: "Chainmail Armor",
        description: "Linked metal rings provide good protection. Defense +5",
        type: "armor",
        icon: "./assets/items/chainmail.webp",
    },
    plate_armor: {
        name: "Plate Armor",
        description: "Heavy plate armor for maximum protection. Defense +15",
        type: "armor",
        icon: "./assets/items/plate-armor.webp",
    },
    wooden_shield: {
        name: "Wooden Shield",
        description: "A simple wooden shield. Defense +3",
        type: "shield",
        icon: "./assets/items/wooden-shield.webp",
    },
    iron_shield: {
        name: "Iron Shield",
        description: "A sturdy iron shield. Defense +7",
        type: "shield",
        icon: "./assets/items/iron-shield.webp",
    },
    health_potion: {
        name: "Health Potion",
        description: "Restores 50 HP when consumed",
        type: "consumable",
        icon: "./assets/items/health-potion.webp",
    },
    royal_seal: {
        name: "Elder's Sealed Letter",
        description:
            "A letter from Elder Marcus granting audience with the King",
        type: "quest",
        icon: "./assets/items/royal-seal.webp",
    },
    forest_treasure: {
        name: "Ancient Amulet",
        description: "A mysterious amulet found in the Whispering Woods",
        type: "treasure",
        icon: "./assets/items/amulet.webp",
    },
    dragon_scale: {
        name: "Dragon Scale",
        description: "A scale from Vexarion. Proof of your encounter.",
        type: "trophy",
        icon: "./assets/items/dragon-scale.webp",
    },
};

/**
 * Inventory Component
 */
const InventoryComponent = () => {
    // Use reactive player state
    const reactivePlayer = useGameEntity(player);

    const handleUseItem = (itemId: string) => {
        const item = itemDefinitions[itemId];
        if (!item) return;

        if (item.type === "consumable") {
            if (itemId === "health_potion") {
                playerActions.heal(50);
                playerActions.removeItem(itemId);
            }
        }
    };

    const handleEquipItem = (itemId: string) => {
        const item = itemDefinitions[itemId];
        if (!item) return;

        if (item.type === "weapon") {
            playerActions.equipWeapon(itemId);
        } else if (item.type === "armor") {
            playerActions.equipArmor(itemId);
        } else if (item.type === "shield") {
            playerActions.equipShield(itemId);
        }
    };

    const isEquipped = (itemId: string) => {
        return (
            reactivePlayer.equipment.weapon === itemId ||
            reactivePlayer.equipment.armor === itemId ||
            reactivePlayer.equipment.shield === itemId
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-400">
                        Inventory
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-warning-400 font-semibold">
                            Gold: {reactivePlayer.gold}
                        </span>
                        <Button
                            color="default"
                            variant="bordered"
                            onClick={() => Game.jumpTo("worldMap")}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                {/* Equipment Section */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-secondary-400 mb-4">
                        Equipped Items
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-card/50 rounded-lg p-4 text-center">
                            <p className="text-muted-foreground text-sm mb-2">
                                Weapon
                            </p>
                            {reactivePlayer.equipment.weapon ? (
                                <p className="text-foreground">
                                    {
                                        itemDefinitions[
                                            reactivePlayer.equipment.weapon
                                        ]?.name
                                    }
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    None
                                </p>
                            )}
                        </div>
                        <div className="bg-card/50 rounded-lg p-4 text-center">
                            <p className="text-muted-foreground text-sm mb-2">
                                Armor
                            </p>
                            {reactivePlayer.equipment.armor ? (
                                <p className="text-foreground">
                                    {
                                        itemDefinitions[
                                            reactivePlayer.equipment.armor
                                        ]?.name
                                    }
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    None
                                </p>
                            )}
                        </div>
                        <div className="bg-card/50 rounded-lg p-4 text-center">
                            <p className="text-muted-foreground text-sm mb-2">
                                Shield
                            </p>
                            {reactivePlayer.equipment.shield ? (
                                <p className="text-foreground">
                                    {
                                        itemDefinitions[
                                            reactivePlayer.equipment.shield
                                        ]?.name
                                    }
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    None
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Inventory Grid */}
                <div className="bg-card/80 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-secondary-400 mb-4">
                        Items ({reactivePlayer.inventory.length})
                    </h2>

                    {reactivePlayer.inventory.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 italic">
                            Your inventory is empty
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reactivePlayer.inventory.map((itemId) => {
                                const item = itemDefinitions[itemId];
                                if (!item) return null;

                                const equipped = isEquipped(itemId);

                                return (
                                    <div
                                        key={itemId}
                                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                                            equipped
                                                ? "border-primary-500 bg-primary-500/10"
                                                : "border-border bg-card/50"
                                        }`}
                                    >
                                        {/* Item Icon */}
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                className="w-8 h-8 object-contain"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        "./assets/items/default.webp";
                                                }}
                                            />
                                        </div>

                                        {/* Item Info */}
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">
                                                {item.name}
                                                {equipped && (
                                                    <span className="text-primary-400 text-sm ml-2">
                                                        (Equipped)
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {item.type === "consumable" && (
                                                <Button
                                                    color="success"
                                                    variant="solid"
                                                    onClick={() =>
                                                        handleUseItem(itemId)
                                                    }
                                                >
                                                    Use
                                                </Button>
                                            )}
                                            {[
                                                "weapon",
                                                "armor",
                                                "shield",
                                            ].includes(item.type) &&
                                                !equipped && (
                                                    <Button
                                                        color="primary"
                                                        variant="bordered"
                                                        onClick={() =>
                                                            handleEquipItem(
                                                                itemId
                                                            )
                                                        }
                                                    >
                                                        Equip
                                                    </Button>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Inventory Widget Passage
 * Demonstrates: Widget passage with custom React component
 */
export const inventoryWidget = newWidget("inventory", <InventoryComponent />);
