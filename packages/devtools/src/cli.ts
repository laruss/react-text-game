import { runCheck } from "#commands/check";
import { runSnapshot } from "#commands/snapshot";
import type { VersionSource } from "#loadEntry";
import { formatCheckResult } from "#report";
import { DEFAULT_SCHEMA_DIR } from "#types";

/**
 * Exit codes the `rtg` binary reports.
 *
 * @remarks
 * `FINDINGS` is what makes the command usable as a CI gate: a shape change that
 * needs a migration fails the build, while a usage or IO problem is reported
 * distinctly so a broken pipeline is not mistaken for a broken save format.
 */
export const EXIT = {
    /** Nothing to do. */
    OK: 0,
    /** A migration is required. */
    FINDINGS: 1,
    /** Bad usage, or a file that could not be read. */
    ERROR: 2,
} as const;

const HELP = `rtg - React Text Game developer tools

Usage
  rtg saves snapshot [options]   Record the current save shape as a baseline
  rtg saves check [options]      Compare the current shape against the baseline

Sources
  --entry <module>       Import a module that registers entities and passages
                         (for example src/game/registry.ts) and read the shape
                         from the engine
  --from-save <file.sx>  Derive the shape from an exported save file
                         (needs --game-id)
  --from-dump <file>     Derive the shape from an IndexedDB record copied out of
                         a browser
  --current <file.json>  Use an existing snapshot as the current shape (check)
  --baseline <file.json> Compare against this snapshot instead of the newest one

Options
  --dir <directory>      Where snapshots live (default: ${DEFAULT_SCHEMA_DIR})
  --game-id <id>         The game's gameId, required with --from-save
  --game-version <v>     Version of the game being captured (see below)
  --out <file>           Write the snapshot here instead of <dir>/<version>.json
  -h, --help             Show this help
  -v, --version          Show the version of this tool

Which game version a capture describes
  Games pass gameVersion to Game.init() from their React entry point, which
  cannot be imported here. With --entry the version is therefore taken from, in
  order: --game-version, a "gameVersion" string exported by the entry module,
  the nearest package.json, then whatever the engine holds. The chosen source is
  always printed, because the version check depends on getting this right.

Exit codes
  ${EXIT.OK}  nothing to do, or a registered migration already covers the change
  ${EXIT.FINDINGS}  a migration is required and none covers the change
  ${EXIT.ERROR}  bad usage, or a file could not be read

Guide: https://reacttextgame.dev/keep-saves-valid`;

interface ParsedArgs {
    positionals: string[];
    flags: Map<string, string | true>;
}

const VALUE_FLAGS = new Set([
    "entry",
    "from-save",
    "from-dump",
    "current",
    "baseline",
    "dir",
    "game-id",
    "game-version",
    "out",
]);

const parseArgs = (argv: string[]): ParsedArgs => {
    const positionals: string[] = [];
    const flags = new Map<string, string | true>();

    for (let index = 0; index < argv.length; index++) {
        const argument = argv[index];

        if (argument === undefined) {
            continue;
        }

        if (!argument.startsWith("-")) {
            positionals.push(argument);
            continue;
        }

        const name = argument.replace(/^--?/, "");

        if (VALUE_FLAGS.has(name)) {
            const value = argv[index + 1];

            if (value === undefined || value.startsWith("-")) {
                throw new Error(`--${name} needs a value.`);
            }

            flags.set(name, value);
            index++;
            continue;
        }

        flags.set(name, true);
    }

    return { positionals, flags };
};

const readFlag = (parsed: ParsedArgs, name: string): string | null => {
    const value = parsed.flags.get(name);

    return typeof value === "string" ? value : null;
};

/**
 * Reports where the version came from, and warns when it is only a guess.
 *
 * @remarks
 * The "you changed the shape but not the version" check is only meaningful if
 * this version is the one the game really ships, so a fallback is never silent.
 */
const describeVersionSource = (
    version: string,
    source: VersionSource | null
): string => {
    if (source === null) {
        return `Version ${version} as recorded in the artifact.`;
    }

    if (source === "engine default") {
        return `Version ${version} is the engine default - nothing declared one. Export a "gameVersion" from the entry module or pass --game-version, otherwise the version check cannot work.`;
    }

    return `Version ${version}, from ${source}.`;
};

const dispatchSnapshot = async (parsed: ParsedArgs): Promise<number> => {
    const { path, schema, versionSource } = await runSnapshot({
        entry: readFlag(parsed, "entry"),
        fromSave: readFlag(parsed, "from-save"),
        fromDump: readFlag(parsed, "from-dump"),
        gameId: readFlag(parsed, "game-id"),
        gameVersion: readFlag(parsed, "game-version"),
        directory: readFlag(parsed, "dir") ?? DEFAULT_SCHEMA_DIR,
        out: readFlag(parsed, "out"),
    });

    console.log(
        `Wrote ${path}: version ${schema.gameVersion}, ${schema.entities.length} entities, ${Object.keys(schema.paths).length} paths, captured from ${schema.capturedFrom}.`
    );
    console.log(describeVersionSource(schema.gameVersion, versionSource));
    console.log(
        "Commit this file so future runs have something to compare to."
    );

    return EXIT.OK;
};

const dispatchCheck = async (parsed: ParsedArgs): Promise<number> => {
    const { result, baselinePath, versionSource } = await runCheck({
        entry: readFlag(parsed, "entry"),
        current: readFlag(parsed, "current"),
        baseline: readFlag(parsed, "baseline"),
        directory: readFlag(parsed, "dir") ?? DEFAULT_SCHEMA_DIR,
        gameVersion: readFlag(parsed, "game-version"),
    });

    console.log(`Baseline: ${baselinePath}`);
    console.log(describeVersionSource(result.currentVersion, versionSource));
    console.log("");
    console.log(formatCheckResult(result));

    return result.migrationRequired && !result.migrationSatisfied
        ? EXIT.FINDINGS
        : EXIT.OK;
};

/**
 * Runs the CLI.
 *
 * @remarks
 * Returns an exit code rather than calling `process.exit`, so every path stays
 * testable in-process and buffered output is never truncated.
 *
 * @param argv - Arguments after the executable and script name
 * @param version - Version to report for `--version`
 * @returns The exit code to report
 *
 * @example
 * ```typescript
 * const code = await run(["saves", "check", "--entry", "src/game/registry.ts"]);
 * ```
 */
export const run = async (
    argv: string[],
    version = "0.1.0"
): Promise<number> => {
    let parsed: ParsedArgs;

    try {
        parsed = parseArgs(argv);
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));

        return EXIT.ERROR;
    }

    if (parsed.flags.has("help") || parsed.flags.has("h")) {
        console.log(HELP);

        return EXIT.OK;
    }

    if (parsed.flags.has("version") || parsed.flags.has("v")) {
        console.log(version);

        return EXIT.OK;
    }

    const [group, command] = parsed.positionals;

    if (group !== "saves" || (command !== "snapshot" && command !== "check")) {
        console.error(
            `Unknown command${group ? `: ${[group, command].filter(Boolean).join(" ")}` : ""}.\n`
        );
        console.error(HELP);

        return EXIT.ERROR;
    }

    try {
        return command === "snapshot"
            ? await dispatchSnapshot(parsed)
            : await dispatchCheck(parsed);
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));

        return EXIT.ERROR;
    }
};
