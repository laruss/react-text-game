import { createEntity, newStory } from "@react-text-game/core";

/**
 * A game module with no declared version, so the version has to come from the
 * nearest package.json.
 *
 * @remarks
 * Entity and passage ids are unique per fixture: the engine's registries are
 * module-level and shared across every test in the run.
 */
export const fixturePlayer = createEntity("fixture-plain-player", {
    name: "Ada",
    level: 3,
    inventory: { money: 10, items: [] as string[] },
});

export const fixtureStory = newStory("fixture-plain-story", () => []);
