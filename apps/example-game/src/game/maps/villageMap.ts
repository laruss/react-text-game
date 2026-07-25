import type { AnyHotspot } from "@react-text-game/core";
import { defineInteractiveMap, Game } from "@react-text-game/core";

import {
    elderMarcus,
    environment,
    musicVillage,
    sfxDoorOpen,
    switchBgMusic,
} from "../entities";

/**
 * Village Map - Millbrook Village interior
 * Demonstrates:
 * - Multiple location hotspots within a single map
 * - Left/Right side hotspots for navigation
 * - Dynamic hotspots based on quest state
 * - Image hotspots for buildings
 */
export const villageMap = defineInteractiveMap(
    "villageMap",
    (h): AnyHotspot[] => {
        // Play village music when map is displayed
        switchBgMusic(musicVillage);

        const hotspots: AnyHotspot[] = [];

        // ===== MAP HOTSPOTS - Buildings =====

        // Tavern - "The Golden Flagon"
        hotspots.push(
            h.image(
                {
                    idle: "./assets/hotspots/tavern-idle.webp",
                    hover: "./assets/hotspots/tavern-hover.webp",
                },
                {
                    position: { x: 30, y: 39 },
                    action: () => {
                        sfxDoorOpen.play();
                        environment.visitCounts.tavern++;
                        Game.jumpTo("tavernStory");
                    },
                    tooltip: {
                        content: "The Golden Flagon - local tavern",
                        position: "top",
                    },
                    zoom: "20%",
                }
            )
        );

        // Label for tavern
        hotspots.push(
            h.label("The Golden Flagon", {
                position: { x: 30, y: 55 },
                action: () => {
                    sfxDoorOpen.play();
                    environment.visitCounts.tavern++;
                    Game.jumpTo("tavernStory");
                },
                variant: "flat",
                color: "secondary",
                classNames: { button: "text-xs" },
            })
        );

        // Blacksmith
        hotspots.push(
            h.image(
                {
                    idle: "./assets/hotspots/blacksmith-idle.webp",
                    hover: "./assets/hotspots/blacksmith-hover.webp",
                },
                {
                    position: { x: 70, y: 35 },
                    action: () => {
                        sfxDoorOpen.play();
                        environment.visitCounts.blacksmith++;
                        Game.jumpTo("blacksmithStory");
                    },
                    tooltip: {
                        content: "Gareth's Smithy - weapons and armor",
                        position: "top",
                    },
                    zoom: "20%",
                }
            )
        );

        // Label for blacksmith
        hotspots.push(
            h.label("Gareth's Smithy", {
                position: { x: 70, y: 50 },
                action: () => {
                    sfxDoorOpen.play();
                    environment.visitCounts.blacksmith++;
                    Game.jumpTo("blacksmithStory");
                },
                variant: "flat",
                color: "warning",
                classNames: { button: "text-xs" },
            })
        );

        // Elder's House - Quest Giver
        hotspots.push(
            h.image(
                {
                    idle: "./assets/hotspots/elder-house-idle.webp",
                    hover: "./assets/hotspots/elder-house-hover.webp",
                },
                {
                    position: { x: 69.13, y: 71.78 },
                    action: () => {
                        sfxDoorOpen.play();
                        Game.jumpTo("questGiverStory");
                    },
                    tooltip: {
                        content: () =>
                            elderMarcus.questState === "not_started"
                                ? "Elder Marcus's House - he wishes to speak with you"
                                : elderMarcus.questState === "accepted"
                                  ? "Elder Marcus's House - return when the quest is complete"
                                  : "Elder Marcus's House",
                        position: "bottom",
                    },
                    zoom: "20%",
                }
            )
        );

        // Quest marker if quest available
        if (elderMarcus.questState === "not_started") {
            hotspots.push(
                h.label("!", {
                    position: { x: 69.13, y: 71.78 },
                    action: () => {
                        sfxDoorOpen.play();
                        Game.jumpTo("questGiverStory");
                    },
                    tooltip: {
                        content: "Quest available!",
                        position: "top",
                    },
                    variant: "solid",
                    color: "warning",
                    classNames: { button: "text-lg font-bold animate-pulse" },
                })
            );
        }

        // ===== NAVIGATION MENU =====
        hotspots.push(
            h.menu(
                [
                    h.label("< World Map", {
                        action: () => Game.jumpTo("worldMap"),
                        variant: "bordered",
                        color: "default",
                    }),
                    h.label(
                        () =>
                            environment.visitCounts.village === 1
                                ? "Welcome to Millbrook Village, your home"
                                : `Millbrook Village (visited ${environment.visitCounts.village} times)`,
                        {
                            action: () => {},
                            isDisabled: true,
                            variant: "flat",
                            color: "default",
                            classNames: { button: "text-sm italic" },
                        }
                    ),
                ],
                { position: { x: 50, y: 5 }, direction: "horizontal" }
            )
        );

        return hotspots;
    },
    {
        caption: "Millbrook Village",
        image: "./assets/maps/village-map.webp",
        bgImage: "./assets/backgrounds/village-background.webp",
        props: { bgOpacity: 0.2 },
        classNames: {
            container: "bg-gradient-to-b from-amber-900/30 to-emerald-900/30",
            topHotspots: "p-2 bg-card/70 backdrop-blur-sm",
            bottomHotspots: "p-2 bg-card/70 backdrop-blur-sm",
            leftHotspots: "p-2 bg-card/70 backdrop-blur-sm",
            rightHotspots: "p-2 bg-card/70 backdrop-blur-sm",
        },
    }
);
