/**
 * Refuses to pack a package whose `dist` is missing.
 *
 * @remarks
 * Replaces a `prepack` that rebuilt the package. Rebuilding there is unsafe
 * during a release: `changeset publish` packs several packages at once, every
 * build starts with `rm -rf dist`, and the packages that depend on
 * `@react-text-game/core` compile against the very directory core's own build
 * has just deleted. CI builds the whole workspace through Turborepo, in
 * dependency order, immediately before publishing - so by the time anything is
 * packed, `dist` is already correct and only needs checking.
 *
 * Usage: `bun ../../scripts/assert-built.ts` from a package directory.
 */
import { existsSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

const directory = resolve(process.cwd(), "dist");
const packageName = basename(process.cwd());

if (!existsSync(directory) || readdirSync(directory).length === 0) {
    console.error(
        `${packageName}: dist/ is missing or empty, so there is nothing to publish.\n` +
            "Run `bun run build` from the repository root first - it builds every\n" +
            "package in dependency order."
    );
    process.exit(1);
}
