/**
 * English defaults for the `ui` namespace.
 *
 * @remarks
 * A TypeScript module rather than JSON on purpose: Node's ESM resolver requires
 * an `with { type: "json" }` import attribute for JSON modules, so a bare JSON
 * import makes this entry unloadable under plain Node (SSR, or `Game.init`
 * reaching it through core's dynamic import).
 */
export const ui = {
    mainMenu: {
        title: "Main Menu",
        newGame: "New Game",
        continue: "Continue",
        loadGame: "Load Game",
    },
    saves: {
        title: {
            save: "Save Game",
            load: "Load Game",
            saveLoad: "Save / Load Game",
        },
        slot: {
            label: "Slot {{number}}",
            empty: "Empty Slot",
            saveHere: "Save Here",
            overwrite: "Overwrite",
        },
        actions: {
            load: "Load",
            loading: "Loading...",
            save: "Save",
            saving: "Saving...",
            delete: "Delete",
            close: "Close",
        },
        errors: {
            actionFailed:
                "An error occurred. Please check the console for details.",
        },
    },
};
