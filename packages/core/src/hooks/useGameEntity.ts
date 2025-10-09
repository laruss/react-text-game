import { useProxy } from "valtio/utils";

import { Game } from "#game";
import { BaseGameObject } from "#gameObjects";

const getErrorMessage = (id: string) =>
    [
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "⚠️  Entity Registration Error",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "",
        `Entity "${id}" is not registered with the game engine.`,
        "",
        "Why this happened:",
        "  React components need entities to be registered as Valtio proxies",
        "  to detect state changes and trigger re-renders automatically.",
        "",
        "How to fix:",
        "  Entities should auto-register in their constructor via:",
        "    Game.registerEntity(this)",
        "",
        `  If "${id}" is a custom entity, ensure its constructor`,
        "  calls the parent BaseGameObject constructor which handles registration:",
        "",
        "  Example:",
        "    constructor(props) {",
        "      super(props); // This registers the entity",
        "    }",
        "",
        "Troubleshooting:",
        `  1. Check if "${id}" extends BaseGameObject`,
        "  2. Verify the constructor calls super() with an id",
        "  3. Make sure the entity is imported before using useGameEntity",
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "",
    ].join("\n");

/**
 * Monitors changes to a given game entity by wrapping it in a Valtio proxy.
 * This hook enables React components to automatically re-render when the entity's state changes.
 *
 * @param gameObject - The game entity to observe. Must extend BaseGameObject and be registered.
 * @return The proxied game entity that triggers re-renders on state changes.
 *
 * @example
 * ```tsx
 * import { useGameEntity } from "@app/hooks";
 * import { environment } from "@game/entities/environment";
 *
 * function TemperatureDisplay() {
 *   const env = useGameEntity(environment);
 *   return <div>Temperature: {env.variables.temperature}°C</div>;
 * }
 * ```
 */
export function useGameEntity<T extends BaseGameObject>(gameObject: T): T {
    const proxiedObject = Game._getProxiedObject(gameObject);

    try {
        return useProxy(proxiedObject);
    } catch (error) {
        // if error is a TypeError, it means the object is not registered
        if (error instanceof TypeError) {
            const errorMessage = getErrorMessage(gameObject.id);
            console.error(errorMessage);
            throw new Error(errorMessage);
        } else {
            throw error; // rethrow other types of errors
        }
    }
}
