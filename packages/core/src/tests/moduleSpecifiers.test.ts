import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sourceRoot = resolve(import.meta.dir, "..");
const specifierPattern = /\bfrom\s+"([^"]+)"|\bimport\s+"([^"]+)"/g;

// JSDoc examples reference consumer-side paths, so comments must not be scanned.
const stripComments = (sourceText: string): string =>
    sourceText.replaceAll(/\/\*[\s\S]*?\*\//g, "").replaceAll(/\/\/.*$/gm, "");

const resolveInternal = (
    absolutePath: string,
    specifier: string
): string | null => {
    if (specifier.startsWith("#")) {
        return resolve(sourceRoot, specifier.slice(1));
    }

    return specifier.startsWith(".")
        ? resolve(dirname(absolutePath), specifier)
        : null;
};

const isEmittedModule = (target: string): boolean =>
    [
        `${target}.ts`,
        `${target}.tsx`,
        resolve(target, "index.ts"),
        resolve(target, "index.tsx"),
    ].some(existsSync);

describe("Internal module specifiers", () => {
    test("every internal specifier points at a module tsc emits", async () => {
        const sources = new Bun.Glob("**/*.{ts,tsx}");
        const unresolved: string[] = [];

        for await (const sourcePath of sources.scan({
            cwd: sourceRoot,
            onlyFiles: true,
        })) {
            if (sourcePath.startsWith("tests/")) {
                continue;
            }

            const absolutePath = resolve(sourceRoot, sourcePath);
            const sourceText = stripComments(
                await Bun.file(absolutePath).text()
            );

            for (const match of sourceText.matchAll(specifierPattern)) {
                const specifier = match[1] ?? match[2];

                if (!specifier) {
                    continue;
                }

                const target = resolveInternal(absolutePath, specifier);

                if (target !== null && !isEmittedModule(target)) {
                    unresolved.push(`${sourcePath} -> ${specifier}`);
                }
            }
        }

        // A declaration-only module (`foo.d.ts`) is never emitted to `dist`, so
        // re-exporting from one ships a specifier that resolves to nothing and
        // breaks consumers on `moduleResolution: "nodenext"`.
        expect(unresolved).toEqual([]);
    });
});
