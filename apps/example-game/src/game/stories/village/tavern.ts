import { Game, newStory } from "@react-text-game/core";

import { player, tavernKeeper } from "@/game/entities";

/**
 * Tavern Story - The Golden Flagon
 * Demonstrates:
 * - Conversations with "byClick" appearance (progressive reveal)
 * - Conversations with avatars
 * - Conversations with custom colors
 * - Both left and right sides
 * - Dynamic content based on NPC state
 * - Actions after conversation
 */
export const tavernStory = newStory(
    "tavernStory",
    () => {
        // Increment conversation count
        tavernKeeper.conversationCount++;

        const isFirstVisit = tavernKeeper.conversationCount === 1;

        // Update rumor flags when visiting
        const learnedDragonRumor = !tavernKeeper.rumors.dragonSighting;
        const learnedCastleRumor = !tavernKeeper.rumors.castleSecret;
        const learnedForestRumor = !tavernKeeper.rumors.forestTreasure;

        // Set flags
        if (learnedDragonRumor) {
            tavernKeeper.rumors.dragonSighting = true;
            player.flags.heardRumorAboutDragon = true;
        }
        if (learnedCastleRumor) {
            tavernKeeper.rumors.castleSecret = true;
        }
        if (learnedForestRumor) {
            tavernKeeper.rumors.forestTreasure = true;
        }
        tavernKeeper.dialogue.servedDrink = true;

        return [
            // Scene header
            {
                type: "header",
                content: "The Golden Flagon",
                props: { level: 1, className: "text-amber-400" },
            },

            // Scene description
            {
                type: "text",
                content: `The tavern is warm and inviting, filled with the scent of roasting meat and fresh bread. 
                ${isFirstVisit ? "Martha, the tavern keeper, looks up as you enter and waves you over with a friendly smile." : "Martha nods in recognition as you approach the bar."}`,
                props: { className: "text-lg mb-4" },
            },

            // Scene image
            {
                type: "image",
                content: "./assets/backgrounds/tavern-interior.webp",
                props: {
                    alt: "Inside The Golden Flagon tavern",
                    className: "rounded-lg shadow-lg mb-6",
                },
            },

            // Conversation with Martha - byClick for interactive feel
            {
                type: "conversation",
                appearance: "byClick",
                props: { variant: "messenger", className: "my-6" },
                content: [
                    // Martha's greeting
                    {
                        content: isFirstVisit
                            ? `Well, well! If it isn't young ${player.name}! What brings you to my humble establishment today?`
                            : `Back again, ${player.name}? What can I get for you?`,
                        who: {
                            name: "Martha",
                            avatar: "./assets/avatars/martha.webp",
                        },
                        side: "left",
                        color: "#8B4513", // Brown for Martha
                    },
                    // Player response
                    {
                        content: isFirstVisit
                            ? "Good day, Martha. I've heard rumors about trouble in the kingdom. What do you know?"
                            : "Any news worth sharing today, Martha?",
                        who: {
                            name: player.name,
                            avatar: "./assets/avatars/knight.webp",
                        },
                        side: "right",
                        color: "#4169E1", // Royal blue for player
                    },
                    // Martha's response about rumors
                    {
                        content: `*Martha leans in closer and lowers her voice*\n\nAye, there's been talk. Dark talk, ${player.name}.`,
                        who: {
                            name: "Martha",
                            avatar: "./assets/avatars/martha.webp",
                        },
                        side: "left",
                        color: "#8B4513",
                    },
                    // Dragon rumor
                    ...(learnedDragonRumor
                        ? [
                              {
                                  content:
                                      "They say a dragon has awakened in the northern mountains. Farmers have seen smoke rising from Mount Doom, and some claim to have heard terrible roars in the night.",
                                  who: {
                                      name: "Martha",
                                      avatar: "./assets/avatars/martha.webp",
                                  },
                                  side: "left" as const,
                                  color: "#8B4513" as const,
                              },
                              {
                                  content:
                                      "A dragon? That's troubling news indeed. Has anyone done anything about it?",
                                  who: {
                                      name: player.name,
                                      avatar: "./assets/avatars/knight.webp",
                                  },
                                  side: "right" as const,
                                  color: "#4169E1" as const,
                              },
                          ]
                        : []),
                    // Castle rumor
                    ...(learnedCastleRumor
                        ? [
                              {
                                  content:
                                      "The King has sent messengers throughout the realm, seeking brave warriors. But there's something else... *she glances around nervously* ...they say the Princess herself ventured north three days ago and hasn't returned.",
                                  who: {
                                      name: "Martha",
                                      avatar: "./assets/avatars/martha.webp",
                                  },
                                  side: "left" as const,
                                  color: "#8B4513" as const,
                              },
                          ]
                        : []),
                    // Forest treasure hint
                    ...(learnedForestRumor
                        ? [
                              {
                                  content:
                                      "Oh, and one more thing. Old Tom the woodcutter swears he saw something glinting in the heart of the Whispering Woods. Could be treasure, could be danger. Who knows with that cursed forest?",
                                  who: {
                                      name: "Martha",
                                      avatar: "./assets/avatars/martha.webp",
                                  },
                                  side: "left" as const,
                                  color: "#8B4513" as const,
                              },
                          ]
                        : []),
                    // Final exchange
                    {
                        content:
                            "Thank you for the information, Martha. I should investigate these matters.",
                        who: {
                            name: player.name,
                            avatar: "./assets/avatars/knight.webp",
                        },
                        side: "right",
                        color: "#4169E1",
                    },
                    {
                        content: `Be careful out there, ${player.name}. The world's become a dangerous place. Here, have some bread for the road - on the house.`,
                        who: {
                            name: "Martha",
                            avatar: "./assets/avatars/martha.webp",
                        },
                        side: "left",
                        color: "#8B4513",
                    },
                ],
            },

            // Text after conversation
            {
                type: "text",
                content:
                    "*Martha hands you a small loaf of fresh bread. The warmth is comforting.*",
                props: {
                    className: "italic text-muted-foreground text-center my-4",
                },
            },

            // Actions
            {
                type: "actions",
                props: { direction: "vertical", className: "mt-6" },
                content: [
                    {
                        label: "Return to Village",
                        action: () => Game.jumpTo("villageMap"),
                        color: "primary",
                        variant: "solid",
                    },
                    {
                        label: "Ask about the blacksmith",
                        action: () => {
                            tavernKeeper.rumors.blacksmithSecret = true;
                            Game.jumpTo("blacksmithHint");
                        },
                        color: "secondary",
                        variant: "bordered",
                        isDisabled: tavernKeeper.rumors.blacksmithSecret,
                        tooltip: tavernKeeper.rumors.blacksmithSecret
                            ? {
                                  content: "You already asked about this",
                                  position: "top",
                              }
                            : undefined,
                    },
                ],
            },
        ];
    },
    {
        background: {
            image: "./assets/backgrounds/tavern-interior.webp",
        },
        classNames: {
            base: "min-h-screen bg-cover bg-center",
            container:
                "max-w-3xl mx-auto py-8 px-6 bg-card/90 backdrop-blur-sm",
        },
    }
);

