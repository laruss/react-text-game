import type { AnyHotspot } from "@react-text-game/core";
import { Game, newInteractiveMap } from "@react-text-game/core";
import { toast } from "sonner";

import { environment, player } from "../entities";

/**
 * World Map - Central hub for navigation
 * Demonstrates:
 * - Label hotspots (map positions)
 * - Image hotspots (with state-dependent images)
 * - Dynamic/conditional hotspots (appear based on game state)
 * - Side hotspots (top/bottom for UI elements)
 * - Tooltips on hotspots
 * - Menu hotspots (contextual actions)
 * - Background image
 */
export const worldMap = newInteractiveMap("worldMap", {
    caption: "The Kingdom of Valdoria",
    image: "./assets/maps/world-map.webp",
    bgImage: "./assets/backgrounds/map-background.webp",
    props: { bgOpacity: 0.3 },

    hotspots: (): AnyHotspot[] => {
        const hotspots: AnyHotspot[] = [];

        // TODO: fixme
        // // ===== TOP SIDE HOTSPOTS (UI elements) =====
        // // Character stats button
        // hotspots.push({
        //     type: "label",
        //     content: `${player.name} | HP: ${player.health}/${player.maxHealth} | Gold: ${player.gold}`,
        //     position: "top",
        //     action: () => Game.jumpTo("characterSheet"),
        //     props: {
        //         variant: "ghost",
        //         color: "default",
        //         classNames: { button: "text-sm" },
        //     },
        //     tooltip: {
        //         content: "View character sheet",
        //         position: "bottom",
        //     },
        // });
        //
        // // Inventory button (side hotspot)
        // hotspots.push({
        //     type: "image",
        //     content: "./assets/ui/inventory-icon.webp",
        //     position: "top",
        //     action: () => Game.jumpTo("inventory"),
        //     tooltip: {
        //         content: () => `Inventory (${player.inventory.length} items)`,
        //         position: "bottom",
        //     },
        //     props: {
        //         zoom: "20%",
        //         classNames: { container: "w-10 h-10" },
        //     },
        // });

        // ===== MAP LOCATION HOTSPOTS =====

        // Village - always visible (label hotspot)
        hotspots.push({
            type: "label",
            content: "Millbrook Village",
            position: { x: 44.9, y: 45.73 },
            action: () => {
                environment.visitCounts.village++;
                Game.jumpTo("villageMap");
            },
            props: {
                variant: "solid",
                color: "primary",
            },
            tooltip: {
                content: "A peaceful farming village - your home",
                position: "top",
            },
        });

        // Forest - always visible (image hotspot with states)
        hotspots.push({
            type: "image",
            content: {
                idle: "./assets/hotspots/forest-idle.webp",
                hover: "./assets/hotspots/forest-hover.webp",
                active: "./assets/hotspots/forest-active.webp",
            },
            position: { x: 78.25, y: 23.37 },
            action: () => {
                environment.visitCounts.forest++;
                Game.jumpTo("forestEncounter");
            },
            tooltip: {
                content: () =>
                    player.flags.foundForestTreasure
                        ? "The Whispering Woods (explored)"
                        : "The Whispering Woods - rumored to hide ancient treasures",
                position: "bottom",
            },
            props: {
                zoom: "40%",
            },
        });

        // Castle - conditional (only if discovered)
        if (environment.discoveredLocations.castle) {
            hotspots.push({
                type: "image",
                content: {
                    idle: "./assets/hotspots/castle-idle.webp",
                    hover: "./assets/hotspots/castle-hover.webp",
                    active: "./assets/hotspots/castle-active.webp",
                },
                position: { x: 25.18, y: 26.94 },
                action: () => {
                    environment.visitCounts.castle++;
                    Game.jumpTo("castleMap");
                },
                tooltip: {
                    content: "Castle Valdoria - seat of the King",
                    position: "left",
                },
                props: {
                    zoom: "30%",
                },
            });
        } else {
            // Show locked castle
            hotspots.push({
                type: "image",
                content: {
                    idle: "./assets/hotspots/castle-locked.webp",
                    disabled: "./assets/hotspots/castle-locked.webp",
                },
                position: { x: 25.04, y: 27.24 },
                action: () => {},
                isDisabled: true,
                tooltip: {
                    content: "Castle Valdoria - you need permission to enter",
                    position: "bottom",
                },
                props: {
                    zoom: "40%",
                },
            });
        }

        // Dragon's Lair - conditional (only if castle cleared)
        if (environment.discoveredLocations.dragonLair) {
            hotspots.push({
                type: "image",
                content: {
                    idle: "./assets/hotspots/dragon-lair-idle.webp",
                    hover: "./assets/hotspots/dragon-lair-hover.webp",
                    active: "./assets/hotspots/dragon-lair-active.webp",
                },
                position: { x: 85, y: 15 },
                action: () => {
                    environment.visitCounts.dragonLair++;
                    Game.jumpTo("dragonLairMap");
                },
                tooltip: {
                    content: "Mount Doom - lair of Vexarion the Terrible",
                    position: "left",
                },
                props: {
                    zoom: "20%",
                },
            });
        } else {
            // Show mysterious mountain
            hotspots.push({
                type: "label",
                content: "???",
                position: { x: 85, y: 15 },
                action: () => {},
                isDisabled: true,
                tooltip: {
                    content: "A dark mountain shrouded in smoke and mystery",
                    position: "left",
                },
                props: {
                    variant: "ghost",
                    color: "danger",
                },
            });
        }

        // ===== MENU HOTSPOT (contextual actions on a location) =====
        // Crossroads with multiple options
        hotspots.push({
            type: "menu",
            position: { x: 52, y: 70 },
            direction: "vertical",
            items: [
                {
                    type: "label",
                    content: "Rest here",
                    action: () => {
                        const healAmount = Math.min(
                            player.maxHealth - player.health,
                            20
                        );
                        player.health = Math.min(
                            player.maxHealth,
                            player.health + 20
                        );
                        if (healAmount > 0) {
                            toast.success(
                                `Rested and recovered +${healAmount} HP`
                            );
                        } else {
                            toast.info("You're already at full health");
                        }
                        environment.timeOfDay =
                            environment.timeOfDay === "night"
                                ? "morning"
                                : environment.timeOfDay === "evening"
                                  ? "night"
                                  : environment.timeOfDay === "afternoon"
                                    ? "evening"
                                    : "afternoon";
                    },
                    props: { color: "success" },
                },
                {
                    type: "label",
                    content: "Check surroundings",
                    action: () => {
                        // Random chance to find gold
                        if (Math.random() > 0.7) {
                            player.gold += 5;
                            player.stats.goldEarned += 5;
                            toast.success(`You found some gold! (+5 gold)`);
                        } else {
                            toast.info("Nothing interesting found here");
                        }
                    },
                    props: { color: "secondary" },
                },
            ],
            props: { className: "bg-card/90 rounded-lg p-1" },
        });

        return hotspots;
    },

    classNames: {
        container: "bg-gradient-to-b from-sky-900/50 to-emerald-900/50",
        topHotspots: "p-3 bg-card/80 backdrop-blur-sm",
        bottomHotspots: "p-3 bg-card/80 backdrop-blur-sm",
    },
});
