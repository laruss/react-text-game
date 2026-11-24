import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";

const sourceRoot = resolve(import.meta.dir, "..");

type ExportTarget = Readonly<Record<string, string>>;

// The source of every runtime entry in package.json "exports".
const manifest: { exports: Record<string, ExportTarget> } = await Bun.file(
    resolve(sourceRoot, "../package.json")
).json();
const runtimeExports = Object.values(manifest.exports).filter((target) =>
    Object.keys(target).some((condition) => condition !== "types")
);
const entrypoints = runtimeExports
    .map((target) => target.import)
    .filter((target) => target !== undefined)
    .map((target) =>
        resolve(
            sourceRoot,
            target.replace(/^\.\/dist\//, "").replace(/\.js$/, ".ts")
        )
    );

describe("Bundling without @react-text-game/ui", () => {
    // Bundlers resolve every literal import specifier, dynamic ones included,
    // at build time. A reference to the UI package therefore breaks the build
    // of any game that ships a custom UI, whatever runtime fallback guards it.
    test("no entry point reaches the UI package", async () => {
        const packageImports = new Set<string>();

        const result = await Bun.build({
            entrypoints,
            target: "browser",
            plugins: [
                {
                    name: "record-package-imports",
                    setup(build) {
                        build.onResolve({ filter: /^[^./#]/ }, (args) => {
                            packageImports.add(args.path);
                            return { path: args.path, external: true };
                        });
                    },
                },
            ],
        });

        expect(result.logs.filter((log) => log.level === "error")).toEqual([]);
        expect(result.success).toBe(true);
        // Every runtime export must be bundled, not skipped for lacking `import`.
        expect(entrypoints).toHaveLength(runtimeExports.length);
        expect(entrypoints).toContain(resolve(sourceRoot, "index.ts"));
        // Guards the guard: the plugin must observe the graph's package imports.
        expect(packageImports).toContain("i18next");
        expect(
            [...packageImports].filter((specifier) =>
                specifier.startsWith("@react-text-game/ui")
            )
        ).toEqual([]);
    });
});
