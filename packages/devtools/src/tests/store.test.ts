import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
    compareVersions,
    findLatestSchema,
    readSchema,
    snapshotPath,
    writeSchema,
} from "#store";
import { SCHEMA_VERSION } from "#types";

import { makeTempDir, removeTempDir, schemaOf } from "./helpers";

let directory: string;

beforeEach(async () => {
    directory = await makeTempDir();
});

afterEach(async () => {
    await removeTempDir(directory);
});

describe("compareVersions", () => {
    test("orders by numeric segments rather than as strings", () => {
        expect(compareVersions("0.10.0", "0.9.0")).toBeGreaterThan(0);
        expect(compareVersions("0.9.0", "0.10.0")).toBeLessThan(0);
    });

    test("treats equal versions as equal", () => {
        expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
    });

    test("falls back to a string comparison for non-numeric segments", () => {
        expect(compareVersions("1.0.0-rc.1", "1.0.0-rc.2")).toBeLessThan(0);
        expect(compareVersions("1.0.0-beta", "1.0.0-alpha")).toBeGreaterThan(0);
    });

    test("pads a shorter version with empty segments", () => {
        expect(compareVersions("1.1", "1.0.5")).toBeGreaterThan(0);
    });
});

describe("snapshotPath", () => {
    test("names the file after the version", () => {
        expect(snapshotPath("save-schemas", "0.2.0")).toBe(
            join("save-schemas", "0.2.0.json")
        );
    });
});

describe("writeSchema and readSchema", () => {
    test("round-trips a schema, creating missing directories", async () => {
        const path = join(directory, "nested", "deeper", "0.1.0.json");
        const schema = schemaOf({ player: "object" });

        await writeSchema(path, schema);

        expect(await readSchema(path)).toEqual(schema);
    });

    test("writes indented JSON with a trailing newline", async () => {
        const path = join(directory, "0.1.0.json");
        await writeSchema(path, schemaOf({ player: "object" }));

        const raw = await Bun.file(path).text();

        expect(raw.endsWith("}\n")).toBe(true);
        expect(raw).toContain('\n    "gameVersion"');
    });

    test("reports an unreadable file", async () => {
        await expect(
            readSchema(join(directory, "absent.json"))
        ).rejects.toThrow("Cannot read");
    });

    test("reports a file that is not JSON", async () => {
        const path = join(directory, "broken.json");
        await writeFile(path, "not json", "utf8");

        await expect(readSchema(path)).rejects.toThrow("is not valid JSON");
    });

    test("rejects a snapshot from an incompatible format version", async () => {
        const path = join(directory, "old.json");
        await writeFile(
            path,
            JSON.stringify({ schemaVersion: SCHEMA_VERSION + 1 }),
            "utf8"
        );

        await expect(readSchema(path)).rejects.toThrow("understands version 1");
    });

    test("rejects JSON that is not an object", async () => {
        const path = join(directory, "array.json");
        await writeFile(path, "[]", "utf8");

        await expect(readSchema(path)).rejects.toThrow(
            "does not contain a save schema object"
        );
    });

    test("rejects a snapshot missing its required fields", async () => {
        const path = join(directory, "partial.json");
        await writeFile(
            path,
            JSON.stringify({ schemaVersion: SCHEMA_VERSION }),
            "utf8"
        );

        await expect(readSchema(path)).rejects.toThrow(
            "missing gameVersion or paths"
        );
    });
});

describe("findLatestSchema", () => {
    test("returns null when the directory does not exist", async () => {
        expect(await findLatestSchema(join(directory, "absent"))).toBeNull();
    });

    test("returns null when the directory holds no snapshots", async () => {
        await mkdir(join(directory, "empty"), { recursive: true });
        await writeFile(join(directory, "empty", "notes.txt"), "x", "utf8");

        expect(await findLatestSchema(join(directory, "empty"))).toBeNull();
    });

    test("picks the highest version, not the newest file", async () => {
        for (const version of ["0.9.0", "0.10.0", "0.2.0"]) {
            await writeSchema(
                snapshotPath(directory, version),
                schemaOf({ player: "object" }, { gameVersion: version })
            );
        }

        const latest = await findLatestSchema(directory);

        expect(latest?.schema.gameVersion).toBe("0.10.0");
        expect(latest?.path).toBe(snapshotPath(directory, "0.10.0"));
    });

    test("propagates an invalid snapshot rather than skipping it", async () => {
        await writeFile(join(directory, "bad.json"), "{}", "utf8");

        await expect(findLatestSchema(directory)).rejects.toThrow(
            "understands version 1"
        );
    });
});
