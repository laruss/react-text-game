import { Game, newStory } from "@react-text-game/core";

import { musicMainTheme, musicVillage, player, switchMusic } from "../entities";

/**
 * Intro story - the opening sequence
 * Demonstrates:
 * - Headers (multiple levels)
 * - Text (styled, long form)
 * - Video (cutscene placeholder)
 * - Image (scene image)
 * - Actions (single choice to continue)
 */
export const introStory = newStory(
    "start-passage",
    () => {
        // Start the main theme music when entering the intro
        void musicMainTheme.play();

        return [
            // Chapter title - demonstrates h1 header
            {
                type: "header",
                content: "Prologue: The Dragon's Shadow",
                props: { level: 1, className: "text-primary-400" },
            },

            // Opening video/cutscene placeholder
            {
                type: "video",
                content: "./assets/video/intro-cutscene.mp4",
                props: {
                    className: "rounded-lg shadow-xl my-6",
                    controls: true,
                    autoPlay: true,
                    loop: true,
                    muted: true,
                },
            },

            // Scene-setting text
            {
                type: "text",
                content: `The Kingdom of Valdoria has known peace for a hundred years. Under the wise rule of King Alderon III, the realm has flourished, its people prosperous and content.`,
                props: { className: "text-lg leading-relaxed" },
            },

            // Scene image
            {
                type: "image",
                content: "./assets/backgrounds/kingdom-overview.webp",
                props: {
                    alt: "The peaceful Kingdom of Valdoria",
                    className: "rounded-lg shadow-lg my-4",
                },
            },

            // More narrative text
            {
                type: "text",
                content: `But darkness stirs in the mountains to the north. Vexarion, a dragon of terrible power, has awakened from his centuries-long slumber. His shadow now falls upon the land, and his fiery breath threatens all that Valdoria holds dear.`,
                props: { className: "text-lg leading-relaxed" },
            },

            // Subheader for player introduction
            {
                type: "header",
                content: "Your Story Begins",
                props: { level: 2, className: "text-secondary-400 mt-8" },
            },

            // Player introduction - dynamic with player name
            {
                type: "text",
                content: `You are ${player.name}, ${player.title}. Though young, your courage and skill with a blade have earned you respect among your peers. When news of the dragon's awakening reached the village of Millbrook, you knew your moment had come.`,
                props: { className: "text-lg leading-relaxed" },
            },

            // Another scene image
            {
                type: "image",
                content: "./assets/characters/knight-portrait.webp",
                props: {
                    alt: `${player.name}, Knight of Valdoria`,
                    className: "rounded-lg shadow-lg my-4 max-w-md mx-auto",
                },
            },

            // Quest hook text
            {
                type: "text",
                content: `The village elder has summoned all able warriors to discuss the threat. Perhaps this is your chance to prove yourself and bring honor to your name. The road ahead is dangerous, but glory awaits those brave enough to face the dragon.`,
                props: { className: "text-lg leading-relaxed italic" },
            },

            // Additional dramatic text with HTML formatting
            {
                type: "text",
                content: `<p class="text-center text-xl font-semibold text-primary-400 my-6">Your destiny awaits...</p>`,
                props: { isHTML: true },
            },

            // Action to continue
            {
                type: "actions",
                props: { direction: "vertical", className: "mt-8" },
                content: [
                    {
                        label: "Begin Your Quest",
                        action: async () => {
                            void switchMusic(musicVillage, musicMainTheme);
                            Game.jumpTo("worldMap");
                        },
                        color: "primary",
                        variant: "solid",
                        className: "text-lg py-3 px-8",
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/parchment.webp",
        },
        classNames: {
            base: "min-h-screen",
            container: "max-w-3xl mx-auto py-8 px-6",
        },
    }
);
