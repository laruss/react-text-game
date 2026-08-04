import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeSf } from "@react-text-game/core/saves";

import { EXIT, run } from "#cli";
import { snapshotPath, writeSchema } from "#store";

import {
    captureConsole,
    makeTempDir,
    removeTempDir,
    schemaOf,
} from "./helpers";

const fixture = (name: string): string =>
    fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

let directory: string;
let output: ReturnType<typeof captureConsole>;

beforeEach(async () => {
    directory = await makeTempDir();
    output = captureConsole();
});

afterEach(async () => {
    output.restore();
    await removeTempDir(directory);
});

describe("run", () => {
    test("prints help for --help and -h", async () => {
        expect(await run(["--help"])).toBe(EXIT.OK);
        expect(output.text).toContain("rtg saves snapshot");

        expect(await run(["-h"])).toBe(EXIT.OK);
    });

    test("prints the tool version", async () => {
        expect(await run(["--version"], "1.2.3")).toBe(EXIT.OK);
        expect(output.out).toContain("1.2.3");

        expect(await run(["-v"], "1.2.3")).toBe(EXIT.OK);
    });

    test("rejects an unknown command and shows help", async () => {
        expect(await run(["nope"])).toBe(EXIT.ERROR);
        expect(output.text).toContain("Unknown command: nope");
        expect(output.text).toContain("rtg saves snapshot");
    });

    test("rejects a known group with an unknown subcommand", async () => {
        expect(await run(["saves", "explode"])).toBe(EXIT.ERROR);
        expect(output.text).toContain("Unknown command: saves explode");
    });

    test("rejects no command at all", async () => {
        expect(await run([])).toBe(EXIT.ERROR);
        expect(output.text).toContain("Unknown command.");
    });

    test("rejects a value flag with no value", async () => {
        expect(await run(["saves", "check", "--entry"])).toBe(EXIT.ERROR);
        expect(output.text).toContain("--entry needs a value.");

        expect(await run(["saves", "check", "--entry", "--dir", "x"])).toBe(
            EXIT.ERROR
        );
    });
});