// Bonus story about the blacksmith (demonstrates anotherStory component)
newStory("blacksmithHint", () => [
    {
        type: "header",
        content: "A Secret About Gareth",
        props: { level: 2, className: "text-amber-400" },
    },
    {
        type: "conversation",
        appearance: "atOnce", // Shows all at once
        props: { variant: "chat" },
        content: [
            {
                content:
                    "*Martha's eyes light up* Ah, old Gareth! Did you know he used to be a royal blacksmith at the castle? He made armor for the King's own guard!",
                who: { name: "Martha", avatar: "./assets/avatars/martha.webp" },
                side: "left",
                color: "#8B4513",
            },
            {
                content: "Really? Why did he leave?",
                who: {
                    name: player.name,
                    avatar: "./assets/avatars/knight.webp",
                },
                side: "right",
                color: "#4169E1",
            },
            {
                content:
                    "Something about a disagreement with the King's advisor. But I'll tell you this - if you need the finest weapons in the realm, Gareth's your man. Mention my name and he might give you a discount!",
                who: { name: "Martha", avatar: "./assets/avatars/martha.webp" },
                side: "left",
                color: "#8B4513",
            },
        ],
    },
    {
        type: "actions",
        props: { direction: "horizontal" },
        content: [
            {
                label: "Continue",
                action: () => Game.jumpTo("tavernStory"),
                color: "primary",
            },
        ],
    },
]);
