import "./main.css";
import "@/game/registry";

import { GameProvider } from "@react-text-game/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MainMenu } from "@/components/MainMenu";
import { Toaster } from "@/components/ui/sonner";

import { App } from "./App";

/**
 * The Knight's Quest - Example Game
 *
 * A medieval fantasy text adventure demonstrating all features of:
 * - @react-text-game/core (entities, passages, save system)
 * - @react-text-game/ui (components, theming, navigation)
 *
 * Game Flow:
 * MainMenu → Intro → WorldMap → Village/Forest/Castle/DragonLair → Endings
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element was not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <GameProvider
            loadingScreen={{
                backgroundImage: "./assets/backgrounds/parchment.webp",
                text: ["Loading the realm...", "Preparing your quest..."],
                progressBarClassName: "bg-amber-500",
            }}
            options={{
                gameName: "the-knights-quest",
                // startPassage: "castleMap",
                isDevMode: import.meta.env.MODE === "development",
            }}
            preload={[
                "./assets/maps/world-map.webp",
                "./assets/backgrounds/parchment.webp",
                "./assets/ui/inventory-icon.webp",
            ]}
            showSplashScreenOnDev
            components={{
                MainMenu: MainMenu,
            }}
        >
            <App />
            <Toaster position="top-center" />
        </GameProvider>
    </StrictMode>
);