describe("run saves snapshot", () => {
    test("captures from an entry module and reports the version source", async () => {
        expect(
            await run([
                "saves",
                "snapshot",
                "--entry",
                fixture("plain.ts"),
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);

        expect(output.text).toContain("captured from code");
        expect(output.text).toContain("from package.json");
        expect(output.text).toContain("Commit this file");
    });

    test("honours --out over the conventional path", async () => {
        const out = join(directory, "custom.json");

        expect(
            await run([
                "saves",
                "snapshot",
                "--entry",
                fixture("plain.ts"),
                "--out",
                out,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain(out);
    });

    test("warns when the version is only the engine default", async () => {
        const entry = join(directory, "bare.mjs");
        await writeFile(entry, "export const noop = 1;", "utf8");

        expect(
            await run([
                "saves",
                "snapshot",
                "--entry",
                entry,
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain("is the engine default");
    });

    test("captures from an exported save file", async () => {
        const savePath = join(directory, "backup.sx");
        await writeFile(
            savePath,
            encodeSf(
                [
                    {
                        name: "1",
                        gameData: { player: { gold: 1 } },
                        version: "0.3.0",
                    },
                ],
                "cli-game"
            )
        );

        expect(
            await run([
                "saves",
                "snapshot",
                "--from-save",
                savePath,
                "--game-id",
                "cli-game",
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain("captured from save");
        expect(output.text).toContain("as recorded in the artifact");
    });

    test("requires --game-id alongside --from-save", async () => {
        expect(
            await run(["saves", "snapshot", "--from-save", "backup.sx"])
        ).toBe(EXIT.ERROR);
        expect(output.text).toContain("--from-save needs --game-id");
    });

    test("reports an unreadable save file", async () => {
        expect(
            await run([
                "saves",
                "snapshot",
                "--from-save",
                join(directory, "absent.sx"),
                "--game-id",
                "x",
            ])
        ).toBe(EXIT.ERROR);
        expect(output.text).toContain("Cannot read");
    });

    test("captures from an IndexedDB dump", async () => {
        const dumpPath = join(directory, "dump.json");
        await writeFile(
            dumpPath,
            JSON.stringify({
                name: "__SYSTEM_INITIAL_STATE__",
                gameData: { player: { gold: 1 } },
                version: "0.4.0",
            }),
            "utf8"
        );

        expect(
            await run([
                "saves",
                "snapshot",
                "--from-dump",
                dumpPath,
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain("captured from dump");
    });

    test("reports an unreadable or malformed dump", async () => {
        expect(
            await run([
                "saves",
                "snapshot",
                "--from-dump",
                join(directory, "absent.json"),
            ])
        ).toBe(EXIT.ERROR);
        expect(output.text).toContain("Cannot read");

        const broken = join(directory, "broken.json");
        await writeFile(broken, "not json", "utf8");

        expect(await run(["saves", "snapshot", "--from-dump", broken])).toBe(
            EXIT.ERROR
        );
        expect(output.text).toContain("is not valid JSON");
    });

    test("requires a source", async () => {
        expect(await run(["saves", "snapshot"])).toBe(EXIT.ERROR);
        expect(output.text).toContain("Pick a source");
    });
});

describe("run saves check", () => {
    test("passes when nothing changed", async () => {
        await run([
            "saves",
            "snapshot",
            "--entry",
            fixture("plain.ts"),
            "--dir",
            directory,
        ]);

        expect(
            await run([
                "saves",
                "check",
                "--entry",
                fixture("plain.ts"),
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain("No migration needed");
    });

    test("fails when an entity appeared and no migration covers it", async () => {
        await writeSchema(
            snapshotPath(directory, "3.0.0"),
            schemaOf({ other: "object" }, { gameVersion: "3.0.0" })
        );

        expect(
            await run([
                "saves",
                "check",
                "--entry",
                fixture("plain.ts"),
                "--dir",
                directory,
                "--game-version",
                "5.0.0",
            ])
        ).toBe(EXIT.FINDINGS);
        expect(output.text).toContain("entity-added");
        expect(output.text).toContain("missing-migration");
    });

    test("passes once a registered migration covers the change", async () => {
        await writeSchema(
            snapshotPath(directory, "3.0.0"),
            schemaOf({ other: "object" }, { gameVersion: "3.0.0" })
        );

        // The versioned fixture declares 4.0.0 and registers 3.0.0 -> 4.0.0.
        expect(
            await run([
                "saves",
                "check",
                "--entry",
                fixture("versioned.ts"),
                "--dir",
                directory,
            ])
        ).toBe(EXIT.OK);
        expect(output.text).toContain("one is registered for 3.0.0 to 4.0.0");
    });

    test("compares two snapshots without importing any code", async () => {
        const baseline = join(directory, "baseline.json");
        const current = join(directory, "current.json");

        await writeSchema(
            baseline,
            schemaOf({ "player.age": "number" }, { gameVersion: "1.0.0" })
        );
        await writeSchema(
            current,
            schemaOf({ "player.age": "string" }, { gameVersion: "2.0.0" })
        );

        expect(
            await run([
                "saves",
                "check",
                "--current",
                current,
                "--baseline",
                baseline,
            ])
        ).toBe(EXIT.FINDINGS);
        expect(output.text).toContain("kind-changed");
        expect(output.text).toContain("did not import the game's code");
    });

    test("explains how to create a missing baseline", async () => {
        expect(
            await run([
                "saves",
                "check",
                "--entry",
                fixture("plain.ts"),
                "--dir",
                join(directory, "absent"),
            ])
        ).toBe(EXIT.ERROR);
        expect(output.text).toContain("No baseline snapshot found");
        expect(output.text).toContain("keep-saves-valid");
    });

    test("requires a source for the current shape", async () => {
        expect(await run(["saves", "check", "--dir", directory])).toBe(
            EXIT.ERROR
        );
        expect(output.text).toContain("Pick a source for the current shape");
    });
});
