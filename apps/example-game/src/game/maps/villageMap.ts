import type { AnyHotspot } from "@react-text-game/core";
import { Game, newInteractiveMap } from "@react-text-game/core";

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
export const villageMap = newInteractiveMap("villageMap", {
    caption: "Millbrook Village",
    image: "./assets/maps/village-map.webp",
    bgImage: "./assets/backgrounds/village-background.webp",
    props: { bgOpacity: 0.2 },

    hotspots: (): AnyHotspot[] => {
        // Play village music when map is displayed
        switchBgMusic(musicVillage);

        const hotspots: AnyHotspot[] = [];

        // ===== MAP HOTSPOTS - Buildings =====

        // Tavern - "The Golden Flagon"
        hotspots.push({
            type: "image",
            content: {
                idle: "./assets/hotspots/tavern-idle.webp",
                hover: "./assets/hotspots/tavern-hover.webp",
            },
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
            props: {
                zoom: "20%",
            },
        });

        // Label for tavern
        hotspots.push({
            type: "label",
            content: "The Golden Flagon",
            position: { x: 30, y: 55 },
            action: () => {
                sfxDoorOpen.play();
                environment.visitCounts.tavern++;
                Game.jumpTo("tavernStory");
            },
            props: {
                variant: "flat",
                color: "secondary",
                classNames: { button: "text-xs" },
            },
        });

        // Blacksmith
        hotspots.push({
            type: "image",
            content: {
                idle: "./assets/hotspots/blacksmith-idle.webp",
                hover: "./assets/hotspots/blacksmith-hover.webp",
            },
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
            props: {
                zoom: "20%",
            },
        });

        // Label for blacksmith
        hotspots.push({
            type: "label",
            content: "Gareth's Smithy",
            position: { x: 70, y: 50 },
            action: () => {
                sfxDoorOpen.play();
                environment.visitCounts.blacksmith++;
                Game.jumpTo("blacksmithStory");
            },
            props: {
                variant: "flat",
                color: "warning",
                classNames: { button: "text-xs" },
            },
        });

        // Elder's House - Quest Giver
        hotspots.push({
            type: "image",
            content: {
                idle: "./assets/hotspots/elder-house-idle.webp",
                hover: "./assets/hotspots/elder-house-hover.webp",
            },
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
            props: {
                zoom: "20%",
            },
        });

        // Quest marker if quest available
        if (elderMarcus.questState === "not_started") {
            hotspots.push({
                type: "label",
                content: "!",
                position: { x: 69.13, y: 71.78 },
                action: () => {
                    sfxDoorOpen.play();
                    Game.jumpTo("questGiverStory");
                },
                props: {
                    variant: "solid",
                    color: "warning",
                    classNames: { button: "text-lg font-bold animate-pulse" },
                },
                tooltip: {
                    content: "Quest available!",
                    position: "top",
                },
            });
        }

        // ===== NAVIGATION MENU =====
        hotspots.push({
            type: "menu",
            position: { x: 50, y: 5 },
            direction: "horizontal",
            items: [
                {
                    type: "label",
                    content: "< World Map",
                    action: () => Game.jumpTo("worldMap"),
                    props: {
                        variant: "bordered",
                        color: "default",
                    },
                },
                {
                    type: "label",
                    content: () =>
                        environment.visitCounts.village === 1
                            ? "Welcome to Millbrook Village, your home"
                            : `Millbrook Village (visited ${environment.visitCounts.village} times)`,
                    action: () => {},
                    isDisabled: true,
                    props: {
                        variant: "flat",
                        color: "default",
                        classNames: { button: "text-sm italic" },
                    },
                },
            ],
        });

        return hotspots;
    },

    classNames: {
        container: "bg-gradient-to-b from-amber-900/30 to-emerald-900/30",
        topHotspots: "p-2 bg-card/70 backdrop-blur-sm",
        bottomHotspots: "p-2 bg-card/70 backdrop-blur-sm",
        leftHotspots: "p-2 bg-card/70 backdrop-blur-sm",
        rightHotspots: "p-2 bg-card/70 backdrop-blur-sm",
    },
});
