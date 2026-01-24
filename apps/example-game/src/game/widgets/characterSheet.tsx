import { Game, newWidget } from "@react-text-game/core";
import { useGameEntity } from "@react-text-game/core";
import { Button } from "@react-text-game/ui";

import { environment, player } from "../entities";

/**
 * Character Sheet Component
 */
const CharacterSheetComponent = () => {
    // Use reactive player and environment state
    const reactivePlayer = useGameEntity(player);
    const reactiveEnvironment = useGameEntity(environment);

    // Calculate health percentage for bar
    const healthPercent =
        (reactivePlayer.health / reactivePlayer.maxHealth) * 100;
    const healthColor =
        healthPercent > 60
            ? "bg-success-500"
            : healthPercent > 30
              ? "bg-warning-500"
              : "bg-danger-500";

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-400">
                        Character Sheet
                    </h1>
                    <Button
                        color="default"
                        variant="bordered"
                        onClick={() => Game.jumpTo("worldMap")}
                    >
                        Close
                    </Button>
                </div>

                {/* Character Portrait & Basic Info */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-6">
                        {/* Portrait */}
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-primary-500">
                            <img
                                src="./assets/avatars/knight.webp"
                                alt={reactivePlayer.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "./assets/avatars/default.webp";
                                }}
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-foreground">
                                {reactivePlayer.name}
                            </h2>
                            <p className="text-secondary-400 mb-4">
                                {reactivePlayer.title}
                            </p>

                            {/* Health Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">
                                        Health
                                    </span>
                                    <span className="text-foreground">
                                        {reactivePlayer.health} /{" "}
                                        {reactivePlayer.maxHealth}
                                    </span>
                                </div>
                                <div className="h-4 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${healthColor} transition-all duration-300`}
                                        style={{ width: `${healthPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-secondary-400 mb-4">
                        Combat Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Attack
                            </p>
                            <p className="text-2xl font-bold text-danger-400">
                                {reactivePlayer.attack}
                            </p>
                        </div>
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Defense
                            </p>
                            <p className="text-2xl font-bold text-primary-400">
                                {reactivePlayer.defense}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-secondary-400 mb-4">
                        Resources
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Gold
                            </p>
                            <p className="text-2xl font-bold text-warning-400">
                                {reactivePlayer.gold}
                            </p>
                        </div>
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Items
                            </p>
                            <p className="text-2xl font-bold text-info-400">
                                {reactivePlayer.inventory.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quest Progress */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-secondary-400 mb-4">
                        Quest Progress
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reactivePlayer.quests.mainQuestStarted
                                        ? "bg-success-500"
                                        : "bg-muted-500"
                                }`}
                            />
                            <span
                                className={
                                    reactivePlayer.quests.mainQuestStarted
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                Main quest started
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reactivePlayer.quests.talkedToKing
                                        ? "bg-success-500"
                                        : "bg-muted-500"
                                }`}
                            />
                            <span
                                className={
                                    reactivePlayer.quests.talkedToKing
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                Audience with the King
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reactivePlayer.quests.hasRoyalBlessing
                                        ? "bg-success-500"
                                        : "bg-muted-500"
                                }`}
                            />
                            <span
                                className={
                                    reactivePlayer.quests.hasRoyalBlessing
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                Royal blessing received
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reactivePlayer.quests.defeatedDragon
                                        ? "bg-success-500"
                                        : "bg-muted-500"
                                }`}
                            />
                            <span
                                className={
                                    reactivePlayer.quests.defeatedDragon
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                Dragon defeated
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    reactivePlayer.quests.mainQuestComplete
                                        ? "bg-success-500"
                                        : "bg-muted-500"
                                }`}
                            />
                            <span
                                className={
                                    reactivePlayer.quests.mainQuestComplete
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                Quest complete
                            </span>
                        </div>
                    </div>
                </div>

                {/* World Info */}
                <div className="bg-card/80 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-secondary-400 mb-4">
                        World Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Time
                            </p>
                            <p className="text-lg font-semibold text-foreground capitalize">
                                {reactiveEnvironment.timeOfDay}
                            </p>
                        </div>
                        <div className="bg-card/50 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">
                                Weather
                            </p>
                            <p className="text-lg font-semibold text-foreground capitalize">
                                {reactiveEnvironment.weather}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-card/80 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-secondary-400 mb-4">
                        Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Monsters Defeated
                            </span>
                            <span className="text-foreground">
                                {reactivePlayer.stats.monstersDefeated}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Gold Earned
                            </span>
                            <span className="text-foreground">
                                {reactivePlayer.stats.goldEarned}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Gold Spent
                            </span>
                            <span className="text-foreground">
                                {reactivePlayer.stats.goldSpent}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Locations Visited
                            </span>
                            <span className="text-foreground">
                                {reactivePlayer.stats.locationsVisited}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Character Sheet Widget Passage
 * Demonstrates: Widget passage with reactive state display
 */
export const characterSheetWidget = newWidget(
    "characterSheet",
    <CharacterSheetComponent />
);
