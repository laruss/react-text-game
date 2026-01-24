import {
    Game,
    useCurrentPassage,
    useGameEntity,
    useGameIsStarted,
} from "@react-text-game/core";
import { Button, ReloadButton, SaveButton } from "@react-text-game/ui";

import { environment, player } from "@/game/entities";

export const GameHeader = () => {
    const isStarted = useGameIsStarted();
    const [passage] = useCurrentPassage();
    const p = useGameEntity(player);
    const env = useGameEntity(environment);

    const healthPercent = (p.health / p.maxHealth) * 100;
    const healthColor =
        healthPercent > 60
            ? "bg-success-500"
            : healthPercent > 30
              ? "bg-warning-500"
              : "bg-danger-500";

    const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    if (!isStarted) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Player Info */}
                <div className="flex items-center gap-6">
                    {/* Name & Title */}
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                            {p.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {p.title}
                        </span>
                    </div>

                    {/* Health Bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            HP
                        </span>
                        <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${healthColor} transition-all duration-300`}
                                style={{ width: `${healthPercent}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-foreground min-w-[60px]">
                            {p.health}/{p.maxHealth}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-warning-400">Gold:</span>
                            <span className="font-medium text-foreground">
                                {p.gold}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-danger-400">ATK:</span>
                            <span className="font-medium text-foreground">
                                {p.attack}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-primary-400">DEF:</span>
                            <span className="font-medium text-foreground">
                                {p.defense}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                                Items:
                            </span>
                            <span className="font-medium text-foreground">
                                {p.inventory.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Time/Weather & Save */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{capitalize(env.timeOfDay)}</span>
                        <span>|</span>
                        <span>{capitalize(env.weather)}</span>
                    </div>
                    {passage?.id !== "inventory" && (
                        <Button
                            color="primary"
                            variant="bordered"
                            onClick={() => Game.jumpTo("inventory")}
                        >
                            Inventory
                        </Button>
                    )}
                    <SaveButton variant="bordered" color="primary" isIconOnly />
                    <ReloadButton
                        variant="bordered"
                        color="primary"
                        isIconOnly
                    />
                </div>
            </div>
        </header>
    );
};
