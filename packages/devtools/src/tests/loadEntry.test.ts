import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, writeFile } from "node:fs/promises";
import { join, parse as parsePath } from "node:path";
import { fileURLToPath } from "node:url";

import {
    describeImportFailure,
    findPackageVersion,
    loadGameSchema,
    resolveGameVersion,
} from "#loadEntry";

import { makeTempDir, removeTempDir } from "./helpers";

const fixture = (name: string): string =>
    fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

let directory: string;

beforeEach(async () => {
    directory = await makeTempDir();
});

afterEach(async () => {
    await removeTempDir(directory);
});

describe("describeImportFailure", () => {
    test("explains an unsupported extension with both likely causes", () => {
        const message = describeImportFailure("src/game.ts", {
            code: "ERR_UNKNOWN_FILE_EXTENSION",
        });

        expect(message).toContain("bunx");
        expect(message).toContain("tsx");
        expect(message).toContain("src/game/registry.ts");
    });

    test("reports an unresolvable module with the runtime's detail", () => {
        const error = Object.assign(new Error("boom"), {
            code: "ERR_MODULE_NOT_FOUND",
        });

        expect(describeImportFailure("src/game.ts", error)).toContain(
            "Cannot resolve src/game.ts"
        );
        expect(describeImportFailure("src/game.ts", error)).toContain("boom");
    });

    test("omits the detail when the rejection is not an Error", () => {
        expect(
            describeImportFailure("src/game.ts", {
                code: "ERR_MODULE_NOT_FOUND",
            })
        ).toBe("Cannot resolve src/game.ts or one of its imports.");
    });

    test("declines to explain anything else", () => {
        expect(describeImportFailure("src/game.ts", new Error("x"))).toBeNull();
        expect(describeImportFailure("src/game.ts", null)).toBeNull();
    });
});

describe("findPackageVersion", () => {
    test("reads the version from the nearest manifest", async () => {
        await writeFile(
            join(directory, "package.json"),
            JSON.stringify({ version: "7.7.7" }),
            "utf8"
        );

        expect(await findPackageVersion(directory)).toBe("7.7.7");
    });

    test("keeps walking up past a manifest that declares no version", async () => {
        await writeFile(
            join(directory, "package.json"),
            JSON.stringify({ version: "7.7.7" }),
            "utf8"
        );
        const inner = join(directory, "inner");
        await mkdir(inner, { recursive: true });
        await writeFile(
            join(inner, "package.json"),
            JSON.stringify({ name: "no-version" }),
            "utf8"
        );

        expect(await findPackageVersion(inner)).toBe("7.7.7");
    });

    test("returns null when nothing up to the root declares one", async () => {
        expect(await findPackageVersion(parsePath(directory).root)).toBeNull();
    });
});

describe("resolveGameVersion", () => {
    const base = {
        exported: undefined,
        entryPath: fixture("plain.ts"),
        configured: "1.0.0",
    };

    test("prefers an explicit version above everything", async () => {
        expect(
            await resolveGameVersion({
                ...base,
                explicit: "9.9.9",
                exported: "8.8.8",
            })
        ).toEqual({ version: "9.9.9", source: "--game-version" });
    });

    test("falls back to a version exported by the entry", async () => {
        expect(
            await resolveGameVersion({
                ...base,
                explicit: null,
                exported: "8.8.8",
            })
        ).toEqual({ version: "8.8.8", source: "entry export" });
    });

    test("ignores a non-string or empty export", async () => {
        expect(
            (
                await resolveGameVersion({
                    ...base,
                    explicit: null,
                    exported: 42,
                })
            ).source
        ).toBe("package.json");
        expect(
            (
                await resolveGameVersion({
                    ...base,
                    explicit: null,
                    exported: "",
                })
            ).source
        ).toBe("package.json");
    });

    test("falls back to the nearest package.json", async () => {
        expect(await resolveGameVersion({ ...base, explicit: null })).toEqual({
            version: "0.1.0",
            source: "package.json",
        });
    });

    test("falls back to the engine's own value as a last resort", async () => {
        expect(
            await resolveGameVersion({
                explicit: null,
                exported: undefined,
                entryPath: join(parsePath(directory).root, "entry.ts"),
                configured: "1.0.0",
            })
        ).toEqual({ version: "1.0.0", source: "engine default" });
    });
});

describe("loadGameSchema", () => {
    test("captures entities and passages registered by the entry", async () => {
        const loaded = await loadGameSchema(fixture("plain.ts"));

        expect(loaded.schema.entities).toContain("fixture-plain-player");
        expect(loaded.schema.passages).toContain("fixture-plain-story");
        expect(loaded.schema.capturedFrom).toBe("code");
        expect(loaded.schema.paths["fixture-plain-player.level"]).toBe(
            "number"
        );
    });

    test("takes the version from the nearest manifest by default", async () => {
        const loaded = await loadGameSchema(fixture("plain.ts"));

        expect(loaded.versionSource).toBe("package.json");
        expect(loaded.schema.gameVersion).toBe("0.1.0");
    });

    test("lets an explicit version win", async () => {
        const loaded = await loadGameSchema(fixture("plain.ts"), "2.5.0");

        expect(loaded.versionSource).toBe("--game-version");
        expect(loaded.schema.gameVersion).toBe("2.5.0");
    });

    test("uses a version the entry exports", async () => {
        const loaded = await loadGameSchema(fixture("versioned.ts"));

        expect(loaded.versionSource).toBe("entry export");
        expect(loaded.schema.gameVersion).toBe("4.0.0");
    });

    test("reports the migrations the entry registered", async () => {
        const loaded = await loadGameSchema(fixture("versioned.ts"));

        expect(loaded.migrations).toContainEqual({
            from: "3.0.0",
            to: "4.0.0",
            description: "Seed the fixture wallet",
        });
    });

    test("explains a path that cannot be imported", async () => {
        await expect(
            loadGameSchema(join(directory, "absent.ts"))
        ).rejects.toThrow("Cannot resolve");
    });

    test("reports an entry that throws while being imported", async () => {
        const path = join(directory, "boom.mjs");
        await writeFile(path, "throw new Error('entry exploded');", "utf8");

        await expect(loadGameSchema(path)).rejects.toThrow("entry exploded");
    });
});
