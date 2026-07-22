import "@/game/registry";

import { Game } from "@react-text-game/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import passagesEn from "./locales/en/passages.json";
import passagesRu from "./locales/ru/passages.json";

await Game.init({
    gameName: "core-test-app",
    isDevMode: true,
    initialState: {
        player: {
            name: "Player",
        },
    },
    translations: {
        defaultLanguage: "en",
        fallbackLanguage: "en",
        resources: {
            en: {
                passages: passagesEn,
            },
            ru: {
                passages: passagesRu,
            },
        },
    },
});
console.log({ state: Game.getState() });

const elem = document.getElementById("root");

if (!elem) {
    throw new Error("Root element not found");
}
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

if (import.meta.hot) {
    // With hot module reloading, `import.meta.hot.data` is persisted.
    let root = import.meta.hot.data.root;

    if (!root) {
        root = createRoot(elem);
        import.meta.hot.data.root = root;
    }

    root.render(app);
} else {
    // The hot module reloading API is not available in production.
    createRoot(elem).render(app);
}
