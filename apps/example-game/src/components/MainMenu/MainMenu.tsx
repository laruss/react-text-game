import { Game } from "@react-text-game/core";
import { useLastLoadGame } from "@react-text-game/core/saves";
import { Button, useSaveLoadMenu } from "@react-text-game/ui";
import { useState } from "react";

import { musicMainTheme, switchBgMusic } from "@/game/entities";

/**
 * Custom MainMenu component with medieval theme
 * Demonstrates: custom MainMenu override, save/load integration, theming
 */
export const MainMenu = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const { hasLastSave, loadLastGame, isLoading } = useLastLoadGame();
    const { openLoadMenu } = useSaveLoadMenu();

    const handleStart = () => {
        switchBgMusic(musicMainTheme);
        setHasStarted(true);
    };

    const handleNewGame = () => {
        Game.jumpTo("start-passage");
    };

    const handleContinue = async () => {
        await loadLastGame();
    };

    const handleLoadGame = () => {
        openLoadMenu();
    };

    // Click-to-start overlay
    if (!hasStarted) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative cursor-pointer"
                style={{
                    backgroundImage:
                        "url('./assets/backgrounds/main-menu.webp')",
                }}
                onClick={handleStart}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-2xl text-center">
                    {/* Library badge */}
                    <div className="px-4 py-2 bg-primary-500/20 border border-primary-500/40 rounded-full">
                        <span className="text-primary-300 text-sm font-medium">
                            @react-text-game Example
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-primary-400 drop-shadow-lg tracking-wider">
                        The Knight's Quest
                    </h1>

                    {/* Description */}
                    <div className="text-muted-300 space-y-4">
                        <p className="text-lg">
                            This is a demonstration game showcasing the
                            capabilities of the{" "}
                            <span className="text-primary-400 font-semibold">
                                react-text-game
                            </span>{" "}
                            library.
                        </p>
                        <p>
                            Build your own text-based adventures with React
                            using our core engine, UI components, and MDX
                            integration.
                        </p>
                    </div>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 my-4">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary-500" />
                        <div className="text-primary-400 text-xl">&#9876;</div>
                        <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary-500" />
                    </div>

                    {/* Click to start prompt */}
                    <div className="animate-pulse">
                        <p className="text-2xl text-primary-300 font-semibold drop-shadow-lg">
                            Click anywhere to start
                        </p>
                    </div>

                    {/* Package links */}
                    <div className="mt-8 text-muted-500 text-xs space-y-1">
                        <p>
                            @react-text-game/core | @react-text-game/ui |
                            @react-text-game/mdx
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: "url('./assets/backgrounds/main-menu.webp')",
            }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 p-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-primary-400 mb-2 drop-shadow-lg tracking-wider">
                        The Knight's Quest
                    </h1>
                    <p className="text-xl text-muted-300 italic">
                        A Tale of Honor and Dragon Fire
                    </p>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-primary-500" />
                    <div className="text-primary-400 text-2xl">&#9876;</div>
                    <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-primary-500" />
                </div>

                {/* Menu buttons */}
                <div className="flex flex-col gap-4 w-64">
                    <Button
                        color="primary"
                        variant="solid"
                        className="w-full py-3 text-lg font-semibold tracking-wide"
                        onClick={handleNewGame}
                    >
                        New Game
                    </Button>

                    {hasLastSave && (
                        <Button
                            color="secondary"
                            variant="solid"
                            className="w-full py-3 text-lg font-semibold tracking-wide"
                            onClick={handleContinue}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Continue"}
                        </Button>
                    )}

                    <Button
                        color="default"
                        variant="bordered"
                        className="w-full py-3 text-lg font-semibold tracking-wide"
                        onClick={handleLoadGame}
                    >
                        Load Game
                    </Button>
                </div>

                {/* Credits */}
                <div className="mt-12 text-center text-muted-400 text-sm">
                    <p>A demonstration of @react-text-game packages</p>
                    <p className="mt-1">
                        Created with @react-text-game/core & @react-text-game/ui
                    </p>
                </div>
            </div>
        </div>
    );
};
