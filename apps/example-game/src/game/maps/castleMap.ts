import type { AnyHotspot } from "@react-text-game/core";
import { Game, newInteractiveMap } from "@react-text-game/core";

import {
    kingAlderon,
    musicCastle,
    player,
    princessElara,
    sfxDoorOpen,
    switchBgMusic,
} from "../entities";

/**
 * Castle Map - Royal castle interior
 * Demonstrates:
 * - Multiple interior locations with image hotspots
 * - Conditional content based on quest progress
 * - NPC state-dependent hotspots
 * - Guards/restricted areas
 */
export const castleMap = newInteractiveMap("castleMap", {
    caption: "Castle Valdoria",
    image: "./assets/maps/castle-map.webp",
    bgImage: "./assets/backgrounds/castle-interior.webp",
    props: { bgOpacity: 0.2 },

    hotspots: (): AnyHotspot[] => {
        // Play castle music when map is displayed
        switchBgMusic(musicCastle);

        const hotspots: AnyHotspot[] = [];

        // TODO: fixme
        // // ===== TOP UI ELEMENTS =====
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

        // ===== MAIN LOCATIONS =====

        // Throne Room - main destination
        hotspots.push({
            type: "image",
            content: {
                idle: "./assets/hotspots/throne-idle.webp",
                hover: "./assets/hotspots/throne-hover.webp",
                active: "./assets/hotspots/throne-active.webp",
            },
            position: { x: 81.18, y: 49.72 },
            action: () => {
                sfxDoorOpen.play();
                Game.jumpTo("throneRoom");
            },
            tooltip: {
                content: () =>
                    kingAlderon.dialogue.gaveAudience
                        ? "The Throne Room - The King awaits"
                        : "The Throne Room - Seek audience with King Alderon",
                position: "bottom",
            },
            props: {
                zoom: "30%",
            },
        });

        // Castle Armory - special equipment
        hotspots.push({
            type: "label",
            content: "Royal Armory",
            position: { x: 20, y: 50 },
            action: () => {
                sfxDoorOpen.play();
                Game.jumpTo("castleArmory");
            },
            isDisabled: !player.quests.hasRoyalBlessing,
            props: {
                variant: player.quests.hasRoyalBlessing ? "solid" : "bordered",
                color: player.quests.hasRoyalBlessing ? "warning" : "default",
            },
            tooltip: {
                content: player.quests.hasRoyalBlessing
                    ? "Access granted - Browse the finest weapons"
                    : "Restricted - Only those with the King's blessing may enter",
                position: "right",
            },
        });

        // Princess's Tower - optional story
        if (
            princessElara.dialogue.introducedSelf ||
            player.quests.hasRoyalBlessing
        ) {
            hotspots.push({
                type: "image",
                content: {
                    idle: "./assets/hotspots/tower-idle.webp",
                    hover: "./assets/hotspots/tower-hover.webp",
                },
                position: { x: 80, y: 25 },
                action: () => {
                    sfxDoorOpen.play();
                    Game.jumpTo("princessTower");
                },
                tooltip: {
                    content: "Princess Elara's Tower",
                    position: "left",
                },
                props: {
                    zoom: "30%",
                },
            });
        }

        // Castle Gardens - healing/rest area
        hotspots.push({
            type: "label",
            content: "Royal Gardens",
            position: { x: 50.83, y: 92.92 },
            action: () => {
                sfxDoorOpen.play();
                Game.jumpTo("castleGardens");
            },
            props: { color: "success" },
            tooltip: {
                content: "A peaceful place to rest and restore health",
                position: "top",
            },
        });

        // ===== NAVIGATION MENU =====
        hotspots.push({
            type: "menu",
            position: { x: 50, y: 5 },
            direction: "horizontal",
            items: [
                {
                    type: "label",
                    content: "Leave Castle",
                    action: () => Game.jumpTo("worldMap"),
                    props: {
                        variant: "bordered",
                        color: "default",
                    },
                },
                {
                    type: "label",
                    content: () => {
                        if (player.quests.hasRoyalBlessing)
                            return "Quest: Slay the Dragon";
                        if (player.quests.talkedToKing)
                            return "Quest: Prove Yourself";
                        return "Quest: Seek the King";
                    },
                    action: () => {},
                    isDisabled: true,
                    props: {
                        variant: "flat",
                        color: "primary",
                    },
                },
            ],
        });

        return hotspots;
    },

    classNames: {
        container: "bg-gradient-to-b from-stone-800/50 to-stone-900/50",
        topHotspots: "p-3 bg-card/80 backdrop-blur-sm",
        bottomHotspots: "p-3 bg-card/80 backdrop-blur-sm",
    },
});
