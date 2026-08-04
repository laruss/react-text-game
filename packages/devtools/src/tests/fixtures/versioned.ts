import { createEntity } from "@react-text-game/core";
import { registerMigration } from "@react-text-game/core/saves";

/**
 * A game module that declares its own version and registers a migration chain
 * from 3.0.0 to 4.0.0.
 */
export const gameVersion = "4.0.0";

export const fixtureWallet = createEntity("fixture-versioned-wallet", {
    gold: 100,
});

registerMigration({
    from: "3.0.0",
    to: "4.0.0",
    description: "Seed the fixture wallet",
    migrate: (save) => ({ ...save, "fixture-versioned-wallet": { gold: 100 } }),
});
