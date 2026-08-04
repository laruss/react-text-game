import { describe, expect, test } from "bun:test";
import { encodeSf } from "@react-text-game/core/saves";

import {
    SYSTEM_SAVE_NAME,
    schemaFromDump,
    schemaFromSaveFile,
} from "#artifacts";

const GAME_ID = "artifact-game";

const gameData = {
    _system: { game: { currentPassageId: "intro" } },
    player: { name: "Ada", inventory: { items: ["axe"] } },
};

const record = (overrides: Record<string, unknown> = {}) => ({
    name: "1",
    gameData,
    timestamp: new Date(),
    version: "0.1.0",
    ...overrides,
});

const saveFile = (payload: unknown, gameId = GAME_ID): Uint8Array =>
    encodeSf(payload, gameId);

describe("schemaFromSaveFile", () => {
    test("derives a schema from an exported save", () => {
        const schema = schemaFromSaveFile(saveFile([record()]), GAME_ID);

        expect(schema.gameVersion).toBe("0.1.0");
        expect(schema.capturedFrom).toBe("save");
        expect(schema.entities).toEqual(["player"]);
        // A populated save reveals an element type an empty default would hide.
        expect(schema.paths["player.inventory.items"]).toBe("array<string>");
    });

    test("leaves the passage registry unknown", () => {
        expect(
            schemaFromSaveFile(saveFile([record()]), GAME_ID).passages
        ).toBeNull();
    });

    test("accepts a single record that is not wrapped in an array", () => {
        expect(
            schemaFromSaveFile(saveFile(record()), GAME_ID).entities
        ).toEqual(["player"]);
    });

    test("explains a gameId mismatch", () => {
        expect(() =>
            schemaFromSaveFile(saveFile([record()]), "wrong-game")
        ).toThrow('Could not decrypt this save file with gameId "wrong-game"');
    });

    test("rejects a file holding no save records", () => {
        expect(() => schemaFromSaveFile(saveFile([1, 2]), GAME_ID)).toThrow(
            "holds no save records"
        );
    });

    test("unions the slots of one version", () => {
        const schema = schemaFromSaveFile(
            saveFile([
                record({ name: "1", gameData: { player: { a: 1 } } }),
                record({ name: "2", gameData: { wallet: { gold: 2 } } }),
            ]),
            GAME_ID
        );

        expect(schema.entities).toEqual(["player", "wallet"]);
    });

    test("refuses to guess between several versions", () => {
        expect(() =>
            schemaFromSaveFile(
                saveFile([record(), record({ version: "0.2.0" })]),
                GAME_ID
            )
        ).toThrow("saves from several versions (0.1.0, 0.2.0)");
    });

    test("picks the requested version out of a mixed file", () => {
        const schema = schemaFromSaveFile(
            saveFile([
                record({ gameData: { player: {} } }),
                record({ version: "0.2.0", gameData: { wallet: {} } }),
            ]),
            GAME_ID,
            "0.2.0"
        );

        expect(schema.gameVersion).toBe("0.2.0");
        expect(schema.entities).toEqual(["wallet"]);
    });

    test("reports when no save matches the requested version", () => {
        expect(() =>
            schemaFromSaveFile(saveFile([record()]), GAME_ID, "9.9.9")
        ).toThrow("holds no save for version 9.9.9");
    });

    test("asks for a version when the records state none", () => {
        expect(() =>
            schemaFromSaveFile(saveFile([{ gameData }]), GAME_ID)
        ).toThrow("records no game version");
    });

    test("prefers the pristine system record over a played slot", () => {
        const schema = schemaFromSaveFile(
            saveFile([
                record({ gameData: { player: { playedOnly: 1 } } }),
                record({
                    name: SYSTEM_SAVE_NAME,
                    gameData: { player: { pristine: 1 } },
                }),
            ]),
            GAME_ID
        );

        expect(Object.keys(schema.paths)).toEqual([
            "player",
            "player.pristine",
        ]);
    });
});

describe("schemaFromDump", () => {
    test("reads a single IndexedDB row", () => {
        const schema = schemaFromDump(record({ name: SYSTEM_SAVE_NAME }));

        expect(schema.capturedFrom).toBe("dump");
        expect(schema.gameVersion).toBe("0.1.0");
        expect(schema.entities).toEqual(["player"]);
    });

    test("reads a whole table copy", () => {
        expect(
            schemaFromDump([record(), record({ name: "2" })]).entities
        ).toEqual(["player"]);
    });

    test("reads a bare state object when told the version", () => {
        const schema = schemaFromDump(gameData, "0.5.0");

        expect(schema.gameVersion).toBe("0.5.0");
        expect(schema.entities).toEqual(["player"]);
    });

    test("asks for a version when given a bare state object", () => {
        expect(() => schemaFromDump(gameData)).toThrow(
            "bare state object with no version"
        );
    });

    test("rejects a dump with no state at all", () => {
        expect(() => schemaFromDump({})).toThrow("holds no save state");
        expect(() => schemaFromDump([])).toThrow("holds no save state");
        expect(() => schemaFromDump(null)).toThrow("holds no save state");
    });
});
