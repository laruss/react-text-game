import type { AnyHotspot } from "@react-text-game/core";
import { defineInteractiveMap, Game } from "@react-text-game/core";

import { dragon, musicDragonLair, switchBgMusic } from "../entities";

/**
 * Dragon Lair Map - Mount Doom interior
 * Demonstrates:
 * - Dangerous environment with conditional areas
 * - Boss encounter hotspot
 * - Treasure and loot hotspots
 * - Environmental storytelling
 */
export const dragonLairMap = defineInteractiveMap(
    "dragonLairMap",
    (h): AnyHotspot[] => {
        // Play dragon lair music when map is displayed
        switchBgMusic(musicDragonLair);

        const hotspots: AnyHotspot[] = [];

        // TODO: fixme
        // ===== TOP UI ELEMENTS =====
        // hotspots.push({
        //     type: "label",
        //     content: `${player.name} | HP: ${player.health}/${player.maxHealth} | ATK: ${player.attack} | DEF: ${player.defense}`,
        //     position: "top",
        //     action: () => Game.jumpTo("characterSheet"),
        //     props: {
        //         variant: "ghost",
        //         color: "danger",
        //         classNames: { button: "text-sm" },
        //     },
        //     tooltip: {
        //         content: "View character sheet",
        //         position: "bottom",
        //     },
        // });
        //
        // // Warning indicator
        // hotspots.push({
        //     type: "label",
        //     content: dragon.isDefeated ? "Dragon Defeated" : "DANGER ZONE",
        //     position: "top",
        //     action: () => {},
        //     isDisabled: true,
        //     props: {
        //         variant: "flat",
        //         color: dragon.isDefeated ? "success" : "danger",
        //     },
        // });

        // ===== MAIN LOCATIONS =====

        // Dragon's Chamber - main encounter
        if (!dragon.isDefeated) {
            hotspots.push(
                h.image(
                    {
                        idle: "./assets/hotspots/dragon-chamber-idle.webp",
                        hover: "./assets/hotspots/dragon-chamber-hover.webp",
                        active: "./assets/hotspots/dragon-chamber-active.webp",
                    },
                    {
                        position: { x: 50, y: 35 },
                        action: () => Game.jumpTo("dragonEncounter"),
                        tooltip: {
                            content:
                                "The Dragon's Chamber - Vexarion awaits within. Proceed with caution.",
                            position: "bottom",
                        },
                        zoom: "30%",
                    }
                )
            );
        } else {
            // After dragon defeated/befriended
            hotspots.push(
                h.label("Dragon's Chamber", {
                    position: { x: 50, y: 35 },
                    action: () => Game.jumpTo("dragonChamberEmpty"),
                    tooltip: {
                        content: "The chamber is peaceful now",
                        position: "bottom",
                    },
                    variant: "bordered",
                    color: "success",
                })
            );
        }

        // Treasure Hoard - only accessible after dragon dealt with
        hotspots.push(
            h.image(
                {
                    idle: "./assets/hotspots/treasure-hoard-idle.webp",
                    hover: "./assets/hotspots/treasure-hoard-hover.webp",
                    disabled: "./assets/hotspots/treasure-hoard-locked.webp",
                },
                {
                    position: { x: 75, y: 55 },
                    action: () => Game.jumpTo("dragonTreasure"),
                    isDisabled: !dragon.isDefeated,
                    tooltip: {
                        content: dragon.isDefeated
                            ? "The Dragon's Treasure Hoard"
                            : "Too dangerous while the dragon lives",
                        position: "left",
                    },
                    zoom: "30%",
                }
            )
        );

        // Ancient Shrine - lore/healing spot
        hotspots.push(
            h.label("Ancient Shrine", {
                position: { x: 25, y: 60 },
                action: () => Game.jumpTo("dragonLairShrine"),
                tooltip: {
                    content: "An ancient shrine to forgotten gods",
                    position: "right",
                },
                color: "primary",
            })
        );

        // Cave entrance (escape route)
        hotspots.push(
            h.label("Exit to World Map", {
                position: { x: 50, y: 85 },
                action: () => Game.jumpTo("worldMap"),
                tooltip: {
                    content: "Return to the world map",
                    position: "top",
                },
                color: "default",
            })
        );

        // ===== NAVIGATION MENU =====
        hotspots.push(
            h.menu(
                [
                    h.label(
                        () =>
                            dragon.isDefeated
                                ? "Quest Status: Dragon Resolved"
                                : `Dragon HP: ${dragon.health}/${dragon.maxHealth}`,
                        {
                            action: () => {},
                            isDisabled: true,
                            variant: "flat",
                            color: dragon.isDefeated ? "success" : "danger",
                        }
                    ),
                ],
                { position: { x: 50, y: 5 }, direction: "horizontal" }
            )
        );

        return hotspots;
    },
    {
        caption: "Mount Doom - Dragon's Lair",
        image: "./assets/maps/dragon-lair-map.webp",
        bgImage: "./assets/backgrounds/volcanic-cave.webp",
        props: { bgOpacity: 0.3 },
        classNames: {
            container: "bg-gradient-to-b from-red-900/50 to-orange-900/50",
            topHotspots: "p-3 bg-card/80 backdrop-blur-sm",
            bottomHotspots: "p-3 bg-card/80 backdrop-blur-sm",
        },
    }
);
