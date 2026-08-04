import { readFile } from "node:fs/promises";
import { dirname, parse as parsePath, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { buildSchema } from "#schema";
import type { SaveSchema } from "#types";

/**
 * A migration the game registered, reduced to the parts this tool needs.
 */
export interface RegisteredMigration {
    from: string;
    to: string;
    description: string;
}

/**
 * Where the game version in a capture came from.
 *
 * @remarks
 * Worth surfacing, because the whole "you changed the shape but not the version"
 * check is only as trustworthy as this.
 *
 * The engine's configured version is normally out of reach: games pass it to
 * `Game.init()` from their React entry point, which imports stylesheets and
 * components and so cannot be loaded here. Hence the fallback chain, in
 * decreasing order of trustworthiness:
 *
 * 1. `"--game-version"` - an explicit value from the command line
 * 2. `"entry export"` - a `gameVersion` string exported by the entry module
 * 3. `"package.json"` - the version in the nearest manifest
 * 4. `"engine default"` - whatever the engine holds, usually just its default
 */
export type VersionSource =
    | "--game-version"
    | "entry export"
    | "package.json"
    | "engine default";

/**
 * What importing a game's modules reveals about its saves.
 */
export interface LoadedGame {
    /** Current save shape, captured from the registered entities and passages. */
    schema: SaveSchema;
    /** Every migration the imported modules registered. */
    migrations: RegisteredMigration[];
    /** Where {@link SaveSchema.gameVersion} was taken from. */
    versionSource: VersionSource;
}

/**
 * Finds the version in the nearest `package.json` at or above a directory.
 *
 * @param from - Directory to start walking up from
 * @returns The version, or `null` if no manifest up to the root declares one
 */
export const findPackageVersion = async (
    from: string
): Promise<string | null> => {
    const { root } = parsePath(from);
    let directory = from;

    for (;;) {
        try {
            const manifest = JSON.parse(
                await readFile(resolve(directory, "package.json"), "utf8")
            ) as { version?: unknown };

            if (typeof manifest.version === "string") {
                return manifest.version;
            }
        } catch {
            // No readable manifest here; keep walking up.
        }

        if (directory === root) {
            return null;
        }

        directory = dirname(directory);
    }
};

/**
 * Decides which version a code capture describes.
 *
 * @remarks
 * The engine's configured version is normally out of reach: games pass it to
 * `Game.init()` from their React entry point, which imports stylesheets and
 * components and so cannot be loaded here. Hence the fallback chain, in
 * decreasing order of trustworthiness:
 *
 * 1. an explicit `--game-version`
 * 2. a `gameVersion` string exported by the entry module
 * 3. the version in the nearest `package.json`
 * 4. whatever the engine currently holds, which is usually just its default
 *
 * Takes the value passed on the command line, the `gameVersion` the entry module
 * exported, the entry's absolute path for the manifest walk, and the version the
 * engine currently reports.
 *
 * @returns The chosen version and where it came from
 */
export const resolveGameVersion = async ({
    explicit,
    exported,
    entryPath,
    configured,
}: {
    explicit: string | null;
    exported: unknown;
    entryPath: string;
    configured: string;
}): Promise<{ version: string; source: VersionSource }> => {
    if (explicit) {
        return { version: explicit, source: "--game-version" };
    }

    if (typeof exported === "string" && exported) {
        return { version: exported, source: "entry export" };
    }

    const fromManifest = await findPackageVersion(dirname(entryPath));

    if (fromManifest) {
        return { version: fromManifest, source: "package.json" };
    }

    return { version: configured, source: "engine default" };
};

const UNSUPPORTED_EXTENSION_HELP = [
    "This runtime cannot import that file directly.",
    "",
    "If it is TypeScript, either run the CLI with bunx (Bun compiles TypeScript natively):",
    "    bunx @react-text-game/devtools saves check --entry <path>",
    "or use Node 22.6+ which strips types, or a loader:",
    "    npx tsx node_modules/.bin/rtg saves check --entry <path>",
    "",
    "If the failure is about a stylesheet, an image, or an MDX file, the entry module",
    "reaches into your React app. Point --entry at a module that only registers",
    "entities and passages, for example src/game/registry.ts.",
].join("\n");

/**
 * Turns an import failure into advice, or `null` if it is not one this tool can
 * explain better than the runtime already did.
 *
 * @param entryPath - Path the caller asked for, as they wrote it
 * @param error - Whatever `import()` rejected with
 * @returns The message to raise, or `null` to fall back to a generic one
 */
export const describeImportFailure = (
    entryPath: string,
    error: unknown
): string | null => {
    const code = (error as { code?: string } | null)?.code;

    if (code === "ERR_UNKNOWN_FILE_EXTENSION") {
        return `Cannot import ${entryPath}.\n\n${UNSUPPORTED_EXTENSION_HELP}`;
    }

    if (code === "ERR_MODULE_NOT_FOUND") {
        const detail = error instanceof Error ? `\n\n${error.message}` : "";

        return `Cannot resolve ${entryPath} or one of its imports.${detail}`;
    }

    return null;
};

/**
 * Imports a game's modules and captures the shape of its saves.
 *
 * @remarks
 * Entities and passages register as a side effect of being imported, so this
 * only has to load the module and then ask the engine what it now knows. It
 * never calls `Game.init()`: initialization opens the IndexedDB save database,
 * which does not exist outside a browser.
 *
 * Point `entryPath` at a module that registers entities and passages - typically
 * `src/game/registry.ts` - rather than at the React entry point.
 *
 * @param entryPath - Path to the module to import, absolute or relative to cwd
 * @param gameVersion - Explicit version, taking precedence over every other
 * source. See {@link VersionSource} for the fallback chain.
 * @returns The captured schema, the registered migrations, and where the version
 * came from
 * @throws Error with actionable guidance if the module cannot be imported
 */
export const loadGameSchema = async (
    entryPath: string,
    gameVersion: string | null = null
): Promise<LoadedGame> => {
    const absolute = resolve(entryPath);
    let entryModule: Record<string, unknown>;

    try {
        entryModule = (await import(pathToFileURL(absolute).href)) as Record<
            string,
            unknown
        >;
    } catch (error) {
        const described = describeImportFailure(entryPath, error);

        if (described) {
            throw new Error(described);
        }

        throw new Error(
            `Failed to import ${entryPath}: ${error instanceof Error ? error.message : String(error)}`
        );
    }

    // Resolved after the entry so that both reach the same installed copy of the
    // engine. A second copy would carry its own, empty, migration registry.
    const core = await import("@react-text-game/core");
    const saves = await import("@react-text-game/core/saves");

    const source = core.getSaveSchemaSource();
    const version = await resolveGameVersion({
        explicit: gameVersion,
        exported: entryModule.gameVersion,
        entryPath: absolute,
        configured: source.gameVersion,
    });

    return {
        schema: buildSchema({
            gameVersion: version.version,
            gameData: source.gameData,
            passageIds: source.passageIds,
            capturedFrom: "code",
        }),
        migrations: saves.getAllMigrations().map((migration) => ({
            from: migration.from,
            to: migration.to,
            description: migration.description,
        })),
        versionSource: version.source,
    };
};
