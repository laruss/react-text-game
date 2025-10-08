import "./main.css";

import { GameProvider } from "@react-text-game/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MainMenu } from "@/components/MainMenu";

import { App } from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GameProvider
            options={{
                gameName: "example-game",
                isDevMode: import.meta.env.MODE === "development",
            }}
            components={{
                MainMenu: MainMenu
            }}
        >
            <App />
        </GameProvider>
    </StrictMode>
);
