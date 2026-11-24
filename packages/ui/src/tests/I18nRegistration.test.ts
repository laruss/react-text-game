import { afterAll, describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { Game } from "@react-text-game/core";
import { initI18n } from "@react-text-game/core/i18n";
import i18next from "i18next";

import "../index";

const packageRoot = resolve(import.meta.dir, "../..");

// Test files share one module cache, so another file importing `#i18n` would
// mask a module that fails to register. Each import is checked in a fresh
// process instead.
const readUiTitleAfterImporting = async (modulePath: string) => {
    const script = `
        import i18next from "i18next";
        await i18next.init({ lng: "en", resources: {} });
        await import(${JSON.stringify(modulePath)});
        console.log(i18next.getFixedT("en", "ui")("mainMenu.title"));
    `;
    const child = Bun.spawn([process.execPath, "-e", script], {
        cwd: packageRoot,
        stdout: "pipe",
        stderr: "pipe",
    });
    const [stdout, stderr, exitCode] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);

    expect(stderr).toBe("");
    expect(exitCode).toBe(0);
    return stdout.trim();
};

// JSDoc examples mention `Game.init(`, so comments must not be scanned. The
// line-comment pattern also eats `//` inside strings, which only removes text.
const stripComments = (sourceText: string): string =>
    sourceText.replaceAll(/\/\*[\s\S]*?\*\//g, "").replaceAll(/\/\/.*$/gm, "");

// Every module that starts the game or reads the `ui` namespace, whether as
// `useTranslation("ui", ...)`, `useTranslation(["ui"])` or a `"ui:key"`.
const namespaceUse = /useTranslation\(\s*\[?\s*["']ui["']|["']ui:|Game\.init\(/;
const namespaceConsumers: string[] = [];
for await (const sourcePath of new Bun.Glob("**/*.{ts,tsx}").scan({
    cwd: resolve(packageRoot, "src"),
    onlyFiles: true,
})) {
    if (sourcePath.startsWith("tests/")) {
        continue;
    }

    const sourceText = stripComments(
        await Bun.file(resolve(packageRoot, "src", sourcePath)).text()
    );

    if (namespaceUse.test(sourceText)) {
        namespaceConsumers.push(`./src/${sourcePath}`);
    }
}
namespaceConsumers.sort();

afterAll(() => {
    Game._resetForTesting();
});

describe("UI translations", () => {
    test("finds the modules that need the namespace", () => {
        expect(namespaceConsumers).toEqual(
            expect.arrayContaining([
                "./src/components/GameProvider/GameProvider.tsx",
                "./src/components/MainMenu.tsx",
            ])
        );
    });

    // A Next.js client bundle reaches the "use client" modules without the
    // package entry, so the modules that start the game or read the `ui`
    // namespace register it themselves.
    test.each(["./src/index.ts", ...namespaceConsumers])(
        "are registered with core by importing %s",
        async (modulePath) => {
            expect(await readUiTitleAfterImporting(modulePath)).toBe(
                "Main Menu"
            );
        }
    );

    // At runtime the entry also registers through the components it
    // re-exports, which masks a missing import. A tree-shaking bundler keeps
    // only the components a game uses, so the entry must register on its own.
    test("are registered by the package entry itself", async () => {
        const entrySource = stripComments(
            await Bun.file(resolve(packageRoot, "src/index.ts")).text()
        );

        expect(entrySource).toContain('import "./i18n";');
    });

    test("are not visible to a process that never imports them", async () => {
        expect(
            await readUiTitleAfterImporting(
                "./src/components/LanguageToggle.tsx"
            )
        ).toBe("mainMenu.title");
    });

    test("lose to the author's resources key by key", async () => {
        await initI18n({
            defaultLanguage: "en",
            resources: { en: { ui: { mainMenu: { title: "Start" } } } },
        });

        const t = i18next.getFixedT("en", "ui");
        expect(t("mainMenu.title")).toBe("Start");
        expect(t("mainMenu.newGame")).toBe("New Game");
    });

    // Bundlers drop a side-effect-only import whose importer is marked free
    // of side effects, so both links of the chain from the package entry to
    // the registration call must be listed.
    test("survive tree shaking of the package entry", async () => {
        const manifest = await Bun.file(
            resolve(packageRoot, "package.json")
        ).json();

        expect(manifest.sideEffects).toEqual(
            expect.arrayContaining(["./dist/index.js", "./dist/i18n/index.js"])
        );
    });
});
