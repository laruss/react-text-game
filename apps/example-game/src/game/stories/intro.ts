import { defineStory, Game } from "@react-text-game/core";

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
export const introStory = defineStory(
    "start-passage",
    (h) => {
        // Start the main theme music when entering the intro
        void musicMainTheme.play();

        return [
            // Chapter title - demonstrates h1 header
            h.header("Prologue: The Dragon's Shadow", {
                level: 1,
                className: "text-primary-400",
            }),

            // Opening video/cutscene placeholder
            h.video("./assets/video/intro-cutscene.mp4", {
                className: "rounded-lg shadow-xl my-6",
                controls: true,
                autoPlay: true,
                loop: true,
                muted: true,
            }),

            // Scene-setting text
            h.text(
                `The Kingdom of Valdoria has known peace for a hundred years. Under the wise rule of King Alderon III, the realm has flourished, its people prosperous and content.`,
                { className: "text-lg leading-relaxed" }
            ),

            // Scene image
            h.image("./assets/backgrounds/kingdom-overview.webp", {
                alt: "The peaceful Kingdom of Valdoria",
                className: "rounded-lg shadow-lg my-4",
            }),

            // More narrative text
            h.text(
                `But darkness stirs in the mountains to the north. Vexarion, a dragon of terrible power, has awakened from his centuries-long slumber. His shadow now falls upon the land, and his fiery breath threatens all that Valdoria holds dear.`,
                { className: "text-lg leading-relaxed" }
            ),

            // Subheader for player introduction
            h.header("Your Story Begins", {
                level: 2,
                className: "text-secondary-400 mt-8",
            }),

            // Player introduction - dynamic with player name
            h.text(
                `You are ${player.name}, ${player.title}. Though young, your courage and skill with a blade have earned you respect among your peers. When news of the dragon's awakening reached the village of Millbrook, you knew your moment had come.`,
                { className: "text-lg leading-relaxed" }
            ),

            // Another scene image
            h.image("./assets/characters/knight-portrait.webp", {
                alt: `${player.name}, Knight of Valdoria`,
                className: "rounded-lg shadow-lg my-4 max-w-md mx-auto",
            }),

            // Quest hook text
            h.text(
                `The village elder has summoned all able warriors to discuss the threat. Perhaps this is your chance to prove yourself and bring honor to your name. The road ahead is dangerous, but glory awaits those brave enough to face the dragon.`,
                { className: "text-lg leading-relaxed italic" }
            ),

            // Additional dramatic text with HTML formatting
            h.text(
                `<p class="text-center text-xl font-semibold text-primary-400 my-6">Your destiny awaits...</p>`,
                { isHTML: true }
            ),

            // Action to continue
            h.actions(
                [
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
                { direction: "vertical", className: "mt-8" }
            ),
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
