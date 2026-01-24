import { createEntity } from "@react-text-game/core";

/**
 * Environment entity - tracks world state
 * Demonstrates: createEntity for non-player state, location discovery, time/weather
 */
export const environment = createEntity("environment", {
    // Time of day affects some descriptions and events
    timeOfDay: "morning" as "morning" | "afternoon" | "evening" | "night",

    // Weather affects atmosphere
    weather: "clear" as "clear" | "cloudy" | "rainy" | "stormy",

    // Discovered locations - unlocks hotspots on world map
    discoveredLocations: {
        village: true, // Start with village discovered
        forest: true, // Forest is also accessible from start
        castle: false, // Unlocked after starting main quest
        dragonLair: false, // Unlocked after getting royal blessing
    },

    // Location visit counts for dynamic content
    visitCounts: {
        village: 0,
        tavern: 0,
        blacksmith: 0,
        forest: 0,
        castle: 0,
        dragonLair: 0,
    },

    // World events that have occurred
    worldEvents: {
        dragonAttackAnnounced: false,
        villageInPanic: false,
        castleOnAlert: false,
        dragonDefeated: false,
        peacefulEnding: false,
    },

    // Current chapter for story progression
    currentChapter: 1,
});

// Helper functions for environment
export const environmentActions = {
    discoverLocation: (
        location: keyof typeof environment.discoveredLocations
    ) => {
        environment.discoveredLocations[location] = true;
    },

    isLocationDiscovered: (
        location: keyof typeof environment.discoveredLocations
    ) => {
        return environment.discoveredLocations[location];
    },

    incrementVisitCount: (location: keyof typeof environment.visitCounts) => {
        environment.visitCounts[location]++;
    },

    getVisitCount: (location: keyof typeof environment.visitCounts) => {
        return environment.visitCounts[location];
    },

    advanceTime: () => {
        const times: Array<"morning" | "afternoon" | "evening" | "night"> = [
            "morning",
            "afternoon",
            "evening",
            "night",
        ];
        const currentIndex = times.indexOf(environment.timeOfDay);
        environment.timeOfDay = times[(currentIndex + 1) % times.length];
    },

    setWeather: (weather: typeof environment.weather) => {
        environment.weather = weather;
    },

    triggerWorldEvent: (event: keyof typeof environment.worldEvents) => {
        environment.worldEvents[event] = true;
    },

    advanceChapter: () => {
        environment.currentChapter++;
    },
};
