import { describe, expect, test } from "bun:test";

import { diffSchemas } from "#diff";
import type { CheckResult, Finding, FindingCode } from "#types";

import { schemaOf } from "./helpers";

/**
 * Findings about the shape itself.
 *
 * @remarks
 * Drops the `missing-migration` note, which every shape-changing diff carries by
 * default because the migration registry is unknown unless a caller says
 * otherwise. The migration-chain behaviour has its own tests below.
 */
const shapeFindings = (result: CheckResult): Finding[] =>
    result.findings.filter((finding) => finding.code !== "missing-migration");

const codes = (
    baseline: Parameters<typeof diffSchemas>[0],
    current: Parameters<typeof diffSchemas>[1],
    pathExists?: boolean | null
): FindingCode[] =>
    shapeFindings(diffSchemas(baseline, current, pathExists)).map(
        (finding) => finding.code
    );

describe("diffSchemas", () => {
    test("reports nothing for an unchanged shape", () => {
        const shape = { player: "object", "player.name": "string" };
        const result = diffSchemas(schemaOf(shape), schemaOf(shape));

        expect(result.findings).toEqual([]);
        expect(result.migrationRequired).toBe(false);
        expect(result.migrationSatisfied).toBe(false);
    });

    test("treats a new field on an existing entity as harmless", () => {
        const result = diffSchemas(
            schemaOf({ player: "object", "player.name": "string" }),
            schemaOf({
                player: "object",
                "player.name": "string",
                "player.level": "number",
            })
        );

        expect(result.findings.map((finding) => finding.code)).toEqual([
            "field-added",
        ]);
        expect(result.findings[0]?.severity).toBe("info");
        expect(result.migrationRequired).toBe(false);
    });

    test("treats a whole new entity as needing a migration", () => {
        const result = diffSchemas(
            schemaOf({ player: "object" }, { gameVersion: "1.0.0" }),
            schemaOf(
                { player: "object", wallet: "object", "wallet.gold": "number" },
                { gameVersion: "2.0.0" }
            )
        );

        expect(shapeFindings(result).map((finding) => finding.code)).toEqual([
            "entity-added",
        ]);
        expect(shapeFindings(result)[0]?.severity).toBe("error");
        expect(result.migrationRequired).toBe(true);
    });

    test("does not list the fields of an added entity separately", () => {
        const result = diffSchemas(
            schemaOf({ player: "object" }, { gameVersion: "1.0.0" }),
            schemaOf(
                {
                    player: "object",
                    wallet: "object",
                    "wallet.gold": "number",
                    "wallet.notes": "string",
                },
                { gameVersion: "2.0.0" }
            )
        );

        expect(shapeFindings(result)).toHaveLength(1);
    });

    test("treats a removed entity as harmless dead data", () => {
        const result = diffSchemas(
            schemaOf({ player: "object", wallet: "object" }),
            schemaOf({ player: "object" })
        );

        expect(result.findings.map((finding) => finding.code)).toEqual([
            "entity-removed",
        ]);
        expect(result.migrationRequired).toBe(false);
    });

    test("pairs a removal and an addition of the same kind as a rename", () => {
        const result = diffSchemas(
            schemaOf(
                { player: "object", "player.name": "string" },
                { gameVersion: "1.0.0" }
            ),
            schemaOf(
                { player: "object", "player.title": "string" },
                { gameVersion: "2.0.0" }
            )
        );

        expect(shapeFindings(result).map((finding) => finding.code)).toEqual([
            "possible-rename",
        ]);
        expect(shapeFindings(result)[0]?.severity).toBe("warning");
        expect(shapeFindings(result)[0]?.message).toContain("player.title");
        expect(result.migrationRequired).toBe(true);
    });

    test("does not pair fields under different parents", () => {
        expect(
            codes(
                schemaOf({
                    player: "object",
                    wallet: "object",
                    "player.name": "string",
                }),
                schemaOf({
                    player: "object",
                    wallet: "object",
                    "wallet.name": "string",
                })
            ).sort()
        ).toEqual(["field-added", "field-removed"]);
    });

    test("does not pair fields of different kinds", () => {
        expect(
            codes(
                schemaOf({ player: "object", "player.name": "string" }),
                schemaOf({ player: "object", "player.title": "number" })
            ).sort()
        ).toEqual(["field-added", "field-removed"]);
    });

    test("reports a changed kind as needing a migration", () => {
        const result = diffSchemas(
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" }),
            schemaOf({ "player.age": "string" }, { gameVersion: "2.0.0" })
        );

        expect(shapeFindings(result).map((finding) => finding.code)).toEqual([
            "kind-changed",
        ]);
        expect(result.migrationRequired).toBe(true);
    });

    test("ignores a difference where either side was merely empty", () => {
        // currentPassageId is null until the game navigates, a string in any save.
        expect(
            diffSchemas(
                schemaOf({ "_system.game.currentPassageId": "null" }),
                schemaOf({ "_system.game.currentPassageId": "string" })
            ).findings
        ).toEqual([]);

        expect(
            diffSchemas(
                schemaOf({ "player.items": "array<unknown>" }),
                schemaOf({ "player.items": "array<string>" })
            ).findings
        ).toEqual([]);

        expect(
            diffSchemas(
                schemaOf({ "player.quest": "undefined" }),
                schemaOf({ "player.quest": "string" })
            ).findings
        ).toEqual([]);
    });

    test("reports a removed passage as needing a migration", () => {
        const result = diffSchemas(
            schemaOf(
                {},
                { gameVersion: "1.0.0", passages: ["intro", "attic"] }
            ),
            schemaOf({}, { gameVersion: "2.0.0", passages: ["intro"] })
        );

        expect(shapeFindings(result).map((finding) => finding.code)).toEqual([
            "passage-removed",
        ]);
        expect(shapeFindings(result)[0]?.subject).toBe("attic");
    });

    test("skips the passage check when either side does not know the registry", () => {
        expect(
            diffSchemas(
                schemaOf({}, { passages: ["intro", "attic"] }),
                schemaOf({}, { passages: null })
            ).findings
        ).toEqual([]);
    });

    test("flags a changed shape whose version was not bumped", () => {
        const result = diffSchemas(
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" }),
            schemaOf({ "player.age": "string" }, { gameVersion: "1.0.0" })
        );

        expect(result.findings.map((finding) => finding.code)).toContain(
            "version-not-bumped"
        );
        expect(result.migrationSatisfied).toBe(false);
    });

    test("does not complain about the version when nothing needs migrating", () => {
        expect(
            codes(
                schemaOf({ player: "object" }),
                schemaOf({ player: "object", "player.level": "number" })
            )
        ).not.toContain("version-not-bumped");
    });

    test("reports a missing migration when no chain covers the bump", () => {
        const result = diffSchemas(
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" }),
            schemaOf({ "player.age": "string" }, { gameVersion: "2.0.0" }),
            false
        );

        expect(result.findings.map((finding) => finding.code)).toContain(
            "missing-migration"
        );
        expect(result.migrationSatisfied).toBe(false);
    });

    test("counts the change as handled once a chain covers the bump", () => {
        const result = diffSchemas(
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" }),
            schemaOf({ "player.age": "string" }, { gameVersion: "2.0.0" }),
            true
        );

        expect(result.migrationRequired).toBe(true);
        expect(result.migrationSatisfied).toBe(true);
        expect(result.findings.map((finding) => finding.code)).not.toContain(
            "missing-migration"
        );
    });

    test("notes that the chain is unverified when the code was not imported", () => {
        const result = diffSchemas(
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" }),
            schemaOf({ "player.age": "string" }, { gameVersion: "2.0.0" }),
            null
        );

        const note = result.findings.find(
            (finding) => finding.code === "missing-migration"
        );

        expect(note?.severity).toBe("info");
        expect(result.migrationSatisfied).toBe(false);
    });

    test("orders errors before warnings before notes", () => {
        const result = diffSchemas(
            schemaOf(
                {
                    player: "object",
                    "player.age": "number",
                    "player.name": "string",
                },
                { gameVersion: "1.0.0" }
            ),
            schemaOf(
                {
                    player: "object",
                    "player.age": "string",
                    "player.title": "string",
                    "player.level": "number",
                },
                { gameVersion: "2.0.0" }
            )
        );

        expect(
            shapeFindings(result).map((finding) => finding.severity)
        ).toEqual(["error", "warning", "info"]);
    });

    test("reports the versions it compared", () => {
        const result = diffSchemas(
            schemaOf({}, { gameVersion: "1.2.3" }),
            schemaOf({}, { gameVersion: "4.5.6" })
        );

        expect(result.baselineVersion).toBe("1.2.3");
        expect(result.currentVersion).toBe("4.5.6");
    });
});
